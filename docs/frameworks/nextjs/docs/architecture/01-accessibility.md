# アクセシビリティ

Next.jsチームは、すべての開発者（およびそのエンドユーザー）がNext.jsをアクセシブルにすることに取り組んでいます。Next.jsにデフォルトでアクセシビリティ機能を追加することで、Webをすべての人にとってより包括的なものにすることを目指しています。

## ルートアナウンス

サーバー側でレンダリングされたページ間（例：`<a href>`タグを使用）を遷移する場合、スクリーンリーダーやその他の支援技術は、ページが読み込まれるときにページタイトルをアナウンスして、ユーザーがページが変更されたことを理解できるようにします。

従来のページナビゲーションに加えて、Next.jsはパフォーマンス向上のためにクライアント側のルーティング（`next/link`を使用）もサポートしています。クライアント側のルーティングが支援技術にもアナウンスされるようにするために、Next.jsにはデフォルトでルートアナウンサーが含まれています。

Next.jsルートアナウンサーは、最初にドキュメントの`<title>`を検査し、次に`<h1>`要素、最後にURLのパス名を検査することで、アナウンスするページ名を探します。最もアクセシブルなユーザー体験のために、アプリケーションの各ページに一意で説明的なタイトルがあることを確認してください。

## リンティング

Next.jsは、Next.js向けのカスタムルールを含む統合された[ESLint体験](/docs/app/building-your-application/configuring/eslint)を箱から出してすぐに提供します。デフォルトでは、Next.jsにはアクセシビリティの問題を早期にキャッチするのに役立つ`eslint-plugin-jsx-a11y`が含まれています。以下のような問題をキャッチします:

- [aria-*](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Attributes)属性のプレフィックスとTypeScriptが正しいかどうかを警告
- [role](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Roles)属性が正しく使用されていることを検証
- `<img>`、`<video>`、`<audio>`に代替テキストがあることを検証

例えば、このプラグインは`alt`テキストのない画像の追加、`aria-*`属性の誤用、`role`属性の誤用などの一般的なアクセシビリティの問題をキャッチするのに役立ちます。

> **知っておくと良いこと**: アクセシビリティの詳細については、[アクセシビリティリソース](#アクセシビリティリソース)セクションを参照してください。

## アクセシビリティリソース

- [WebAIM WCAG checklist](https://webaim.org/standards/wcag/checklist)
- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/)
- [The A11y Project](https://www.a11yproject.com/)
- Foreground and background要素間の[色のコントラスト比](https://developer.mozilla.org/docs/Web/Accessibility/Understanding_WCAG/Perceivable/Color_contrast)を確認
- アニメーションを操作する際に[`prefers-reduced-motion`](https://web.dev/prefers-reduced-motion/)を使用
