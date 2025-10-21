# カスタムアクセストークンフック

## 概要

Supabase Auth のカスタムアクセストークンフックにより、開発者はトークンが発行される前にアクセストークンをカスタマイズできます。主な機能は以下の通りです：

### 目的

- トークンが発行される前に実行されます
- 認証方法に基づいて追加のクレームを追加できます
- Supabase のクレーム仕様に準拠する必要があります

### トークンクレーム

**必須クレーム**：

- `iss`
- `aud`
- `exp`
- `iat`
- `sub`
- `role`
- `aal`
- `session_id`
- `email`
- `phone`
- `is_anonymous`

**オプションクレーム**：

- `jti`
- `nbf`
- `app_metadata`
- `user_metadata`
- `amr`

### フック入力

- `user_id`: 一意のユーザー識別子
- `claims`: 現在のトークンクレーム
- `authentication_method`: 認証に使用された方法（例：`oauth`、`password`、`anonymous`）

### ユースケース

1. サーバーサイドレンダリング用にJWTサイズを削減
2. 管理者ロールを追加
3. SSOユーザーへのアクセスを制限
4. カスタムメタデータクレームを追加

### 例（最小限のJWT削減）

```sql
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
as $$
  declare
    original_claims jsonb;
    new_claims jsonb;
    claim text;
  begin
    original_claims = event->'claims';
    new_claims = '{}'::jsonb;

    foreach claim in array array[
      'iss', 'aud', 'exp', 'iat', 'sub',
      'role', 'aal', 'session_id',
      'email', 'phone', 'is_anonymous'
    ] loop
      if original_claims ? claim then
        new_claims = jsonb_set(new_claims, array[claim], original_claims->claim);
      end if;
    end loop;

    return jsonb_build_object('claims', new_claims);
  end;
$$;
```

この関数は、必須クレームのみを含む最小限のアクセストークンを作成する方法を示しています。

### 管理者ロールの追加例

```sql
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
as $$
  declare
    claims jsonb;
    is_admin boolean;
  begin
    -- ユーザーのメタデータから管理者フラグを確認
    select (raw_user_meta_data->>'is_admin')::boolean into is_admin
    from auth.users
    where id = (event->>'user_id')::uuid;

    claims = event->'claims';

    if is_admin then
      claims = jsonb_set(claims, '{role}', '"admin"');
    end if;

    return jsonb_build_object('claims', claims);
  end;
$$;
```

### SSOユーザーのアクセス制限

```sql
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
as $$
  declare
    claims jsonb;
    auth_method text;
  begin
    auth_method = event->>'authentication_method';
    claims = event->'claims';

    -- OAuth以外の方法でのアクセスを制限
    if auth_method != 'oauth' then
      raise exception 'SSO経由でのみアクセスが許可されています';
    end if;

    return jsonb_build_object('claims', claims);
  end;
$$;
```

## 重要な注意事項

- フックは高速に実行される必要があります（推奨：100ms未満）
- フックでエラーが発生すると、トークンの発行が失敗します
- すべての必須クレームを含める必要があります
- クレームのサイズ制限に注意してください（JWTは通常4KB以下に保つべきです）
