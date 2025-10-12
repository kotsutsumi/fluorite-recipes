# unstable_rethrow

`unstable_rethrow` は、アプリケーションエラーを処理する際に、内部の Next.js エラーをキャッチしないようにするための実験的な Next.js 関数です。

## 概要

この関数は、エラーページのレンダリングなど、フレームワークの期待される動作を中断することを防ぐのに役立ちます。

## 使用方法

```typescript
import { notFound, unstable_rethrow } from 'next/navigation'

export default async function Page() {
  try {
    const post = await fetch('https://.../posts/1').then((res) => {
      if (res.status === 404) notFound()
      if (!res.ok) throw new Error(res.statusText)
      return res.json()
    })
  } catch (err) {
    unstable_rethrow(err)
    console.error(err)
  }
}
```

## 適用可能な Next.js API

以下の Next.js API で使用できます：

- `notFound()`
- `redirect()`
- `permanentRedirect()`
- `cookies()`、`headers()` などの動的 API 呼び出し

## 重要な考慮事項

- catch ブロックの先頭で呼び出す必要があります
- フレームワーク制御の例外を含む可能性のある例外をキャッチする場合にのみ推奨されます
- 現在は不安定であり、本番環境での使用は推奨されません

## パラメータ

- `err`: キャッチされたエラーオブジェクト

## 戻り値

この関数は値を返しません。内部の Next.js エラーを再スローするか、アプリケーションエラーをそのまま通過させます。

## 注意事項

> **Good to know**: このドキュメントは実験的な機能を説明しています。API は変更される可能性があります。開発者からのフィードバックを GitHub で受け付けています。

## バージョン履歴

| バージョン | 変更内容 |
|---------|---------|
| `v15.0.0-RC` | `unstable_rethrow` が導入されました |
