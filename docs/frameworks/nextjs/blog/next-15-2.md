# Next.js 15.2

**公開日**: 2025年2月26日(水曜日)

**著者**:
- Jiachi Liu (@huozhi)
- Jiwon Choi (@devjiwonchoi)
- Jude Gao (@gao_jude)
- Maia Teegarden (@padmaia)
- Pranathi Peri (@pranathiperii)
- Rauno Freiberg (@raunofreiberg)
- Sebastian Silbermann (@sebsilbermann)
- Zack Tanner (@zt1072)

## 主な更新内容

### 1. エラーUIの再設計とスタックトレースの改善

- エラーメッセージの表示を刷新
- コアエラーの詳細を強調
- ライブラリコードからのノイズを削減
- Reactの「owner stacks」機能を使用
- エラーメッセージのフィードバックセクションを追加

### 2. ストリーミングメタデータ

- 非同期メタデータがページレンダリングをブロックしなくなりました
- メタデータ完了前に初期UIを送信可能
- ボットユーザーエージェントとの互換性を維持

### 3. Turbopackのパフォーマンス改善

- コンパイル時間が最大57.6%高速化
- メモリ使用量が30%削減
- ほとんどのシナリオでWebpackより高速

### 4. 実験的機能

- React View Transitions API
- Node.js Middlewareランタイム

## アップグレード手順

```bash
# 自動アップグレードCLIを使用
npx @next/codemod@canary upgrade latest

# ...または手動でアップグレード
npm install next@latest react@latest react-dom@latest

# ...または新しいプロジェクトを開始
npx create-next-app@latest
```

このブログ記事は、各機能の詳細な説明をスクリーンショットとコード例とともに提供し、開発者体験とパフォーマンスの改善を強調しています。
