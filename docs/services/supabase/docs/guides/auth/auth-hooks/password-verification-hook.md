# パスワード検証フック

## 概要

パスワード検証フックにより、企業はデフォルトのSupabase実装を超えて認証セキュリティを強化できます。主な目的は以下の通りです：

- パスワードサインイン試行のステータスを追跡
- メール送信やログイン制限などのアクションを実行
- カスタムセキュリティとコンプライアンス要件を実装

## 重要な考慮事項

「このフックは認証されていないリクエストで実行されるため、悪意のあるユーザーが複数回呼び出すことでフックを悪用する可能性があります。」

推奨事項：

- 追加のアクションを実行する前にパスワードの有効性を確認
- ユーザーをブロックするよりも通知の送信を優先

## 入力

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `user_id` | `string` | サインインを試みているユーザーの一意の識別子 |
| `valid` | `boolean` | パスワード検証試行が有効かどうか |

## 出力

フックがエラーなしで入力を処理した場合に返されます：

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `decision` | `string` | 認証アクション：`reject` または `continue` |
| `message` | `string` | 拒否された場合のユーザー向けメッセージ |
| `should_logout_user` | `boolean` | 拒否時にユーザーをログアウトするかどうか |

## ユースケース例

### パスワード失敗試行を制限

パスワードの誤入力を追跡するテーブルを作成：

```sql
create table public.password_failed_verification_attempts (
  user_id uuid not null,
  failed_attempts int not null default 0,
  last_failed_at timestamp not null default now(),
  locked_until timestamp,
  primary key (user_id)
);

-- インデックスの作成
create index idx_password_failed_attempts_user
on public.password_failed_verification_attempts(user_id);

create index idx_password_locked_until
on public.password_failed_verification_attempts(locked_until)
where locked_until is not null;
```

### パスワード検証フックの実装

```sql
create or replace function public.password_verification_hook(event jsonb)
returns jsonb
language plpgsql
security definer
as $$
  declare
    failed_count int;
    max_attempts int := 5;
    lockout_duration interval := interval '30 minutes';
    locked_until_time timestamp;
  begin
    -- ロックアウト状態を確認
    select locked_until into locked_until_time
    from public.password_failed_verification_attempts
    where user_id = (event->>'user_id')::uuid;

    -- ユーザーがロックアウトされているか確認
    if locked_until_time is not null and locked_until_time > now() then
      return jsonb_build_object(
        'decision', 'reject',
        'message', 'アカウントが一時的にロックされています。' ||
                   to_char(locked_until_time, 'YYYY-MM-DD HH24:MI:SS') ||
                   ' 以降に再試行してください。',
        'should_logout_user', true
      );
    end if;

    -- 無効なパスワードの場合
    if (event->>'valid')::boolean = false then
      -- 失敗カウントを更新
      insert into public.password_failed_verification_attempts
        (user_id, failed_attempts, last_failed_at)
      values (
        (event->>'user_id')::uuid,
        1,
        now()
      )
      on conflict (user_id)
      do update set
        failed_attempts = password_failed_verification_attempts.failed_attempts + 1,
        last_failed_at = now();

      -- 更新された失敗回数を取得
      select failed_attempts into failed_count
      from public.password_failed_verification_attempts
      where user_id = (event->>'user_id')::uuid;

      -- 最大試行回数に達した場合、アカウントをロック
      if failed_count >= max_attempts then
        update public.password_failed_verification_attempts
        set locked_until = now() + lockout_duration
        where user_id = (event->>'user_id')::uuid;

        return jsonb_build_object(
          'decision', 'reject',
          'message', 'パスワードの試行回数が多すぎます。アカウントは30分間ロックされます。',
          'should_logout_user', true
        );
      end if;

      -- まだ最大回数に達していない場合
      return jsonb_build_object(
        'decision', 'continue',
        'message', format('パスワードが正しくありません。残り %s 回試行できます。',
                          max_attempts - failed_count)
      );
    else
      -- 成功した検証の場合、失敗カウンタとロックをリセット
      update public.password_failed_verification_attempts
      set failed_attempts = 0,
          locked_until = null
      where user_id = (event->>'user_id')::uuid;
    end if;

    -- デフォルトの動作を続行
    return jsonb_build_object('decision', 'continue');
  end;
$$;
```

### メール通知の送信

不審なログイン試行をユーザーに通知する代替アプローチ：

