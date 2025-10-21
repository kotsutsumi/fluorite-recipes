# マイクロフロントエンド

## マイクロフロントエンドとは

マイクロフロントエンドは、[ベータ版](/docs/release-phases#beta)で[すべてのプラン](/docs/plans)で利用可能な機能です。

これにより、1つのアプリケーションを、ユーザーにとって1つの統合されたアプリケーションとしてレンダリングされる、より小さく独立してデプロイ可能な単位に分割できます。異なるチームが異なる技術を使用して、各マイクロフロントエンドを開発、テスト、デプロイできます。

## マイクロフロントエンドを使用するタイミング

以下のような場合に有効です：

- **開発者の生産性向上**：大規模なアプリケーションをより小さな単位に分割し、開発とビルドの時間を改善
- **独立したチーム**：大規模な組織が、各チームが独自の技術スタック、フレームワーク、開発ライフサイクルを選択して機能を分割可能
- **段階的な移行**：レガシーシステムから最新のフレームワークへ、一度にすべてを書き換えることなく徐々に移行可能

### 代替案の検討

複雑さを追加する可能性があるため、以下の代替案を検討してください：

- [モノレポ](/docs/monorepos)と[Turborepo](https://turborepo.com/)
- [フィーチャーフラグ](/docs/feature-flags)
- [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack)による高速コンパイル

## 制限とプライシング

マイクロフロントエンドは、すべてのプランで利用可能で、追加料金は発生しません。ただし、通常のVercelの使用制限が適用されます。

## 関連リンク

- [クイックスタート](/docs/microfrontends/quickstart)
- [ローカル開発](/docs/microfrontends/local-development)
- [パスルーティング](/docs/microfrontends/path-routing)
- [マイクロフロントエンドの管理](/docs/microfrontends/managing-microfrontends)
- [トラブルシューティング](/docs/microfrontends/troubleshooting)
