# Turso - AI と埋め込み

TursoとlibSQLのベクトル類似検索機能について説明します。

## 概要

ベクトル類似検索は、TursoとlibSQL Serverにネイティブに組み込まれています。拡張機能なしでベクトル検索を利用できます。

## ベクトルタイプ

libSQLは6種類のベクトルタイプをサポートしており、精度とコンパクトさのバランスを選択できます：

### 利用可能なベクトルタイプ

1. **FLOAT64 / F64_BLOB** - 最も精度が高い
2. **FLOAT32 / F32_BLOB** - 標準的な精度
3. **FLOAT16 / F16_BLOB** - 半精度
4. **FLOATB16 / FB16_BLOB** - Brain Float 16
5. **FLOAT8 / F8_BLOB** - 8ビット浮動小数点
6. **FLOAT1BIT / F1BIT_BLOB** - 最もコンパクト

## 主な関数

### 変換関数

各ベクトルタイプに対応する変換関数：

```sql
-- FLOAT32への変換
SELECT vector32('[0.1, 0.2, 0.3, 0.4]');

-- FLOAT64への変換
SELECT vector64('[0.1, 0.2, 0.3, 0.4]');
```

### 距離計算関数

#### コサイン距離

```sql
SELECT vector_distance_cos(
  vector32('[0.1, 0.2, 0.3]'),
  vector32('[0.4, 0.5, 0.6]')
);
```

#### ユークリッド距離（L2）

```sql
SELECT vector_distance_l2(
  vector32('[0.1, 0.2, 0.3]'),
  vector32('[0.4, 0.5, 0.6]')
);
```

## ベクトルの使用方法

### 1. テーブルの作成

ベクトルカラムを持つテーブルを作成：

```sql
CREATE TABLE movies (
  title TEXT,
  year INT,
  embedding F32_BLOB(4)  -- 4次元ベクトル
);
```

### 2. 埋め込みの生成と挿入

```sql
-- ベクトルデータの挿入
INSERT INTO movies (title, year, embedding)
VALUES (
  'Napoleon',
  2023,
  vector32('[0.800, 0.579, 0.481, 0.229]')
);

INSERT INTO movies (title, year, embedding)
VALUES (
  'Black Hawk Down',
  2001,
  vector32('[0.658, 0.564, 0.549, 0.513]')
);

INSERT INTO movies (title, year, embedding)
VALUES (
  'Gladiator',
  2000,
  vector32('[0.846, 0.573, 0.424, 0.003]')
);

INSERT INTO movies (title, year, embedding)
VALUES (
  'Blade Runner',
  1982,
  vector32('[0.064, 0.777, 0.661, 0.687]')
);
```

### 3. ベクトル類似検索の実行

#### コサイン類似度での検索

```sql
SELECT
  title,
  year,
  vector_distance_cos(
    embedding,
    vector32('[0.064, 0.777, 0.661, 0.687]')
  ) AS distance
FROM movies
ORDER BY distance
LIMIT 3;
```

## ベクトルインデックス

### インデックスの作成

DiskANNアルゴリズムを使用した近似最近傍検索のインデックス：

```sql
CREATE INDEX movies_idx ON movies(
  libsql_vector_idx(embedding)
);
```

### インデックス設定オプション

```sql
CREATE INDEX movies_idx ON movies(
  libsql_vector_idx(
    embedding,
    'metric=cosine',
    'compress_neighbors=float8',
    'max_neighbors=20',
    'search_size=50'
  )
);
```

#### 利用可能な設定

- **metric**: `cosine`（デフォルト）または `euclidean`
- **compress_neighbors**: ベクトル圧縮方式
- **max_neighbors**: 最大近傍数
- **search_size**: 検索サイズ

### インデックスを使用した検索

```sql
-- 上位3件の類似結果を取得
SELECT
  title,
  year
FROM vector_top_k(
  'movies_idx',
  vector32('[0.064, 0.777, 0.661, 0.687]'),
  3
)
JOIN movies ON movies.rowid = id;
```

## 完全なワークフロー例

### 1. テーブルとインデックスの作成

