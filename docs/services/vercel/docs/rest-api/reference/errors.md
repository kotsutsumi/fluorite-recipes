# Vercel REST API - エラーリファレンス

Vercel REST APIで発生する可能性のあるエラーの包括的なリファレンスガイド。

## 📚 目次

- [汎用エラー](#汎用エラー)
- [デプロイメントエラー](#デプロイメントエラー)
- [ドメインエラー](#ドメインエラー)
- [DNSエラー](#dnsエラー)
- [OAuth2エラー](#oauth2エラー)

## 汎用エラー

すべてのエンドポイントで発生する可能性のある共通エラー。

### Forbidden (403)

```typescript
interface ForbiddenError {
  code: "forbidden";
  message: "Not authorized";
  cause: "ユーザートークンの欠如または未承認アクセス";
}
```

**原因**:
- 認証トークンが提供されていない
- トークンに必要な権限がない
- リソースへのアクセス権限がない

**解決方法**:
- 有効なトークンを提供
- トークンの権限スコープを確認
- リソースへのアクセス権を確認

### Rate Limited (429)

```typescript
interface RateLimitError {
  code: "rate_limited";
  message: string;
  remaining: number;      // 残りのリクエスト数
  reset: number;          // リセットタイムスタンプ
  limit: number;          // 合計制限数
  note: "The limit of request is per endpoint basis";
}
```

**原因**:
- エンドポイントごとの最大リクエスト数を超過

**解決方法**:
- `reset` タイムスタンプまで待機
- リクエストの頻度を減らす
- バックオフ戦略を実装

### Bad Request (400)

```typescript
interface BadRequestError {
  code: "bad_request";
  message: string;  // 具体的な問題の詳細を含む
  cause: "無効なリクエストパラメータ";
}
```

**原因**:
- 無効なリクエストパラメータ
- 必須フィールドの欠如
- 不正な形式のデータ

**解決方法**:
- リクエストパラメータを確認
- APIドキュメントを参照して正しい形式を確認

### Internal Server Error (500)

```typescript
interface InternalServerError {
  code: "internal_server_error";
  cause: "予期しないサーバー側の障害";
}
```

**原因**:
- サーバー側の予期しないエラー

**解決方法**:
- しばらく待ってから再試行
- 問題が続く場合はサポートに連絡

### Resource Not Found (404)

```typescript
interface NotFoundError {
  code: "not_found";
  message: "Could not find the RESOURCE: ID";
}
```

**原因**:
- 指定されたリソースが存在しない
- リソースIDが間違っている

**解決方法**:
- リソースIDを確認
- リソースが削除されていないか確認

### Method Unknown

```typescript
interface MethodUnknownError {
  code: "method_unknown";
  cause: "エンドポイントがHTTPメソッドをサポートしていない";
}
```

**原因**:
- サポートされていないHTTPメソッドの使用

**解決方法**:
- エンドポイントがサポートするHTTPメソッドを確認
- APIドキュメントを参照

## デプロイメントエラー

デプロイメント操作に関連するエラー。

### Missing Files

```typescript
interface MissingFilesError {
  code: "missing_files";
  missing: string[];  // 不足しているファイル参照の配列
}
```

**原因**:
- デプロイメントに必要なファイルが欠如

**解決方法**:
- すべての必要なファイルが含まれているか確認
- ファイルパスが正しいか確認

### No Files in Deployment

```typescript
interface NoFilesError {
  code: "no_files";
  cause: "空のデプロイメント試行";
}
```

**原因**:
- ファイルを含まないデプロイメント

**解決方法**:
- 少なくとも1つのファイルを含める

### 環境変数エラー

#### Too Many Keys

```typescript
interface EnvTooManyKeysError {
  code: "env_too_many_keys";
  limit: 100;
  message: "100変数の制限を超過";
}
```

**解決方法**:
- 環境変数の数を100以下に削減
- 不要な変数を削除

#### Invalid Characters

```typescript
interface EnvKeyInvalidCharactersError {
  code: "env_key_invalid_characters";
  allowedCharacters: "文字、数字、アンダースコアのみ";
}
```

**解決方法**:
- 変数名に許可された文字のみを使用
- 特殊文字を削除

#### Key Too Long

```typescript
interface EnvKeyInvalidLengthError {
  code: "env_key_invalid_length";
  maxLength: 256;
}
```

**解決方法**:
- 変数名を256文字以下にする

#### Value Too Long

```typescript
interface EnvValueInvalidLengthError {
  code: "env_value_invalid_length";
  maxLength: 65536;
}
```

**解決方法**:
- 変数値を65,536文字以下にする

#### Invalid Type - Missing UID

```typescript
interface EnvValueInvalidTypeMissingUidError {
  code: "env_value_invalid_type_missing_uid";
  cause: "オブジェクト値に必須のUIDがない";
}
```

**解決方法**:
- オブジェクト値に `uid` プロパティを含める

#### Invalid Type - Unknown Properties

```typescript
interface EnvValueInvalidTypeUnknownPropsError {
  code: "env_value_invalid_type_unknown_props";
  cause: "オブジェクトにサポートされていないプロパティが含まれている";
}
```

**解決方法**:
- サポートされているプロパティのみを使用
- APIドキュメントで許可されたプロパティを確認

#### Invalid Type

```typescript
interface EnvValueInvalidTypeError {
  code: "env_value_invalid_type";
  cause: "サポートされていないデータ型";
}
```

**解決方法**:
- サポートされているデータ型を使用
- 値を文字列または許可された型に変換

### シークレットアクセスエラー

#### Secret Forbidden

```typescript
interface EnvSecretForbiddenError {
  code: "env_secret_forbidden";
  cause: "シークレットへの不十分な権限";
}
```

**解決方法**:
- シークレットへのアクセス権限を確認
- 必要な権限を持つトークンを使用

#### Secret Missing

```typescript
interface EnvSecretMissingError {
  code: "env_secret_missing";
  cause: "参照されたシークレットが存在しない";
}
```

**解決方法**:
- シークレットが作成されているか確認
- シークレットIDが正しいか確認

## ドメインエラー

ドメイン管理に関連するエラー。

### アクセス問題

#### Forbidden

```typescript
interface DomainForbiddenError {
  code: "forbidden";
  cause: "ドメインが別のアカウント/チームに所有されている";
}
```

**解決方法**:
- ドメインの所有権を確認
- 正しいアカウント/チームコンテキストを使用

#### Not Found

```typescript
interface DomainNotFoundError {
  code: "not_found";
  cause: "ドメインがシステムに存在しない";
}
```

**解決方法**:
- ドメイン名を確認
- ドメインが追加されているか確認

#### Missing Name (URL)

```typescript
interface DomainMissingNameUrlError {
  code: "missing_name";
  cause: "URLからドメイン名が省略されている";
}
```

**解決方法**:
- URLにドメイン名を含める

### 変更エラー

#### Conflict Aliases

```typescript
interface ConflictAliasesError {
  code: "conflict_aliases";
  message: "ドメイン削除前にエイリアスを削除する必要がある";
}
```

**解決方法**:
- すべてのエイリアスを削除してからドメインを削除

#### Not Modified

```typescript
interface NotModifiedError {
  code: "not_modified";
  cause: "変更が不要";
}
```

**解決方法**:
- リクエストが必要か確認

#### Missing Name (Body)

```typescript
interface DomainMissingNameBodyError {
  code: "missing_name";
  cause: "リクエストボディに名前フィールドがない";
}
```

**解決方法**:
- リクエストボディに `name` フィールドを含める

#### Invalid Name

```typescript
interface InvalidNameError {
  code: "invalid_name";
  cause: "無効なドメイン形式";
}
```

**解決方法**:
- 有効なドメイン形式を使用

### 登録問題

#### Custom Domain Needs Upgrade

```typescript
interface CustomDomainNeedsUpgradeError {
  code: "custom_domain_needs_upgrade";
  cause: "プレミアムアカウントが必要";
}
```

**解決方法**:
- アカウントをアップグレード

#### Not Modified (Domain Exists)

```typescript
interface DomainExistsError {
  code: "not_modified";
  cause: "ドメインがすでに存在する";
}
```

#### Failed to Add Domain

```typescript
interface FailedToAddDomainError {
  code: "failed_to_add_domain";
  cause: "購入したがアカウントへの追加に失敗";
}
```

**解決方法**:
- サポートに連絡

#### Service Unavailable

```typescript
interface ServiceUnavailableError {
  code: "service_unavailable";
  cause: "価格を決定できない";
}
```

**解決方法**:
- しばらく待ってから再試行

#### Price Mismatch

```typescript
interface PriceMismatchError {
  code: "price_mismatch";
  cause: "予想価格が実際の価格と一致しない";
}
```

**解決方法**:
- 現在の価格を確認してから再試行

#### Not Available

```typescript
interface NotAvailableError {
  code: "not_available";
  cause: "ドメインが購入不可";
}
```

**解決方法**:
- 別のドメイン名を選択

#### Invalid Domain

```typescript
interface InvalidDomainError {
  code: "invalid_domain";
  cause: "ドメインまたはTLDがサポートされていない";
}
```

**解決方法**:
- サポートされているドメイン/TLDを使用

## DNSエラー

DNS設定に関連するエラー。

### Missing Name

```typescript
interface DNSMissingNameError {
  code: "missing_name";
  cause: "必須のnameパラメータがない";
}
```

**解決方法**:
- `name` パラメータを含める

### Missing Type

```typescript
interface DNSMissingTypeError {
  code: "missing_type";
  cause: "必須のtypeパラメータがない";
}
```

**解決方法**:
- `type` パラメータを含める（例: "A", "CNAME", "MX"）

## OAuth2エラー

OAuth2認証に関連するエラー。

### Not Found

```typescript
interface OAuth2NotFoundError {
  code: "not_found";
  cause: "クライアントIDが存在しないか無効";
}
```

**解決方法**:
- クライアントIDを確認
- OAuth2設定を確認

## エラーハンドリングのベストプラクティス

### 一般的な戦略

```typescript
async function apiCallWithErrorHandling() {
  try {
    const response = await vercel.deployments.create(config);
    return response;
  } catch (error) {
    switch (error.code) {
      case 'forbidden':
        console.error('権限エラー: トークンを確認してください');
        break;
      case 'rate_limited':
        const waitTime = error.reset - Date.now();
        console.log(`レート制限: ${waitTime}ms待機してください`);
        await sleep(waitTime);
        return apiCallWithErrorHandling(); // リトライ
      case 'bad_request':
        console.error('リクエストエラー:', error.message);
        break;
      case 'not_found':
        console.error('リソースが見つかりません');
        break;
      case 'internal_server_error':
        console.error('サーバーエラー: 後で再試行してください');
        break;
      default:
        console.error('予期しないエラー:', error);
    }
    throw error;
  }
}
```

### リトライロジック

```typescript
async function retryableAPICall<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  backoff: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.code === 'rate_limited' && i < maxRetries - 1) {
        const waitTime = error.reset - Date.now();
        await sleep(Math.max(waitTime, backoff * Math.pow(2, i)));
        continue;
      }
      if (error.code === 'internal_server_error' && i < maxRetries - 1) {
        await sleep(backoff * Math.pow(2, i));
        continue;
      }
      throw error;
    }
  }
  throw new Error('最大リトライ回数に到達しました');
}
```

## 関連リンク

- [Vercel REST API - ウェルカム](/docs/services/vercel/docs/rest-api/reference/welcome.md)
- [Vercel REST API - SDK](/docs/services/vercel/docs/rest-api/reference/sdk.md)
- [公式ドキュメント](https://vercel.com/docs/rest-api/reference/errors)
