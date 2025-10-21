# Vercel Functionsの最大継続時間の設定

## 最大継続時間を変更した場合の影響

関数の継続時間に基づいて課金されます。継続時間とは、呼び出し全体の間に経過した実際の時間を指します。Vercelは、暴走関数がリソースを無期限に消費するのを防ぐために、デフォルトの最大継続時間を設定しています。

継続時間を設定する際は、以下を考慮してください:

1. 関数の操作に十分な時間を許可する
2. 異常に長い実行を防ぐために、合理的な制限を設定する

## 異なるランタイムの最大継続時間

### Node.js、Next.js(>= 13.5)、SvelteKit、Astro、Nuxt、Remix

関数内で直接最大継続時間を設定:

```typescript
export const maxDuration = 5; // この関数は最大5秒間実行可能

export function GET(request: Request) {
  return new Response('Vercel', {
    status: 200,
  });
}
```

### その他のフレームワークおよび古いランタイム

`vercel.json`で設定:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "functions": {
    "api/test.js": {
      "maxDuration": 30 // この関数は最大30秒間実行可能
    },
    "api/*.js": {
      "maxDuration": 15 // この関数は最大15秒間実行可能
    }
  }
}
```

## デフォルトの最大継続時間の設定

### ダッシュボードメソッド

1. プロジェクトを選択してSettingsタブに移動
2. Functionsタブを選択
3. Default Max Durationフィールドを更新
4. Saveを選択

### vercel.jsonメソッド

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "functions": {
    "app/api/**/*": {
      "maxDuration": 5
    }
  }
}
```

## 継続時間の制限

### Fluid Computeあり(デフォルト)

| プラン       | デフォルト | 最大 |
|------------|---------|---------|
| Hobby      | 300秒    | 300秒    |
| Pro        | 300秒    | 800秒    |
| Enterprise | カスタム | カスタム |
