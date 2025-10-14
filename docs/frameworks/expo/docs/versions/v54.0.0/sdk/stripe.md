# @stripe/stripe-react-native

`@stripe/stripe-react-native` は、React NativeとExpoを使用してネイティブのAndroidおよびiOSアプリでStripe決済を統合するためのライブラリです。

## 主な機能

- Stripe決済用のネイティブAPIを提供
- カスタマイズ可能なUI画面と決済要素を提供
- AndroidおよびiOSプラットフォームの両方をサポート

## インストール

```bash
npx expo install @stripe/stripe-react-native
```

## Config Pluginの設定（オプション）

`app.json` でConfig Pluginを設定することができます:

```json
{
  "expo": {
    "plugins": [
      [
        "@stripe/stripe-react-native",
        {
          "merchantIdentifier": "your-merchant-id",
          "enableGooglePay": true
        }
      ]
    ]
  }
}
```

## 制限事項

- **Google PayとApple PayはExpo Goでサポートされていません**
- 完全な決済機能を利用するには開発ビルドが必要です

## よくある問題

### ブラウザリダイレクトの処理

ブラウザリダイレクトを処理するには、特定のURLスキーム設定が必要です。

### iOSのPaymentSheetローカライゼーション

iOSでPaymentSheetのローカライゼーションを行うには、手動での設定が必要です。

## リソース

- [Stripe React Native SDK Reference](https://stripe.dev/stripe-react-native/api-reference/index.html) - 公式APIリファレンス
- [Stripe React Native GitHub Repository](https://github.com/stripe/stripe-react-native) - GitHubリポジトリ
- [Example React Native App](https://github.com/stripe/stripe-react-native/tree/master/example) - サンプルアプリ

## 関連情報

このドキュメントは、ExpoおよびReact NativeアプリケーションでStripe決済を統合したい開発者向けの包括的なガイドを提供しています。
