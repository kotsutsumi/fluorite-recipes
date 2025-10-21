# Supabase Auth メールテンプレート

## 概要

さまざまな認証フローのメールメッセージをカスタマイズできます：

- サインアップの確認
- ユーザーの招待
- マジックリンク
- メールアドレスの変更
- パスワードのリセット

## 用語：テンプレート変数

| 変数 | 説明 |
|----------|-------------|
| `{{ .ConfirmationURL }}` | サインアップまたは確認用の確認URL |
| `{{ .Token }}` | 6桁のワンタイムパスワード (OTP) |
| `{{ .TokenHash }}` | トークンのハッシュ化されたバージョン |
| `{{ .SiteURL }}` | アプリケーションのサイトURL |
| `{{ .RedirectTo }}` | 認証メソッド中に渡されるリダイレクトURL |
| `{{ .Data }}` | `auth.users.user_metadata` からのメタデータ |
| `{{ .Email }}` | 元のユーザーメールアドレス |
| `{{ .NewEmail }}` | 新しいメールアドレス（メール変更テンプレート用） |

## メールテンプレートの編集

### 方法

1. ホストされたSupabaseプロジェクト：ダッシュボードから編集
2. セルフホスト/ローカル開発：設定ファイルを編集
3. Management API：プログラムでテンプレートを更新

### API更新の例

```bash
curl -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
      "mailer_subjects_confirmation": "Confirm your signup",
      "mailer_templates_confirmation_content": "<h2>Confirm your signup</h2>..."
  }'
```

## 制限事項と考慮事項

### メールのプリフェッチ

一部のメールプロバイダーはリンクをプリフェッチする場合があり、トークンの有効期限切れを引き起こす可能性があります。対策：

- メール OTP を使用
- 確認ページにリダイレクトするカスタムメールリンクを作成

### メールトラッキング

リンクが正しく機能するよう、メールトラッキングを無効にしてください。

### サーバーサイドレンダリング

サーバーサイドエンドポイントで認証を処理するために、メールリンクをカスタマイズします。

## カスタマイズ

Go テンプレートを使用しており、テンプレートプロパティに基づいた条件付きレンダリングが可能です。

### 例：アーリーアクセスユーザー向けに異なるメールを送信

```go
{{ if eq .Data.early_access true }}
  <!-- アーリーアクセスユーザー向けのコンテンツ -->
{{ else }}
  <!-- 通常のユーザー向けのコンテンツ -->
{{ end }}
```
