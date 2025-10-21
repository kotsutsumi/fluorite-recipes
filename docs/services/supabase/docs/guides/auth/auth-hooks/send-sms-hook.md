# SMS送信フック

## 概要

SMS送信フックは、Supabase 認証の機能で、認証メッセージが送信される前にSMSメッセージの送信をカスタマイズできます。

### 主な目的

- 地域別のSMSプロバイダーを使用
- WhatsAppなどの代替メッセージングチャネルを使用
- プラットフォーム固有のフィールド（例：`AppHash`）でメッセージ本文を調整

### 入力

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `user` | `User` | サインインを試みているユーザー |
| `sms` | `object` | OTPを含むSMS送信プロセス固有のメタデータ |

### 出力

- 特定の出力は不要
- 200ステータスコードの空のレスポンスが成功を示します

### 実装例

#### SQL: SMSメッセージをキューに入れる

以下は、PostgreSQLを使用してSMSメッセージのジョブキューを作成する例です：

1. **ジョブキューテーブルの作成**

```sql
create table public.sms_queue (
  id bigserial primary key,
  phone text not null,
  message text not null,
  created_at timestamp with time zone default now()
);
```

2. **SMS送信フック関数の作成**

```sql
create or replace function public.send_sms_hook(event jsonb)
returns jsonb
language plpgsql
as $$
  declare
    phone text;
    message text;
  begin
    -- ユーザーの電話番号とSMSメッセージを取得
    phone = event->'user'->>'phone';
    message = event->'sms'->>'message';

    -- メッセージをキューに追加
    insert into public.sms_queue (phone, message)
    values (phone, message);

    return jsonb_build_object();
  end;
$$;
```

3. **ジョブ処理関数の作成**

```sql
create or replace function public.process_sms_queue()
returns void
language plpgsql
as $$
  declare
    sms_record record;
  begin
    -- キューからメッセージを取得して処理
    for sms_record in
      select * from public.sms_queue
      order by created_at
      limit 100
    loop
      -- ここでSMSプロバイダーAPIを呼び出す
      -- 例：Twilio、AWS SNSなど

      -- 処理済みメッセージを削除
      delete from public.sms_queue where id = sms_record.id;
    end loop;
  end;
$$;
```

4. **定期実行の設定（pg_cronを使用）**

```sql
-- 1分ごとにSMSキューを処理
select cron.schedule(
  'process-sms-queue',
  '* * * * *',
  'select public.process_sms_queue();'
);
```

#### HTTP例

##### 代替メッセージプロバイダーの使用（Twilioの例）

```typescript
// Supabase Edge Function
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const payload = await req.json()
  const { user, sms } = payload

  // Twilio APIを使用してSMSを送信
  const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/ACCOUNT_SID/Messages.json', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa('ACCOUNT_SID:AUTH_TOKEN'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      To: user.phone,
      From: 'YOUR_TWILIO_NUMBER',
      Body: sms.message,
    }),
  })

  return new Response(JSON.stringify({}), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})
```

##### 特定地域向けにWhatsAppでメッセージを送信

```typescript
// Supabase Edge Function
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const payload = await req.json()
  const { user, sms } = payload

  // 特定の国コードにはWhatsAppを使用
  const isWhatsAppRegion = user.phone.startsWith('+81') // 日本の例

  if (isWhatsAppRegion) {
    // WhatsApp Business APIを使用
    await fetch('https://api.whatsapp.com/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: user.phone,
        message: sms.message,
      }),
    })
  } else {
    // 通常のSMSプロバイダーを使用
    // ...
  }

  return new Response(JSON.stringify({}), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})
```

### 主な考慮事項

- 柔軟なメッセージング戦略
- ジョブキューによるパフォーマンス最適化
- 地域別および代替メッセージングチャネルのサポート
- エラーハンドリングとリトライロジックの実装が推奨されます
