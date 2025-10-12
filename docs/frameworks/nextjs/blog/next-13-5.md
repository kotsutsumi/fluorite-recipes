# Next.js 13.5

**公開日**: 2023年9月19日(火曜日)

**著者**:
- Jimmy Lai (@feedthejim)
- Tim Neutkens (@timneutkens)
- Tobias Koppers (@wSokra)

## 主なハイライト

### パフォーマンスの向上

- ローカルサーバーの起動が22%高速化
- ホットモジュール置換(HMR)が29%高速化
- メモリ使用量が40%削減
- App Routerの採用が月間80%増加

### 最適化されたパッケージインポート

新しい`optimizePackageImports`機能を導入しました。これにより、以下のようなライブラリのインポートが自動的に最適化されます:

- `@mui/icons-material`
- `lodash`
- `react-bootstrap`

使用されるモジュールのみをロードすることで、バンドルサイズを削減します。

### `next/image`の改善

新しい実験的な`unstable_getImgProps()`関数を追加しました。以下のような高度なユースケースをサポートします:

- 背景画像
- Canvasでの画像処理
- `<picture>`要素のサポート
- アートディレクションとダークモードでの画像バリエーション

### その他の機能

- 438以上のバグを修正
- Turbopackのサポートを改善
- 開発および本番環境でのパフォーマンスを向上

## アップグレード方法

```bash
npm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

このリリースは、パフォーマンス、開発者体験、継続的な改善へのNext.jsのコミットメントを強調しています。
