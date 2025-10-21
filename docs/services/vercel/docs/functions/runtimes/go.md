# Vercel FunctionsでのGoランタイムの使用

## 概要

GoランタイムはすべてのVercelプランでベータ版として利用可能です。プロジェクトのルートにある`/api`ディレクトリ内の`.go`ファイルから単一のHTTPハンドラーを公開するGo Vercel関数をコンパイルできます。

## 関数の例

```go
package handler

import (
  "fmt"
  "net/http"
)

func Handler(w http.ResponseWriter, r *http.Request) {
  fmt.Fprintf(w, "<h1>Hello from Go!</h1>")
}
```

## Goバージョン

- `go.mod`ファイルを自動的に検出してGoバージョンを決定
- バージョンが指定されていない場合のデフォルトバージョンは1.20
- 初回バージョン検出時にGoバージョンをダウンロードしてキャッシュ

## Goの依存関係

- `go.mod`から依存関係を自動的に検出してインストール

## ビルド設定

`GO_BUILD_FLAGS`環境変数を使用してカスタムビルドフラグを提供できます:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "build": {
    "env": {
      "GO_BUILD_FLAGS": "-ldflags '-s -w'"
    }
  }
}
```

## Goの高度な使用方法

### プライベートパッケージ

プライベートパッケージをインストールするには:

- 環境変数`GIT_CREDENTIALS`を追加
- 値は資格情報を含むGitリポジトリのURLである必要があります
- GitHub、GitLab、Bitbucket、およびセルフホストGitサーバーをサポート
- GitHubの場合、リポジトリアクセス権を持つパーソナルトークンを作成

## 要件

- 関数は`http.HandlerFunc`シグネチャを実装する必要があります
- `.go`ファイルを`/api`ディレクトリに配置
- 追加の設定は不要
