# GitLabでログイン | Supabase ドキュメント

## 概要

SupabaseプロジェクトにGitLab認証を設定するには、主に3つのステップがあります。

1. GitLab上でGitLabアプリケーションを作成・設定する
2. SupabaseプロジェクトにGitLabアプリケーションキーを追加する
3. Supabase JSクライアントアプリにログインコードを追加する

## 前提条件

- GitLabアカウント
- Supabaseプロジェクト

## ステップバイステップガイド

### GitLabアカウントにアクセスする

1. `gitlab.com`にアクセス
2. 右上の「Login」をクリック

### コールバックURLを確認する

コールバックURLは次のような形式になります: `https://<project-ref>.supabase.co/auth/v1/callback`

確認方法:
1. Supabaseプロジェクトダッシュボードにアクセス
2. サイドバーの「Authentication」をクリック
3. 「Providers」をクリック
4. 「GitLab」を選択し、コールバックURLをコピー

### GitLabアプリケーションを作成する

1. プロフィールアバターをクリック
2. 「Edit profile」を選択
3. サイドバーの「Applications」に移動
4. アプリケーション名を入力
5. コールバックURLを追加
6. 「Confidential」にチェック
7. 「read_user」スコープを選択
8. 「Save Application」をクリック
9. 「Application ID」と「Secret」をコピー

### Supabaseを設定する

1. Supabaseプロジェクトダッシュボードにアクセス
2. 「Authentication」をクリック
3. 「Providers」に移動
4. GitLabを有効化
5. Client IDとClient Secretを入力
6. 「Save」をクリック

### ログインコードを追加する

JavaScriptの例:
```javascript
async function signInWithGitLab() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'gitlab'
  })
}
```

### サインアウト

```javascript
async function signOut() {
  const { error } = await supabase.auth.signOut()
}
```

## リソース

- [Supabase - 無料で始める](https://supabase.com)
- [Supabase JSクライアント](https://github.com/supabase/supabase-js)
- [GitLab](https://gitlab.com)
