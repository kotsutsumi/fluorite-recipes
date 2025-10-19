# Flask on Vercel

## 概要

Flaskは、Pythonの軽量なWSGIウェブアプリケーションフレームワークで、Vercelに追加設定なしでデプロイできます。

## 始め方

### Vercel CLIでプロジェクトを初期化

```bash
vc init flask
```

このコマンドは、Flaskアプリケーションの基本的なテンプレートを作成します。

## アプリケーションのエクスポート

以下のいずれかのファイルにFlaskアプリケーションを定義できます：

- `app.py`
- `index.py`
- `server.py`
- `src/app.py`
- `app/app.py`

### サンプルコード

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return {"message": "Hello, World!"}

@app.route("/api/users")
def get_users():
    return {
        "users": [
            {"id": 1, "name": "Alice"},
            {"id": 2, "name": "Bob"}
        ]
    }
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

## 静的アセットの提供

### 静的ファイルの配置

- `public/**`ディレクトリに配置
- VercelのCDNで自動的に提供されます
- デフォルトのヘッダーが適用されます

**注意**: Flaskの`static`フォルダ機能は使用されません。すべての静的ファイルは`public`ディレクトリに配置してください。

## Vercelファンクション

- Flaskアプリケーション全体が単一のVercelファンクションになります
- トラフィックに応じて自動スケーリング
- デフォルトでFluid Computeを使用

## 制限事項

### アプリケーションサイズ

- アプリケーションサイズは250MB以内である必要があります

### キャッシュファイルの処理

- `__pycache__`と`.pyc`ファイルは自動的に削除されます
- これにより、デプロイメントサイズが最適化されます

## ベストプラクティス

### 依存関係の管理

`requirements.txt`ファイルに必要な依存関係を記載：

```txt
Flask==3.0.0
```

### 環境変数の使用

環境変数は、Vercelのダッシュボードまたは`.env.local`ファイルで設定できます：

```python
import os

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['DATABASE_URL'] = os.getenv('DATABASE_URL')
```

## 追加リソース

- [Flask公式ドキュメント](https://flask.palletsprojects.com/)
- [Vercel Functionsドキュメント](/docs/functions)
- [バックエンドテンプレート](https://vercel.com/templates?type=backend)
- [Python on Vercel](/docs/functions/runtimes/python)
