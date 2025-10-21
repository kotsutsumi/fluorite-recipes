# Vercel Functionsのランタイムの設定

関数のランタイムは、実行される環境を決定します。Vercelは、Node.js、Python、Ruby、Goを含む複数のランタイムをサポートしています。

## Node.js

デフォルトでは、追加の設定がない関数は、Node.jsランタイム上のVercel Functionとしてデプロイされます。

### Next.js App Routerの例

```typescript
export function GET(request: Request) {
  return new Response('Hello from Vercel!');
}
```

**注意**: フレームワークを使用しない場合、以下のいずれかを行う必要があります:

- `package.json`に`"type": "module"`を追加
- JavaScript関数のファイル拡張子を`.js`から`.mjs`に変更

## Go

`/api`ディレクトリ内の`.go`ファイルから単一のHTTPハンドラーを公開:

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

## Python

`api/index.py`に関数を作成:

```python
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type','text/plain')
        self.end_headers()
        self.wfile.write('Hello, world!'.encode('utf-8'))
        return
```

## Ruby

`/api`ディレクトリ内の`.rb`ファイルでHTTPハンドラーを定義します。以下のいずれかが必要です:

- `do |request, response|`シグネチャに一致する`Handler` proc
- `WEBrick::HTTPServlet::AbstractServlet`を継承する`Handler`クラス

```ruby
require 'cowsay'

Handler = Proc.new do |request, response|
  name = request.query['name'] || 'World'

  response.status = 200
  response['Content-Type'] = 'text/text; charset=utf-8'
  response.body = Cowsay.say("Hello #{name}", 'cow')
end
```
