# データベースのセットアップ

ダッシュボードでの作業を続ける前に、いくつかのデータが必要です。この章では、[Vercelのマーケットプレイス統合](https://vercel.com/marketplace?category=storage)の一つからPostgreSQLデータベースをセットアップします。PostgreSQLに既に精通していて、独自のデータベースプロバイダーを使用したい場合は、この章をスキップして独自にセットアップできます。そうでなければ、続けましょう！

この章では...

ここで扱うトピックは次のとおりです

- プロジェクトをGitHubにプッシュする
- Vercelアカウントをセットアップし、GitHubレポジトリをリンクしてインスタントプレビューとデプロイメントを行う
- プロジェクトをPostgresデータベースに作成してリンクする
- データベースに初期データをシードする

## GitHubリポジトリの作成

まず、まだ行っていない場合は、リポジトリをGitHubにプッシュしましょう。これにより、データベースのセットアップとデプロイが簡単になります。

リポジトリのセットアップに助けが必要な場合は、[GitHubのこのガイド](https://help.github.com/en/github/getting-started-with-github/create-a-repo)をご覧ください。

> **知っておくべきこと:**
>
> • GitLabやBitbucketなどの他のgitプロバイダーも使用できます。
> • GitHubが初めての場合は、簡素化された開発ワークフローのために[GitHub Desktop App](https://desktop.github.com/)をお勧めします。

## Vercelアカウントの作成

[vercel.com/signup](https://vercel.com/signup)にアクセスしてアカウントを作成します。無料の「hobby」プランを選択してください。「Continue with GitHub」を選択して、GitHubとVercelアカウントを接続します。

## プロジェクトの接続とデプロイ

次に、この画面に移動し、作成したばかりのGitHubリポジトリを選択してインポートできます：

![Vercelダッシュボードのスクリーンショット、ユーザーのGitHubリポジトリのリストとともにインポートプロジェクト画面を表示](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fimport-git-repo.png&w=1920&q=75)

プロジェクトに名前を付けて「Deploy」をクリックします。

![プロジェクト名フィールドとデプロイボタンを表示するデプロイメント画面](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fconfigure-project.png&w=1920&q=75)

やりました！🎉 プロジェクトがデプロイされました。

![プロジェクト名、ドメイン、デプロイメント状況を表示するプロジェクト概要画面](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fdeployed-project.png&w=1920&q=75)

GitHubリポジトリを接続することで、メインブランチに変更をプッシュするたびに、Vercelは設定不要でアプリケーションを自動的に再デプロイします。プルリクエストを開くときは、デプロイメントエラーを早期にキャッチし、チームメンバーとフィードバックのためにプロジェクトのプレビューを共有できる[インスタントプレビューURL](https://vercel.com/docs/deployments/environments#preview-environment-pre-production#preview-urls)も利用できます。

## Postgresデータベースの作成

次に、データベースをセットアップするために、「Continue to Dashboard」をクリックして、プロジェクトダッシュボードから「Storage」タブを選択します。「Create Database」を選択します。Vercelアカウントが作成された時期によって、NeonやSupabaseなどのオプションが表示される場合があります。お好みのプロバイダーを選択して「Continue」をクリックします。

![Postgres オプションと KV、Blob、Edge Config を表示するConnect Store画面](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fcreate-database.png&w=1920&q=75)

必要に応じて、リージョンとストレージプランを選択します。すべてのVercelプロジェクトの[デフォルトリージョン](https://vercel.com/docs/functions/configuring-functions/region)はワシントンD.C（iad1）で、データリクエストの[レイテンシ](https://developer.mozilla.org/en-US/docs/Web/Performance/Understanding_latency)を削減するために、利用可能な場合はこれを選択することをお勧めします。

![データベース名とリージョンを表示するデータベース作成モーダル](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fdatabase-region.png&w=1920&q=75)

接続したら、`.env.local` タブに移動し、「Show secret」をクリックして「Copy Snippet」をクリックします。コピーする前にシークレットを必ず表示してください。

![隠されたデータベースシークレットを表示する.env.localタブ](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Fdatabase-dashboard.png&w=1920&q=75)

コードエディタに移動し、`.env.example` ファイルを `.env` に名前を変更します。Vercelからコピーした内容を貼り付けます。

> **重要:** `.gitignore` ファイルに移動し、`.env` が無視されるファイルに含まれていることを確認して、GitHubにプッシュする際にデータベースシークレットが公開されないようにしてください。

## データベースのシード

データベースが作成されたので、初期データでシードしましょう。

データベースに初期データセットを入力するシードスクリプトを実行する、ブラウザでアクセスできるAPIを含めています。

スクリプトはSQLを使用してテーブルを作成し、作成後に `placeholder-data.ts` ファイルのデータでそれらを入力します。

`pnpm run dev` でローカル開発サーバーが実行されていることを確認し、ブラウザで [localhost:3000/seed](http://localhost:3000/seed) に移動してください。完了すると、ブラウザに「Database seeded successfully」というメッセージが表示されます。完了したら、このファイルを削除できます。

> **トラブルシューティング:**
>
> • `.env` ファイルにコピーする前に、データベースシークレットを必ず表示してください。
> • スクリプトは `bcrypt` を使用してユーザーのパスワードをハッシュ化します。`bcrypt` がお使いの環境と互換性がない場合は、代わりに [bcryptjs](https://www.npmjs.com/package/bcryptjs) を使用するようにスクリプトを更新できます。
> • データベースのシード中に問題が発生し、スクリプトを再実行したい場合は、データベースクエリインターフェースで `DROP TABLE tablename` を実行して既存のテーブルを削除できます。詳細については、以下のクエリ実行セクションを参照してください。ただし、このコマンドはテーブルとそのすべてのデータを削除するため、注意してください。プレースホルダーデータを使用しているサンプルアプリでは問題ありませんが、本番アプリでこのコマンドを実行すべきではありません。

## クエリの実行

すべてが期待通りに動作していることを確認するために、クエリを実行してみましょう。別のRouter Handler `app/query/route.ts` を使用してデータベースにクエリを実行します。このファイル内には、以下のSQLクエリを持つ `listInvoices()` 関数があります。

```sql
SELECT invoices.amount, customers.name
FROM invoices
JOIN customers ON invoices.customer_id = customers.id
WHERE invoices.amount = 666;
```

ファイルのコメントアウトを解除し、`Response.json()` ブロックを削除して、ブラウザで [localhost:3000/query](http://localhost:3000/query) に移動してください。invoice の `amount` と `name` が返されることが確認できるはずです。

## 第6章を完了しました

データベースがセットアップされ統合されたので、アプリケーションの構築を続けることができます。

次は

**第7章：データの取得**

API、SQL、代替手段を含む、データベースからデータを取得するさまざまな方法について説明しましょう。

[第7章を開始](https://nextjs.org/learn/dashboard-app/fetching-data)
