# Next.js 15 RC 2

**公開日**: 2024年10月15日(火曜日)

**著者**:
- Delba de Oliveira (@delba_oliveira)
- Jiachi Liu (@huozhi)
- Jiwon Choi (@devjiwonchoi)
- Josh Story (@joshcstory)
- Sebastian Silbermann (@sebsilbermann)
- Zack Tanner (@zt1072)

## 主なハイライト

### Codemod CLIによるスムーズなアップグレード

最新のNext.jsおよびReactバージョンへの簡単なアップグレード:

```bash
npx @next/codemod@canary upgrade rc
```

### 開発用Turbopack

- パフォーマンスの改善
- メモリ使用量が25-35%削減
- 大規模ページのコンパイルが30-50%高速化

### 非同期リクエストAPI(破壊的変更)

`cookies()`, `headers()`などのAPIが非同期に移行。移行用のcodemodが利用可能です。

### Server Actionsのセキュリティ強化

- 推測不可能なエンドポイント
- 未使用アクションの削除
- デッドコードの除去

### 静的ルートインジケーター

ルートのレンダリング戦略を識別するための開発中の視覚的な手がかり。

### 新しい`<Form>`コンポーネント

HTMLフォームにプリフェッチとクライアント側ナビゲーションを追加。

### その他の改善点

- `next.config.ts`のTypeScriptサポート
- 安定版の`instrumentation.js`
- ビルド時間の改善
- ESLint 9のサポート

## アップグレード方法

```bash
npx @next/codemod@canary upgrade rc
```

このブログ記事は、次期Next.js 15リリース候補の包括的な概要を提供し、パフォーマンス、セキュリティ、開発者体験の改善に焦点を当てています。
