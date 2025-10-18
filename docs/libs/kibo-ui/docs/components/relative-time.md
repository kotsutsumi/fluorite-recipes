# Relative Time

## 概要
柔軟なフォーマットオプションを備えた複数のタイムゾーンで時間を表示するKibo UIコンポーネントです。

## インストール
```bash
npx kibo-ui add relative-time
```

## 機能
- 複数のタイムゾーンを同時に表示
- 制御および非制御の時間状態をサポート
- 時間が提供されていない場合、毎秒自動更新
- カスタマイズ可能な日付と時刻のフォーマットオプション
- タイムゾーンラベル付きのクリーンでミニマルなUI
- レスポンシブレイアウト

## 使用例

### カスタム日付フォーマット
異なるタイムゾーンでカスタムフォーマットで日付を表示するデモンストレーション:
- EST: Thursday, October 16, 2025 03:29:46 PM
- GMT: Thursday, October 16, 2025 08:29:46 PM
- JST: Thursday, October 16, 2025 04:29:46 AM

### カスタム時刻フォーマット
変更された表示による時刻フォーマットを表示:
- EST: October 16, 2025 07:29 PM
- GMT: October 16, 2025 07:29 PM
- JST: October 17, 2025 07:29 PM

### 制御された時刻
タイムゾーン間での手動時刻指定が可能

## 関連コンポーネント
- [Rating](/components/rating)
- [Spinner](/components/spinner)
