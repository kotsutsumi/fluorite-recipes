# Next.js App Router Functions API Reference

このドキュメントは、Next.js App Router で利用可能なサーバーサイド関数とクライアントサイドフック一覧です。LLMが解析・参照しやすいよう、各関数の要約とリンクを含めています。

## 目次

- [サーバーサイド関数](#サーバーサイド関数)
  - [非同期処理・キャッシュ](#非同期処理キャッシュ)
  - [リクエスト・レスポンス処理](#リクエストレスポンス処理)
  - [ナビゲーション・リダイレクト](#ナビゲーションリダイレクト)
  - [メタデータ生成](#メタデータ生成)
  - [静的パラメータ生成](#静的パラメータ生成)
- [クライアントサイドフック](#クライアントサイドフック)
  - [ナビゲーション](#ナビゲーション)
  - [パラメータ・状態取得](#パラメータ状態取得)
  - [パフォーマンス監視](#パフォーマンス監視)

---

## サーバーサイド関数

### 非同期処理・キャッシュ

#### [`after`](./functions/01-after.md)

レスポンス完了後に実行される作業をスケジュールする関数。ログやアナリティクスなど、レスポンスをブロックしない副作用のタスクに使用します。

**使用場所**: サーバーコンポーネント、サーバーアクション、ルートハンドラー、ミドルウェア

#### [`cacheLife`](./functions/02-cacheLife.md)

キャッシュのライフサイクルを制御する関数。データの有効期限や無効化戦略を管理します。

#### [`cacheTag`](./functions/03-cacheTag.md)

キャッシュにタグを付けて、グループ単位でキャッシュを管理する関数。関連データの一括無効化に便利です。

#### [`fetch`](./functions/07-fetch.md)

Web `fetch()` APIを拡張したNext.js版。サーバー側でキャッシュと再検証のセマンティクスを設定できます。

**キーポイント**: サーバーコンポーネント内で`async/await`で直接使用可能

#### [`unstable_cache`](./functions/24-unstable_cache.md)

データベースクエリなど高コストな操作の結果をキャッシュし、複数のリクエスト間で再利用する実験的関数。

#### [`unstable_noStore`](./functions/25-unstable_noStore.md)

特定の関数やコンポーネントでキャッシュを無効化する実験的関数。

#### [`unstable_rethrow`](./functions/26-unstable_rethrow.md)

エラーハンドリングを制御する実験的関数。

### リクエスト・レスポンス処理

#### [`connection`](./functions/04-connection.md)

接続情報を取得する関数。

#### [`cookies`](./functions/05-cookies.md)

HTTP受信リクエストのクッキーを読み取り、送信リクエストのクッキーを読み書きする**非同期**関数。

**使用場所**: サーバーコンポーネント（読み取り）、サーバーアクション・ルートハンドラー（読み書き）

#### [`headers`](./functions/14-headers.md)

サーバーコンポーネントからHTTP受信リクエストヘッダーを**読み取る**非同期関数。読み取り専用のWeb Headersオブジェクトを返します。

#### [`draft-mode`](./functions/06-draft-mode.md)

ドラフトモードの制御を行う関数。プレビュー機能の実装に使用します。

#### [`NextRequest`](./functions/16-next-request.md)

Next.js拡張されたリクエストオブジェクト。ミドルウェアやルートハンドラーで使用します。

#### [`NextResponse`](./functions/17-next-response.md)

Next.js拡張されたレスポンスオブジェクト。ミドルウェアやルートハンドラーで使用します。

#### [`userAgent`](./functions/35-userAgent.md)

ユーザーエージェント情報を解析・取得する関数。

### ナビゲーション・リダイレクト

#### [`redirect`](./functions/20-redirect.md)

ユーザーを別のURLにリダイレクトする関数。一時的なリダイレクト（307）を実行します。

**使用場所**: サーバーコンポーネント、クライアントコンポーネント、ルートハンドラー、サーバーアクション

#### [`permanentRedirect`](./functions/19-permanentRedirect.md)

永続的なリダイレクト（308）を実行する関数。

#### [`notFound`](./functions/18-not-found.md)

404ページを表示する関数。リソースが存在しない場合に使用します。

#### [`forbidden`](./functions/08-forbidden.md)

403 Forbiddenレスポンスを返す関数。

#### [`unauthorized`](./functions/23-unauthorized.md)

401 Unauthorizedレスポンスを返す関数。

### メタデータ生成

#### [`generateMetadata`](./functions/10-generate-metadata.md)

動的メタデータを生成する関数。現在のルートパラメータや外部データに基づいてMetadataオブジェクトを返します。

#### [`generateImageMetadata`](./functions/09-generate-image-metadata.md)

画像メタデータを動的に生成する関数。

#### [`generateViewport`](./functions/13-generate-viewport.md)

ビューポートメタデータを生成する関数。

#### [`ImageResponse`](./functions/15-image-response.md)

動的に画像を生成してレスポンスとして返すコンストラクタ。

### 静的パラメータ生成

#### [`generateStaticParams`](./functions/12-generate-static-params.md)

動的ルートセグメントの静的パラメータを生成する関数。ビルド時に静的ページを事前生成するために使用します。

#### [`generateSitemaps`](./functions/11-generate-sitemaps.md)

サイトマップを動的に生成する関数。

### キャッシュ無効化

#### [`revalidatePath`](./functions/21-revalidatePath.md)

特定のパスに対してキャッシュされたデータをオンデマンドで無効化する関数。

#### [`revalidateTag`](./functions/22-revalidateTag.md)

特定のタグに対してキャッシュされたデータを無効化する関数。

---

## クライアントサイドフック

### ナビゲーション

#### [`useRouter`](./functions/31-use-router.md)

クライアントコンポーネント内でプログラム的にルートを変更するフック。

**使用例**: `router.push('/dashboard')`でページ遷移

#### [`usePathname`](./functions/29-use-pathname.md)

現在のパス名を取得するフック。

### パラメータ・状態取得

#### [`useParams`](./functions/28-use-params.md)

動的ルートパラメータを取得するフック。

#### [`useSearchParams`](./functions/32-use-search-params.md)

URLクエリパラメータを取得するフック。

#### [`useSelectedLayoutSegment`](./functions/33-use-selected-layout-segment.md)

選択されたレイアウトセグメントを取得するフック。

#### [`useSelectedLayoutSegments`](./functions/34-use-selected-layout-segments.md)

選択されたレイアウトセグメントの配列を取得するフック。

### 状態管理

#### [`useLinkStatus`](./functions/27-use-link-status.md)

リンクの状態を取得するフック。

### パフォーマンス監視

#### [`useReportWebVitals`](./functions/30-use-report-web-vitals.md)

Web Vitalsメトリクスを報告するフック。パフォーマンス監視とアナリティクスに使用します。

---

## 使用上の注意点

### 非同期関数について

`cookies`と`headers`は非同期関数のため、`await`キーワードが必要です：

```typescript
// ✅ 正しい使用法
const cookieStore = await cookies();
const headersList = await headers();

// ❌ 間違った使用法
const cookieStore = cookies(); // Promiseオブジェクトが返される
```

### サーバー vs クライアント

- **サーバーサイド関数**: サーバーコンポーネント、サーバーアクション、ルートハンドラー、ミドルウェアで使用
- **クライアントサイドフック**: `'use client'`ディレクティブが必要なクライアントコンポーネントで使用

### 実験的機能

`unstable_`プレフィックスの関数は実験的機能のため、本番環境での使用は慎重に検討してください。

---

このドキュメントは、Next.js App Routerの主要な関数とフックの包括的なリファレンスです。各関数の詳細な使用方法やパラメータについては、個別のリンク先ドキュメントを参照してください。
