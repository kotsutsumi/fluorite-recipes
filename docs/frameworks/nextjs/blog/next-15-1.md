# Next.js 15.1

**公開日**: 2024年12月10日(火曜日)

**著者**:
- Janka Uryga (@lubieowoce)
- Jiachi Liu (@huozhi)
- Sebastian Silbermann (@sebsilbermann)

## 主な更新内容

### React 19安定版サポート

- Pages RouterとApp Routerで完全サポート
- 「sibling pre-warming」機能を含む
- App Router向けCanaryリリースを継続提供

### エラーデバッグの改善

- ソースマップ処理の強化
- デフォルトでスタックフレームを折りたたむ
- アプリケーション固有のエラーの視認性向上
- プロファイリングとEdgeランタイムエラー表示の改善

### 新しい`after()` API(安定版)

レスポンスストリーミング後にコードを実行します:

- ログ記録、分析、システム同期をサポート
- プラットフォーム互換性の向上

### 実験的な認証API

- 新しい`forbidden()`および`unauthorized()`メソッド
- カスタマイズ可能なエラーページ
- きめ細かい認証エラー処理

## アップグレード方法

```bash
# 自動アップグレード
npx @next/codemod@canary upgrade latest

# 手動アップグレード
npm install next@latest react@latest react-dom@latest

# 新しいプロジェクト
npx create-next-app@latest
```

このブログ記事は、このリリースにおける開発者体験とフレームワーク機能の改善を強調しています。
