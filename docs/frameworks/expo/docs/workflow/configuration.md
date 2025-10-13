# アプリ設定による構成

アプリ設定ファイル（`app.json`、`app.config.js`、`app.config.ts`）は以下の用途に使用されます：

- Expo Prebuildの生成
- Expo Goプロジェクトの読み込み
- OTA更新マニフェスト

## 最小限の例

```json
{
   "name": "My app",
   "slug": "my-app"
}
```

## 主要機能

### 設定プロパティ

アプリ設定では以下を構成できます：

- アプリ名
- アイコン
- スプラッシュスクリーン
- ディープリンク
- APIキー

完全なスキーマはリファレンスドキュメントで確認できます。

### 設定の読み取り

ほとんどの設定値は`Constants.expoConfig`を通じてアクセスできます。ただし、一部の機密フィールド（フックや設定の詳細など）はフィルタリングされます。

## 動的設定

JavaScriptとTypeScriptの設定ファイルをサポートし、以下が可能です：

- コメントと変数の使用
- 環境ベースの設定
- 任意の追加設定データ

### TypeScript設定の例

```typescript
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
   ...config,
   slug: 'my-app',
   name: 'My App',
});
```

### 環境ベースの設定

```javascript
module.exports = () => {
   if (process.env.MY_ENVIRONMENT === 'production') {
     return {
       /* 本番環境の設定 */
     };
   } else {
     return {
       /* 開発環境の設定 */
     };
   }
};
```

## 設定の解決ルール

1. **静的設定が最初に読み込まれます**（`app.config.json`または`app.json`）
2. **動的設定**（`app.config.ts`または`app.config.js`）は静的設定を変更できます
3. **最終的な設定はJSON形式でシリアライズ可能である必要があります**
4. **トップレベルの`expo: {}`オブジェクトが優先されます**

## まとめ

Expoの設定システムは、プロジェクトを動的かつ柔軟に構成するための包括的なガイドを提供します。環境に応じた設定の切り替えや、TypeScriptを使用した型安全な設定が可能です。
