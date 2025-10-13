# アップデートIDをEASダッシュボードにトレースする方法

## 埋め込みまたはダウンロードされたアップデートの判定

EAS Updateで作業する際、`Updates.updateId`がアップデートが埋め込まれているかダウンロードされたかに関係なくIDを返すため、`updateId`のトレースが困難になる可能性があります。

## 判定方法

`Updates.isEmbeddedLaunch`を使用：

```typescript
import * as Updates from 'expo-updates';
import { Text } from 'react-native';

export default function UpdateStatus() {
  return (
    <Text>
      {Updates.isEmbeddedLaunch
        ? '(Embedded) ❌ このアップデートはEASダッシュボードでトレースできません。'
        : '(Downloaded) ✅ このアップデートはEASダッシュボードでトレースできます。'}
    </Text>
  );
}
```

## EASダッシュボードへのナビゲーション

特定のアップデートにナビゲートするには、このURL形式を使用：

```
https://expo.dev/accounts/[accountName]/projects/[projectName]/updates/[updateId]
```

## 主なポイント

- 埋め込まれたアップデートはダッシュボードでトレースできない
- `Updates.isEmbeddedLaunch`を使用してアップデートタイプを確認
- ダッシュボードURLを使用して特定のアップデートに直接アクセス可能
