# Next.js CLI (Command Line Interface) API Reference

このドキュメントは、Next.js のコマンドラインインターフェース（CLI）の包括的なリファレンスです。LLMが解析・参照しやすいよう、各CLIコマンドの要約とリンクを含めています。

## 目次

- [プロジェクト作成](#プロジェクト作成)
  - [create-next-app](#create-next-app)
- [Next.js CLI](#nextjs-cli)
  - [開発・ビルドコマンド](#開発ビルドコマンド)
  - [ユーティリティコマンド](#ユーティリティコマンド)
- [CLI使用パターン](#cli使用パターン)
- [環境変数とオプション](#環境変数とオプション)

---

## プロジェクト作成

### [`create-next-app`](./01-create-next-app.md) 🚀

新しいNext.jsアプリケーションを作成するための公式CLIツール。最も簡単で推奨される方法です。

#### 🔑 **主要な特徴**

- **公式メンテナンス**: Next.jsクリエーターによる公式サポート
- **ゼロ依存関係**: プロジェクト初期化が1秒で完了
- **オフラインサポート**: ローカルパッケージキャッシュを使用
- **テスト済み**: Next.jsモノレポと同じ統合テストスイート

#### 📋 **基本的な使用方法**

**インタラクティブモード**:

```bash
npx create-next-app@latest
yarn create next-app
pnpm create next-app
bun create next-app
```

**非インタラクティブモード**:

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir --turbopack --import-alias=\"@/*\"
```

#### ⚙️ **設定オプション**

| オプション       | 短縮形 | 説明                               | デフォルト |
| ---------------- | ------ | ---------------------------------- | ---------- |
| `--typescript`   | `--ts` | TypeScriptプロジェクトとして初期化 | ✅         |
| `--javascript`   | `--js` | JavaScriptプロジェクトとして初期化 | ❌         |
| `--tailwind`     | -      | Tailwind CSS設定で初期化           | ✅         |
| `--eslint`       | -      | ESLint設定で初期化                 | ✅         |
| `--app`          | -      | App Routerプロジェクトとして初期化 | 推奨       |
| `--src-dir`      | -      | `src/`ディレクトリ内で初期化       | ❌         |
| `--turbopack`    | -      | `next dev`でTurbopackを有効化      | ❌         |
| `--import-alias` | -      | カスタムインポートエイリアス       | `@/*`      |
| `--empty`        | -      | 空のプロジェクトを初期化           | ❌         |

#### 📦 **パッケージマネージャー指定**

```bash
--use-npm     # npmを強制使用
--use-pnpm    # pnpmを強制使用
--use-yarn    # yarnを強制使用
--use-bun     # bunを強制使用
```

#### 🎯 **サンプル・テンプレート使用**

```bash
# 公式サンプルの使用
npx create-next-app --example api-routes
npx create-next-app --example with-tailwindcss

# GitHub URLからの使用
npx create-next-app --example https://github.com/vercel/next-learn/tree/main/dashboard/final-example

# 特殊なブランチ・パス指定
npx create-next-app --example https://github.com/user/repo/tree/bug/fix-1 --example-path foo/bar
```

#### 🛠️ **その他のオプション**

```bash
--reset-preferences  # 保存された設定をリセット
--skip-install      # 依存関係インストールをスキップ
-h, --help          # ヘルプ表示
-V, --version       # バージョン表示
```

---

## Next.js CLI

### [`Next.js CLI`](./02-next.md) ⚡

Next.jsアプリケーションの開発、ビルド、起動などを行うメインCLIツール。

#### 📋 **基本コマンド一覧**

```bash
npx next -h  # ヘルプ表示

Commands:
  build     本番ビルド用にアプリケーションをビルド
  dev       開発モードでアプリケーションを起動
  info      システムの関連情報を出力
  lint      ページとコンポーネントでESLintを実行
  start     本番モードでアプリケーションを起動
  telemetry Next.jsテレメトリデータの詳細情報
  typegen   Next.jsが生成した型を再生成
```

---

## 開発・ビルドコマンド

### 🔨 **next build** - 本番ビルド

アプリケーションの最適化された本番ビルドを作成します。

```bash
next build [directory] [options]
```

#### **主要オプション**

| オプション                  | 説明                                              |
| --------------------------- | ------------------------------------------------- |
| `--profile`                 | React本番プロファイリングを有効化（Next.js 9.5+） |
| `--debug`                   | 詳細なビルド出力を表示（Next.js 9.5.3+）          |
| `--no-lint`                 | リントを無効化                                    |
| `--no-mangling`             | マングリングを無効化                              |
| `--experimental-build-mode` | 実験的なビルドモード                              |

#### **ビルド出力の読み方**

```bash
Route (app)                    Size     First Load JS
┌ ○ /_not-found               0 B             0 kB
└ ƒ /products/[id]            0 B             0 kB

○ (Static)   ビルド時にHTMLとしてレンダリング
ƒ (Dynamic)  リクエスト時にレンダリング
```

- **Size**: クライアント側ナビゲーション時のダウンロードサイズ
- **First Load JS**: サーバーから初回アクセス時のダウンロードサイズ
- **gzip圧縮**: 両方の値ともgzip圧縮後のサイズ

### 🚀 **next dev** - 開発サーバー

ホットリロード、エラー報告などを備えた開発モードでアプリケーションを起動します。

```bash
next dev [directory] [options]
```

#### **基本的な使用方法**

```bash
# デフォルト (http://localhost:3000)
npx next dev

# ポート指定
npx next dev -p 4000
PORT=4000 npx next dev

# ホスト名指定
npx next dev -H 192.168.1.2
HOSTNAME=192.168.1.2 npx next dev
```

#### **Turbopackを使用した開発**

```bash
# Turbopack (ベータ版) でより高速な開発
next dev --turbopack
```

#### **HTTPS開発環境**

```bash
# 自己署名証明書で HTTPS 開発
next dev --experimental-https

# カスタム証明書使用
next dev --experimental-https \
  --experimental-https-key ./certificates/localhost-key.pem \
  --experimental-https-cert ./certificates/localhost.pem
```

#### **重要な注意点**

- `PORT`は`.env`では設定不可（HTTPサーバーブートストラップが初期化前のため）
- App Routerでは[Fast Refresh](/docs/architecture/fast-refresh)がデフォルト有効

### 🌐 **next start** - 本番サーバー

本番モードでアプリケーションを起動します。事前に`next build`が必要です。

```bash
next start [directory] [options]
```

#### **基本的な使用方法**

```bash
# デフォルト (http://localhost:3000)
npx next start

# ポート指定
npx next start -p 4000
PORT=4000 npx next start
```

#### **Keep Alive Timeout設定**

ロードバランサー背後でのデプロイ時に重要な設定：

```bash
# 70秒のkeep-aliveタイムアウト設定
npx next start --keepAliveTimeout 70000
```

#### **制限事項**

- `output: 'standalone'` または `output: 'export'` では使用不可
- `PORT`は`.env`では設定不可

---

## ユーティリティコマンド

### 📊 **next info** - システム情報

バグ報告に役立つシステム情報を出力します。

```bash
next info [--verbose]
```

#### **出力例**

```bash
Operating System:
  Platform: linux
  Arch: x64
  Version: #22-Ubuntu SMP Fri Nov 5 13:21:36 UTC 2021
Binaries:
  Node: 16.13.0
  npm: 8.1.0
  Yarn: 1.22.17
  pnpm: 6.24.2
Relevant Packages:
  next: 14.1.1-canary.61
  eslint-config-next: 14.1.1-canary.61
  react: 18.2.0
  react-dom: 18.2.0
  typescript: 5.3.3
Next.js Config:
  output: N/A
```

### 🔍 **next lint** - ESLint実行

⚠️ **Next.js 16以降で廃止予定** - 代わりにBiomeまたはESLintを直接使用

```bash
next lint [directory] [options]
```

#### **対象ディレクトリ**

デフォルト: `pages/`, `app/`, `components/`, `lib/`, `src/`

```bash
# カスタムディレクトリ指定
next lint --dir utils
```

### 📡 **next telemetry** - テレメトリ管理

Next.jsの匿名テレメトリデータに関する詳細情報と設定。

```bash
next telemetry [options]
```

- **完全に匿名**: 個人識別情報は収集されない
- **オプトアウト可能**: 参加は任意

### 🏷️ **next typegen** - 型生成

Next.jsが生成する型ファイルを再生成します。

```bash
next typegen [options]
```

**使用ケース**: 実験的な`typedRoutes`を使用した静的型付けリンクの更新

---

## CLI使用パターン

### 🔄 **典型的な開発フロー**

```bash
# 1. プロジェクト作成
npx create-next-app@latest my-app --typescript --tailwind --app

# 2. ディレクトリ移動
cd my-app

# 3. 開発サーバー起動
npm run dev

# 4. ビルド（本番準備）
npm run build

# 5. 本番サーバー起動
npm run start
```

### 🎯 **package.json スクリプト例**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "dev:turbo": "next dev --turbopack",
    "dev:https": "next dev --experimental-https",
    "build:profile": "next build --profile",
    "build:debug": "next build --debug",
    "info": "next info"
  }
}
```

### 🌍 **CI/CD パイプライン例**

```bash
# GitHub Actions / CI環境での典型的なフロー
npm ci                    # 依存関係インストール
npm run lint             # リント実行
npm run build            # 本番ビルド
npm run start &          # バックグラウンドで起動
npm run test             # テスト実行（E2Eなど）
```

---

## 環境変数とオプション

### 🔧 **Node.js引数の渡し方**

```bash
NODE_OPTIONS='--throw-deprecation' next
NODE_OPTIONS='-r esm' next
NODE_OPTIONS='--inspect' next
```

### 📦 **npx使用時の注意**

`package.json`のscriptsフィールドにないコマンドは`npx`が必要：

```bash
npx next info      # ✅ 正しい
next info          # ❌ package.jsonにスクリプトがない場合エラー
```

### 🏠 **ディレクトリ指定**

ほとんどのコマンドでプロジェクトディレクトリを指定可能：

```bash
next dev ./my-app
next build ./my-app
next start ./my-app
```

### 🆘 **ヘルプの活用**

```bash
# 全般的なヘルプ
npx next --help

# 特定コマンドのヘルプ
npx next build --help
npx next dev --help
npx next start --help
```

---

## CLI のベストプラクティス

### ✅ **推奨事項**

1. **プロジェクト作成**: 常に最新版を使用

   ```bash
   npx create-next-app@latest
   ```

2. **開発環境**: Turbopackで高速化（ベータ版）

   ```bash
   npm run dev -- --turbopack
   ```

3. **本番ビルド**: プロファイリングでパフォーマンス確認

   ```bash
   npm run build -- --profile
   ```

4. **デバッグ**: 詳細な出力で問題分析
   ```bash
   npm run build -- --debug
   ```

### ⚠️ **注意事項**

1. **ポート設定**: `.env`ではなく環境変数またはCLIオプションを使用
2. **HTTPS開発**: 開発専用機能、本番では適切な証明書を使用
3. **実験的機能**: `--experimental-*`は慎重に使用
4. **Keep Alive**: ロードバランサー使用時は適切なタイムアウト設定

### 🚨 **トラブルシューティング**

#### よくある問題と解決方法

1. **ポートが使用中**

   ```bash
   npx next dev -p 3001  # 別のポートを使用
   ```

2. **ビルドエラー**

   ```bash
   npx next build --debug  # 詳細なエラー情報
   npx next info           # システム情報確認
   ```

3. **型エラー**

   ```bash
   npx next typegen        # 型ファイル再生成
   ```

4. **キャッシュ問題**
   ```bash
   rm -rf .next            # ビルドキャッシュクリア
   npm run build           # 再ビルド
   ```

---

このドキュメントは、Next.js CLIの包括的なリファレンスです。各コマンドの詳細な使用方法やオプションについては、個別のリンク先ドキュメントまたは`--help`オプションを参照してください。CLI操作に不明な点がある場合は、まず`npx next --help`またはコマンド固有のヘルプを確認することを推奨します。
