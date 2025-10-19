# Handling Verified Bots

Verified Botsの処理は、botid@1.5.0以降で利用可能です。

BotIDを使用すると、[検証済みボット](/docs/bot-management#verified-bots)を通常のボットとは異なる方法で識別および処理できます。この機能により、AIアシスタントなどの信頼できるボットにアプリケーションへのアクセスを許可しながら、他のボットをブロックできます。

Vercelは、[bots.fyi](https://bots.fyi)で既知の検証済みボットのディレクトリを管理しています。

## 検証済みボットの確認

`checkBotId()`を使用する際、レスポンスには検証済みボットを識別するためのフィールドが含まれます：

```typescript
import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const botResult = await checkBotId();

  const { isBot, verifiedBotName, isVerifiedBot, verifiedBotCategory } = botResult;

  // ChatGPTオペレーターかどうかを確認
  const isOperator = isVerifiedBot && verifiedBotName === "chatgpt-operator";

  if (isBot && !isOperator) {
    return Response.json({ error: "アクセス拒否" }, { status: 403 });
  }

  // ... ハンドラーの残りの処理
  return Response.json({ success: true });
}
```

## 検証済みボットのレスポンスフィールド

```typescript
interface BotIdResult {
  isBot: boolean;                    // ボットかどうか
  isVerifiedBot: boolean;            // 検証済みボットかどうか
  verifiedBotName?: string;          // ボット名（例: "googlebot"）
  verifiedBotCategory?: string;      // カテゴリ（例: "search-engine"）
}
```

## 検証済みボットのディレクトリ

### 検索エンジン

| ボット名 | カテゴリ | 説明 |
|---------|---------|------|
| googlebot | search-engine | Googleの検索クローラー |
| bingbot | search-engine | Bingの検索クローラー |
| yandex | search-engine | Yandexの検索クローラー |
| duckduckbot | search-engine | DuckDuckGoの検索クローラー |
| baiduspider | search-engine | Baiduの検索クローラー |

### AIアシスタント

| ボット名 | カテゴリ | 説明 |
|---------|---------|------|
| chatgpt-operator | ai-assistant | OpenAI ChatGPTオペレーター |
| claude-web | ai-assistant | Anthropic Claude |
| perplexitybot | ai-assistant | Perplexity AI |

### ソーシャルメディア

| ボット名 | カテゴリ | 説明 |
|---------|---------|------|
| twitterbot | social-media | Twitterのクローラー |
| facebookbot | social-media | Facebookのクローラー |
| linkedinbot | social-media | LinkedInのクローラー |
| pinterestbot | social-media | Pinterestのクローラー |

### モニタリングとその他

| ボット名 | カテゴリ | 説明 |
|---------|---------|------|
| uptimerobot | monitoring | UptimeRobotのモニタリング |
| pingdom | monitoring | Pingdomのモニタリング |
| statuspage | monitoring | Statuspageのモニタリング |

完全なリストは[bots.fyi](https://bots.fyi)で確認できます。

## 使用例

### AIアシスタントのみを許可

```typescript
import { checkBotId } from "botid/server";

export async function GET(request: Request) {
  const verification = await checkBotId();

  // AIアシスタントのみ許可
  const isAllowedBot =
    verification.isVerifiedBot &&
    verification.verifiedBotCategory === "ai-assistant";

  if (verification.isBot && !isAllowedBot) {
    return new Response("Access denied", { status: 403 });
  }

  return new Response("Content for AI assistants");
}
```

### 検索エンジンとAIアシスタントを許可

```typescript
import { checkBotId } from "botid/server";

export async function GET(request: Request) {
  const verification = await checkBotId();

  const allowedCategories = ["search-engine", "ai-assistant"];
  const isAllowedBot =
    verification.isVerifiedBot &&
    allowedCategories.includes(verification.verifiedBotCategory || "");

  if (verification.isBot && !isAllowedBot) {
    return new Response("Access denied", { status: 403 });
  }

  return new Response("Public content");
}
```

### 特定のボットをブロック

```typescript
import { checkBotId } from "botid/server";

export async function POST(request: Request) {
  const verification = await checkBotId();

  // すべてのボットをブロック（検証済みを含む）
  if (verification.isBot) {
    return new Response("No bots allowed", { status: 403 });
  }

  // または特定の検証済みボットのみをブロック
  const blockedBots = ["specificbot"];
  if (
    verification.isVerifiedBot &&
    blockedBots.includes(verification.verifiedBotName || "")
  ) {
    return new Response("This bot is not allowed", { status: 403 });
  }

  // 処理を続行
  return new Response("Success");
}
```

### カテゴリ別の処理

```typescript
import { checkBotId } from "botid/server";

export async function GET(request: Request) {
  const verification = await checkBotId();

  if (!verification.isVerifiedBot) {
    // 未検証のボットをブロック
    if (verification.isBot) {
      return new Response("Unverified bot", { status: 403 });
    }
    // 通常のユーザー
    return new Response("Full content");
  }

  // 検証済みボット用の処理
  switch (verification.verifiedBotCategory) {
    case "search-engine":
      return new Response("SEO optimized content");
    case "ai-assistant":
      return new Response("Structured content for AI");
    case "social-media":
      return new Response("Social media preview");
    default:
      return new Response("Basic content");
  }
}
```

## ベストプラクティス

1. **SEO考慮**: 検索エンジンボットは常に許可する
2. **AI対応**: AIアシスタントにコンテンツへのアクセスを許可することを検討
3. **明示的な許可**: 許可するボットのカテゴリを明確に定義
4. **ログ記録**: どのボットがアクセスしているかを記録し、分析
5. **柔軟性**: 新しいボットが追加されるため、カテゴリベースの許可を使用

## トラブルシューティング

### 検索エンジンがブロックされている

```typescript
// すべての検証済み検索エンジンを許可
if (
  verification.isVerifiedBot &&
  verification.verifiedBotCategory === "search-engine"
) {
  // 通過させる
}
```

### 新しいAIボットへの対応

新しいAIボットは、Vercelによって検証され次第、ディレクトリに追加されます。カテゴリベースの許可を使用することで、個別に更新する必要がありません。

### カスタムボットの追加

現在、カスタムボットをディレクトリに追加することはできません。信頼できるボットには、カスタムヘッダーやAPIキーを使用して識別し、ファイアウォールのバイパスルールで許可することを検討してください。

詳細については、[BotID Documentation](/docs/botid)を参照してください。
