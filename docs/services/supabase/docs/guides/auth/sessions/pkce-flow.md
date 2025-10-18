# PKCE Flow（PKCEフロー）

## 概要

PKCE（Proof Key for Code Exchange）フローは、アクセストークンとリフレッシュトークンを受け取るための2つの認証方法のうちの1つです。ドキュメントに記載されているように：「このフローはSupabase Authによって処理される実装の詳細ですが、PKCEフローとImplicit Flowの違いを理解することは、クライアントのみの認証とサーバーサイド認証の違いを理解するために重要です。」

## 仕組み

検証が成功すると、ユーザーは`code`パラメータを含むURLにリダイレクトされます。このコードは、`exchangeCodeForSession(code)`を呼び出すことでアクセストークンと交換できます。

### 主な特徴

- 認証コードは5分間有効
- アクセストークンと交換できるのは1回のみ
- 新しいアクセストークンを取得するには、認証フローを再開する必要がある

## ストレージと設定

フローはサーバーサイドで実行されるため、`localStorage`が利用できない場合があります。ドキュメントでは、カスタムストレージアダプターの例を提供しています：

```typescript
const customStorageAdapter: SupportedStorage = {
    getItem: (key) => {
        if (!supportsLocalStorage()) {
            // 代替ストレージを設定
            return null
        }
        return globalThis.localStorage.getItem(key)
    },
    // setItemとremoveItemの追加メソッド
}
```

### クライアントライブラリの設定

ライブラリを次のように設定できます：

- カスタムストレージアダプターを使用
- `detectSessionInUrl`を`true`に設定して、自動的にコードをセッションと交換

## 制限事項

- コード交換にはコードベリファイアが必要
- フローが開始されたのと同じブラウザとデバイスで開始する必要がある

## リソース

- [OAuth 2.0 guide to PKCE flow](https://oauth.net/2/pkce/)
