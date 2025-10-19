# CDN Compression（CDN圧縮）

Vercel CDNの圧縮機能は、データ転送量を削減し、パフォーマンスを向上させるための重要な機能です。

## 概要

Vercelは、データ転送を最適化するために2つの圧縮アルゴリズムをサポートしています:

1. **Gzip**
2. **Brotli**

## 圧縮アルゴリズムの比較

### Brotliの優位性

Brotliは、Gzipよりも新しく、より効率的な圧縮アルゴリズムです。

#### 圧縮効率の改善

Gzipと比較した場合のBrotliの圧縮率向上:

| ファイルタイプ | 改善率 |
|-------------|-------|
| JavaScriptファイル | 14%削減 |
| HTMLファイル | 21%削減 |
| CSSファイル | 17%削減 |

### Gzip

- 広くサポートされている
- 互換性が高い
- 古いブラウザにも対応

### Brotli

- より高い圧縮率
- 現代のブラウザで広くサポート
- データ転送量をさらに削減

## 圧縮のネゴシエーション

### 自動的な圧縮

ほとんどのクライアント（ブラウザ）は、`Accept-Encoding`ヘッダーを自動的に含めます。

**例**:

```
Accept-Encoding: gzip, deflate, br
```

**意味**:
- `gzip`: Gzip圧縮をサポート
- `deflate`: Deflate圧縮をサポート
- `br`: Brotli圧縮をサポート

### 圧縮の確認

`Content-Encoding`レスポンスヘッダーで圧縮方法を確認できます。

**例**:

```
Content-Encoding: br
```

この場合、Brotli圧縮が使用されています。

## 自動圧縮を含まないクライアント

以下のクライアントは、`Accept-Encoding`ヘッダーを自動的に含まない場合があります:

- カスタムアプリケーション
- HTTPライブラリ
- 古いブラウザ
- 一部のボットとクローラー

### 対応方法

これらのクライアントに対しては、手動で`Accept-Encoding`ヘッダーを設定する必要があります。

## 自動的に圧縮されるMIMEタイプ

Vercelは、以下のMIMEタイプを自動的に圧縮します:

### アプリケーションタイプ

- application/json
- application/xml
- application/javascript
- application/x-javascript
- application/ecmascript
- application/rss+xml
- application/atom+xml
- application/x-web-app-manifest+json
- application/manifest+json

### フォントタイプ

- font/otf
- font/ttf
- font/collection
- font/sfnt

### 画像タイプ

- image/svg+xml
- image/bmp
- image/x-icon
- image/vnd.microsoft.icon

### テキストタイプ

- text/css
- text/plain
- text/html
- text/javascript
- text/xml
- text/csv
- text/markdown
- text/calendar
- text/richtext
- text/x-component
- text/x-cross-domain-policy

## すべてのMIMEタイプを圧縮しない理由

### 既に圧縮されているファイル

一部のファイルタイプは、既に圧縮されているため、再圧縮するとファイルサイズが増加する可能性があります。

**例**:
- JPEG画像
- PNG画像
- MP4動画
- ZIP圧縮ファイル

### 画像圧縮の推奨

画像の圧縮には、Vercel Image Optimizationの使用を推奨します。

詳細: [Image Optimization](/docs/image-optimization)

## 圧縮の確認方法

### curlコマンド

```bash
curl -I -H "Accept-Encoding: br" https://example.com
```

**出力例**:

```
HTTP/2 200
content-encoding: br
content-type: text/html; charset=utf-8
```

### ブラウザ開発者ツール

1. ブラウザの開発者ツールを開く（F12）
2. Networkタブを選択
3. リクエストを選択
4. Headersタブで`content-encoding`を確認

## パフォーマンスへの影響

### データ転送量の削減

圧縮により、データ転送量が大幅に削減されます。

**例**:
- 元のファイルサイズ: 100KB
- Gzip圧縮後: 約30KB（70%削減）
- Brotli圧縮後: 約25KB（75%削減）

### ページ読み込み速度の向上

データ転送量の削減により、ページの読み込み速度が向上します。

### 帯域幅コストの削減

データ転送量が減少することで、帯域幅コストも削減されます。

## ベストプラクティス

### 1. 圧縮可能なコンテンツの最適化

テキストベースのコンテンツ（HTML、CSS、JavaScript）は圧縮に適しています。

### 2. 画像の最適化

画像には、Vercel Image Optimizationを使用します。

### 3. Accept-Encodingヘッダーの設定

カスタムクライアントでは、適切な`Accept-Encoding`ヘッダーを設定します:

```javascript
fetch('https://api.example.com/data', {
  headers: {
    'Accept-Encoding': 'br, gzip',
  },
});
```

### 4. Content-Encodingの確認

本番環境で、圧縮が正しく適用されているか確認します。

### 5. 圧縮の測定

圧縮前後のファイルサイズを比較して、効果を測定します。

## トラブルシューティング

### 圧縮が適用されない場合

1. MIMEタイプが圧縮対象に含まれているか確認
2. ファイルサイズが適切か確認（小さすぎるファイルは圧縮されない場合がある）
3. `Accept-Encoding`ヘッダーが正しく送信されているか確認

### パフォーマンスが向上しない場合

1. ネットワーク速度を確認
2. ファイルサイズを最適化
3. キャッシュ戦略を見直す

## まとめ

Vercelの圧縮機能は、データ転送量を削減し、Webパフォーマンスを向上させる重要なツールです。BrotliとGzipの両方をサポートし、様々なファイルタイプを自動的に圧縮することで、最適なユーザーエクスペリエンスを提供します。
