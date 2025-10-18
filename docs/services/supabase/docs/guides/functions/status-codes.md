# ステータスコード

Edge Functionsから返されるHTTPステータスコードを理解して、問題を適切にデバッグし、レスポンスを処理します。

## 成功レスポンス

### 2XX Success
Edge Functionが正常に実行され、有効なレスポンスを返しました。これには、関数が明示的に返す200〜299の範囲のすべてのステータスコードが含まれます。

### 3XX Redirect
Edge Functionが`Response.redirect()` APIを使用して、クライアントを別のURLにリダイレクトしました。これは、認証フローやURL転送を実装する際の通常のレスポンスです。

## クライアントエラー
これらのエラーは、リクエスト自体の問題を示しており、通常は関数の呼び出し方法を変更する必要があります。

### 401 Unauthorized
**原因:** Edge FunctionでJWT検証が有効になっていますが、リクエストが無効または欠落したJWTトークンで行われました。

**解決策:**
- `Authorization`ヘッダーに有効なJWTトークンを渡していることを確認してください
- トークンの有効期限が切れていないか確認してください
- Webhookやパブリックエンドポイントの場合は、JWT検証を無効にすることを検討してください

### 404 Not Found
**原因:** リクエストされたEdge Functionが存在しないか、URLパスが正しくありません。

**解決策:**
- リクエストURLの関数名とプロジェクト参照を確認してください
- 関数が正常にデプロイされているか確認してください

### 405 Method Not Allowed
**原因:** サポートされていないHTTPメソッドを使用しています。Edge Functionsは次のメソッドのみをサポートします: `GET`、`POST`、`PUT`、`PATCH`、`DELETE`、`OPTIONS`。

**解決策:** サポートされているHTTPメソッドを使用するようにリクエストを更新してください。

## サーバーエラー
これらのエラーは、関数の実行または基盤となるプラットフォームの問題を示しています。

### 500 Internal Server Error
**原因:** Edge Functionがキャッチされない例外をスローしました（`WORKER_ERROR`）。

**一般的な原因:**
- 関数コード内の未処理のJavaScriptエラー
- 非同期操作のエラー処理の欠落
- 無効なJSON解析

**解決策:** Edge Functionのログを確認して特定のエラーを識別し、コードに適切なエラー処理を追加してください。

```javascript
// ✅ 適切なエラー処理
try {
  const result = await someAsyncOperation()
  return new Response(JSON.stringify(result))
} catch (error) {
  console.error('Function error:', error)
  return new Response('Internal error', { status: 500 })
}
```

### 503 Service Unavailable
**原因:** Edge Function の実行環境が一時的に利用できません。

**解決策:**
- リクエストを再試行してください
- 問題が続く場合は、Supabaseのステータスページを確認してください

### 504 Gateway Timeout
**原因:** Edge Functionが制限時間内にレスポンスを返しませんでした。

**解決策:**
- 関数の実行時間を最適化してください
- 長時間実行されるタスクにはバックグラウンドタスクの使用を検討してください
- 関数のタイムアウト制限を確認してください
