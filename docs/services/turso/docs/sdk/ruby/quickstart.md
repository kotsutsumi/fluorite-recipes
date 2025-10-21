# Ruby SDK クイックスタート - Turso

Ruby アプリケーションで Turso データベースを使用するための基本ガイドです。

## インストール

```bash
bundle add turso_libsql
```

または `Gemfile` に追加：

```ruby
gem 'turso_libsql'
```

そして実行：

```bash
bundle install
```

## 接続方法

### 1. 組み込みレプリカ（推奨）

```ruby
require 'libsql'

db = Libsql::Database.new(
  path: 'local.db',
  url: ENV['TURSO_DATABASE_URL'],
  auth_token: ENV['TURSO_AUTH_TOKEN'],
  sync_interval: 100
)
```

### 2. ローカルのみ

```ruby
db = Libsql::Database.new(path: 'local.db')
```

### 3. リモートのみ

```ruby
db = Libsql::Database.new(
  url: ENV['TURSO_DATABASE_URL'],
  auth_token: ENV['TURSO_AUTH_TOKEN']
)
```

### 4. インメモリ

```ruby
db = Libsql::Database.new(path: ':memory:')
```

## クエリの実行

### テーブルの作成

```ruby
db.connect do |conn|
  conn.execute <<-SQL
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    )
  SQL
end
```

### データの挿入

```ruby
db.connect do |conn|
  # プレースホルダーを使用
  conn.execute(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    ['Alice', 'alice@example.com']
  )
end
```

### データの取得

```ruby
db.connect do |conn|
  # すべてのユーザーを取得
  rows = conn.query('SELECT * FROM users')

  rows.each do |row|
    puts "ID: #{row['id']}, Name: #{row['name']}, Email: #{row['email']}"
  end

  rows.close
end
```

### 単一レコードの取得

```ruby
db.connect do |conn|
  rows = conn.query('SELECT * FROM users WHERE id = ?', [1])

  if row = rows.first
    puts "Found user: #{row['name']}"
  end

  rows.close
end
```

### データの更新

```ruby
db.connect do |conn|
  conn.execute(
    'UPDATE users SET name = ? WHERE id = ?',
    ['Alice Updated', 1]
  )
end
```

### データの削除

```ruby
db.connect do |conn|
  conn.execute('DELETE FROM users WHERE id = ?', [1])
end
```

## 同期機能（組み込みレプリカ）

### 手動同期

```ruby
db.sync
```

### 自動定期同期

```ruby
db = Libsql::Database.new(
  path: 'local.db',
  url: ENV['TURSO_DATABASE_URL'],
  auth_token: ENV['TURSO_AUTH_TOKEN'],
  sync_interval: 60  # 60秒ごとに同期
)
```

## トランザクション

```ruby
db.connect do |conn|
  conn.transaction do |tx|
    tx.execute(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      ['Bob', 'bob@example.com']
    )

    tx.execute(
      'UPDATE stats SET count = count + 1'
    )

    # トランザクションは自動的にコミットされます
  end
end
```

### 明示的なロールバック

```ruby
db.connect do |conn|
  conn.transaction do |tx|
    tx.execute('INSERT INTO users (name, email) VALUES (?, ?)', ['Charlie', 'charlie@example.com'])

    # エラーが発生した場合
    if some_error_condition
      tx.rollback
    end
  end
end
```

## 完全な例

```ruby
require 'libsql'
require 'dotenv/load'

class UserManager
  def initialize
    @db = Libsql::Database.new(
      path: 'app.db',
      url: ENV['TURSO_DATABASE_URL'],
      auth_token: ENV['TURSO_AUTH_TOKEN'],
      sync_interval: 60
    )

    create_table
  end

  def create_table
    @db.connect do |conn|
      conn.execute <<-SQL
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      SQL
    end
  end

  def create_user(name, email)
    @db.connect do |conn|
      conn.execute(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [name, email]
      )
    end

    @db.sync if @db.respond_to?(:sync)
  end

  def all_users
    users = []

    @db.connect do |conn|
      rows = conn.query('SELECT * FROM users ORDER BY created_at DESC')

      rows.each do |row|
        users << {
          id: row['id'],
          name: row['name'],
          email: row['email'],
          created_at: row['created_at']
        }
      end

      rows.close
    end

    users
  end

  def find_user(id)
    @db.connect do |conn|
      rows = conn.query('SELECT * FROM users WHERE id = ?', [id])
      user = rows.first

      rows.close
      user
    end
  end

  def update_user(id, name: nil, email: nil)
    updates = []
    params = []

    if name
      updates << 'name = ?'
      params << name
    end

    if email
      updates << 'email = ?'
      params << email
    end

    return if updates.empty?

    params << id

    @db.connect do |conn|
      conn.execute(
        "UPDATE users SET #{updates.join(', ')} WHERE id = ?",
        params
      )
    end

    @db.sync if @db.respond_to?(:sync)
  end

  def delete_user(id)
    @db.connect do |conn|
      conn.execute('DELETE FROM users WHERE id = ?', [id])
    end

    @db.sync if @db.respond_to?(:sync)
  end
end

# 使用例
if __FILE__ == $0
  manager = UserManager.new

  # ユーザーを作成
  manager.create_user('Alice', 'alice@example.com')
  manager.create_user('Bob', 'bob@example.com')

  # すべてのユーザーを表示
  puts "\nAll users:"
  manager.all_users.each do |user|
    puts "  #{user[:id]}: #{user[:name]} (#{user[:email]})"
  end

  # ユーザーを更新
  manager.update_user(1, name: 'Alice Updated')

  # 更新後のユーザーを表示
  user = manager.find_user(1)
  puts "\nUpdated user: #{user['name']}" if user

  # ユーザーを削除
  manager.delete_user(2)

  # 削除後のユーザー一覧
  puts "\nUsers after deletion:"
  manager.all_users.each do |user|
    puts "  #{user[:id]}: #{user[:name]}"
  end
end
```

## Rails との統合

### Gemfile

```ruby
gem 'turso_libsql'
```

### 初期化子

```ruby
# config/initializers/turso.rb
TURSO_DB = Libsql::Database.new(
  path: Rails.root.join('db', 'turso.db').to_s,
  url: ENV['TURSO_DATABASE_URL'],
  auth_token: ENV['TURSO_AUTH_TOKEN']
)
```

### モデルでの使用

```ruby
class User
  class << self
    def all
      users = []

      TURSO_DB.connect do |conn|
        rows = conn.query('SELECT * FROM users')

        rows.each do |row|
          users << new(row)
        end

        rows.close
      end

      users
    end

    def create(attributes)
      TURSO_DB.connect do |conn|
        conn.execute(
          'INSERT INTO users (name, email) VALUES (?, ?)',
          [attributes[:name], attributes[:email]]
        )
      end
    end
  end

  def initialize(attributes)
    @attributes = attributes
  end

  def id
    @attributes['id']
  end

  def name
    @attributes['name']
  end

  def email
    @attributes['email']
  end
end
```

## 関連リンク

- [Ruby SDK 例](./examples.md)
- [Turso 公式ドキュメント](https://docs.turso.tech)
