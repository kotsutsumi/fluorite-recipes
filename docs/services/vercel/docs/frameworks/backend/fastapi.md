# FastAPI on Vercel

## 概要

FastAPIは、Pythonの型ヒントに基づいた高性能なウェブAPIフレームワークで、Vercelに簡単にデプロイできます。

## 始め方

### Vercel CLIを使用したセットアップ

```bash
vc init fastapi
```

このコマンドは、FastAPIアプリケーションの基本的なテンプレートを作成します。

## アプリケーションのエクスポート

以下のいずれかのエントリーポイントでFastAPIアプリケーションを定義します：

- `app.py`
- `index.py`
- `server.py`
- `src/`または`app/`ディレクトリ内の同様のファイル

### サンプルコード

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Python": "on Vercel"}

@app.get("/api/hello")
def hello():
    return {"message": "Hello from FastAPI on Vercel!"}
```

## ローカル開発

### 仮想環境のセットアップ

```bash
python -m venv .venv
source .venv/bin/activate  # Windowsの場合: .venv\Scripts\activate
pip install -r requirements.txt
```

### ローカルサーバーの起動

```bash
vercel dev
```

このコマンドで、Vercel環境をローカルで再現し、開発中にアプリケーションをテストできます。

## デプロイ

```bash
vc deploy
```

## 主な特徴

### 静的アセットの提供

- `public/**`ディレクトリ内のファイルをCDNで自動提供
- `app.mount("/public", ...)`は不要です

静的ファイルは、Vercelによって自動的に最適化され、グローバルCDNで配信されます。

### Vercelファンクション

- FastAPIアプリケーション全体が単一のVercelファンクションになります
- トラフィックに応じて自動スケーリング
- デフォルトでFluid Computeを使用

## 制限事項

### アプリケーションサイズ

- アプリケーションサイズは250MB以内である必要があります

### キャッシュファイルの処理

- キャッシュされていないファイル（`__pycache__`、`.pyc`）は削除されます
- これにより、デプロイメントサイズが最適化されます

## ベストプラクティス

### 依存関係の管理

`requirements.txt`ファイルに必要な依存関係を記載：

```txt
fastapi
uvicorn[standard]
```

### 環境変数の使用

環境変数は、Vercelのダッシュボードまたは`.env.local`ファイルで設定できます：

```python
import os

DATABASE_URL = os.getenv("DATABASE_URL")
```

## 追加リソース

- [FastAPI公式ドキュメント](https://fastapi.tiangolo.com/)
- [Vercel Functionsドキュメント](/docs/functions)
- [バックエンドテンプレート](https://vercel.com/templates?type=backend)
- [Python on Vercel](/docs/functions/runtimes/python)
