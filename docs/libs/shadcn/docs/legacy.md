以下は、ウェブページの内容の日本語翻訳です：

# レガシードキュメント

ページをコピー

[前へ](/llms.txt)[次へ](/docs/components)

## shadcn/ui と Tailwind v3 のレガシードキュメントを表示します

現在、shadcn/ui + Tailwind v4 のドキュメントを閲覧しています。shadcn/ui + Tailwind v3 のドキュメントをお探しの場合は、以下のリンクで確認できます。

## Tailwind CSS v3とv4の違い

### Tailwind CSS v4の主な変更点

#### 1. パフォーマンス向上
Tailwind CSS v4は、ビルド時間とランタイムパフォーマンスが大幅に向上しています。

#### 2. 新しい設定システム
設定ファイルの構造が変更され、より直感的になりました。

#### 3. CSS変数のネイティブサポート
CSS変数の使用がより簡単になり、テーマ設定が改善されました。

#### 4. OKLCHカラースペース
新しいカラースペースのサポートにより、より鮮やかで一貫した色が使用できます。

### 移行が必要な理由

#### 最新機能へのアクセス
Tailwind CSS v4の新機能と改善を利用するため。

#### 長期的なサポート
v4は今後の主要バージョンとして、長期的にサポートされます。

#### パフォーマンス
ビルド時間の短縮と最適化されたCSS出力。

#### コミュニティサポート
新しいバージョンには、より活発なコミュニティサポートがあります。

## v3ドキュメントへのアクセス

shadcn/ui + Tailwind v3の完全なドキュメントは、専用のレガシーサイトで利用可能です。

### レガシードキュメントの内容

- インストール手順（Tailwind v3用）
- コンポーネント一覧とコード例
- テーマ設定ガイド（v3設定）
- カスタマイズ方法
- CLIコマンド
- トラブルシューティング

[レガシードキュメントを表示](https://v3.shadcn.com)

## 移行ガイド

### Tailwind v3からv4への移行

既存のshadcn/uiプロジェクトをTailwind v3からv4に移行する場合：

#### 1. 依存関係の更新

```bash
npm install tailwindcss@^4.0.0
```

#### 2. 設定ファイルの更新

Tailwind v4の新しい設定形式に従って、`tailwind.config.js`を更新します。

#### 3. CSS変数の調整

v4の新しいCSS変数システムに合わせて、`globals.css`を更新します。

#### 4. コンポーネントの確認

すべてのshadcn/uiコンポーネントが正しく動作することを確認します。

#### 5. テスト

アプリケーション全体をテストして、スタイリングの問題がないことを確認します。

### 詳細な移行手順

完全な移行ガイドについては、[Tailwind CSS公式移行ドキュメント](https://tailwindcss.com/docs/upgrade-guide)を参照してください。

## よくある質問

### Q: v3からv4に移行する必要がありますか？
A: 必須ではありませんが、新機能、パフォーマンス向上、長期サポートのために推奨されます。

### Q: v3のサポートはいつまで続きますか？
A: Tailwind CSSチームがv3のサポートスケジュールを決定します。最新情報は公式ドキュメントを確認してください。

### Q: 移行は難しいですか？
A: ほとんどのプロジェクトでは比較的簡単ですが、プロジェクトの複雑さによります。

### Q: v3ドキュメントはいつまで利用できますか？
A: レガシードキュメントは当面の間利用可能です。

## サポート

### v3プロジェクトのサポート

Tailwind v3を使用したshadcn/uiプロジェクトのサポートが必要な場合：

1. [レガシードキュメント](https://v3.shadcn.com)を参照
2. [GitHub Discussions](https://github.com/shadcn-ui/ui/discussions)で質問
3. [Discord](https://discord.gg/shadcn)でコミュニティに相談

### 移行サポート

移行に関する質問や問題がある場合：

1. [Tailwind CSS移行ガイド](https://tailwindcss.com/docs/upgrade-guide)を確認
2. [shadcn/ui GitHub Issues](https://github.com/shadcn-ui/ui/issues)で報告
3. [Discord](https://discord.gg/shadcn)で相談

## リソース

### 公式リソース

- [Tailwind CSS v4ドキュメント](https://tailwindcss.com)
- [shadcn/ui v4ドキュメント](https://ui.shadcn.com)
- [shadcn/ui v3レガシードキュメント](https://v3.shadcn.com)

### コミュニティリソース

- [GitHub リポジトリ](https://github.com/shadcn-ui/ui)
- [Discord コミュニティ](https://discord.gg/shadcn)
- [Twitter](https://twitter.com/shadcn)

## ナビゲーション

- [前のページ: llms.txt](/llms.txt)
- [次のページ: コンポーネント](/docs/components)

## デプロイメント

### Vercelで shadcn/ui アプリをデプロイ

OpenAI、Sonos、Adobeなどに信頼されています。

Vercelは、アプリと機能を大規模にデプロイするためのツールとインフラストラクチャを提供します。Tailwind v3とv4の両方のプロジェクトをサポートしています。

### 特徴

- 自動デプロイ
- グローバルCDN
- カスタムドメイン
- プレビューデプロイ
- 分析とモニタリング

[今すぐデプロイ](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)

## クレジット

[shadcn](https://twitter.com/shadcn)が[Vercel](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)で作成。ソースコードは[GitHub](https://github.com/shadcn-ui/ui)で利用可能です。

## 追加情報

### バージョン管理

shadcn/uiとTailwind CSSの両方のバージョンを適切に管理することが重要です：

```json
{
  "dependencies": {
    "tailwindcss": "^3.4.0", // v3を使用する場合
    // または
    "tailwindcss": "^4.0.0"  // v4を使用する場合
  }
}
```

### 互換性

shadcn/uiコンポーネントは、Tailwind v3とv4の両方で動作するように設計されていますが、一部のスタイリングや設定に違いがあります。

### 推奨事項

新しいプロジェクトを開始する場合は、Tailwind CSS v4とshadcn/ui最新版の使用を推奨します。既存のv3プロジェクトは、都合の良い時期に移行を検討してください。