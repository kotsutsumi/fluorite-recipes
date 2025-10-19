# ローカル開発の動作

ローカル開発中、BotIDは本番環境とは異なる動作をし、テストと開発のワークフローを容易にします。開発モードでは、`checkBotId()` は常に `{ isBot: false }` を返し、すべてのリクエストを通過させます。これにより、機能の構築とテスト中に、ボット保護によって開発ワークフローが中断されないようにします。

## デフォルトの動作

ローカル開発環境（`process.env.NODE_ENV === 'development'`）では：

```typescript
import { checkBotId } from 'botid/server';

export async function POST(request: Request) {
  const verification = await checkBotId();
  // ローカル開発では常に: { isBot: false, isVerifiedBot: false }

  if (verification.isBot) {
    // この条件は決して実行されない
    return new Response('Bot detected', { status: 403 });
  }

  // すべてのリクエストがここに到達
  return new Response('Success');
}
```

## developmentOptionsの使用

ローカル開発中にBotIDの異なる戻り値をテストする必要がある場合、`developmentOptions`オプションを使用できます：

```typescript
import { checkBotId } from 'botid/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const verification = await checkBotId({
    developmentOptions: {
      bypass: 'BAD-BOT', // デフォルト: 'HUMAN'
    },
  });

  if (verification.isBot) {
    return NextResponse.json({ error: 'アクセス拒否' }, { status: 403 });
  }

  // 保護されたロジックをここに記述
  return NextResponse.json({ success: true });
}
```

## 利用可能なbypass値

| 値 | 動作 | 用途 |
|----|------|------|
| `'HUMAN'` | `{ isBot: false }` を返す（デフォルト） | 通常の開発ワークフロー |
| `'BAD-BOT'` | `{ isBot: true, isVerifiedBot: false }` を返す | ボット検出ロジックのテスト |
| `'VERIFIED-BOT'` | `{ isBot: true, isVerifiedBot: true, verifiedBotName: 'test-bot', verifiedBotCategory: 'test' }` を返す | 検証済みボット処理のテスト |

## 使用例

### ボット検出のテスト

```typescript
import { checkBotId } from 'botid/server';

export async function POST(request: Request) {
  // 開発中にボット検出をシミュレート
  const verification = await checkBotId({
    developmentOptions: {
      bypass: 'BAD-BOT',
    },
  });

  if (verification.isBot) {
    console.log('Bot detected!');
    return new Response('Access denied', { status: 403 });
  }

  return new Response('Success');
}
```

ローカルでこのエンドポイントを呼び出すと、常に「Bot detected!」がログに表示され、403エラーが返されます。

### 検証済みボット処理のテスト

```typescript
import { checkBotId } from 'botid/server';

export async function GET(request: Request) {
  const verification = await checkBotId({
    developmentOptions: {
      bypass: 'VERIFIED-BOT',
    },
  });

  if (verification.isVerifiedBot) {
    console.log('Verified bot:', verification.verifiedBotName);
    return new Response('Content for verified bots');
  }

  if (verification.isBot) {
    return new Response('Access denied', { status: 403 });
  }

  return new Response('Regular content');
}
```

### 環境変数による制御

環境変数を使用して、開発時の動作を制御できます：

`.env.local`:

```
BOTID_DEV_MODE=BAD-BOT
```

コード：

```typescript
import { checkBotId } from 'botid/server';

const devMode = process.env.BOTID_DEV_MODE as 'HUMAN' | 'BAD-BOT' | 'VERIFIED-BOT' | undefined;

export async function POST(request: Request) {
  const verification = await checkBotId({
    developmentOptions: {
      bypass: devMode || 'HUMAN',
    },
  });

  if (verification.isBot) {
    return new Response('Bot detected', { status: 403 });
  }

  return new Response('Success');
}
```

これにより、環境変数を変更するだけで、異なるシナリオをテストできます。

## 本番環境との違い

| 環境 | 動作 |
|------|------|
| **ローカル開発** | `developmentOptions`に基づいて固定値を返す |
| **本番環境** | 実際のボット検出を実行（`developmentOptions`は無視される） |

**重要**: `developmentOptions`は本番環境では完全に無視されます。本番環境では、常に実際のボット検出が実行されます。

## テスト戦略

### 単体テスト

```typescript
import { checkBotId } from 'botid/server';

describe('API endpoint', () => {
  it('should block bots', async () => {
    const verification = await checkBotId({
      developmentOptions: { bypass: 'BAD-BOT' },
    });

    expect(verification.isBot).toBe(true);
  });

  it('should allow humans', async () => {
    const verification = await checkBotId({
      developmentOptions: { bypass: 'HUMAN' },
    });

    expect(verification.isBot).toBe(false);
  });

  it('should handle verified bots', async () => {
    const verification = await checkBotId({
      developmentOptions: { bypass: 'VERIFIED-BOT' },
    });

    expect(verification.isVerifiedBot).toBe(true);
    expect(verification.verifiedBotName).toBe('test-bot');
  });
});
```

### 統合テスト

```typescript
import { POST } from './route';

describe('Contact API', () => {
  it('should reject bot requests', async () => {
    // モックリクエスト
    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({ message: 'test' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(403);
  });
});
```

## ベストプラクティス

1. **デフォルトはHUMAN**: 通常の開発では、`developmentOptions`を指定せず、デフォルトの動作を使用
2. **特定のテストのみ設定**: ボット検出ロジックをテストする場合のみ`BAD-BOT`または`VERIFIED-BOT`を使用
3. **環境変数で制御**: プロジェクト全体で一貫した動作を確保
4. **ドキュメント化**: チームメンバーがテスト方法を理解できるようにドキュメント化
5. **本番環境でテスト**: 最終的には本番環境またはプレビュー環境で実際の動作を確認

## 本番環境でのテスト

ローカル開発では実際のボット検出をテストできないため、本番環境またはVercelのプレビューデプロイメントでテストすることが重要です：

1. **プレビューデプロイメント**: ブランチをpushしてプレビュー環境で確認
2. **ステージング環境**: 本番環境と同じ設定のステージング環境を使用
3. **モニタリング**: 本番環境のファイアウォールログで実際の動作を確認

## トラブルシューティング

### developmentOptionsが本番環境で機能しない

これは正常な動作です。`developmentOptions`は開発環境でのみ機能し、本番環境では常に実際のボット検出が実行されます。

### ローカルでボット検出をテストできない

`developmentOptions.bypass`を使用して、ボット検出の動作をシミュレートしてください。実際のボット検出のテストには、Vercelのプレビューデプロイメントを使用してください。

### テストが失敗する

1. `NODE_ENV`が`development`に設定されているか確認
2. `developmentOptions`が正しく渡されているか確認
3. テストフレームワークの設定を確認

詳細については、[BotID Documentation](/docs/botid)を参照してください。
