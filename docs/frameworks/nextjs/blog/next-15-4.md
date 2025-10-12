# Next.js 15.4

**公開日**: 2025年7月14日(月曜日)

**著者**:
- Jimmy Lai (@feedthejim)
- Zack Tanner (@zt1072)

## 主なハイライト

### Turbopackビルド

- `next build --turbopack`で統合テストの100%互換性を達成
- vercel.comで稼働中
- Next.js 16でのベータ版リリースを準備中

### Next.js 16プレビュー機能

- Cache Components(ベータ版)
- 最適化されたクライアント側ルーティング
- DevToolsとデバッグの改善
- Node.js Middleware(安定版)
- Deployment Adapters(アルファ版)
- 軽微な非推奨事項

## アップグレードオプション

```bash
# 自動アップグレード
npx @next/codemod@canary upgrade latest

# 手動アップグレード
npm install next@latest react@latest react-dom@latest

# 新しいプロジェクト
npx create-next-app@latest
```

## `next.config.js`での実験的機能

```typescript
const nextConfig: NextConfig = {
  experimental: {
    browserDebugInfoInTerminal: true,
    dynamicIO: true, // cacheComponentsにリネーム予定
    clientSegmentCache: true,
    // 追加の実験的フラグ
  }
};
```

チームは、スムーズな移行を強調し、GitHubのDiscussionsとIssuesを通じてコミュニティからのフィードバックを奨励しています。
