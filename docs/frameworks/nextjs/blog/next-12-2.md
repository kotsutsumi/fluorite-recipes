# Next.js 12.2

**投稿日**: 2022年6月28日（火曜日）

**著者**: Balázs Orbán、DongYoon Kang、Javi Velasco、その他

## 主な機能

### 1. ミドルウェア（安定版）

- アプリケーション全体の動的ルーティング
- リクエスト完了前にレスポンスを変更可能

### 2. オンデマンドインクリメンタル静的再生成（ISR）（安定版）

- 再デプロイせずにコンテンツを更新
- Next.js Build APIをサポートするプロバイダーで動作

### 3. Edge APIルート（実験的）

- APIエンドポイント用の軽量ランタイム
- ストリーミングレスポンスをサポート

### 4. Edgeサーバーレンダリング（実験的）

- サーバーサイドレンダリング用の軽量ランタイム
- React 18でストリーミングサーバーレンダリングを有効化

### 5. SWCプラグイン（実験的）

- SWC変換の動作をカスタマイズ
- コンパイル中にWebAssemblyプラグインを追加

### 6. `next/image`の改善

- 新しい`next/future/image`コンポーネント
- クライアント側JavaScriptの削減
- ネイティブ遅延読み込み
- リモート画像パターン設定

## ミドルウェアの例

```typescript
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const isInBeta = JSON.parse(req.cookies.get('beta') || 'false');
  req.nextUrl.pathname = isInBeta ? '/beta' : '/';
  return NextResponse.rewrite(req.nextUrl);
}
```

**更新コマンド**: `npm i next@latest`

## まとめ

この記事では、パフォーマンス、柔軟性、開発者体験に焦点を当てたNext.jsの継続的な進化を強調しています。
