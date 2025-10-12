# htmlLimitedBots

`htmlLimitedBots` 設定を使用すると、ストリーミングメタデータではなくブロッキングメタデータを受け取るべきユーザーエージェントを指定できます。

## 概要

- **バージョン**: Next.js 15.2.0 で導入
- **設定ファイル**: `next.config.js`
- **用途**: Next.js のデフォルトの HTML 制限ボットリストを上書き

## 設定例

```typescript
import type { NextConfig } from 'next'

const config: NextConfig = {
  htmlLimitedBots: /MySpecialBot|MyAnotherSpecialBot|SimpleCrawler/,
}

export default config
```

## 重要な注意事項

- カスタムの `htmlLimitedBots` 設定を指定すると、デフォルトのリストが完全に置き換えられます
- これは高度な設定オプションと見なされます
- ほとんどのユースケースでは、デフォルト設定で十分です

## 動作

この設定は、特定のボットユーザーエージェントにメタデータを提供する方法を制御し、特定のウェブクローラーのパフォーマンスや処理を改善するのに役立ちます。
