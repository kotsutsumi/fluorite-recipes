# QR Code

## 概要
QR Codeコンポーネントは、文字列データからQRコードを生成し、いくつかの主要な機能を持ちます:

### 機能
- 任意の文字列からQRコードを生成
- 前景色と背景色にshadcn/uiのCSS変数を使用
- カスタム前景色と背景色のサポート
- あらゆるサイズで鮮明に表示されるSVGとしてレンダリング
- 自動サイズ調整による完全なレスポンシブ対応

## インストール
```bash
npx kibo-ui add qr-code
```

## ロバストネスレベル
コンポーネントは異なるQRコードのロバストネスレベルをサポートします:
- L: 最低のエラー訂正
- M: 中程度のエラー訂正
- Q: より高いエラー訂正
- H: 最高のエラー訂正

## 使用例

### 基本スタイリング
```jsx
<QRCode value="https://example.com" />
```

### カスタムロバストネス
```jsx
<QRCode value="https://example.com" robustness="H" />
```

### サーバーコンポーネント
```jsx
<QRCode
  value="https://example.com"
  foreground="#000000"
  background="#FFFFFF"
/>
```

## 使用技術
- github.com/soldair/node-qrcode
- culorijs.org

## 関連コンポーネント
- Pill
- Rating
