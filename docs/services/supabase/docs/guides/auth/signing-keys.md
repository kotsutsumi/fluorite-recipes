# JWT署名鍵

Supabase AuthがJSON Web Tokenを作成および検証するために使用する鍵の管理に関するベストプラクティス

Supabase Authは、ユーザーがサインインしている限り、各ユーザーセッションに対して新しいJWTを継続的に発行します。JWT署名鍵は、アプリケーションのセキュリティにとって重要なこのプロセスをきめ細かく制御できます。

続行する前に、Authがユーザーのセッションのためにトークンを作成する方法の詳細については、[セッション](/docs/guides/auth/sessions)の包括的なガイドを確認してください。JWTの基本に慣れていない場合は、[JWT](/docs/guides/auth/jwts)を読んでください。

## 概要

JWTがSupabase Authによって発行されるとき、その[署名](https://en.wikipedia.org/wiki/Digital_signature)を作成するために使用される鍵は署名鍵として知られています。Supabaseは、署名鍵を扱うための2つのシステムを提供しています: JWT秘密鍵に基づくレガシーシステムと、新しい署名鍵システムです。

| システム | タイプ | 説明 |
|--------|------|-------------|
| レガシー | JWT秘密鍵 | 当初、SupabaseはすべてのJWTに署名するために単一の共有秘密鍵を使用するように設計されていました。これには、`anon`および`service_role`キー、すべてのユーザーアクセストークン、一部の[Storage事前署名URL](/docs/reference/javascript/storage-from-createsignedurl)が含まれます。**もはや推奨されません。**下位互換性のために利用可能です。 |
| 署名鍵 | 非対称鍵（RSA、楕円曲線） | 業界のベストプラクティスに従い、アプリケーションのセキュリティ、信頼性、パフォーマンスを大幅に向上させる[公開鍵暗号](https://en.wikipedia.org/wiki/Public-key_cryptography)（RSA、楕円曲線）に基づくJWT署名鍵。 |
| 署名鍵 | 共有秘密鍵 | [共有秘密鍵](https://en.wikipedia.org/wiki/HMAC)に基づくJWT署名鍵。 |

### 署名鍵システムの利点

レガシーシステムが抱えていた多くの問題に対処するために、署名鍵システムを設計しました。これは、[公開可能および秘密APIキー](/docs/guides/api/api-keys)と密接に連携しています。
