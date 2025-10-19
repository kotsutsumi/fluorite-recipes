# Vercel FunctionsでのPythonランタイムの使用

## 概要

PythonランタイムはすべてのVercelプランでベータ版として利用可能です。FastAPI、Django、Flaskなどのフレームワークを使用してPythonコードを記述し、Vercel Functionsで実行できます。

## 基本的な関数の作成

シンプルなhello world Python API関数の例:

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

## Pythonバージョン

- デフォルト: 最新のPythonバージョン(現在Python 3.12)
- `pyproject.toml`を使用してバージョンを指定:

```toml
[project]
requires-python = ">=3.11"
```

または`Pipfile`を使用:

```toml
[requires]
python_version = "3.12"
```

## ストリーミング関数

Vercel FunctionsはPythonでのストリーミングレスポンスをサポートし、部分的なUIレンダリングを可能にします。

## Pythonの依存関係

以下を介して依存関係をインストール:

- `pyproject.toml`
- `requirements.txt`
- `Pipfile`

`requirements.txt`の例:

```
fastapi==0.117.1
```

## バンドルサイズの制御

- 最大非圧縮バンドルサイズ: 250 MB
- `vercel.json`を使用して不要なファイルを除外:

```json
{
  "functions": {
    "api/**/*.py": {
      "excludeFiles": "{tests/**,__tests__/**,**/*.test.py}"
    }
  }
}
```

## サポートされているフレームワーク

- FastAPI
- Flask
- Django(設定あり)

## ファイルの読み取り

現在の作業ディレクトリは、`api/`ディレクトリではなく、プロジェクトのベースディレクトリです。

## サポートされているインターフェース

- Web Server Gateway Interface(WSGI)
- Asynchronous Server Gateway Interface(ASGI)

## ASGIアプリケーションの例

```python
from sanic import Sanic
from sanic.response import json
app = Sanic()

# アプリケーションの実装
```
