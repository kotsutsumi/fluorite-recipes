# Supabase Storageとの統合

Edge Functionsは[Supabase Storage](/docs/guides/storage)とシームレスに連携します。これにより、以下のことが可能になります:

- 関数から生成されたコンテンツを直接アップロード
- パフォーマンス向上のためのキャッシュファーストパターンの実装
- 組み込みCDN機能を使用したファイルの配信

## 基本的なファイル操作

Supabaseクライアントを使用して、Edge Functionsから直接ファイルをアップロードします。サーバーサイドのStorage操作には、サービスロールキーが必要です:

```typescript
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // コンテンツを生成
  const fileContent = await generateImage()

  // Storageにアップロード
  const { data, error } = await supabaseAdmin.storage
    .from('images')
    .upload(`generated/${filename}.png`, fileContent.body!, {
      contentType: 'image/png',
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw error
  }

  return new Response(JSON.stringify({ path: data.path }))
})
```

> **警告**: サーバーサイド操作には常に`SUPABASE_SERVICE_ROLE_KEY`を使用してください。このキーをクライアントサイドのコードで公開しないでください！

## キャッシュファーストパターン

新しいコンテンツを生成する前にStorageを確認してパフォーマンスを向上させます:

```typescript
const STORAGE_URL = 'https://your-project.supabase.co/storage/v1/object/public/images'

Deno.serve(async (req) => {
  const url = new URL(req.url)
  const username = url.searchParams.get('username')

  try {
    // まず既存のファイルをStorageから取得を試みます
    const storageResponse = await fetch(`${STORAGE_URL}/avatars/${username}.png`)

    if (storageResponse.ok) {
      // ファイルが存在する場合は、そのまま返します
      return new Response(storageResponse.body, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=3600',
        },
      })
    }

    // ファイルが存在しない場合は、新しいものを生成します
    const generatedImage = await generateAvatar(username)

    // Storageにアップロード
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await supabaseAdmin.storage
      .from('images')
      .upload(`avatars/${username}.png`, generatedImage, {
        contentType: 'image/png',
        cacheControl: '3600',
      })

    return new Response(generatedImage, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    return new Response('Error generating image', { status: 500 })
  }
})
```

## ファイルの削除

```typescript
const { data, error } = await supabaseAdmin.storage
  .from('images')
  .remove(['path/to/file.png'])
```

## ファイル一覧の取得

```typescript
const { data, error } = await supabaseAdmin.storage
  .from('images')
  .list('folder-path', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  })
```

## 署名付きURLの生成

プライベートファイルへの一時的なアクセスを提供します:

```typescript
const { data, error } = await supabaseAdmin.storage
  .from('private-images')
  .createSignedUrl('path/to/file.png', 3600) // 1時間有効
```

## ベストプラクティス

1. **キャッシュ制御**: 適切な`cacheControl`ヘッダーを設定してCDNパフォーマンスを最適化
2. **エラー処理**: Storage操作のエラーを常に処理
3. **セキュリティ**: サーバーサイドでは`SUPABASE_SERVICE_ROLE_KEY`を使用し、クライアントサイドでは公開しない
4. **ファイル検証**: アップロード前にファイルタイプとサイズを検証
