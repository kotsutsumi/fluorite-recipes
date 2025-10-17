# Status

## 概要
Statusコンポーネントは、サービスの稼働時間または現在のステータスを表示するために使用されます。

## 機能
- サービスステータスの表示
- ステータスに基づく自動カラー設定
- カスタマイズ可能な色とラベル
- インジケーターのPingアニメーション

## インストール
```bash
npx kibo-ui add status
```

## ステータスタイプ
コンポーネントは複数のステータス状態をサポートします:
- Online
- Offline
- Maintenance
- Degraded

## 使用例
```jsx
// 基本的なステータスインジケーター
<Status />

// 完全稼働ステータス
<Status label="Fully operational" />
```

## 関連コンポーネント
- [Spinner](/components/spinner)
- [Theme Switcher](/components/theme-switcher)

## 推奨される次のステップ
- 他のKibo UIコンポーネントを探索
- 追加のドキュメントを確認

## 追加リンク
- [AI Elements](https://ai-sdk.dev/elements/components?ref=kibo)
- [React Wheel Picker](https://react-wheel-picker.chanhdai.com/?ref=kibo)
