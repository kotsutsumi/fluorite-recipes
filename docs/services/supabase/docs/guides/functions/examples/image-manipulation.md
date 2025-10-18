# 画像の操作

Supabase Storageには、最も一般的な画像の変換と最適化のための[すぐに使えるサポート](/docs/guides/storage/serving/image-transformations?queryGroups=language&language=js)があります。Supabase Storageが提供する機能以外のカスタム処理が必要な場合は、Edge Functionsを使用してカスタム画像操作スクリプトを作成できます。

この例では、[`magick-wasm`](https://github.com/dlemstra/magick-wasm)を使用して画像操作を実行します。`magick-wasm`は、人気のImageMagickライブラリのWebAssemblyポートで、100以上のファイル形式の処理をサポートしています。

> **警告**: Edge Functionsは現在、ネイティブライブラリに依存する`Sharp`などの画像処理ライブラリをサポートしていません。WASMベースのライブラリのみがサポートされています。

## 前提条件

最新バージョンの[Supabase CLI](/docs/guides/cli#installation)がインストールされていることを確認してください。

## Edge Functionの作成

ローカルで新しい関数を作成します:

```bash
supabase functions new image-blur
```

## 関数の作成

この例では、ユーザーが画像をアップロードしてぼかしたサムネイルを取得できる関数を実装します。

`index.ts`ファイルの実装は次のとおりです:

```typescript
// This is an example showing how to use Magick WASM to do image manipulations in Edge Functions.
import {
  ImageMagick,
  initializeImageMagick,
  MagickFormat,
} from "npm:@imagemagick/magick-wasm@0.0.30";

const wasmBytes = await Deno.readFile(
  new URL(
    "magick.wasm",
    import.meta.resolve("npm:@imagemagick/magick-wasm@0.0.30"),
  ),
);
await initializeImageMagick(wasmBytes);

Deno.serve(async (req) => {
  const formData = await req.formData();
  const content = await formData.get("file").bytes();
  let result = ImageMagick.read(
    content,
    (img) => {
      // 画像をぼかす
      img.blur(0, 10);
      // PNG形式で書き出す
      return img.write(
        MagickFormat.Png,
        (data) => data,
      );
    },
  );

  return new Response(result, {
    headers: {
      "Content-Type": "image/png",
    },
  });
});
```

## デプロイ

関数をローカルでテスト:

```bash
supabase start
supabase functions serve image-blur --no-verify-jwt
```

関数をデプロイ:

```bash
supabase functions deploy image-blur
```

完全な実装の詳細については、[GitHubのサンプルコード](https://github.com/supabase/supabase/tree/master/examples/edge-functions/supabase/functions/image-blur)を参照してください。