```sql
create or replace function public.password_verification_hook(event jsonb)
returns jsonb
language plpgsql
security definer
as $$
  declare
    user_email text;
    failed_count int;
  begin
    -- 無効なパスワードの場合のみ通知
    if (event->>'valid')::boolean = false then
      -- ユーザーのメールアドレスを取得
      select email into user_email
      from auth.users
      where id = (event->>'user_id')::uuid;

      -- 失敗回数をカウント
      insert into public.password_failed_verification_attempts
        (user_id, failed_attempts, last_failed_at)
      values (
        (event->>'user_id')::uuid,
        1,
        now()
      )
      on conflict (user_id)
      do update set
        failed_attempts = password_failed_verification_attempts.failed_attempts + 1,
        last_failed_at = now();

      -- 最近の失敗回数を取得
      select failed_attempts into failed_count
      from public.password_failed_verification_attempts
      where user_id = (event->>'user_id')::uuid;

      -- 3回以上の失敗でメール通知を送信
      if failed_count >= 3 then
        -- pg_netを使用してメール送信APIを呼び出す
        perform net.http_post(
          url := 'https://api.resend.com/emails',
          headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || current_setting('app.settings.resend_api_key')
          ),
          body := jsonb_build_object(
            'from', 'security@yourdomain.com',
            'to', user_email,
            'subject', 'セキュリティアラート：不審なログイン試行',
            'html', format(
              '<p>お客様のアカウントで%s回の失敗したログイン試行が検出されました。</p>' ||
              '<p>これがお客様ご自身でない場合は、すぐにパスワードを変更してください。</p>',
              failed_count
            )
          )
        );
      end if;
    else
      -- 成功した検証の場合、カウンタをリセット
      delete from public.password_failed_verification_attempts
      where user_id = (event->>'user_id')::uuid;
    end if;

    return jsonb_build_object('decision', 'continue');
  end;
$$;
```

### HTTP実装例

```typescript
// Supabase Edge Function
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 30 * 60 * 1000 // 30分

serve(async (req) => {
  const payload = await req.json()
  const { user_id, valid } = payload

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 失敗試行を確認
  const { data: attempt } = await supabase
    .from('password_failed_verification_attempts')
    .select('*')
    .eq('user_id', user_id)
    .single()

  // ロックアウト確認
  if (attempt?.locked_until && new Date(attempt.locked_until) > new Date()) {
    return new Response(
      JSON.stringify({
        decision: 'reject',
        message: `アカウントがロックされています。${attempt.locked_until}以降に再試行してください。`,
        should_logout_user: true
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (!valid) {
    const newFailedAttempts = (attempt?.failed_attempts || 0) + 1

    if (newFailedAttempts >= MAX_ATTEMPTS) {
      // アカウントをロック
      const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS)
      await supabase
        .from('password_failed_verification_attempts')
        .upsert({
          user_id,
          failed_attempts: newFailedAttempts,
          last_failed_at: new Date().toISOString(),
          locked_until: lockedUntil.toISOString()
        })

      return new Response(
        JSON.stringify({
          decision: 'reject',
          message: 'パスワードの試行回数が多すぎます。アカウントは30分間ロックされます。',
          should_logout_user: true
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 失敗回数を更新
    await supabase
      .from('password_failed_verification_attempts')
      .upsert({
        user_id,
        failed_attempts: newFailedAttempts,
        last_failed_at: new Date().toISOString()
      })
  } else {
    // 成功時にリセット
    await supabase
      .from('password_failed_verification_attempts')
      .delete()
      .eq('user_id', user_id)
  }

  return new Response(
    JSON.stringify({ decision: 'continue' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
})
```

## ベストプラクティス

1. **段階的な対応**: すぐにブロックするのではなく、警告から始める
2. **ユーザー通知**: 不審な活動についてユーザーに通知
3. **監査ログ**: すべての試行を記録して分析
4. **IP追跡**: 同一IPからの複数アカウント攻撃を検出（オプション）
5. **管理者ツール**: アカウントロックを手動で解除する機能を提供
6. **クリーンアップ**: 古い記録を定期的に削除

## セキュリティ考慮事項

- **タイミング攻撃**: レスポンス時間を一定に保つ
- **列挙攻撃**: 存在しないユーザーに対しても同じ動作を維持
- **分散攻撃**: 複数のIPアドレスからの攻撃を検出
- **権限管理**: フック関数に適切な権限を設定
