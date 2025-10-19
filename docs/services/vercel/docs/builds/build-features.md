# ビルド機能

デプロイメントをカスタマイズするためのビルド機能。

## 概要

Vercelは、デプロイメントをカスタマイズするためのいくつかの機能を提供しています。

## 1. プライベートnpmパッケージ

### 概要

プライベートnpmモジュールをインストールするには、環境変数として`NPM_TOKEN`または`NPM_RC`を定義します。

### 設定方法

#### NPM_TOKENの使用

1. **npmトークンの作成**

```bash
npm login
npm token create
```

2. **環境変数の設定**

Vercelダッシュボードで環境変数を追加：

```
NPM_TOKEN=your-npm-token-here
```

3. **パッケージのインストール**

ビルド時に自動的にプライベートパッケージがインストールされます：

```bash
npm install @your-org/private-package
```

#### NPM_RCの使用

`.npmrc`ファイルの内容を環境変数として設定：

```
NPM_RC=//registry.npmjs.org/:_authToken=${NPM_TOKEN}
@your-org:registry=https://registry.npmjs.org/
```

### スコープ付きパッケージ

```json
{
  "dependencies": {
    "@your-org/private-package": "^1.0.0"
  }
}
```

### プライベートレジストリ

独自のnpmレジストリを使用する場合：

```
NPM_RC=registry=https://your-registry.example.com/
//your-registry.example.com/:_authToken=${NPM_TOKEN}
```

## 2. 無視されるファイルとフォルダ

### 自動的に無視されるファイル

Vercelはセキュリティとパフォーマンスのため、デプロイメント時に特定のファイル・フォルダを自動的に無視します。

### 無視されるファイル・フォルダのリスト

```
.git/
.env
.env.*
node_modules/
.next/cache/
.cache/
.DS_Store
Thumbs.db
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.vscode/
.idea/
*.swp
*.swo
*~
```

### 例外: .vercel/output

`.vercel/output`ディレクトリは、プリビルトデプロイメントを使用する場合に**無視されません**。

### カスタム無視パターン

`.vercelignore`ファイルを使用して、追加のファイルを無視できます：

```
# .vercelignore
tests/
docs/
*.test.js
coverage/
.github/
```

### 無視パターンの構文

`.gitignore`と同じ構文を使用：

```
# コメント
*.log           # すべての.logファイル
/temp/          # ルートのtempディレクトリ
**/tests/       # どの階層のtestsディレクトリも
!important.log  # important.logは無視しない
```

## 3. 特殊パス

### 概要

デプロイメント情報にアクセスするための2つの特殊パス名があります。

### /_src

デプロイされたソースコードを表示します。

```
https://your-deployment.vercel.app/_src
```

**アクセス:**
- デフォルトで保護されている
- Vercelアカウントでのログインが必要

**用途:**
- デプロイされたコードの確認
- デバッグ
- コードレビュー

### /_logs

ビルドログを表示します。

```
https://your-deployment.vercel.app/_logs
```

**アクセス:**
- デフォルトで保護されている
- Vercelアカウントでのログインが必要

**用途:**
- ビルドプロセスの確認
- エラーのデバッグ
- ビルド時間の分析

### アクセス制御の設定

プロジェクト設定でアクセス制御を変更できます：

**手順:**

1. プロジェクトダッシュボードに移動
2. **Settings** > **Security**
3. **Special Paths**セクション
4. アクセス設定を変更：
   - **Protected**（保護）: ログインが必要（デフォルト）
   - **Public**（公開）: 誰でもアクセス可能

### セキュリティ考慮事項

**保護されたアクセス:**
- Vercelにリダイレクト
- アカウント認証が必要
- 第三者はURLを操作してもアクセス不可

**公開アクセス:**
- 誰でもソースコードとログを閲覧可能
- オープンソースプロジェクトに適している
- プライベートコードには推奨されない

## 4. Gitサブモジュール

### サポートされるサブモジュール

HTTP経由で公開アクセス可能なGitサブモジュールをサポートします。

```gitmodules
[submodule "lib/shared"]
  path = lib/shared
  url = https://github.com/your-org/shared-lib.git
```

### 制限事項

**失敗するケース:**

1. **プライベートサブモジュール**
   ```gitmodules
   [submodule "lib/private"]
     path = lib/private
     url = https://github.com/your-org/private-lib.git  # プライベート
   ```

2. **SSHベースのリポジトリ**
   ```gitmodules
   [submodule "lib/ssh"]
     path = lib/ssh
     url = git@github.com:your-org/repo.git  # SSH
   ```

### 代替方法: npmパッケージとして参照

プライベートリポジトリをnpmパッケージ依存関係として参照できます：

```json
{
  "dependencies": {
    "private-lib": "github:your-org/private-lib#main"
  }
}
```

または、プライベートnpmパッケージとして公開：

```json
{
  "dependencies": {
    "@your-org/private-lib": "^1.0.0"
  }
}
```

### サブモジュールの初期化

`.gitmodules`ファイルが存在する場合、Vercelは自動的にサブモジュールを初期化します：

```bash
git submodule update --init --recursive
```

## ベストプラクティス

### プライベートパッケージ

1. **環境変数の使用**
   - トークンをコードに含めない
   - 環境変数で管理

2. **トークンのスコープ**
   - 必要最小限の権限を付与
   - 読み取り専用トークンを使用

3. **トークンのローテーション**
   - 定期的にトークンを更新

### ファイル無視

1. **セキュリティ**
   - `.env`ファイルを必ず無視
   - シークレットを含むファイルを除外

2. **パフォーマンス**
   - 大きなファイルやディレクトリを無視
   - テストファイルを除外

3. **`.vercelignore`の活用**
   - プロジェクト固有の無視パターンを定義

### 特殊パス

1. **プライベートプロジェクト**
   - 特殊パスを保護状態に保つ
   - アクセス制御を適切に設定

2. **オープンソースプロジェクト**
   - 公開設定を検討
   - ドキュメントに明記

### Gitサブモジュール

1. **公開サブモジュール**
   - HTTPSプロトコルを使用
   - 公開リポジトリのみ

2. **プライベート依存関係**
   - npmパッケージとして管理
   - `NPM_TOKEN`で認証

## トラブルシューティング

### プライベートパッケージのインストール失敗

**問題:**
```
npm ERR! 404 Not Found - GET https://registry.npmjs.org/@your-org/package
```

**解決策:**
1. `NPM_TOKEN`が正しく設定されているか確認
2. トークンに適切な権限があるか確認
3. パッケージ名が正しいか確認

### サブモジュールのクローン失敗

**問題:**
```
fatal: could not read Username for 'https://github.com'
```

**解決策:**
1. サブモジュールURLがHTTPSであることを確認
2. リポジトリが公開されているか確認
3. プライベートリポジトリの場合、npmパッケージとして参照

### 特殊パスへのアクセス拒否

**問題:**
ログインしているにもかかわらず、`/_src`または`/_logs`にアクセスできない。

**解決策:**
1. 正しいアカウントでログインしているか確認
2. プロジェクトへのアクセス権があるか確認
3. チーム設定を確認

## 関連リンク

- [ビルド概要](/docs/builds)
- [ビルドの設定](/docs/builds/configure-a-build)
- [環境変数](/docs/environment-variables)
- [.vercelignore仕様](https://vercel.com/docs/deployments/ignored-build-files)
