# Advanced BotID Configuration

## ルートごとの設定

BotIDの検出レベルを細かく制御する必要がある場合、`advancedOptions`を使用して、ルートごとに基本分析モードと詳細分析モードを選択できます。この設定は、VercelダッシュボードのプロジェクトレベルのBotID設定よりも優先されます。

**重要**: クライアント側とサーバー側の両方の設定で`checkLevel`が同一である必要があります。設定が一致しない場合、BotID検証に失敗し、正規のトラフィックがブロックされたり、ボットが通過したりする可能性があります。

この機能は`botid@1.4.5`以降で利用可能です。

## 検出レベル

### Basic（基本分析）

- 軽量で高速
- 有効なブラウザセッションを確認
- 一般的なボットを検出
- 推奨: 一般的なエンドポイント

### Deep Analysis（詳細分析）

- より詳細なブラウザ動作分析
- 洗練されたボットを検出
- わずかなパフォーマンスオーバーヘッド（5-10ms）
- 推奨: 高価値なエンドポイント（決済、アカウント作成等）

## クライアント側の設定

保護対象のパスごとにチェックレベルを指定できます：

```typescript
import { initBotId } from 'botid/client';

export async function register() {
  initBotId({
    protect: [
      {
        path: '/api/checkout',
        method: 'POST',
        advancedOptions: {
          checkLevel: 'deepAnalysis',
        },
      },
      {
        path: '/api/contact',
        method: 'POST',
        advancedOptions: {
          checkLevel: 'basic',
        },
      },
    ],
  });
}
```

## サーバー側の設定

`checkBotId()`エンドポイントで、クライアント側の設定と一致するように設定します：

```typescript
import { checkBotId } from 'botid/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const verification = await checkBotId({
    advancedOptions: {
      checkLevel: 'deepAnalysis', // クライアント側と一致させる
    },
  });

  if (verification.isBot) {
    return NextResponse.json({ error: 'アクセス拒否' }, { status: 403 });
  }

  // 保護されたロジック
  return NextResponse.json({ success: true });
}
```

## 完全な例

### 複数のエンドポイントで異なるレベル

`instrumentation-client.ts`:

```typescript
import { initBotId } from 'botid/client';

export async function register() {
  initBotId({
    protect: [
      // 高セキュリティ: 決済エンドポイント
      {
        path: '/api/checkout',
        method: 'POST',
        advancedOptions: {
          checkLevel: 'deepAnalysis',
        },
      },
      {
        path: '/api/account/create',
        method: 'POST',
        advancedOptions: {
          checkLevel: 'deepAnalysis',
        },
      },
      // 標準セキュリティ: 一般的なエンドポイント
      {
        path: '/api/contact',
        method: 'POST',
        advancedOptions: {
          checkLevel: 'basic',
        },
      },
      {
        path: '/api/newsletter',
        method: 'POST',
        advancedOptions: {
          checkLevel: 'basic',
        },
      },
    ],
  });
}
```

対応するサーバー側の実装：

`app/api/checkout/route.ts`:

```typescript
import { checkBotId } from 'botid/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const verification = await checkBotId({
    advancedOptions: {
      checkLevel: 'deepAnalysis', // クライアント側と一致
    },
  });

  if (verification.isBot) {
    return NextResponse.json(
      { error: 'Bot detected' },
      { status: 403 }
    );
  }

  // 決済処理
  return NextResponse.json({ orderId: '12345' });
}
```

`app/api/contact/route.ts`:

```typescript
import { checkBotId } from 'botid/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const verification = await checkBotId({
    advancedOptions: {
      checkLevel: 'basic', // クライアント側と一致
    },
  });

  if (verification.isBot) {
    return NextResponse.json(
      { error: 'Bot detected' },
      { status: 403 }
    );
  }

  // お問い合わせ処理
  return NextResponse.json({ success: true });
}
```

## 使用ガイドライン

### Deep Analysisを使用すべき場合

- 決済エンドポイント
- アカウント作成・登録
- パスワードリセット
- 高額な操作（NFTミント、トークン購入等）
- 機密データへのアクセス

### Basicを使用すべき場合

- お問い合わせフォーム
- ニュースレター登録
- コメント投稿
- いいねやフォロー
- 一般的なAPI呼び出し

## パフォーマンスへの影響

| チェックレベル | オーバーヘッド | 検出精度 | 推奨用途 |
|---------------|------------|---------|---------|
| Basic | 1-2ms | 良い | 一般的なエンドポイント |
| Deep Analysis | 5-10ms | 優れた | 高価値なエンドポイント |

## エラーハンドリング

設定の不一致を検出するためのヘルパー関数：

```typescript
import { checkBotId } from 'botid/server';

async function verifyBotId(expectedLevel: 'basic' | 'deepAnalysis') {
  try {
    const verification = await checkBotId({
      advancedOptions: {
        checkLevel: expectedLevel,
      },
    });
    return verification;
  } catch (error) {
    console.error('BotID verification failed:', error);
    // フェイルセーフ: エラー時はボットとして扱う
    return { isBot: true };
  }
}

export async function POST(request: Request) {
  const verification = await verifyBotId('deepAnalysis');

  if (verification.isBot) {
    return new Response('Access denied', { status: 403 });
  }

  // 処理を続行
}
```

## トラブルシューティング

### 設定が一致しない場合

**エラー**: 正当なユーザーがブロックされる、またはボットが通過する

**解決策**:
1. クライアント側の`initBotId()`設定を確認
2. サーバー側の`checkBotId()`設定を確認
3. 両方で同じ`checkLevel`が指定されているか確認

### Deep Analysisが遅い

**問題**: レスポンス時間が許容範囲を超える

**解決策**:
1. 本当にDeep Analysisが必要か再評価
2. 可能であればBasicに切り替え
3. 他の最適化を検討（キャッシング等）

### すべてのリクエストがボットとして検出される

**問題**: 誤検知が多い

**解決策**:
1. クライアント側でBotIDが正しく初期化されているか確認
2. `protect`配列のパスが正しいか確認
3. ブラウザの開発者ツールでネットワークリクエストを確認

## ベストプラクティス

1. **段階的な導入**: まずBasicで始め、必要に応じてDeep Analysisに移行
2. **設定の一元管理**: 設定を一箇所で管理し、クライアントとサーバーで共有
3. **監視**: ファイアウォールログで誤検知を監視
4. **ドキュメント化**: 各エンドポイントでどのレベルを使用しているか記録
5. **テスト**: 本番環境適用前に十分にテスト

## 設定の一元管理例

`lib/botid-config.ts`:

```typescript
export const botIdConfig = {
  checkout: {
    path: '/api/checkout',
    method: 'POST' as const,
    checkLevel: 'deepAnalysis' as const,
  },
  contact: {
    path: '/api/contact',
    method: 'POST' as const,
    checkLevel: 'basic' as const,
  },
} as const;
```

クライアント側:

```typescript
import { botIdConfig } from '@/lib/botid-config';

initBotId({
  protect: Object.values(botIdConfig).map((config) => ({
    path: config.path,
    method: config.method,
    advancedOptions: {
      checkLevel: config.checkLevel,
    },
  })),
});
```

サーバー側:

```typescript
import { botIdConfig } from '@/lib/botid-config';

export async function POST(request: Request) {
  const verification = await checkBotId({
    advancedOptions: {
      checkLevel: botIdConfig.checkout.checkLevel,
    },
  });
  // ...
}
```

詳細については、[BotID Documentation](/docs/botid)を参照してください。
