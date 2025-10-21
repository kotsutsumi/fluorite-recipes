use std::collections::HashMap;
use std::env;
use std::fs;
use std::path::{Path, PathBuf};

use anyhow::{bail, Context, Result};
#[cfg(feature = "embeddings")]
use anyhow::anyhow;
use clap::{Parser, Subcommand};
#[cfg(feature = "embeddings")]
use fastembed::{InitOptions, TextEmbedding};
#[cfg(feature = "embeddings")]
use once_cell::sync::OnceCell;
use rusqlite::{params, Connection, OpenFlags, OptionalExtension};
#[cfg(feature = "embeddings")]
use std::sync::Mutex;

#[derive(Parser)]
#[command(author, version, about = "Rust verifier for Fluorite SQLite packs", long_about = None)]
struct Cli {
    /// Override the pack path. Defaults to env variables and repository layout.
    #[arg(long)]
    pack: Option<PathBuf>,
    /// Override root directory used when resolving relative pack paths.
    #[arg(long)]
    root: Option<PathBuf>,
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Print pack statistics (docs, chunks, embeddings).
    Info,
    /// Run a hybrid FTS + embedding search against the pack.
    Search {
        /// Natural language query.
        query: String,
        /// Number of final results to show.
        #[arg(long, default_value_t = 5)]
        top: usize,
        /// Only use FTS (no embedding scoring). Useful when pack embeddings are placeholders.
        #[arg(long)]
        fts_only: bool,
    },
}

#[derive(Debug)]
struct ChunkCandidate {
    rowid: i64,
    doc_id: i64,
    ord: i64,
    doc_title: String,
    text: String,
    bm25: f64,
    #[cfg_attr(not(feature = "embeddings"), allow(dead_code))]
    embedding: Option<Vec<f32>>,
}

#[cfg(feature = "embeddings")]
static EMBEDDER: OnceCell<Mutex<TextEmbedding>> = OnceCell::new();

fn main() -> Result<()> {
    let cli = Cli::parse();
    let pack_path = resolve_pack_path(cli.pack.as_ref(), cli.root.as_ref())?;
    if !pack_path.exists() {
        bail!("Pack not found at {}", pack_path.display());
    }
    let conn = open_pack(&pack_path)?;

    match cli.command {
        Command::Info => command_info(&pack_path, &conn)?,
        Command::Search {
            query,
            top,
            fts_only,
        } => command_search(&pack_path, &conn, &query, top, fts_only)?,
    }

    Ok(())
}

fn resolve_pack_path(pack_override: Option<&PathBuf>, root_override: Option<&PathBuf>) -> Result<PathBuf> {
    if let Some(path) = pack_override {
        return Ok(path.clone());
    }
    if let Ok(env_path) = env::var("FLUORITE_PACK_PATH") {
        return Ok(PathBuf::from(env_path));
    }

    let root_dir = if let Some(root) = root_override {
        root.clone()
    } else if let Ok(env_root) = env::var("FLUORITE_ROOT_DIR") {
        PathBuf::from(env_root)
    } else {
        env::current_dir().context("Failed to determine current directory")?
    };

    let pack_dir_env = env::var("FLUORITE_PACK_DIR").ok();
    let pack_dir = pack_dir_env
        .map(PathBuf::from)
        .map(|dir| if dir.is_absolute() { dir } else { root_dir.join(dir) })
        .unwrap_or_else(|| root_dir.join("packs"));

    let pack_name_env = env::var("FLUORITE_PACK_NAME").unwrap_or_else(|_| "fluorite-pack.sqlite3".to_string());
    let pack_file = if pack_name_env.ends_with(".sqlite") || pack_name_env.ends_with(".sqlite3") {
        PathBuf::from(&pack_name_env)
    } else {
        PathBuf::from(format!("{pack_name_env}.sqlite3"))
    };

    let resolved = if pack_file.is_absolute() {
        pack_file
    } else {
        pack_dir.join(pack_file)
    };
    Ok(resolved)
}

fn open_pack(path: &Path) -> Result<Connection> {
    if !path.exists() {
        bail!("Pack file {} does not exist", path.display());
    }
    Connection::open_with_flags(path, OpenFlags::SQLITE_OPEN_READ_ONLY | OpenFlags::SQLITE_OPEN_URI)
        .context("Failed to open pack")
}

