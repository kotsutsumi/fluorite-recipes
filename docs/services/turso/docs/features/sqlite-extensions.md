# Turso - SQLite Extensions（SQLite拡張機能）

TursoでサポートされているSQLite拡張機能について説明します。

## 概要

Tursoは、標準SQLiteに加えて、さまざまな拡張機能を提供しています。これらの拡張により、ベクトル検索、全文検索、JSON操作などの高度な機能を使用できます。

## サポートされている拡張機能

```typescript
interface SupportedExtensions {
  vector: {
    name: "libsql_vector / vector0";
    purpose: "ベクトル類似性検索";
    useCase: "AI/ML、レコメンデーション";
  };

  fts5: {
    name: "FTS5";
    purpose: "全文検索";
    useCase: "テキスト検索、ドキュメント検索";
  };

  json: {
    name: "JSON1";
    purpose: "JSON操作";
    useCase: "JSONデータの保存・クエリ";
  };

  uuid: {
    name: "UUID";
    purpose: "UUID生成";
    useCase: "一意識別子の生成";
  };
}
```

## ベクトル拡張（Vector Extension）

### ベクトルテーブルの作成

```sql
-- ベクトル拡張を有効化（Tursoではデフォルトで有効）
-- libsql_vector拡張を使用

-- ベクトルテーブルの作成
CREATE VIRTUAL TABLE embeddings USING vec0(
  embedding FLOAT[768]  -- 768次元のベクトル
);

-- メタデータを含むテーブル
CREATE TABLE documents (
  id INTEGER PRIMARY KEY,
  content TEXT NOT NULL,
  embedding_id INTEGER,
  FOREIGN KEY (embedding_id) REFERENCES embeddings(rowid)
);
```

### ベクトルの挿入

```typescript
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function insertDocument(content: string, embedding: number[]) {
  // エンベディングを挿入
  const embeddingResult = await client.execute({
    sql: "INSERT INTO embeddings(embedding) VALUES (?)",
    args: [JSON.stringify(embedding)],
  });

  const embeddingId = embeddingResult.lastInsertRowid;

  // ドキュメントを挿入
  await client.execute({
    sql: "INSERT INTO documents(content, embedding_id) VALUES (?, ?)",
    args: [content, embeddingId],
  });
}

// 使用例
const documentText = "Turso is a database built on libSQL";
const embedding = await generateEmbedding(documentText); // OpenAI APIなどで生成
await insertDocument(documentText, embedding);
```

### ベクトル類似性検索

```typescript
async function similaritySearch(queryEmbedding: number[], limit = 10) {
  const result = await client.execute({
    sql: `
      SELECT
        d.id,
        d.content,
        e.distance
      FROM documents d
      JOIN (
        SELECT
          rowid,
          vec_distance_cosine(embedding, ?) as distance
        FROM embeddings
        ORDER BY distance
        LIMIT ?
      ) e ON d.embedding_id = e.rowid
      ORDER BY e.distance
    `,
    args: [JSON.stringify(queryEmbedding), limit],
  });

  return result.rows;
}

// 使用例
const query = "What is Turso?";
const queryEmbedding = await generateEmbedding(query);
const results = await similaritySearch(queryEmbedding, 5);

console.log("Similar documents:", results);
```

### ベクトル距離関数

```sql
-- コサイン類似度
SELECT vec_distance_cosine(embedding, '[0.1, 0.2, ...]') as distance
FROM embeddings;

-- L2距離（ユークリッド距離）
SELECT vec_distance_l2(embedding, '[0.1, 0.2, ...]') as distance
FROM embeddings;
```

## 全文検索（FTS5）

### FTS5テーブルの作成

```sql
-- 全文検索テーブルの作成
CREATE VIRTUAL TABLE articles_fts USING fts5(
  title,
  content,
  category,
  tokenize = 'porter unicode61'
);

-- 通常のテーブルと連携
CREATE TABLE articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### データの挿入

```typescript
async function insertArticle(title: string, content: string, category: string) {
  // 通常のテーブルに挿入
  const result = await client.execute({
    sql: `
      INSERT INTO articles (title, content, category)
      VALUES (?, ?, ?)
    `,
    args: [title, content, category],
  });

  // FTS5テーブルに挿入
  await client.execute({
    sql: `
      INSERT INTO articles_fts (rowid, title, content, category)
      VALUES (?, ?, ?, ?)
    `,
    args: [result.lastInsertRowid, title, content, category],
  });
}
```

### 全文検索クエリ

```typescript
async function searchArticles(query: string) {
  const result = await client.execute({
    sql: `
      SELECT
        a.id,
        a.title,
        a.content,
        a.category,
        fts.rank
      FROM articles a
      JOIN articles_fts fts ON a.id = fts.rowid
      WHERE articles_fts MATCH ?
      ORDER BY rank
      LIMIT 20
    `,
    args: [query],
  });

  return result.rows;
}

