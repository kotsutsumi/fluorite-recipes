# ユーザー管理

## 概要
Supabaseでユーザー情報を表示、削除、エクスポートします。

## ユーザーの表示
ユーザーは2つの主な場所で表示できます:
- ダッシュボードの「Users ページ」
- 「Table Editor」でAuthスキーマの内容を表示

## API経由でのユーザーデータへのアクセス

### 重要なセキュリティ注意事項
「セキュリティのため、Authスキーマは自動生成されるAPIには公開されていません。」ユーザーデータにアクセスするには、以下を行う必要があります:
1. `public`スキーマにユーザーテーブルを作成
2. 行レベルセキュリティを有効化
3. `auth.users`テーブルを参照

### プロファイルテーブル作成の例
```sql
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  first_name text,
  last_name text,
  primary key (id)
);

alter table public.profiles enable row level security;
```

### 警告
- 外部キー参照には主キーのみを使用してください
- Supabaseによって管理されている列は「いつでも変更される可能性があります」

## ユーザーメタデータの追加

### メタデータ付きサインアップ
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'valid.email@supabase.io',
  password: 'example-password',
  options: {
    data: {
      first_name: 'John',
      age: 27,
    },
  },
})
```

メタデータは`auth.users`の`raw_user_meta_data`列に保存されます。

## ユーザーメタデータの取得
```javascript
const {
  data: { user },
} = await supabase.auth.getUser()
let metadata = user?.user_metadata
```

## ユーザーの削除
- 直接、または管理コンソール経由で実行可能
- `auth.users`から削除してもユーザーは自動的にサインアウトされません
- Storageオブジェクトを持つユーザーは削除できません

## ユーザーのエクスポート
SQLエディター経由で`auth.users`と`auth.identities`テーブルをクエリし、CSVとしてエクスポートします。

## 追加の注意事項
- トリガーを徹底的にテストして、サインアップをブロックしないようにしてください
- Supabase管理のデータベースオブジェクトを参照する際は注意が必要です
