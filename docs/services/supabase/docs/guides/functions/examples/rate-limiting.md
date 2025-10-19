# Edge Functionsのレート制限

## コンテンツ

[Redis](https://redis.io/docs/about/)は、データベース、キャッシュ、メッセージブローカー、ストリーミングエンジンとして使用されるオープンソース（BSDライセンス）のインメモリデータ構造ストアです。値のインクリメントなどのアトミック操作に最適化されており、例えばビューカウンターやレート制限などに使用できます。Supabase AuthのユーザーIDに基づいてレート制限を行うこともできます！

[Upstash](https://upstash.com/)は、HTTP/RESTベースのRedisクライアントを提供しており、サーバーレスのユースケースに理想的であるため、Supabase Edge Functionsとよく連携します。

コードは[GitHub](https://github.com/supabase/supabase/tree/master/examples/edge-functions/supabase/functions/upstash-redis-ratelimit)で確認できます。

## 主なポイント

- Redisはアトミック操作に最適化されている
- Supabase AuthのユーザーIDに基づいてレート制限が可能
- Upstashはサーバーレスに適したRedisクライアントを提供
- サンプルコードはGitHubで利用可能

## メタデータ

- タイトル: "Edge Functionsのレート制限 | Supabase Docs"
- 説明: "Upstash Redisを使用したEdge Functionsのレート制限"

このコンテンツは、Supabase Edge FunctionsでRedisとUpstashを使用してレート制限を実装する方法の概要を提供しており、サーバーレスアーキテクチャとアトミック操作に焦点を当てています。
