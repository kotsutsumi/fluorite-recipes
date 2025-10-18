# 一般設定

## Supabase Auth の一般設定オプション

このセクションでは、Supabase Auth の一般設定オプションについて説明します。他のタイプの設定をお探しの場合は、以下のセクションをご覧ください：

- [ポリシー](/dashboard/project/_/auth/policies) - テーブルの行レベルセキュリティポリシーを管理
- [サインイン / プロバイダー](/dashboard/project/_/auth/providers) - 認証プロバイダーとログイン方法を設定
- [サードパーティ認証](/dashboard/project/_/auth/third-party) - サードパーティ認証システムを使用
- [セッション](/dashboard/project/_/auth/sessions) - ユーザーセッションとリフレッシュトークンを設定
- [レート制限](/dashboard/project/_/auth/rate-limits) - 不正利用を防止
- [メールテンプレート](/dashboard/project/_/auth/templates) - ユーザーメールを設定
- [カスタム SMTP](/dashboard/project/_/auth/smtp) - メール送信を設定
- [多要素認証](/dashboard/project/_/auth/mfa) - 追加の認証要素を要求
- [URL 設定](/dashboard/project/_/auth/url-configuration) - 認証 URL を設定
- [攻撃保護](/dashboard/project/_/auth/protection) - セキュリティ設定を構成
- [Auth フック (ベータ版)](/dashboard/project/_/auth/auth-hooks) - Auth の動作をカスタマイズ
- [監査ログ (ベータ版)](/dashboard/project/_/auth/audit-logs) - 認証イベントを追跡
- [詳細設定](/dashboard/project/_/auth/advanced) - 認証サーバー設定を構成

Supabase Auth は、ユーザーアクセスを制御するために、以下の一般設定オプションを提供しています：

1. **新規ユーザーのサインアップを許可**:
   - ユーザーがサインアップできるようになります
   - 無効にすると、既存のユーザーのみがサインインできます

2. **メール確認**:
   - ユーザーは初回サインイン前にメールを確認する必要があります
   - 無効にすると、システムはメール確認が不要であると見なします
   - このオプションはメールプロバイダーの個別設定にあります

3. **匿名サインインを許可**:
   - 匿名ユーザーの作成を許可します

4. **手動リンクを許可**:
   - ユーザーが手動でアカウントをリンクできるようにします
