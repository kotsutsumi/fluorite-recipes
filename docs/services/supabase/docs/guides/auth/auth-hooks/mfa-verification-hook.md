# MFA検証フック

## 概要

フックを使用して、Supabase MFA実装に追加のチェックを追加できます。例は以下の通りです：

- 検証試行の頻度を制限
- 無効な試行が多すぎるユーザーをサインアウト
- サインインのカウント、レート制限、または禁止

## 入力

Supabase Auth は以下のフィールドを含むペイロードを送信します：

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `factor_id` | `string` | 検証されているMFA要素の一意の識別子 |
| `factor_type` | `string` | `totp` または `phone` |
| `user_id` | `string` | ユーザーの一意の識別子 |
| `valid` | `boolean` | 検証試行が有効か（コードが正しい/間違っている） |

## 出力

フックがエラーなしで入力を処理した場合、以下を返します：

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `decision` | `string` | 認証決定：`reject`（ログアウト）または `continue`（デフォルト動作） |
| `message` | `string` | 決定が `reject` の場合のユーザーメッセージ |

## SQL実装例

### 追跡テーブルの作成

```sql
create table public.mfa_failed_verification_attempts (
  user_id uuid not null,
  factor_id uuid not null,
  failed_attempts int not null default 0,
  last_failed_at timestamp not null default now(),
  primary key (user_id, factor_id)
);

-- インデックスの作成
create index idx_mfa_failed_attempts_user
on public.mfa_failed_verification_attempts(user_id);
```

### 検証フックの作成

以下の例では、MFA検証試行を2秒に1回に制限し、急速な繰り返し試行を追跡して潜在的に拒否します。

```sql
create or replace function public.mfa_verification_hook(event jsonb)
returns jsonb
language plpgsql
security definer
as $$
  declare
    last_attempt timestamp;
    failed_count int;
    max_attempts int := 5;
    lockout_duration interval := interval '15 minutes';
  begin
    -- 無効な試行の場合のみ処理
    if (event->>'valid')::boolean = false then
      -- 最後の失敗試行時刻を取得
      select last_failed_at, failed_attempts
      into last_attempt, failed_count
      from public.mfa_failed_verification_attempts
      where user_id = (event->>'user_id')::uuid
        and factor_id = (event->>'factor_id')::uuid;

      -- レート制限チェック（2秒以内の再試行を防止）
      if last_attempt is not null
         and now() - last_attempt < interval '2 seconds' then
        return jsonb_build_object(
          'decision', 'reject',
          'message', '試行が早すぎます。しばらくしてから再度お試しください。'
        );
      end if;

      -- 失敗回数をカウント
      insert into public.mfa_failed_verification_attempts
        (user_id, factor_id, failed_attempts, last_failed_at)
      values (
        (event->>'user_id')::uuid,
        (event->>'factor_id')::uuid,
        1,
        now()
      )
      on conflict (user_id, factor_id)
      do update set
        failed_attempts = mfa_failed_verification_attempts.failed_attempts + 1,
        last_failed_at = now();

      -- 更新された失敗回数を取得
      select failed_attempts into failed_count
      from public.mfa_failed_verification_attempts
      where user_id = (event->>'user_id')::uuid
        and factor_id = (event->>'factor_id')::uuid;

      -- 最大試行回数を超えた場合
      if failed_count >= max_attempts then
        -- ロックアウト期間を確認
        if last_attempt is not null
           and now() - last_attempt < lockout_duration then
          return jsonb_build_object(
            'decision', 'reject',
            'message', '試行回数が多すぎます。15分後に再度お試しください。'
          );
        else
          -- ロックアウト期間が過ぎたらカウンタをリセット
          update public.mfa_failed_verification_attempts
          set failed_attempts = 1,
              last_failed_at = now()
          where user_id = (event->>'user_id')::uuid
            and factor_id = (event->>'factor_id')::uuid;
        end if;
      end if;
    else
      -- 成功した検証の場合、失敗カウンタをリセット
      delete from public.mfa_failed_verification_attempts
      where user_id = (event->>'user_id')::uuid
        and factor_id = (event->>'factor_id')::uuid;
    end if;

    -- デフォルトの動作を続行
    return jsonb_build_object('decision', 'continue');
  end;
$$;
```

### クリーンアップジョブの作成（オプション）

古い試行記録を定期的に削除するジョブを作成：

```sql
create or replace function public.cleanup_old_mfa_attempts()
returns void
language plpgsql
as $$
  begin
    delete from public.mfa_failed_verification_attempts
    where last_failed_at < now() - interval '30 days';
  end;
$$;

-- pg_cronを使用して毎日実行
select cron.schedule(
  'cleanup-old-mfa-attempts',
  '0 2 * * *', -- 毎日午前2時
  'select public.cleanup_old_mfa_attempts();'
);
```

## HTTP実装例

```typescript
// Supabase Edge Function
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const payload = await req.json()
  const { user_id, factor_id, valid } = payload

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  if (!valid) {
    // 失敗試行を記録
    const { data: attempt } = await supabase
      .from('mfa_failed_verification_attempts')
      .select('*')
      .eq('user_id', user_id)
      .eq('factor_id', factor_id)
      .single()

    // レート制限チェック
    if (attempt) {
      const timeSinceLastAttempt = Date.now() - new Date(attempt.last_failed_at).getTime()
      if (timeSinceLastAttempt < 2000) { // 2秒
        return new Response(
          JSON.stringify({
            decision: 'reject',
            message: '試行が早すぎます。しばらくしてから再度お試しください。'
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }
  } else {
    // 成功時にカウンタをリセット
    await supabase
      .from('mfa_failed_verification_attempts')
      .delete()
      .eq('user_id', user_id)
      .eq('factor_id', factor_id)
  }

  return new Response(
    JSON.stringify({ decision: 'continue' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
})
```

## ベストプラクティス

1. **適切なレート制限**: 正当なユーザーを締め出さないように、バランスの取れたレート制限を設定
2. **明確なエラーメッセージ**: ユーザーに次のステップを明確に伝える
3. **監視とアラート**: 不審な活動パターンを監視
4. **段階的なロックアウト**: 失敗回数に応じて段階的にロックアウト期間を延長
5. **管理者による解除**: 管理者がユーザーのロックアウトを手動で解除できる機能を提供

## セキュリティ考慮事項

- フック関数には `security definer` を使用して、適切な権限で実行
- 試行記録テーブルへの直接アクセスを制限
- ブルートフォース攻撃を防ぐための適切なレート制限を実装
- ログと監査証跡を維持
