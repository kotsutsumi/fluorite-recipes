# Turso - 使用量と料金

Tursoの使用量制限と料金について説明します。

## 使用量制限

StarterプランとScalerプランには、月次で監視される以下のメトリクスがあります：

### 監視対象メトリクス

1. **読み取り行数** (Rows Read)
2. **書き込み行数** (Rows Written)
3. **ストレージ総量** (Total Storage)

### クォータ超過時の動作

月次クォータを超過すると、クエリが失敗します。

## 読み取り行数（Rows Read）

### 定義

「行の読み取り」とは、ステートメント実行中の「行スキャン」を指します。

### 影響を受ける操作

#### 1. SQLクエリ

```sql
-- 10行スキャン
SELECT * FROM users LIMIT 10;

-- 全行スキャン（テーブルに1000行ある場合は1000行）
SELECT * FROM users;
```

#### 2. 集約関数

```sql
-- 全行をスキャンしてカウント
SELECT COUNT(*) FROM users;

-- 条件に合う行をスキャン
SELECT SUM(balance) FROM accounts WHERE user_id = 123;
```

#### 3. フルテーブルスキャン

インデックスがない場合、テーブル全体がスキャンされます：

```sql
-- インデックスがない場合、全行スキャン
SELECT * FROM users WHERE email = 'alice@example.com';

-- インデックスがある場合、効率的なスキャン
CREATE INDEX idx_email ON users(email);
SELECT * FROM users WHERE email = 'alice@example.com';
```

#### 4. 複雑なクエリ

```sql
-- 両方のテーブルの全行をスキャンする可能性
SELECT * FROM users u
JOIN orders o ON u.id = o.user_id;
```

#### 5. UPDATE操作

UPDATEは対象行を見つけるために読み取りが必要：

```sql
-- 条件に合う行を見つけるためにスキャン
UPDATE users SET status = 'active' WHERE last_login > '2024-01-01';
```

#### 6. ALTER TABLE操作

テーブル構造の変更は全行をスキャンする可能性があります：

```sql
-- 全行を読み取って新しいテーブルに書き込む
ALTER TABLE users ADD COLUMN created_at TIMESTAMP;
```

#### 7. インデックス作成

```sql
-- 全行をスキャンしてインデックスを構築
CREATE INDEX idx_name ON users(name);
```

### 重要な注意点

> クエリは、返される行数よりも多くの行をスキャンする可能性があります。

**例**:
```sql
-- 10行のみ返すが、条件に合う行を見つけるために
-- より多くの行をスキャンする可能性がある
SELECT * FROM users WHERE status = 'active' LIMIT 10;
```

## 書き込み行数（Rows Written）

### 定義

新しい行の挿入と既存行の更新が含まれます。

### 影響を受ける操作

#### 1. INSERT操作

```sql
-- 1行書き込み
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');

-- 複数行書き込み
INSERT INTO users (name, email) VALUES
  ('Bob', 'bob@example.com'),
  ('Charlie', 'charlie@example.com');
-- 2行書き込み
```

#### 2. UPDATE操作

```sql
-- 条件に合うすべての行を更新
UPDATE users SET status = 'inactive' WHERE last_login < '2023-01-01';
-- 更新された行数分カウント
```

#### 3. ALTER TABLE操作

既存データの再構築が必要な場合、全行が書き込みとしてカウントされます：

```sql
ALTER TABLE users ADD COLUMN age INTEGER;
-- 既存の全行が書き込みとしてカウント
```

#### 4. 中断されたトランザクション

ロールバックされたトランザクション内の書き込みもカウントされます：

```sql
BEGIN TRANSACTION;
  INSERT INTO users (name) VALUES ('Test'); -- カウントされる
ROLLBACK; -- ロールバックしてもカウント済み
```

## ストレージ総量（Total Storage）

### 測定方法

SQLiteの`dbstat`仮想テーブルを使用して測定されます。

### 基本単位

- **4KB**: データベースファイルページの基本単位
- ページ単位でストレージが計算されます

### 制限事項

> `VACUUM`コマンドは現在無効になっています。

**注意**: 削除されたデータのスペースは即座に解放されません。

### ストレージ最適化

