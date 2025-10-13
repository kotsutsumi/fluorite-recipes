# 環境変数

## 主要な概念

- **環境変数**は、ソースコードの外部で設定されるキーと値のペアです
- Expo CLIは、`.env`ファイルから`EXPO_PUBLIC_`プレフィックスを持つ変数を自動的に読み込みます
- 変数を使用して、異なる環境に応じてアプリの動作を設定できます

## 環境変数の作成

プロジェクトルートに`.env`ファイルを作成します：

```
EXPO_PUBLIC_API_URL=https://staging.example.com
EXPO_PUBLIC_API_KEY=abc123
```

### ファイル命名規則

- `.env`: すべての環境で読み込まれる基本設定
- `.env.local`: ローカル開発環境専用（gitignoreに追加）
- `.env.production`: 本番環境専用
- `.env.development`: 開発環境専用

## コードでの使用

JavaScriptで変数に直接アクセスします：

```javascript
function Post() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  async function onPress() {
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: process.env.EXPO_PUBLIC_API_KEY,
      }),
    });
  }

  return <Button onPress={onPress} title="投稿" />;
}
```

### TypeScript型定義

環境変数の型を定義できます：

```typescript
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL: string;
      EXPO_PUBLIC_API_KEY: string;
    }
  }
}
```

## 重要な注意事項

### 1. 静的参照のみサポート

静的に参照される`process.env.EXPO_PUBLIC_*`変数のみがサポートされます。

```javascript
// ✅ 正しい
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// ❌ 誤り（動的アクセス）
const key = 'EXPO_PUBLIC_API_URL';
const apiUrl = process.env[key];
```

### 2. 機密情報を保存しない

これらの変数には機密情報を保存しないでください。

> **セキュリティ警告**: `EXPO_PUBLIC_`プレフィックスを持つ環境変数に機密情報を保存しないでください。

### 3. コンパイル済みアプリケーションで可視

変数はコンパイル済みアプリケーションで可視化されます。

## 環境サポート

### サポートされる環境

- Expo CLI
- EAS Build
- EAS Update

### 複数の.envファイル

プロジェクトで複数の`.env`ファイルを使用できます：

```
.env              # すべての環境
.env.local        # ローカル環境（gitignoreに追加）
.env.development  # 開発環境
.env.production   # 本番環境
```

### 優先順位

環境変数の読み込み優先順位：

1. `.env.local`（最高優先度）
2. `.env.development`または`.env.production`（環境に応じて）
3. `.env`（最低優先度）

## 無効化

環境変数の自動読み込みを無効にするには：

```bash
# .envファイルの読み込みを無効化
EXPO_NO_DOTENV=1 npx expo start

# クライアント環境変数を無効化
EXPO_NO_CLIENT_ENV_VARS=1 npx expo start
```

## マイグレーションパス

以下からのマイグレーションをサポート：

### react-native-config

```javascript
// 以前
import Config from 'react-native-config';
const apiUrl = Config.API_URL;

// Expo環境変数
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

### babel-plugin-transform-inline-environment-variables

Expo環境変数システムに移行してください。

### direnv

`.envrc`ファイルから`.env`ファイルへの移行が可能です。

## ベストプラクティス

### 1. .gitignoreに機密ファイルを追加

```gitignore
.env.local
.env*.local
```

### 2. .env.exampleを提供

チームメンバーのために`.env.example`を提供します：

```
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_API_KEY=your_api_key_here
```

### 3. 環境ごとに異なる設定を使用

```javascript
module.exports = function(api) {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    name: isProduction ? 'MyApp' : 'MyApp (Dev)',
    // その他の設定...
  };
};
```

### 4. CIに環境変数を設定

EAS Buildを使用する場合、`eas.json`で環境変数を設定できます：

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.production.com"
      }
    },
    "development": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.staging.com"
      }
    }
  }
}
```

## まとめ

Expoの環境変数システムは、異なる環境でアプリの動作を簡単に設定できる強力な機能です。`EXPO_PUBLIC_`プレフィックスを使用し、機密情報を保存しないように注意してください。
