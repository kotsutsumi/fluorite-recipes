# eslint

プロジェクトでESLintが検出されると、Next.jsはエラーが存在する場合に**本番ビルド**（`next build`）を失敗させます。

アプリケーションにESLintエラーがある場合でも、Next.jsに本番コードを生成させたい場合は、組み込みのリンティングステップを完全に無効にできます。これは、ワークフローの別の部分（例：CIやpre-commitフック）でESLintが既に設定されている場合を除き、推奨されません。

`next.config.js` を開き、`eslint` 設定で `ignoreDuringBuilds` オプションを有効にします：

```javascript
module.exports = {
  eslint: {
    // 警告: これにより、プロジェクトにESLintエラーがある場合でも
    // 本番ビルドが正常に完了します。
    ignoreDuringBuilds: true,
  },
}
```
