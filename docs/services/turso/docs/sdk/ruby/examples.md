# Ruby SDK 例 - Turso

Turso Ruby SDK の実践的な例を紹介します。

## 📚 目次

- [1. ローカルデータベース](#1-ローカルデータベース)
- [2. リモートデータベース](#2-リモートデータベース)
- [3. 同期機能](#3-同期機能)
- [4. トランザクション](#4-トランザクション)
- [5. インメモリデータベース](#5-インメモリデータベース)
- [6. ベクトル埋め込み](#6-ベクトル埋め込み)
- [7. 暗号化](#7-暗号化)

## 1. ローカルデータベース

ローカル SQLite ファイルを使用した基本的な例です。

```ruby
require 'libsql'

# ローカルデータベースに接続
db = Libsql::Database.new(path: 'local.db')

db.connect do |conn|
  # テーブルを作成
  conn.execute <<-SQL
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER DEFAULT 0
    )
  SQL

  # データを挿入
  conn.execute(
    'INSERT INTO products (name, price, stock) VALUES (?, ?, ?)',
    ['Laptop', 999.99, 10]
  )

  conn.execute(
    'INSERT INTO products (name, price, stock) VALUES (?, ?, ?)',
    ['Mouse', 29.99, 50]
  )

  # データを取得
  rows = conn.query('SELECT * FROM products')

  puts "Products:"
  rows.each do |row|
    puts "  #{row['name']}: $#{row['price']} (Stock: #{row['stock']})"
  end

  rows.close
end
```

## 2. リモートデータベース

リモート Turso データベースに接続する例です。

```ruby
require 'libsql'
require 'dotenv/load'

# リモートデータベースに接続
db = Libsql::Database.new(
  url: ENV['TURSO_DATABASE_URL'],
  auth_token: ENV['TURSO_AUTH_TOKEN']
)

db.connect do |conn|
  # データを取得
  rows = conn.query('SELECT * FROM users WHERE status = ?', ['active'])

  puts "Active users:"
  rows.each do |row|
    puts "  #{row['name']} (#{row['email']})"
  end

  rows.close

  # データを挿入
  conn.execute(
    'INSERT INTO logs (message, level) VALUES (?, ?)',
    ['User logged in', 'INFO']
  )
end
```

## 3. 同期機能

組み込みレプリカを使用した同期の例です。

```ruby
require 'libsql'
require 'dotenv/load'

# 組み込みレプリカで接続
db = Libsql::Database.new(
  path: 'replica.db',
  url: ENV['TURSO_DATABASE_URL'],
  auth_token: ENV['TURSO_AUTH_TOKEN']
)

# 初期同期
db.sync
puts "Initial sync completed"

db.connect do |conn|
  # ローカルで読み取り（高速）
  rows = conn.query('SELECT * FROM users')
  puts "Users: #{rows.count}"
  rows.close

  # ローカルで書き込み
  conn.execute(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    ['New User', 'new@example.com']
  )
end

# 変更を同期
db.sync
puts "Changes synced to remote"

# 定期的な同期
loop do
  db.connect do |conn|
    # データベース操作
    rows = conn.query('SELECT COUNT(*) as count FROM users')
    count = rows.first['count']
    rows.close

    puts "Total users: #{count}"
  end

  # 1分ごとに同期
  sleep 60
  db.sync
  puts "Synced at #{Time.now}"
end
```

## 4. トランザクション

複数の操作をトランザクションでまとめる例です。

```ruby
require 'libsql'

db = Libsql::Database.new(path: 'transactions.db')

db.connect do |conn|
  # テーブルを作成
  conn.execute <<-SQL
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      balance REAL DEFAULT 0
    )
  SQL

  # 初期データ
  conn.execute("INSERT INTO accounts (name, balance) VALUES ('Alice', 1000)")
  conn.execute("INSERT INTO accounts (name, balance) VALUES ('Bob', 500)")

  # 送金トランザクション
  begin
    conn.transaction do |tx|
      # Alice から 200 を引く
      tx.execute(
        'UPDATE accounts SET balance = balance - ? WHERE name = ?',
        [200, 'Alice']
      )

      # Bob に 200 を加える
      tx.execute(
        'UPDATE accounts SET balance = balance + ? WHERE name = ?',
        [200, 'Bob']
      )

      puts "Transfer successful!"
    end
  rescue => e
    puts "Transfer failed: #{e.message}"
  end

  # 結果を確認
  rows = conn.query('SELECT * FROM accounts')

  puts "\nAccount balances:"
  rows.each do |row|
    puts "  #{row['name']}: $#{row['balance']}"
  end

  rows.close
end
```

## 5. インメモリデータベース

一時的なデータストレージの例です。

```ruby
require 'libsql'

# インメモリデータベース
db = Libsql::Database.new(path: ':memory:')

db.connect do |conn|
  # セッションデータ用テーブル
  conn.execute <<-SQL
    CREATE TABLE sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER,
      data TEXT,
      expires_at INTEGER
    )
  SQL

  # セッションを保存
  require 'securerandom'
  session_id = SecureRandom.uuid

  conn.execute(
    'INSERT INTO sessions (id, user_id, data, expires_at) VALUES (?, ?, ?, ?)',
    [session_id, 1, '{"theme":"dark"}', Time.now.to_i + 3600]
  )

  # セッションを取得
  rows = conn.query('SELECT * FROM sessions WHERE id = ?', [session_id])

  if row = rows.first
    puts "Session found:"
    puts "  ID: #{row['id']}"
    puts "  User: #{row['user_id']}"
    puts "  Data: #{row['data']}"
  end

  rows.close
end

puts "\nDatabase will be cleared when program exits"
```

## 6. ベクトル埋め込み

ベクトル検索を使用した例です。

```ruby
require 'libsql'

db = Libsql::Database.new(path: 'vectors.db')

db.connect do |conn|
  # ベクトルテーブルを作成
  conn.execute <<-SQL
    CREATE TABLE IF NOT EXISTS embeddings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      vector F32_BLOB(3)
    )
  SQL

  # ベクトルインデックスを作成
  conn.execute(
    'CREATE INDEX IF NOT EXISTS embeddings_vector_idx ON embeddings(libsql_vector_idx(vector))'
  )

  # サンプルデータを挿入
  samples = [
    ['cat', [0.1, 0.2, 0.3]],
    ['dog', [0.2, 0.3, 0.4]],
    ['bird', [0.8, 0.9, 1.0]]
  ]

  samples.each do |text, vector|
    # ベクトルをバイナリ形式に変換
    binary_vector = vector.pack('f*')

    conn.execute(
      'INSERT INTO embeddings (text, vector) VALUES (?, ?)',
      [text, binary_vector]
    )
  end

  # 類似度検索
  search_vector = [0.15, 0.25, 0.35]
  search_binary = search_vector.pack('f*')

  rows = conn.query(<<-SQL, [search_binary])
    SELECT
      text,
      vector_distance_cos(vector, ?) as distance
    FROM embeddings
    ORDER BY distance
    LIMIT 3
  SQL

  puts "Similar items:"
  rows.each do |row|
    puts "  #{row['text']}: distance = #{row['distance']}"
  end

  rows.close
end
```

## 7. 暗号化

暗号化されたデータベースの例です。

```ruby
require 'libsql'
require 'dotenv/load'

encryption_key = ENV['ENCRYPTION_KEY']

# 暗号化されたデータベースを作成
db = Libsql::Database.new(
  path: 'encrypted.db',
  encryption_key: encryption_key
)

db.connect do |conn|
  # 機密データ用テーブル
  conn.execute <<-SQL
    CREATE TABLE IF NOT EXISTS secrets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      value TEXT NOT NULL
    )
  SQL

  # 機密データを保存
  conn.execute(
    'INSERT INTO secrets (name, value) VALUES (?, ?)',
    ['api_key', 'secret-api-key-12345']
  )

  conn.execute(
    'INSERT INTO secrets (name, value) VALUES (?, ?)',
    ['password', 'super-secret-password']
  )

  # データを取得
  rows = conn.query('SELECT * FROM secrets')

  puts "Stored secrets:"
  rows.each do |row|
    puts "  #{row['name']}: #{row['value']}"
  end

  rows.close
end

puts "\nDatabase is encrypted and can only be read with the correct key"
```

## 完全なアプリケーション例

### ブログシステム

```ruby
require 'libsql'
require 'dotenv/load'

class BlogApp
  def initialize
    @db = Libsql::Database.new(
      path: 'blog.db',
      url: ENV['TURSO_DATABASE_URL'],
      auth_token: ENV['TURSO_AUTH_TOKEN'],
      sync_interval: 60
    )

    setup_database
  end

  def setup_database
    @db.connect do |conn|
      conn.execute <<-SQL
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          author TEXT NOT NULL,
          published INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      SQL

      conn.execute <<-SQL
        CREATE TABLE IF NOT EXISTS comments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          post_id INTEGER NOT NULL,
          author TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (post_id) REFERENCES posts(id)
        )
      SQL
    end
  end

  def create_post(title, content, author)
    @db.connect do |conn|
      conn.execute(
        'INSERT INTO posts (title, content, author) VALUES (?, ?, ?)',
        [title, content, author]
      )
    end

    @db.sync if @db.respond_to?(:sync)
  end

  def publish_post(id)
    @db.connect do |conn|
      conn.execute('UPDATE posts SET published = 1 WHERE id = ?', [id])
    end

    @db.sync if @db.respond_to?(:sync)
  end

  def list_posts(published_only: false)
    query = 'SELECT * FROM posts'
    query += ' WHERE published = 1' if published_only
    query += ' ORDER BY created_at DESC'

    posts = []

    @db.connect do |conn|
      rows = conn.query(query)

      rows.each do |row|
        posts << row
      end

      rows.close
    end

    posts
  end

  def add_comment(post_id, author, content)
    @db.connect do |conn|
      conn.execute(
        'INSERT INTO comments (post_id, author, content) VALUES (?, ?, ?)',
        [post_id, author, content]
      )
    end

    @db.sync if @db.respond_to?(:sync)
  end

  def get_post_with_comments(id)
    post = nil
    comments = []

    @db.connect do |conn|
      # 投稿を取得
      rows = conn.query('SELECT * FROM posts WHERE id = ?', [id])
      post = rows.first
      rows.close

      return nil unless post

      # コメントを取得
      rows = conn.query(
        'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC',
        [id]
      )

      rows.each do |row|
        comments << row
      end

      rows.close
    end

    { post: post, comments: comments }
  end
end

# 使用例
if __FILE__ == $0
  blog = BlogApp.new

  # 投稿を作成
  blog.create_post(
    'Hello World',
    'This is my first blog post!',
    'Alice'
  )

  # 投稿を公開
  blog.publish_post(1)

  # コメントを追加
  blog.add_comment(1, 'Bob', 'Great post!')

  # 公開された投稿を一覧表示
  puts "Published posts:"
  blog.list_posts(published_only: true).each do |post|
    puts "  #{post['id']}: #{post['title']} by #{post['author']}"
  end

  # 投稿とコメントを表示
  result = blog.get_post_with_comments(1)

  if result
    puts "\nPost details:"
    puts "  Title: #{result[:post]['title']}"
    puts "  Author: #{result[:post]['author']}"
    puts "  Content: #{result[:post]['content']}"

    puts "\n  Comments (#{result[:comments].size}):"
    result[:comments].each do |comment|
      puts "    - #{comment['author']}: #{comment['content']}"
    end
  end
end
```

## GitHub リポジトリ

すべての例は [libsql-ruby/examples](https://github.com/tursodatabase/libsql-ruby/tree/main/examples) で確認できます。

## 関連リンク

- [Ruby SDK クイックスタート](./quickstart.md)
- [Turso 公式ドキュメント](https://docs.turso.tech)
