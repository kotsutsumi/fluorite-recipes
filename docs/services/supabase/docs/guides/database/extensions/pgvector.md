# pgvector: 埋め込みベクトルとベクトル類似度検索

## 概要

pgvectorは、PostgreSQLの拡張機能で、「ベクトル類似度検索」と埋め込みベクトルの保存を可能にします。データベース内でベクトルデータを効率的に保存・クエリすることができます。

## 主要な概念

### ベクトル類似度

ベクトル類似度とは、2つの関連するアイテム間の類似性を測る指標です。例えば、商品を数値ベクトルに変換し、その近接性を比較することで、類似した商品を見つけることができます。

### 埋め込みベクトル

特にOpenAIのGPT-3のようなAIアプリケーションで有用です。埋め込みベクトルを作成して保存し、「検索拡張生成（Retrieval Augmented Generation）」に利用できます。

## 使用方法

### 拡張機能の有効化

拡張機能を有効にする方法は2つあります：

- **Supabaseダッシュボード**: Database > Extensions > "vector"を検索
- **SQL**: 以下のコマンドを実行

```sql
create extension vector with schema extensions;
```

### ベクトルテーブルの作成

テーブル構造の例：

```sql
create table posts (
  id serial primary key,
  title text not null,
  body text not null,
  embedding vector(384)
);
```

### 埋め込みベクトルの保存

Transformer.jsを使用した例：

```javascript
import { pipeline } from '@xenova/transformers'
const generateEmbedding = await pipeline('feature-extraction', 'Supabase/gte-small')
// 埋め込みベクトルを生成して保存
```

## 特別な考慮事項

- IVFFlatまたはHNSWインデックスを使用する場合、フィルタリングが予想よりも少ない行を返す可能性があります
- 完全な結果セットを確保するために「反復検索」を使用することを推奨します

## 追加リソース

- Supabase Clippy
- PostgreSでのOpenAI埋め込みベクトル
- ChatGPT Pluginsテンプレート
- カスタムドキュメント検索テンプレート