// 使用例
const results = await searchArticles("database libSQL");
console.log("Search results:", results);
```

### 高度な検索クエリ

```sql
-- AND検索
SELECT * FROM articles_fts WHERE articles_fts MATCH 'database AND libSQL';

-- OR検索
SELECT * FROM articles_fts WHERE articles_fts MATCH 'database OR sqlite';

-- フレーズ検索
SELECT * FROM articles_fts WHERE articles_fts MATCH '"edge database"';

-- NOT検索
SELECT * FROM articles_fts WHERE articles_fts MATCH 'database NOT mysql';

-- フィールド指定検索
SELECT * FROM articles_fts WHERE articles_fts MATCH 'title:turso';

-- プレフィックス検索
SELECT * FROM articles_fts WHERE articles_fts MATCH 'data*';
```

## JSON拡張（JSON1）

### JSONデータの保存

```typescript
async function createUserProfile(userId: number, profile: object) {
  await client.execute({
    sql: `
      INSERT INTO user_profiles (user_id, profile_data)
      VALUES (?, ?)
    `,
    args: [userId, JSON.stringify(profile)],
  });
}

// 使用例
await createUserProfile(1, {
  name: "Alice",
  preferences: {
    theme: "dark",
    language: "ja",
    notifications: {
      email: true,
      push: false,
    },
  },
  tags: ["developer", "designer"],
});
```

### JSON関数の使用

```sql
-- JSON値の抽出
SELECT
  user_id,
  json_extract(profile_data, '$.name') as name,
  json_extract(profile_data, '$.preferences.theme') as theme
FROM user_profiles;

-- JSON配列の操作
SELECT
  user_id,
  json_array_length(json_extract(profile_data, '$.tags')) as tag_count
FROM user_profiles;

-- JSON型チェック
SELECT
  user_id,
  json_type(profile_data, '$.preferences') as type
FROM user_profiles;
```

### TypeScriptでのJSON操作

```typescript
async function getUsersByTheme(theme: string) {
  const result = await client.execute({
    sql: `
      SELECT
        user_id,
        json_extract(profile_data, '$.name') as name,
        profile_data
      FROM user_profiles
      WHERE json_extract(profile_data, '$.preferences.theme') = ?
    `,
    args: [theme],
  });

  return result.rows;
}

// 使用例
const darkThemeUsers = await getUsersByTheme("dark");
```

### JSON配列のクエリ

```sql
-- JSON配列の要素を検索
SELECT
  user_id,
  json_extract(profile_data, '$.name') as name
FROM user_profiles
WHERE json_extract(profile_data, '$.tags') LIKE '%developer%';

-- JSON配列を展開
SELECT
  user_id,
  value as tag
FROM user_profiles,
  json_each(json_extract(profile_data, '$.tags'));
```

## UUID拡張

### UUID生成

```typescript
async function createUserWithUUID(name: string, email: string) {
  const result = await client.execute({
    sql: `
      INSERT INTO users (id, name, email)
      VALUES (uuid(), ?, ?)
      RETURNING id
    `,
    args: [name, email],
  });

  return result.rows[0].id;
}

// テーブル定義例
// CREATE TABLE users (
//   id TEXT PRIMARY KEY DEFAULT (uuid()),
//   name TEXT NOT NULL,
//   email TEXT NOT NULL
// );
```

### UUID検証

```sql
-- UUIDフォーマットの検証
SELECT *
FROM users
WHERE typeof(id) = 'text'
  AND length(id) = 36;
```

## 実践的な例

### AIチャットボット（ベクトル検索）

```typescript
import OpenAI from "openai";

const openai = new OpenAI();

// ナレッジベースの初期化
async function initializeKnowledgeBase() {
  await client.execute(`
    CREATE VIRTUAL TABLE IF NOT EXISTS knowledge_embeddings USING vec0(
      embedding FLOAT[1536]
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS knowledge_base (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      embedding_id INTEGER,
      FOREIGN KEY (embedding_id) REFERENCES knowledge_embeddings(rowid)
    )
  `);
}

// ナレッジの追加
async function addKnowledge(question: string, answer: string) {
  // OpenAIでエンベディング生成
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
  });

  const embedding = response.data[0].embedding;

  // エンベディングを保存
  const embResult = await client.execute({
    sql: "INSERT INTO knowledge_embeddings(embedding) VALUES (?)",
    args: [JSON.stringify(embedding)],
  });

  // ナレッジを保存
  await client.execute({
    sql: "INSERT INTO knowledge_base(question, answer, embedding_id) VALUES (?, ?, ?)",
    args: [question, answer, embResult.lastInsertRowid],
  });
}

