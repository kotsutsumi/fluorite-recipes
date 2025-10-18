# Pill

## 概要
Kibo UIでのさまざまなユースケース向けに設計された柔軟なバッジコンポーネントです。

## インストール
```bash
npx kibo-ui add pill
```

## 機能
- 角が丸いカスタマイズ可能なバッジのようなコンポーネント
- フォールバックオプション付きのアバターサポート
- バリアント付きの組み込みステータスインジケーター
- 変化を示すためのデルタインジケーター
- アイコンサポート
- オーバーラップ効果のあるアバターグループ
- ゴーストボタン統合
- テーマ可能なバリアント

## 使用例

### アバターPill
アバターとテキストを含むシンプルなpill:
```jsx
HB@haydenbleasel
```

### ステータスPill
ステータスインジケーター付きのpill:
```jsx
Passed
Approval Status
```

### ボタンPill
削除ボタン付きのpill:
```jsx
#kibo-ui
```

### インジケーターPill
異なるインジケーター状態を持つpill:
```jsx
ActiveError
```

### デルタPill
変化状態を示すpill:
```jsx
Up 10%
Down 5%
No change
```

### アイコンPill
アイコンとテキストを含むpill:
```jsx
17 users
```

### アバターグループPill
複数のアバターを持つpill:
```jsx
HBSCLR
Loved by millions
```

## 関連コンポーネント
- [Marquee](/components/marquee)
- [QR Code](/components/qr-code)

## 使用技術
[![Lucide](lucide.dev logo)]
