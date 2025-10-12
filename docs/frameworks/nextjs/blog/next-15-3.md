# Next.js 15.3

**公開日**: 2025年4月9日(水曜日)

**著者**:
- Andrew Clark
- Jiwon Choi
- Jude Gao
- Maia Teegarden
- Tim Neutkens
- Will Binns-Smith

## 主な機能

### ビルド用Turbopack(アルファ版)

- 開発セッションの50%以上がTurbopackを使用
- 統合テストの99.3%に合格
- 異なるCPUコア数でのパフォーマンス改善
- まだ本番環境には推奨されていません

### Rspackのコミュニティサポート(実験的)

- Webpack互換性を持つ代替バンドラー
- 統合テストの約96%に合格

### クライアントインストゥルメンテーションフック

早期監視と分析セットアップを可能にします:

- パフォーマンストラッキングに使用可能
- エラーモニタリング

### ナビゲーションフック

- `onNavigate`: ルーティング動作を制御
- `useLinkStatus`: ローカライズされたローディング状態を作成

### TypeScriptプラグインのパフォーマンス改善

- レスポンス時間が60%高速化
- 大規模コードベースのサポート向上

## アップグレード方法

```bash
# 自動アップグレード
npx @next/codemod@canary upgrade latest

# 手動アップグレード
npm install next@latest react@latest react-dom@latest

# 新しいプロジェクト
npx create-next-app@latest
```

このブログ記事は、Next.jsエコシステムにおける継続的な改善とコミュニティコラボレーションを強調しています。
