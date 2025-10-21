# @vercel/ogリファレンス

## ImageResponseインターフェース

```typescript
import { ImageResponse } from '@vercel/og'

new ImageResponse(
  element: ReactElement,
  options: {
    width?: number = 1200
    height?: number = 630
    emoji?: 'twemoji' | 'blobmoji' | 'noto' | 'openmoji' = 'twemoji',
    fonts?: {
      name: string,
      data: ArrayBuffer,
      weight: number,
      style: 'normal' | 'italic'
    }[]
    debug?: boolean = false

    // HTTPレスポンスに渡されるオプション
    status?: number = 200
    statusText?: string
    headers?: Record<string, string>
  },
)
```

### 主なパラメータ

| パラメータ | 型 | デフォルト | 説明 |
|-----------|------|---------|-------------|
| `element` | `ReactElement` | — | 画像を生成するReact要素 |
| `options` | `object` | — | 画像とHTTPレスポンスをカスタマイズするオプション |

### オプションパラメータ

| パラメータ | 型 | デフォルト | 説明 |
|-----------|------|---------|-------------|
| `width` | `number` | `1200` | 画像の幅 |
| `height` | `number` | `630` | 画像の高さ |
| `emoji` | `'twemoji' \| 'blobmoji' \| 'noto' \| 'openmoji'` | `'twemoji'` | 使用する絵文字セット |
| `debug` | `boolean` | `false` | デバッグモードフラグ |
| `status` | `number` | `200` | レスポンスのHTTPステータスコード |
| `statusText` | `string` | — | レスポンスのHTTPステータステキスト |
| `headers` | `Record<string, string>` | — | レスポンスのHTTPヘッダー |

### フォントパラメータ

| パラメータ | 型 | デフォルト | 説明 |
|-----------|------|---------|-------------|
| `name` | `string` | — | フォントの名前 |
| `data` | `ArrayBuffer` | — | フォントデータ |
| `weight` | `number` | — | フォントの太さ |
| `style` | `'normal' \| 'italic'` | — | フォントのスタイル |