fn command_info(pack: &Path, conn: &Connection) -> Result<()> {
    println!("Pack: {}", pack.display());
    if let Ok(metadata) = fs::metadata(pack) {
        let size_bytes = metadata.len();
        let size_mib = size_bytes as f64 / (1024.0 * 1024.0);
        println!("Size: {} bytes ({size_mib:.2} MiB)", size_bytes);
    }
    let doc_count: i64 = conn
        .query_row("SELECT COUNT(*) FROM docs", [], |row| row.get(0))
        .unwrap_or(0);
    let chunk_count: i64 = conn
        .query_row("SELECT COUNT(*) FROM chunks", [], |row| row.get(0))
        .unwrap_or(0);
    let embedding_count: i64 = conn
        .query_row("SELECT COUNT(*) FROM chunk_embeddings", [], |row| row.get(0))
        .unwrap_or(0);
    let fts_row_count: i64 = conn
        .query_row("SELECT COUNT(*) FROM chunks_fts", [], |row| row.get(0))
        .unwrap_or(0);
    let embedding_bytes: Option<i64> = conn
        .query_row(
            "SELECT LENGTH(embedding) FROM chunk_embeddings ORDER BY rowid LIMIT 1",
            [],
            |row| row.get(0),
        )
        .optional()?;
    let embedding_dimension = embedding_bytes.map(|len| len / 4);

    println!("Docs:            {}", doc_count);
    println!("Chunks:          {}", chunk_count);
    println!("FTS rows:        {}", fts_row_count);
    println!("Embedding rows:  {}", embedding_count);
    if let Some(dim) = embedding_dimension {
        println!("Embedding dim:   {} ({} bytes)", dim, dim * 4);
    } else {
        println!("Embedding dim:   n/a (no embeddings stored)");
    }

    if chunk_count > 0 {
        let sample: Option<(String, i64, i64)> = conn
            .query_row(
                "
                SELECT d.title, c.doc_id, c.id
                FROM docs d
                JOIN chunks c ON c.doc_id = d.id
                ORDER BY c.id ASC
                LIMIT 1
                ",
                [],
                |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?)),
            )
            .optional()?;
        if let Some((title, doc_id, chunk_id)) = sample {
            println!("Sample doc:      #{doc_id} {title}");
            println!("Sample chunk id: #{chunk_id}");
        }
    }

    Ok(())
}

fn command_search(pack: &Path, conn: &Connection, query: &str, top: usize, fts_only: bool) -> Result<()> {
    if top == 0 {
        bail!("Top must be greater than zero");
    }
    let mut candidates = fetch_candidates(conn, query, top)?;
    if candidates.is_empty() {
        println!("No matches for \"{query}\"");
        return Ok(());
    }

    let mut ranking_scores: HashMap<i64, f64> = HashMap::new();
    let k: f64 = 60.0;
    for (rank, candidate) in candidates.iter().enumerate() {
        let entry = ranking_scores.entry(candidate.rowid).or_insert(0.0);
        *entry += 1.0 / (k + rank as f64 + 1.0);
    }

    #[cfg(feature = "embeddings")]
    let mut vector_scores: Vec<(i64, f32)> = Vec::new();
    #[cfg(not(feature = "embeddings"))]
    let _vector_scores: Vec<(i64, f32)> = Vec::new();
    #[cfg(feature = "embeddings")]
    {
        if !fts_only {
            let embedder_mutex = EMBEDDER.get_or_try_init(|| {
                TextEmbedding::try_new(InitOptions::default())
                    .context("Failed to initialise fastembed")
                    .map(Mutex::new)
            })?;
            let mut embedder = embedder_mutex
                .lock()
                .map_err(|_| anyhow!("Embedder instance is poisoned"))?;
            let mut query_embed = embedder
                .embed(vec![query], None)
                .context("Failed to embed query")?
                .into_iter()
                .next()
                .ok_or_else(|| anyhow!("No embedding returned for query"))?;

            normalize(&mut query_embed);

            for candidate in &candidates {
                if let Some(embedding) = &candidate.embedding {
                    if embedding.len() != query_embed.len() {
                        continue;
                    }
                    let score = cosine_similarity(&query_embed, embedding);
                    vector_scores.push((candidate.rowid, score));
                }
            }
            vector_scores
                .sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal));
            for (rank, (rowid, _)) in vector_scores.iter().enumerate() {
                let entry = ranking_scores.entry(*rowid).or_insert(0.0);
                *entry += 1.0 / (k + rank as f64 + 1.0);
            }
        }
    }
    #[cfg(not(feature = "embeddings"))]
    {
        if !fts_only {
            println!(
                "Warning: re-run with `cargo run --features embeddings` to enable vector scoring; continuing with FTS only."
            );
        }
    }

    candidates.sort_by(|a, b| {
        let score_a = ranking_scores.get(&a.rowid).copied().unwrap_or_default();
        let score_b = ranking_scores.get(&b.rowid).copied().unwrap_or_default();
        score_b
            .partial_cmp(&score_a)
            .unwrap_or(std::cmp::Ordering::Equal)
    });

    println!("Pack: {}", pack.display());
    println!("Query: {query}");
    println!("Results (top {top}):");
    for (idx, candidate) in candidates.iter().take(top).enumerate() {
        let rr_score = ranking_scores.get(&candidate.rowid).copied().unwrap_or_default();
        println!("----------------------------------------");
        println!("#{} doc={} chunk={} ord={}", idx + 1, candidate.doc_id, candidate.rowid, candidate.ord);
        println!("Title: {}", candidate.doc_title);
        println!("BM25: {:.4}", candidate.bm25);
        #[cfg(feature = "embeddings")]
        {
            let vector_score = vector_scores
                .iter()
                .find(|(rowid, _)| *rowid == candidate.rowid)
                .map(|(_, score)| *score);
            if let Some(score) = vector_score {
                println!("Cosine: {:.4}", score);
            } else if !fts_only {
                println!("Cosine: n/a");
            }
        }
        println!("RRF: {:.4}", rr_score);
        print_snippet(&candidate.text);
    }

    #[cfg(feature = "embeddings")]
    {
        if !vector_scores.is_empty() && vector_scores.iter().all(|(_, score)| score.abs() < 1e-5) {
            println!();
            println!("Note: all cosine similarities are near zero. Replace the placeholder embeddings in the pack to unlock semantic ranking.");
        }
    }

    Ok(())
}