// 類似質問の検索
async function findSimilarQuestions(userQuestion: string) {
  // ユーザーの質問をエンベディング化
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: userQuestion,
  });

  const queryEmbedding = response.data[0].embedding;

  // 類似質問を検索
  const result = await client.execute({
    sql: `
      SELECT
        kb.question,
        kb.answer,
        e.distance
      FROM knowledge_base kb
      JOIN (
        SELECT
          rowid,
          vec_distance_cosine(embedding, ?) as distance
        FROM knowledge_embeddings
        ORDER BY distance
        LIMIT 3
      ) e ON kb.embedding_id = e.rowid
      ORDER BY e.distance
    `,
    args: [JSON.stringify(queryEmbedding)],
  });

  return result.rows;
}

// 使用例
await initializeKnowledgeBase();
await addKnowledge(
  "What is Turso?",
  "Turso is an edge-hosted, distributed database built on libSQL."
);

const similar = await findSimilarQuestions("Tell me about Turso");
console.log("Similar questions:", similar);
```

### ブログシステム（FTS5 + JSON）

```typescript
// ブログ記事の作成
async function createBlogPost(post: {
  title: string;
  content: string;
  author: string;
  tags: string[];
  metadata: object;
}) {
  // 記事を挿入
  const result = await client.execute({
    sql: `
      INSERT INTO blog_posts (title, content, author, tags, metadata)
      VALUES (?, ?, ?, ?, ?)
    `,
    args: [
      post.title,
      post.content,
      post.author,
      JSON.stringify(post.tags),
      JSON.stringify(post.metadata),
    ],
  });

  // FTS5に追加
  await client.execute({
    sql: `
      INSERT INTO blog_posts_fts (rowid, title, content)
      VALUES (?, ?, ?)
    `,
    args: [result.lastInsertRowid, post.title, post.content],
  });

  return result.lastInsertRowid;
}

// 検索（全文検索 + JSON フィルタ）
async function searchBlogPosts(searchQuery: string, tag?: string) {
  let sql = `
    SELECT
      bp.id,
      bp.title,
      bp.content,
      bp.author,
      bp.tags,
      fts.rank
    FROM blog_posts bp
    JOIN blog_posts_fts fts ON bp.id = fts.rowid
    WHERE blog_posts_fts MATCH ?
  `;

  const args: any[] = [searchQuery];

  if (tag) {
    sql += ` AND json_extract(tags, '$') LIKE ?`;
    args.push(`%${tag}%`);
  }

  sql += ` ORDER BY rank LIMIT 20`;

  const result = await client.execute({ sql, args });
  return result.rows;
}
```

## ベストプラクティス

### 1. ベクトル検索の最適化

```typescript
// バッチ処理でエンベディングを生成
async function batchInsertEmbeddings(documents: string[]) {
  const embeddings = await Promise.all(
    documents.map(doc => generateEmbedding(doc))
  );

  for (let i = 0; i < documents.length; i++) {
    await insertDocument(documents[i], embeddings[i]);
  }
}
```

### 2. FTS5インデックスの更新

```sql
-- FTS5の最適化
INSERT INTO articles_fts(articles_fts) VALUES('optimize');

-- 再構築
INSERT INTO articles_fts(articles_fts) VALUES('rebuild');
```

### 3. JSON性能の最適化

```sql
-- 頻繁にアクセスするJSON値を計算列として抽出
ALTER TABLE user_profiles
ADD COLUMN theme TEXT GENERATED ALWAYS AS (json_extract(profile_data, '$.preferences.theme'));

-- インデックス作成
CREATE INDEX idx_user_theme ON user_profiles(theme);
```

## 制限事項

### ベクトル拡張

- 最大次元数: 2048
- サポートされる距離関数: コサイン、L2
- メモリ使用量に注意

### FTS5

- 日本語トークナイゼーションは基本的
- カスタムランキング関数は制限あり

### JSON

- ネストの深さに制限はないが、パフォーマンスに影響
- 大きなJSON（1MB以上）は注意

## 関連リンク

- [SQLite FTS5 Documentation](https://www.sqlite.org/fts5.html)
- [SQLite JSON1 Documentation](https://www.sqlite.org/json1.html)
- [libSQL Vector Extension](https://github.com/tursodatabase/libsql-vector)
- [Turso公式サイト](https://turso.tech/)
