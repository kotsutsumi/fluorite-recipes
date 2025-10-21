# ビルドイメージ

Vercelのビルドコンテナ環境の詳細。

## 概要

Vercelでプロジェクトをデプロイする際、ビルドは特定のビルドイメージを使用するコンテナ内で実行されます。

## ベースイメージ

**Amazon Linux 2023**

Vercelのビルドイメージは、Amazon Linux 2023をベースとしています。

## サポートされるランタイム

### Node.js

- **Node.js 22.x**（最新）
- **Node.js 20.x**（LTS）

```json
{
  "engines": {
    "node": "20.x"
  }
}
```

### Edge Runtime

Vercel Edge Functionsで使用される軽量ランタイム。

### Python

- **Python 3.12**

```python
# requirements.txt
Flask==3.0.0
```

### Ruby

- **Ruby 3.3.x**

```ruby
# Gemfile
source 'https://rubygems.org'
gem 'sinatra'
```

### Go

最新の安定版Goランタイム。

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Vercel!")
}
```

### コミュニティランタイム

追加のランタイムはコミュニティによって提供されています。

## プリインストールされたパッケージ

ビルドイメージには、dnf経由で多数のパッケージがプリインストールされています。

### 開発ツール

```bash
gcc                 # GNUコンパイラコレクション
make                # Makeビルドツール
autoconf            # 自動設定生成
automake            # Makefile生成
libtool             # ライブラリサポート
cmake               # クロスプラットフォームビルドシステム
```

### システムライブラリ

```bash
openssl             # SSL/TLSライブラリ
openssl-devel       # OpenSSL開発ファイル
libffi              # 外部関数インターフェース
libffi-devel        # libffi開発ファイル
zlib                # 圧縮ライブラリ
zlib-devel          # zlib開発ファイル
bzip2               # 圧縮ユーティリティ
bzip2-devel         # bzip2開発ファイル
readline-devel      # コマンドライン編集ライブラリ
sqlite              # SQLiteデータベース
sqlite-devel        # SQLite開発ファイル
```

### バージョン管理

```bash
git                 # Gitバージョン管理
```

### Java

```bash
java-11-amazon-corretto  # Java 11 JDK
```

### その他のツール

```bash
tar                 # アーカイブユーティリティ
gzip                # 圧縮ユーティリティ
unzip               # 解凍ユーティリティ
curl                # URLデータ転送
wget                # ネットワークダウンローダー
```

## 追加パッケージのインストール

ビルド時に追加のパッケージをインストールできます。

### 利用可能なパッケージのリスト

```bash
dnf list
```

### パッケージの検索

```bash
dnf search [package-name]
```

例：

```bash
dnf search postgresql
```

### パッケージのインストール

ビルドスクリプト内でパッケージをインストール：

```bash
dnf install -y [package-name]
```

### 実装例

**package.json:**

```json
{
  "scripts": {
    "install-deps": "dnf install -y imagemagick",
    "build": "npm run install-deps && npm run build-app",
    "build-app": "next build"
  }
}
```

**vercel.json:**

```json
{
  "buildCommand": "npm run build"
}
```

### よく使われる追加パッケージ

```bash
# 画像処理
dnf install -y imagemagick imagemagick-devel

# PostgreSQLクライアント
dnf install -y postgresql postgresql-devel

# Redis
dnf install -y redis

# FFmpeg（ビデオ処理）
dnf install -y ffmpeg

# Graphicsライブラリ
dnf install -y cairo cairo-devel
```

## ローカルテスト

### Dockerを使用したローカル環境

ビルドイメージと同じ環境でローカルテストを行うことができます。

```bash
docker run --rm -it amazonlinux:2023.2.20231011.0 sh
```

### イメージバージョン

**2023.2.20231011.0**は、Vercelが使用するAmazon Linux 2023の特定のバージョンです。

### ローカルテストの手順

1. **Dockerコンテナの起動**

```bash
docker run --rm -it amazonlinux:2023.2.20231011.0 sh
```

2. **Node.jsのインストール**

```bash
dnf install -y nodejs
node --version
```

3. **プロジェクトのクローン**

```bash
dnf install -y git
git clone https://github.com/your-org/your-repo.git
cd your-repo
```

4. **依存関係のインストール**

```bash
npm install
```

5. **ビルドの実行**

```bash
npm run build
```

### Dockerfileの作成

プロジェクト用のDockerfileを作成して、一貫した環境を維持：

```dockerfile
FROM amazonlinux:2023.2.20231011.0

# Node.jsのインストール
RUN dnf install -y nodejs npm git

# 作業ディレクトリの設定
WORKDIR /app

# パッケージファイルのコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# ソースコードのコピー
COPY . .

# ビルドの実行
RUN npm run build

# 実行コマンド
CMD ["npm", "start"]
```

## ビルドイメージの利点

### 1. 一貫性

すべてのビルドが同じ環境で実行されます。

### 2. 最新のツール

最新の安定版ランタイムとツールがプリインストールされています。

### 3. セキュリティ

定期的に更新され、セキュリティパッチが適用されます。

### 4. パフォーマンス

最適化されたビルド環境で高速なビルドが可能です。

## ランタイムバージョンの指定

### Node.js

**package.json:**

```json
{
  "engines": {
    "node": "20.x"
  }
}
```

または環境変数で指定：

```
NODE_VERSION=20
```

### Python

**runtime.txt:**

```
python-3.12
```

または環境変数で指定：

```
PYTHON_VERSION=3.12
```

### Ruby

**Gemfile:**

```ruby
ruby '3.3.0'
```

## ベストプラクティス

### 1. 明示的なバージョン指定

```json
{
  "engines": {
    "node": "20.11.0"
  }
}
```

特定のバージョンを指定して、一貫したビルドを確保します。

### 2. ローカル環境の一致

開発環境をビルドイメージに可能な限り一致させます。

### 3. 依存関係の最小化

不要な依存関係やビルドツールを削減します。

### 4. キャッシュの活用

```json
{
  "cacheDirectories": [
    "node_modules",
    ".next/cache"
  ]
}
```

### 5. ビルドログの確認

ビルドログで使用されているランタイムバージョンを確認します。

## トラブルシューティング

### ネイティブモジュールのビルドエラー

**問題:**
```
gyp ERR! build error
```

**解決策:**

```bash
# 必要な開発ツールをインストール
dnf install -y gcc make python3
```

### パッケージが見つからない

**問題:**
```
Package 'xyz' not found
```

**解決策:**

1. パッケージ名を検索：
```bash
dnf search xyz
```

2. 正しいパッケージ名でインストール：
```bash
dnf install -y correct-package-name
```

### ランタイムバージョンの不一致

**問題:**
ローカルとVercelでビルド結果が異なる。

**解決策:**

1. `engines`フィールドで明示的にバージョンを指定
2. ローカルでも同じバージョンを使用
3. Dockerでローカルテストを実行

## 関連リンク

- [ビルド概要](/docs/builds)
- [ビルドの設定](/docs/builds/configure-a-build)
- [Vercel Functions ランタイム](/docs/functions/runtimes)
- [Amazon Linux 2023](https://aws.amazon.com/linux/amazon-linux-2023/)
