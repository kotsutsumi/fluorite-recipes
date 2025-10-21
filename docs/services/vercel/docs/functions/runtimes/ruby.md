# Vercel FunctionsでのRubyランタイムの使用

## 概要

RubyランタイムはすべてのVercelプランでベータ版として利用可能です。プロジェクトのルートにある`/api`ディレクトリ内の`.rb`ファイルからRuby Vercel関数をコンパイルします。

## Rubyファイルの要件

Rubyファイルは以下のいずれかを定義する必要があります:

- `do |request, response|`シグネチャに一致する`Handler` proc
- `WEBrick::HTTPServlet::AbstractServlet`を継承する`Handler`クラス

## 実装例

### APIファイル(api/index.rb)

```ruby
require 'cowsay'

Handler = Proc.new do |request, response|
  name = request.query['name'] || 'World'

  response.status = 200
  response['Content-Type'] = 'text/text; charset=utf-8'
  response.body = Cowsay.say("Hello #{name}", 'cow')
end
```

### Gemfile

```ruby
source "https://rubygems.org"

gem "cowsay", "~> 0.3.0"
```

## Rubyバージョン

- 新しいデプロイメントはデフォルトでRuby 3.3.xを使用
- `Gemfile`でバージョンを指定:

```ruby
source "https://rubygems.org"
ruby "~> 3.3.x"
```

注意: パッチバージョンは無視され、最新の3.3.xが使用されます

## Rubyの依存関係

- `Gemfile`で定義された依存関係のインストールをサポート
- `bundler install --deployment`を使用して依存関係をベンダー化可能
- ベンダー化された依存関係(ネイティブ拡張機能を含む)は、デプロイメント中に再ビルドされません