```sql
-- データを削除
DELETE FROM old_logs WHERE created_at < '2023-01-01';

-- VACUUM は現在使用できません
-- VACUUM; -- エラー
```

## 使用量削減の戦略

### 1. SQLiteクエリプランナーの理解

```sql
-- クエリプランを確認
EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = 'alice@example.com';
```

### 2. 適切なインデックスの使用

```sql
-- よく使われるカラムにインデックスを作成
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_created_at ON users(created_at);

-- 複合インデックス
CREATE INDEX idx_status_created ON users(status, created_at);
```

### 3. 効率的なクエリ設計

**非効率**:
```sql
-- 全行スキャン
SELECT * FROM users WHERE name LIKE '%alice%';
```

**効率的**:
```sql
-- 前方一致でインデックス使用
SELECT * FROM users WHERE name LIKE 'alice%';
```

### 4. 集約値の別テーブル保存

**非効率**:
```sql
-- 毎回全行をスキャン
SELECT COUNT(*) FROM orders WHERE user_id = 123;
```

**効率的**:
```sql
-- 集約値を別テーブルに保存
CREATE TABLE user_stats (
  user_id INTEGER PRIMARY KEY,
  order_count INTEGER
);

-- 注文時に更新
INSERT INTO orders (...) VALUES (...);
UPDATE user_stats SET order_count = order_count + 1 WHERE user_id = 123;

-- 高速な読み取り
SELECT order_count FROM user_stats WHERE user_id = 123;
```

### 5. テーブルスキャンの最小化

#### LIMITの適切な使用

```sql
-- インデックスと組み合わせて使用
CREATE INDEX idx_created_at ON articles(created_at DESC);
SELECT * FROM articles ORDER BY created_at DESC LIMIT 10;
```

#### WHERE句の最適化

```sql
-- インデックス可能な条件を使用
SELECT * FROM users WHERE id = 123; -- 高速

-- フルスキャンが必要な条件を避ける
SELECT * FROM users WHERE LOWER(email) = 'alice@example.com'; -- 遅い
```

### 6. バッチ処理の活用

```sql
-- 複数の操作をトランザクション内で実行
BEGIN TRANSACTION;
  INSERT INTO users (name) VALUES ('Alice');
  INSERT INTO users (name) VALUES ('Bob');
  INSERT INTO users (name) VALUES ('Charlie');
COMMIT;
```

## モニタリング

### 使用量の確認

Turso Dashboardで以下を確認できます：

- 月次読み取り行数
- 月次書き込み行数
- 現在のストレージ使用量
- クォータに対する使用率

### アラート設定

クォータの80%到達時にアラートを設定することを推奨します。

## ベストプラクティス

### 1. インデックス戦略

```sql
-- よくフィルタするカラム
CREATE INDEX idx_status ON users(status);

-- よくソートするカラム
CREATE INDEX idx_created_at ON articles(created_at DESC);

-- 複合クエリ用
CREATE INDEX idx_status_created ON users(status, created_at);
```

### 2. クエリ最適化

```sql
-- EXPLAINで確認
EXPLAIN QUERY PLAN SELECT * FROM users WHERE status = 'active';

-- インデックスが使われているか確認
-- "USING INDEX idx_status" が表示されるべき
```

### 3. データアーカイブ

古いデータを別テーブルに移動：

```sql
-- アーカイブテーブル
CREATE TABLE archived_orders AS
  SELECT * FROM orders WHERE created_at < '2023-01-01';

-- 古いデータを削除
DELETE FROM orders WHERE created_at < '2023-01-01';
```

## トラブルシューティング

### クォータ超過

**症状**: クエリが失敗する

**解決策**:
1. 使用量を確認
2. 非効率なクエリを特定
3. インデックスを追加
4. プランのアップグレードを検討

### パフォーマンス問題

**症状**: クエリが遅い

**解決策**:
```sql
EXPLAIN QUERY PLAN <your-query>;
```
を使用してクエリプランを分析

## 関連リンク

- [Turso Pricing](https://turso.tech/pricing)
- [Turso Dashboard](https://turso.tech/dashboard)
- [SQLite Query Planner](https://www.sqlite.org/queryplanner.html)
- [SQLite Index Documentation](https://www.sqlite.org/lang_createindex.html)
