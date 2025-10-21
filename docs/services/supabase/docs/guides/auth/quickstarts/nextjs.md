# Next.jsでSupabase Authを使用する

Next.js App Router用にSupabase Authを設定する方法を学びます。

## 1. 新しいSupabaseプロジェクトを作成する

[database.new](https://database.new)にアクセスして、新しいSupabaseプロジェクトを作成します。

新しいデータベースには、ユーザーを保存するためのテーブルがあります。これは、SQL Editorで以下のSQLを実行することで確認できます:

```sql
select * from auth.users;
```

## 2. Next.jsアプリを作成する

`create-next-app`コマンドに`with-supabase`テンプレートを使用して、事前設定されたNext.jsアプリを作成します:

```bash
npx create-next-app -e with-supabase
```

このテンプレートには以下が含まれています:
- Cookie ベースの認証
- TypeScript
- Tailwind CSS

## 3. Supabase環境変数を宣言する

`.env.example`を`.env.local`にリネームし、プロジェクトのURLとキーを設定します:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_... or anon key
```

### APIキーの変更について

「Supabaseはプロジェクトのセキュリティと開発者エクスペリエンスを向上させるために、キーの仕組みを変更しています。」移行期間中は、以下を使用できます:
- レガシーキー: `anon` と `service_role`
- 新しいパブリッシャブルキー: `sb_publishable_xxx`

## 4. アプリを起動する

開発サーバーを起動します:

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)にアクセスすると、`app/page.tsx`の内容が表示されます。

新しいユーザーをサインアップするには、[http://localhost:3000/sign-up](http://localhost:3000/sign-up)に移動して「Sign up」をクリックします。

## さらに学ぶ

- [Next.js向けサーバーサイド認証の設定](/docs/guides/auth/server-side/nextjs)
- [Supabase Authドキュメント](/docs/guides/auth#authentication)
