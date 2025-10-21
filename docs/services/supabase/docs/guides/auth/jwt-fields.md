# JWTクレームリファレンス

## 概要
このドキュメントは、Supabase認証トークンで使用されるJWT（JSON Web Token）クレームの包括的なリファレンスを提供します。構造、必須および任意のクレームをカバーし、異なるプログラミング言語での実装のガイダンスを提供します。

## JWT構造
Supabase JWTは3つの部分で構成されています:
1. **ヘッダー**: アルゴリズムとキー情報を含む
2. **ペイロード**: クレーム（ユーザーデータとメタデータ）を含む
3. **署名**: 暗号化検証

## 必須クレーム

| フィールド | 型 | 説明 | 例 |
|-------|------|-------------|---------|
| `iss` | `string` | JWTの発行者 | `"https://project-ref.supabase.co/auth/v1"` |
| `aud` | `string/array` | 想定される受信者 | `"authenticated"` または `"anon"` |
| `exp` | `number` | トークン有効期限タイムスタンプ | `1640995200` |
| `iat` | `number` | トークン発行タイムスタンプ | `1640991600` |
| `sub` | `string` | ユーザーID（UUID） | `"123e4567-e89b-12d3-a456-426614174000"` |
| `role` | `string` | ユーザーのシステムロール | `"authenticated"`, `"anon"`, `"service_role"` |
| `aal` | `string` | 認証強度 | `"aal1"`, `"aal2"` |
| `session_id` | `string` | 一意のセッション識別子 | `"session-uuid"` |
| `email` | `string` | ユーザーのメール | `"user@example.com"` |
| `phone` | `string` | ユーザーの電話番号 | `"+1234567890"` |
| `is_anonymous` | `boolean` | 匿名ユーザーフラグ | `false` |

## 任意のクレーム

| フィールド | 型 | 説明 | 例 |
|-------|------|-------------|---------|
| `jti` | `string` | 一意のJWT識別子 | `"jwt-uuid"` |
