# BotID

BotIDは[すべてのプラン](/docs/plans)で利用可能です。

Vercel BotIDは、目に見える課題を表示せず、手動操作を必要としない「見えないCAPTCHA」で、洗練されたボットから保護します。チェックアウト、サインアップ、APIなどの公開されている高価値なルートを保護するセキュリティ層を追加します。

## 洗練されたボットの動作

洗練されたボットは、実際のユーザーの行動を模倣するように設計されています。JavaScriptを実行し、CAPTCHAを解決し、人間に非常に近い方法でインターフェースを操作できます。PlaywrightやPuppeteerなどのツールは、ページの読み込みからフォーム送信までのセッションを自動化します。

従来のCAPTCHAや簡単なチャレンジでは、これらの高度なボットを効果的にブロックできません。BotIDは、ブラウザの動作を分析し、自動化の兆候を検出することで、実際のユーザーとボットを区別します。

## BotIDの使用

- [はじめに](/docs/botid/get-started) - 完全なコード例を含むセットアップガイド
- [検証済みボット](/docs/botid/verified-bots) - 検証済みボットとその処理に関する情報
- [BotIDのバイパス](#bypass-botid) - BotID検出のバイパスルールの設定
- [高度な設定](/docs/botid/advanced-configuration) - ルートごとの検出レベルの設定
- [フォーム送信](/docs/botid/form-submissions) - HTMLフォームでBotIDを使用する方法
- [ローカル開発](/docs/botid/local-development-behavior) - ローカル環境での動作

## 主な機能

### シームレスな統合

最小限の設定で既存のVercelプロジェクトで動作します。数行のコードを追加するだけで、保護を有効化できます。

### カスタマイズ可能な保護

保護が必要なパスとエンドポイントを定義できます。重要なエンドポイントにのみ保護を適用し、パフォーマンスへの影響を最小限に抑えます。

### プライバシーを重視

ロバストな保護を提供しながらユーザーのプライバシーを尊重します。個人情報を収集せず、ブラウザの動作分析のみに基づいて判断します。

## BotIDモード

BotIDには2つのモードがあります：

### 1. Basic（基本分析）

- 有効なブラウザセッションが確立されているかを確認
- 軽量で高速
- 一般的なユースケースに適している
- デフォルトモード

### 2. Deep Analysis（詳細分析）

- より詳細なブラウザ動作分析を実行
- 洗練されたボットをより正確に検出
- わずかなパフォーマンスオーバーヘッド
- 高セキュリティが必要な場合に推奨

モードは、Vercelダッシュボードのプロジェクト設定または[コードで設定](/docs/botid/advanced-configuration)できます。

## BotIDのバイパス

特定の条件下でBotID保護をバイパスする必要がある場合があります。例えば：

- 信頼できるパートナーのAPIクライアント
- 社内モニタリングツール
- テスト環境

ファイアウォールのカスタムルールでバイパスを設定できます：

```
IF header "X-API-Key" equals "trusted-partner-key"
THEN bypass
```

または、特定のIPアドレスからのトラフィックをバイパス：

```
IF IP address is in list [203.0.113.0/24]
THEN bypass
```

## 検証済みボット

BotIDは、[bots.fyi](https://bots.fyi)で管理されている検証済みボットのディレクトリを使用して、正当なボットを識別します。

検証済みボットには以下が含まれます：

- 検索エンジンクローラー（Googlebot、Bingbot等）
- AIアシスタント（ChatGPT、Claude等）
- ソーシャルメディアボット
- モニタリングサービス

これらのボットは、`checkBotId()`のレスポンスで識別できます。詳細は[Verified Bots](/docs/botid/verified-bots)を参照してください。

## 使用例

### APIエンドポイントの保護

```typescript
import { checkBotId } from 'botid/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const verification = await checkBotId();

  if (verification.isBot) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  // 保護されたロジック
  const data = await request.json();
  // ... 処理
  return NextResponse.json({ success: true });
}
```

### フォーム送信の保護

```typescript
'use server';
import { checkBotId } from 'botid/server';

export async function submitContactForm(formData: FormData) {
  const verification = await checkBotId();

  if (verification.isBot) {
    throw new Error('Bot detected');
  }

  // フォームデータを処理
  const email = formData.get('email');
  const message = formData.get('message');
  // ... 処理
}
```

### 検証済みボットの許可

```typescript
import { checkBotId } from 'botid/server';

export async function GET(request: Request) {
  const verification = await checkBotId();

  // ChatGPTのようなAIアシスタントを許可
  const isAllowedBot = verification.isVerifiedBot &&
                       verification.verifiedBotCategory === 'ai-assistant';

  if (verification.isBot && !isAllowedBot) {
    return new Response('Access denied', { status: 403 });
  }

  // コンテンツを提供
  return new Response('Content...');
}
```

## ベストプラクティス

1. **重要なエンドポイントのみを保護**: すべてのエンドポイントではなく、チェックアウト、サインアップ、APIなどの高価値なルートに焦点を当てる
2. **適切なモードを選択**: 一般的なケースは Basic、高セキュリティが必要な場合は Deep Analysis を使用
3. **検証済みボットを許可**: 検索エンジンやAIアシスタントなど、正当なボットがコンテンツにアクセスできるようにする
4. **エラーハンドリング**: ボット検出時の適切なエラーメッセージとステータスコードを返す
5. **監視**: BotIDのログを定期的に確認し、誤検知がないか確認

## パフォーマンスへの影響

BotIDは、パフォーマンスへの影響を最小限に抑えるように設計されています：

- **Basic モード**: 1-2ms のオーバーヘッド
- **Deep Analysis モード**: 5-10ms のオーバーヘッド

これらのオーバーヘッドは、保護されたエンドポイントにのみ適用されます。

## 価格

BotIDは、すべてのVercelプランで無料で利用できます。追加料金は発生しません。

## トラブルシューティング

### 正当なユーザーがブロックされている

1. モードを確認（Deep Analysis は誤検知の可能性が高い）
2. ログで具体的なケースを確認
3. 必要に応じてバイパスルールを追加

### ボットが通過している

1. Deep Analysis モードに切り替え
2. 保護対象のパスが正しく設定されているか確認
3. クライアント側とサーバー側の設定が一致しているか確認

### フォームが機能しない

[Form Submissions](/docs/botid/form-submissions)のドキュメントを参照し、JavaScriptでフォーム送信を処理していることを確認してください。

詳細については、[BotID Get Started](/docs/botid/get-started)を参照してください。