```sql
-- テーブル作成
CREATE TABLE articles (
  id INTEGER PRIMARY KEY,
  title TEXT,
  content TEXT,
  embedding F32_BLOB(1536)  -- OpenAI Ada-002の次元数
);

-- ベクトルインデックス作成
CREATE INDEX articles_idx ON articles(
  libsql_vector_idx(embedding)
);
```

### 2. データの挿入

```javascript
import { createClient } from "@libsql/client";
import OpenAI from "openai";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const openai = new OpenAI();

async function addArticle(title, content) {
  // OpenAIで埋め込みを生成
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: content,
  });

  const embedding = response.data[0].embedding;

  // データベースに挿入
  await client.execute({
    sql: `INSERT INTO articles (title, content, embedding)
          VALUES (?, ?, vector32(?))`,
    args: [title, content, JSON.stringify(embedding)],
  });
}
```

### 3. 類似検索の実行

```javascript
async function searchSimilar(query, limit = 5) {
  // クエリの埋め込みを生成
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: query,
  });

  const queryEmbedding = response.data[0].embedding;

  // 類似記事を検索
  const results = await client.execute({
    sql: `SELECT
            a.title,
            a.content
          FROM vector_top_k(
            'articles_idx',
            vector32(?),
            ?
          )
          JOIN articles a ON a.rowid = id`,
    args: [JSON.stringify(queryEmbedding), limit],
  });

  return results.rows;
}

// 使用例
const similar = await searchSimilar("machine learning tutorials");
console.log(similar);
```

## 制限事項

### 1. 最大ベクトル次元数

- **最大**: 65,536次元

### 2. テーブル要件

- ROWIDまたは単一のPRIMARY KEYが必要
- 複合主キーは非対応

### 3. 近似検索

- インデックスを使用した検索は近似結果を返します
- 完全に最適な近傍を返さない場合があります
- ほとんどのユースケースでは十分な精度

## パフォーマンス最適化

### インデックスパラメータのチューニング

```sql
-- より高精度（遅い）
CREATE INDEX articles_idx ON articles(
  libsql_vector_idx(
    embedding,
    'max_neighbors=50',
    'search_size=100'
  )
);

-- より高速（精度は若干低下）
CREATE INDEX articles_idx ON articles(
  libsql_vector_idx(
    embedding,
    'max_neighbors=10',
    'search_size=20',
    'compress_neighbors=float8'
  )
);
```

### ベクトル圧縮

```sql
-- float8圧縮でストレージを削減
CREATE INDEX articles_idx ON articles(
  libsql_vector_idx(
    embedding,
    'compress_neighbors=float8'
  )
);
```

## ユースケース

### 1. セマンティック検索

```sql
-- 自然言語クエリで類似文書を検索
SELECT title FROM vector_top_k(
  'documents_idx',
  vector32(?),  -- クエリの埋め込み
  10
) JOIN documents ON documents.rowid = id;
```

### 2. レコメンデーションシステム

```sql
-- 類似商品の推薦
SELECT name, price FROM vector_top_k(
  'products_idx',
  (SELECT embedding FROM products WHERE id = ?),  -- 基準商品
  5
) JOIN products ON products.rowid = id
WHERE id != ?;  -- 自分自身を除外
```

### 3. 画像類似検索

```sql
-- 類似画像の検索
SELECT image_url FROM vector_top_k(
  'images_idx',
  vector32(?),  -- 画像の埋め込み
  20
) JOIN images ON images.rowid = id;
```

### 4. RAG（Retrieval Augmented Generation）

```javascript
async function ragQuery(question) {
  // 1. 関連文書を検索
  const relevant = await searchSimilar(question, 3);

  // 2. コンテキストを構築
  const context = relevant.map(r => r.content).join('\n\n');

  // 3. LLMで回答生成
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `以下のコンテキストを使用して質問に答えてください:\n\n${context}`
      },
      { role: "user", content: question }
    ],
  });

  return completion.choices[0].message.content;
}
```

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [libSQL Vector Documentation](https://github.com/tursodatabase/libsql)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [DiskANN Paper](https://proceedings.neurips.cc/paper/2019/file/09853c7fb1d3f8ee67a61b6bf4a7f8e6-Paper.pdf)
