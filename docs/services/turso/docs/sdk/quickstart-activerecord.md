# ActiveRecord（Ruby on Rails）クイックスタート

TursoをRuby on RailsのActiveRecordで使用する方法を説明します。

## インストール

### 1. Gemfileに追加

```ruby
# Gemfile
gem 'sqlite3'
gem 'libsql' # Turso用のlibsqlアダプター
```

### 2. インストール

```bash
bundle install
```

## データベースの作成

```bash
# Tursoデータベースを作成
turso db create rails-app

# 接続情報を取得
turso db show rails-app --url
turso db tokens create rails-app
```

## 設定

### database.yml の設定

```yaml
# config/database.yml
production:
  adapter: libsql
  database: <%= ENV['TURSO_DATABASE_URL'] %>
  auth_token: <%= ENV['TURSO_AUTH_TOKEN'] %>

# または、SQLiteとして設定（ローカル開発用）
development:
  adapter: sqlite3
  database: db/development.sqlite3
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>

test:
  adapter: sqlite3
  database: db/test.sqlite3
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
```

### 環境変数の設定

```bash
# .env
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

## モデルの使用

### マイグレーションの作成

```bash
rails generate model User name:string email:string
rails db:migrate
```

### モデルの使用

```ruby
# app/models/user.rb
class User < ApplicationRecord
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
end

# コンソールでの使用
rails console

# ユーザーの作成
user = User.create(name: "Alice", email: "alice@example.com")

# ユーザーの検索
User.find_by(email: "alice@example.com")

# すべてのユーザー
User.all
```

## デプロイ

### Herokuの例

```bash
# 環境変数を設定
heroku config:set TURSO_DATABASE_URL=libsql://your-database.turso.io
heroku config:set TURSO_AUTH_TOKEN=your-auth-token

# デプロイ
git push heroku main

# マイグレーション実行
heroku run rails db:migrate
```

## トラブルシューティング

### 接続エラー

```ruby
# データベース接続のテスト
ActiveRecord::Base.connection.execute("SELECT 1")
```

### マイグレーションエラー

```bash
# マイグレーションをリセット
rails db:reset

# または、ロールバックして再実行
rails db:rollback
rails db:migrate
```

## パフォーマンス最適化

```ruby
# config/database.yml
production:
  adapter: libsql
  database: <%= ENV['TURSO_DATABASE_URL'] %>
  auth_token: <%= ENV['TURSO_AUTH_TOKEN'] %>
  pool: 5
  timeout: 5000
```

## 参考リンク

- [Ruby SDK](./ruby.md)
- [ActiveRecord ガイド](https://guides.rubyonrails.org/active_record_basics.html)
- [Turso CLI](../cli/README.md)
- [SDK一覧](./README.md)

## 注意

Tursoでサポートされる機能はSQLiteの機能に依存します。一部のActiveRecord機能は制限される場合があります。
