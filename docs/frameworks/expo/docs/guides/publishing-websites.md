# ExpoでWebサイトを公開

ExpoはWebサイトを公開するための複数の方法をサポートしています。

## 出力ターゲット

Expo Routerは、Webアプリ用に3つの出力ターゲットを提供します：

### 1. `single`（デフォルト）

シングルページアプリケーション（SPA）として出力します。

```json
{
  "expo": {
    "web": {
      "output": "single"
    }
  }
}
```

### 2. `server`

クライアントとサーバーディレクトリを作成します。

```json
{
  "expo": {
    "web": {
      "output": "server"
    }
  }
}
```

### 3. `static`

各ルートに対して個別のHTMLファイルを出力します。

```json
{
  "expo": {
    "web": {
      "output": "static"
    }
  }
}
```

## ビルドプロセス

### Webビルドの作成

```bash
npx expo export -p web
```

このコマンドは、`dist`ディレクトリにWebビルドを生成します。

### ローカルテスト

Webサイトをローカルで提供してテストします：

```bash
npx expo serve
```

## ホスティングオプション

### 推奨: EAS Hosting

Expo Application Services（EAS）Hostingは、最高のエクスペリエンスを提供します。

```bash
# EAS CLIのインストール
npm install -g eas-cli

# EASプロジェクトの設定
eas init

# Webサイトのデプロイ
eas deploy
```

#### EAS Hostingの利点

- カスタムドメイン
- SSL証明書の自動管理
- Expoの機能との最高の互換性
- 簡単な設定とデプロイ

### サードパーティサービス

#### 1. Netlify

ほぼ意見のないプラットフォームで柔軟な設定が可能です。

##### _redirectsファイルの作成

SPAルーティングのために`public/_redirects`を作成します：

```
/* /index.html 200
```

##### デプロイ

```bash
# Netlify CLIのインストール
npm install -g netlify-cli

# デプロイ
netlify deploy --prod --dir dist
```

#### 2. Vercel

シングルコマンドでデプロイできます。

##### vercel.jsonの作成

```json
{
  "buildCommand": "expo export -p web",
  "outputDirectory": "dist",
  "devCommand": "expo",
  "cleanUrls": true,
  "framework": null,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

##### デプロイ

```bash
# Vercel CLIのインストール
npm install -g vercel

# デプロイ
vercel
```

#### 3. AWS Amplify Console

Git駆動の継続的デプロイを提供します。

##### amplify-explicit.ymlの作成

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npx expo export -p web
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

##### AWS Amplifyでの設定

1. AWS Amplify Consoleを開く
2. 新しいアプリを作成
3. GitリポジトリをConnectする
4. ビルド設定を指定
5. デプロイ

#### 4. Firebase Hosting

Firebase CLIを使用したセットアップが必要です。

##### Firebase CLIのインストール

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

##### package.jsonの更新

デプロイスクリプトを追加します：

```json
{
  "scripts": {
    "deploy": "expo export -p web && firebase deploy --only hosting"
  }
}
```

##### デプロイ

```bash
npm run deploy
```

#### 5. GitHub Pages

実験的なサポートで、設定が必要です。

##### baseUrlの設定

```json
{
  "expo": {
    "experiments": {
      "baseUrl": "/your-repo-name"
    }
  }
}
```

##### gh-pagesパッケージのインストール

```bash
npm install --save-dev gh-pages
```

##### package.jsonの更新

```json
{
  "scripts": {
    "predeploy": "expo export -p web",
    "deploy": "gh-pages -d dist"
  }
}
```

##### デプロイ

```bash
npm run deploy
```

## カスタムドメイン

### Netlify

1. Netlifyダッシュボードを開く
2. Domain Settings
3. Add custom domain

### Vercel

```bash
vercel domains add yourdomain.com
```

### Firebase Hosting

```bash
firebase hosting:channel:deploy live --domain yourdomain.com
```

## 主な推奨事項

### 1. EAS Hostingを使用

最高のエクスペリエンスのために、EAS Hostingを使用してください。

### 2. 適切な出力ターゲットを設定

アプリの要件に応じて、適切な出力ターゲットを選択してください。

### 3. プラットフォーム固有のデプロイ手順に従う

各ホスティングプラットフォームの詳細なデプロイ手順に従ってください。

### 4. カスタムドメインとSSLを設定

本番環境では、カスタムドメインとSSLを設定してください。

## まとめ

ExpoはWebサイトを公開するための柔軟なオプションを提供します。EAS Hostingは最も統合された体験を提供しますが、Netlify、Vercel、AWS Amplify、Firebase Hosting、GitHub Pagesなど、さまざまなサードパーティサービスもサポートしています。
