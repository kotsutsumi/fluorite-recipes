# レート制限

## 概要

「レート制限はサービスを悪用から保護します」

Supabase Authは、悪用を防ぐためにエンドポイントにレート制限を適用します。一部のレート制限は、ダッシュボードまたはManagement API経由でカスタマイズ可能です。

## レート制限の管理

Management APIを使用してcurlコマンドでレート制限を管理できます:

```bash
# アクセストークンを https://supabase.com/dashboard/account/tokens から取得
export SUPABASE_ACCESS_TOKEN="your-access-token"
export PROJECT_REF="your-project-ref"

# 現在のレート制限を取得
curl -X GET "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  | jq 'to_entries | map(select(.key | startswith("rate_limit_"))) | from_entries'

# レート制限を更新
curl -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rate_limit_anonymous_users": 10,
    "rate_limit_email_sent": 10,
    "rate_limit_sms_sent": 10,
    "rate_limit_verify": 10,
    "rate_limit_token_refresh": 10,
    "rate_limit_otp": 10,
    "rate_limit_web3": 10
  }'
```

## 詳細なレート制限

| エンドポイント | パス | 制限基準 | レート制限 |
|----------|------|------------|------------|
| メール送信エンドポイント | `/auth/v1/signup` `/auth/v1/recover` `/auth/v1/user`[^1] | 組み合わせリクエストの合計 | 1時間あたり2通のメール（2023年10月21日時点） |
| OTPエンドポイント | `/auth/v1/otp` | 組み合わせリクエストの合計 | 30 |
