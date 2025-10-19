# Draft Mode - ドラフトモード

## 概要

Draft Modeは、Vercelの機能で、開発者が「ヘッドレスCMSの未公開コンテンツを、公開時に表示される通常のスタイルとレイアウトで、ウェブサイト上で表示できる」ようにします。

## サポートされているフレームワーク

- Next.js
- SvelteKit
- `bypassToken`オプションを使用したBuild Output APIを使用する任意のフレームワーク

## Draft Modeの仕組み

1. 各ISRルートには暗号的に安全な`bypassToken`がある
2. ページは`__prerender_bypass` Cookieをチェックする
3. CookieがbypassTokenと一致する場合、ページはDraft Modeでレンダリングされる
4. チームメンバーのみがDraft Modeコンテンツを表示できる

## はじめに（Next.js例）

```typescript
async function getContent() {
  const { isEnabled } = await draftMode();

  const contentUrl = isEnabled
    ? 'https://draft.example.com'
    : 'https://production.example.com';

  const res = await fetch(contentUrl, { next: { revalidate: 120 } });

  return res.json();
}
```

## ドラフトの共有

- ドラフトURLには`?__vercel_draft=1`を含める必要がある
- 外部閲覧者はDraft Modeコンテンツにアクセスできない

## 主な要件

- Incremental Static Regeneration（ISR）を使用する必要がある
- ドラフトコンテンツを検出してレンダリングするコードを追加
- Vercel Toolbar経由でDraft Modeを切り替える

## 歴史的な注意事項

「Draft Modeは、Next.js 13.4のリリース前はPreview Modeと呼ばれていました。」
