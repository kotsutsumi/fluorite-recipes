# Next.js 15

**公開日**: 2024年10月21日(月曜日)

**著者**:
- Delba de Oliveira
- Jimmy Lai
- Rich Haines

## 主なハイライト

Next.js 15では、いくつかの重要な更新が導入されています:

1. **@next/codemod CLI**: Next.jsおよびReactバージョンのアップグレードプロセスを簡素化
2. **React 19サポート**: React Compiler(実験的)を含む
3. **Turbopack Dev**: パフォーマンス改善により安定版に
4. **非同期リクエストAPI**: リクエスト固有のデータ処理への破壊的変更
5. **キャッシングセマンティクス**: デフォルトのキャッシング動作の変更

## アップグレード手順

```bash
# 新しい自動アップグレードCLIを使用
npx @next/codemod@canary upgrade latest

# ...または手動でアップグレード
npm install next@latest react@rc react-dom@rc
```

## 主な変更点

### 非同期リクエストAPI(破壊的変更)

`cookies()`, `headers()`, `params`などのAPIが非同期になりました。移行用のcodemodが提供されています。

### キャッシングセマンティクス

- `GET` Route Handlersはデフォルトでキャッシュされなくなりました
- Client Router Cacheが最新のデータを反映するように変更されました

### React 19サポート

- App RouterはReact 19 RCを使用
- Pages RouterはReact 18互換性を維持
- 実験的なReact Compilerを導入

### Turbopack Dev

パフォーマンスの改善:
- ローカルサーバーの起動が76.7%高速化
- コード更新が96.3%高速化
- 初期ルートコンパイルが45.8%高速化

## その他の注目すべき機能

- 静的ルートインジケーター
- `unstable_after` API
- 拡張された`<Form>`コンポーネント
- セルフホスティングオプションの改善
- Server Actionsのセキュリティ強化

## 互換性と要件

- 最小Node.jsバージョン: 18.18.0
- `next.config.ts`のTypeScriptサポート
- ESLint 9サポート

このブログ記事は、このリリースにおける安定性、パフォーマンス、開発者体験への焦点を強調しています。
