# Build Output API

Vercelデプロイメントを作成するためのファイルシステムベースの仕様。

## 概要

Build Output APIは、Vercelデプロイメントを作成するためのディレクトリ構造を定義するファイルシステムベースの仕様です。

## 目的

Build Output APIを使用することで：

- **フレームワーク作成者**がVercelプラットフォーム機能を活用できる
- **標準化された方法**でデプロイメントインフラストラクチャを定義できる
- **プラットフォーム機能**（Vercel Functions、ルーティング、キャッシング）を活用できる

## 対象ユーザー

- Webフレームワーク作成者
- カスタムデプロイメントを作成したい開発者

## ディレクトリ構造

Build Output APIは特定のディレクトリ構造を定義します：

```
.vercel/
  output/
    config.json      # 設定ファイル
    static/          # 静的ファイル
    functions/       # サーバーレス関数・エッジ関数
```

## 主要機能

### 1. フレームワーク定義のインフラストラクチャ

フレームワークがデプロイメント構造を完全に制御できます。

### 2. プラットフォーム機能のサポート

- **Vercel Functions**: サーバーレスおよびエッジ関数
- **ルーティング**: 高度なルーティング設定
- **キャッシング**: インテリジェントなキャッシュ戦略

### 3. 柔軟な設定

`config.json`を通じて詳細な設定が可能です。

## 既知の制限事項

### ネイティブ依存関係

- ネイティブ依存関係はアーキテクチャの互換性問題がある可能性があります
- **推奨**: Vercel Build Imageに一致するLinux x64 CPUアーキテクチャでビルド

## リソース

### ドキュメント

- [設定ドキュメント](/docs/build-output-api/configuration)
- [Vercel Primitives](/docs/build-output-api/primitives)
- [機能詳細](/docs/build-output-api/features)

### サンプルとガイド

- [完全な例](https://github.com/vercel/examples/tree/main/build-output-api) - vercel/examplesリポジトリ
- [独自のWebフレームワークを構築する](/blog/build-your-own-web-framework) - ブログ記事

## 使用方法

### 基本的なワークフロー

1. **ディレクトリ構造の作成**
   ```
   .vercel/output/
   ```

2. **設定ファイルの作成**
   ```json
   {
     "version": 3
   }
   ```

3. **コンテンツの追加**
   - 静的ファイルを`static/`に配置
   - 関数を`functions/`に配置

4. **デプロイ**
   - Vercelが`.vercel/output`ディレクトリを認識し、デプロイメントを作成

## ベストプラクティス

1. **アーキテクチャの一致**
   - Linux x64環境でビルド
   - Vercel Build Imageとの互換性を確保

2. **構造化された設定**
   - `config.json`で明確な設定を定義
   - ルーティングとキャッシングルールを適切に設定

3. **プリミティブの活用**
   - 静的ファイル、サーバーレス関数、エッジ関数を適切に使い分ける

## フレームワーク統合

Build Output APIを実装することで、フレームワークはVercelプラットフォームの機能をフルに活用できます：

- 自動スケーリング
- エッジネットワーク配信
- インクリメンタル静的再生成（ISR）
- サーバーレスファンクション
- エッジミドルウェア

## 関連リンク

- [Build Output API 設定](/docs/build-output-api/configuration)
- [Build Output API 機能](/docs/build-output-api/features)
- [Build Output API プリミティブ](/docs/build-output-api/primitives)
- [サンプルコード](https://github.com/vercel/examples/tree/main/build-output-api)
