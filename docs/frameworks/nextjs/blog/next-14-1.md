# Next.js 14.1

**公開日**: 2024年1月18日(木曜日)

**著者**:
- Jiachi Liu (@huozhi)
- Jimmy Lai (@feedthejim)

## 主な改善点

### セルフホスティングの改善

- ランタイム環境変数に関する新しいドキュメント
- Incremental Static Regeneration(ISR)のカスタムキャッシュ設定
- カスタム画像最適化
- Middlewareのサポート

### Turbopackの改善

- 開発テストの5,600件(94%)に合格
- ローカル開発のパフォーマンス向上
- vercel.comやv0.appなどのVercelアプリケーションで継続的なテスト

### 開発者体験の向上

- エラーメッセージの改善
- `window.history.pushState`および`replaceState`のサポート
- データキャッシュのログ記録

### `next/image`の改善

- `<picture>`要素のサポート
- アートディレクション機能
- ダークモードでの画像サポート

### パラレルおよびインターセプトルート

- コミュニティのフィードバックに基づく20のバグ修正

## インストール方法

```bash
npx create-next-app@latest
```

このブログ記事は、Webアプリケーション開発のさまざまな側面における開発者体験、パフォーマンス、柔軟性の向上へのNext.jsのコミットメントを強調しています。
