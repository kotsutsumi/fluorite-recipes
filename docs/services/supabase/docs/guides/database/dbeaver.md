# DBeaverでの接続

## 前提条件
- DBeaverを[公式サイト](https://dbeaver.io/download/)からダウンロード

## ステップバイステップガイド

### 1. 新しいデータベース接続を作成
- DBeaverを開く
- 新しいデータベース接続を開始

### 2. PostgreSQLを選択
- データベースタイプとしてPostgreSQLを選択

### 3. 認証情報を取得
Supabaseプロジェクトダッシュボードで:
- 「Connect」をクリック
- セッションプーラーの以下の情報をメモ:
  - Host（ホスト）
  - Username（ユーザー名）
- データベースパスワードを取得または生成

**注意**: 「IPv6環境にいる場合、またはIPv4アドオンを使用している場合は、セッションモードのSupavisorの代わりに直接接続文字列を使用できます。」

### 4. 認証情報を入力
DBeaverのメインメニューで:
- ホストを入力
- ユーザー名を入力
- パスワードを入力

### 5. SSL証明書をダウンロード
データベース設定で:
- SSL証明書をダウンロード

### 6. セキュアな接続
DBeaverのSSLタブで:
- ダウンロードしたSSL証明書を追加

### 7. 接続
- 接続をテスト
- 完了をクリック
- これでDBeaverでデータベースを操作できるようになります

[GitHubでこのページを編集](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/database/dbeaver.mdx)
