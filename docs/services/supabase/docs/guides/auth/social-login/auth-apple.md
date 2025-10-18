# Appleでログイン

## 概要

Supabaseは以下の環境で「Sign in with Apple」をサポートしています：
- Webアプリケーション
- ネイティブアプリ（iOS、macOS、watchOS、tvOS）

### 認証方法

1. Web/Webベースアプリ：
   - Supabase Auth経由のOAuthフロー
   - Sign in with Apple JS（クラシックなWebサイトに推奨）

2. ネイティブアプリ：
   - AppleのAuthentication Services

## Web OAuthフローの実装

### 基本的なサインインコード

```javascript
supabase.auth.signInWithOAuth({
  provider: 'apple'
})
```

### 設定要件

以下が必要です：
1. Apple DeveloperアカウントのTeam ID
2. 登録されたメールソース
3. App ID
4. Services ID
5. 設定されたWebサイトURL
6. 署名キー
7. ダッシュボード設定

## Sign in with Apple JSメソッド

```javascript
// ユーザーの同意後にトークンを取得
await supabase.auth.signInWithIdToken({
  provider: 'apple',
  token: data.id_token,
  nonce: '<nonce used in AppleID.auth.init>'
})
```

## 重要な考慮事項

- Apple Developerアカウントを取得する
- App IDとServices IDを設定する
- 認証キーを安全に管理する
- 6ヶ月ごとにシークレットキーを再生成する

このガイドは、SupabaseでApple認証を実装するためのプラットフォーム固有の包括的な手順を提供します。
