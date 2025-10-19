# 既存のプロジェクトをインポートする

## CLI を使用する場合

Vercel CLI を使用してプロジェクトをデプロイするには、以下のコマンドを使用します：

```terminal
vercel --cwd [path-to-project]
```

既存のプロジェクトは、HTML、CSS、JavaScript を含む静的な Web プロジェクトであれば可能です。Vercel の[サポートされているフレームワーク](/docs/frameworks)を使用する場合、最適なビルドおよびデプロイ設定が自動的に検出されます。

## プロジェクトのインポート手順

1. ### Git プロバイダーに接続
   - [新しいプロジェクト](/new)ページで、インポートする Git プロバイダーを選択
   - [GitHub](/docs/git/vercel-for-github)、[GitLab](/docs/git/vercel-for-gitlab)、または [BitBucket](/docs/git/vercel-for-bitbucket) アカウントにサインイン

2. ### リポジトリをインポート
   - インポートするリポジトリを選択し、「Import」をクリック

3. ### 設定のカスタマイズ（オプション）
   - Vercel は自動的にフレームワークと必要なビルド設定を検出
   - 以下の設定をカスタマイズ可能：
     * フレームワーク
     * ビルドコマンド
     * 出力ディレクトリ
     * インストールコマンド
     * 開発コマンド
     * 環境変数
     * [vercel.json](/docs/project-configuration) の追加

4. ### プロジェクトをデプロイ
   - 「Deploy」ボタンをクリック
   - Vercel がプロジェクトをビルドしてデプロイします