fn fetch_candidates(conn: &Connection, query: &str, top: usize) -> Result<Vec<ChunkCandidate>> {
    let mut stmt = conn.prepare(
        r#"
        SELECT
          c.id AS rowid,
          c.doc_id AS doc_id,
          c.ord AS ord,
          d.title AS doc_title,
          c.text AS text,
          bm25(chunks_fts) AS bm25_score,
          ce.embedding AS embedding
        FROM chunks_fts
        JOIN chunks c ON c.id = chunks_fts.rowid
        JOIN docs d ON d.id = c.doc_id
        LEFT JOIN chunk_embeddings ce ON ce.rowid = c.id
        WHERE chunks_fts MATCH ?
        ORDER BY bm25_score ASC
        LIMIT ?
        "#,
    )?;
    let mut rows = stmt
        .query(params![query, (top.max(1) * 8) as i64])
        .context("Failed to execute FTS query")?;

    let mut out = Vec::new();
    while let Some(row) = rows.next()? {
        let blob: Option<Vec<u8>> = row.get("embedding")?;
        let embedding = match blob {
            Some(bytes) => Some(blob_to_f32(&bytes)?),
            None => None,
        };
        out.push(ChunkCandidate {
            rowid: row.get("rowid")?,
            doc_id: row.get("doc_id")?,
            ord: row.get("ord")?,
            doc_title: row
                .get::<_, Option<String>>("doc_title")?
                .unwrap_or_else(|| "<untitled>".to_string()),
            text: row.get("text")?,
            bm25: row
                .get::<_, Option<f64>>("bm25_score")?
                .unwrap_or(f64::MAX),
            embedding,
        });
    }
    Ok(out)
}

fn blob_to_f32(bytes: &[u8]) -> Result<Vec<f32>> {
    if bytes.len() % 4 != 0 {
        bail!("Embedding blob length {} is not a multiple of 4", bytes.len());
    }
    let mut out = Vec::with_capacity(bytes.len() / 4);
    for chunk in bytes.chunks_exact(4) {
        let mut arr = [0u8; 4];
        arr.copy_from_slice(chunk);
        out.push(f32::from_le_bytes(arr));
    }
    Ok(out)
}

#[cfg(feature = "embeddings")]
fn normalize(vec: &mut [f32]) {
    let norm: f32 = vec.iter().map(|v| v * v).sum::<f32>().sqrt();
    if norm > 0.0 {
        vec.iter_mut().for_each(|v| *v /= norm);
    }
}

#[cfg(feature = "embeddings")]
fn cosine_similarity(a: &[f32], b: &[f32]) -> f32 {
    let mut dot = 0.0f64;
    let mut norm_a = 0.0f64;
    let mut norm_b = 0.0f64;
    for (lhs, rhs) in a.iter().zip(b.iter()) {
        let lhs = *lhs as f64;
        let rhs = *rhs as f64;
        dot += lhs * rhs;
        norm_a += lhs * lhs;
        norm_b += rhs * rhs;
    }
    if norm_a == 0.0 || norm_b == 0.0 {
        return 0.0;
    }
    (dot / (norm_a.sqrt() * norm_b.sqrt())) as f32
}

fn print_snippet(text: &str) {
    let cleaned = text.replace('\n', " ");
    let preview = cleaned.chars().take(200).collect::<String>();
    println!("Snippet: {}", preview);
    if cleaned.chars().count() > 200 {
        println!("…");
    }
}
