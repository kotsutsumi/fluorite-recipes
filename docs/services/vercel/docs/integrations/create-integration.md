# Vercelと統合する

このガイドでは、Vercelでの統合の作成と管理のプロセスを説明し、サードパーティサービスと連携してVercelプロジェクトの機能を拡張する方法を支援します。

## ネイティブ統合について理解する

[ネイティブ統合](/docs/integrations#native-integrations)とVercelプラットフォームとの強力な接続と柔軟性を考慮すると、統合プロバイダーのためのネイティブ統合の作成と最適化に役立ちます。

[ネイティブ統合の概念](/docs/integrations/create-integration/native-integration)と[ネイティブ統合フロー](/docs/integrations/create-integration/marketplace-flows)の詳細を確認してください。

## 統合の作成

統合は、統合作成フォームに記入することで作成できます。フォームにアクセスするには：

1. [ダッシュボード](/dashboard)から、[スコープセレクター](/docs/dashboard-features#scope-selector)で自分のアカウント/チームを選択
2. 統合タブを選択して統合の概要を表示
3. [統合コンソール](/dashboard/integrations/console)ボタンを選択し、次に「作成」を選択
4. 必要に応じて[統合作成フォーム](#統合作成フォームの詳細)のすべてのエントリに記入
5. フォームの最後で、作成する統合の種類に応じて、Vercelの利用規約に同意する必要があります
6. ネイティブ統合を作成する場合は、[ネイティブ統合製品作成](#ネイティブ統合製品作成)プロセスに進みます

## 統合作成フォームの詳細

統合作成フォームには、以下のセクションが含まれます：

### 基本情報

- **統合名**: 統合の名前
- **スラッグ**: 統合のURL識別子
- **説明**: 統合の簡潔な説明
- **カテゴリ**: 統合のカテゴリ（データベース、モニタリング、CMSなど）
- **ロゴ**: 統合のロゴ画像

### 開発者情報

- **開発者名**: 統合を開発する個人または組織の名前
- **開発者ウェブサイト**: 開発者のウェブサイトURL
- **サポートメール**: サポートのための連絡先メールアドレス

### 統合設定

- **リダイレクトURL**: OAuth認証後のリダイレクト先URL
- **Webhook URL**: イベント通知を受信するURL
- **権限**: 統合が必要とするAPIアクセス権限

### マーケットプレイス設定

- **公開設定**: 統合をマーケットプレイスで公開するかどうか
- **特集画像**: マーケットプレイスに表示される画像
- **詳細説明**: 統合の詳細な説明

## 統合作成後

統合を作成した後：

1. [統合をテスト](#統合のテスト)して、正しく動作することを確認
2. [承認チェックリスト](/docs/integrations/create-integration/approval-checklist)を確認
3. [マーケットプレイスへの申請](/docs/integrations/create-integration/submit-integration)を準備

## 統合のテスト

統合をテストするには：

1. 統合コンソールから、テストモードで統合を有効化
2. テストプロジェクトに統合をインストール
3. 統合のすべての機能が正しく動作することを確認
4. 必要に応じて調整を行う

## 次のステップ

- [ネイティブ統合の作成](/docs/integrations/create-integration/native-integration)
- [マーケットプレイス製品の作成](/docs/integrations/create-integration/marketplace-product)
- [デプロイメント統合アクションの実装](/docs/integrations/create-integration/deployment-integration-action)
