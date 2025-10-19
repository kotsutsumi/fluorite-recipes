# Vercel Flags Explorerリファレンス

## 概要

Flags ExplorerはすべてのVercelプランで利用可能で、5つの主要な概念があります：

1. APIエンドポイント
2. FLAGS_SECRET環境変数
3. オーバーライドCookie
4. フラグ定義
5. フラグ値

## 定義

フラグ定義は、フィーチャーフラグのメタデータで、以下を伝達します：

- 名前
- 管理URL
- 説明
- 可能な値とオプションのラベル

### 定義の提供

フィーチャーフラグ定義を提供する2つの方法：

1. Flags APIエンドポイントを通じて定義を返す（推奨）
2. スクリプトタグを通じて定義を埋め込む

## 値

フラグ値は2つの方法で提供可能：

1. Reactコンポーネントを使用して値を発行
2. スクリプトタグを通じて値を埋め込む

### フラグ定義の例

```json
{
  "bannerFlag": {
    "origin": "https://example.com/flag/bannerFlag",
    "description": "Determines whether the banner is shown",
    "options": [
      { "value": true, "label": "on" },
      { "value": false, "label": "off" }
    ]
  }
}
```

## FLAGS_SECRET環境変数

- Flags APIエンドポイントへのアクセスをゲート
- フィーチャーフラグオーバーライドの署名と暗号化を可能にする
- base64でエンコードされた32ランダムバイトである必要がある

## APIエンドポイント

- フィーチャーフラグ設定をリクエスト
- `verifyAccess`を使用してアクセスを検証する必要がある
- 定義、ヒント、オーバーライド暗号化モードを含むJSONを返す

## オーバーライドCookie

- `vercel-flag-overrides`という名前
- プレーンテキストまたは暗号化モードが可能
- アプリケーションで読み取りと復号化が可能

## 主な考慮事項

- フィーチャーフラグ値を保護するために暗号化を使用
- APIエンドポイントへのリクエストを検証
- 明確な定義と値を提供
