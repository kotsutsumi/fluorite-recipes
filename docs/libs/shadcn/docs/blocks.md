# ブロック

## ワークスペースのセットアップ

shadcn/uiに新しいブロックを貢献したい場合は、以下の手順に従ってください。

### リポジトリをフォーク

まず、公式リポジトリをフォークしてクローンします：

```bash
git clone https://github.com/shadcn-ui/ui.git
```

### 新しいブランチを作成

作業用の新しいブランチを作成します：

```bash
git checkout -b username/my-new-block
```

ブランチ名の規則：`username/block-name`

### 依存関係をインストール

プロジェクトの依存関係をインストールします：

```bash
pnpm install
```

### 開発サーバーを起動

開発サーバーを起動して変更をプレビューします：

```bash
pnpm www:dev
```

これにより、ローカルでドキュメントサイトが起動します。

## ブロックを追加

ブロックは、単一のコンポーネント（UIコンポーネントのバリエーションなど）または複数のコンポーネント、フック、ユーティリティを含む複雑なコンポーネント（ダッシュボードなど）になります。

### ブロックとは？

ブロックは、以下のようなものです：

- **単純なブロック:** 単一のコンポーネントのバリエーション（カードのスタイル、ボタンのグループなど）
- **複雑なブロック:** 複数のコンポーネントを組み合わせた機能（ログインフォーム、ダッシュボード、ランディングページなど）

### 新しいブロックを作成

`apps/www/registry/new-york/blocks` ディレクトリに新しいフォルダを作成します。フォルダ名はケバブケースで、`new-york` の下に配置する必要があります。

```bash
mkdir apps/www/registry/new-york/blocks/my-block
```

### ブロックファイルを追加

ブロックフォルダにファイルを追加します。以下は、ページ、コンポーネント、フック、ユーティリティを含むブロックの例です。

#### ディレクトリ構造の例

```
apps/www/registry/new-york/blocks/my-block/
├── page.tsx              # メインページコンポーネント
├── components/
│   ├── header.tsx       # ヘッダーコンポーネント
│   ├── sidebar.tsx      # サイドバーコンポーネント
│   └── content.tsx      # コンテンツコンポーネント
├── hooks/
│   └── use-data.ts      # カスタムフック
└── lib/
    └── utils.ts         # ユーティリティ関数
```

#### page.tsx の例

```typescript
import { Header } from "./components/header"
import { Sidebar } from "./components/sidebar"
import { Content } from "./components/content"

export default function MyBlock() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <Content />
      </div>
    </div>
  )
}
```

## レジストリにブロックを追加

### registry-blocks.ts にブロック定義を追加

レジストリにブロックを追加するには、`apps/www/registry/registry-blocks.ts` にブロック定義を追加する必要があります。

```typescript
export const blocks = {
  // ... 既存のブロック
  "my-block": {
    name: "my-block",
    type: "registry:block",
    description: "私のカスタムブロックの説明",
    registryDependencies: ["button", "card", "input"],
    files: [
      {
        path: "blocks/my-block/page.tsx",
        type: "registry:page",
      },
      {
        path: "blocks/my-block/components/header.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/my-block/components/sidebar.tsx",
        type: "registry:component",
      },
      {
        path: "blocks/my-block/components/content.tsx",
        type: "registry:component",
      },
    ],
    category: "dashboard", // または "landing", "auth", "marketing" など
    subcategory: "overview",
  },
}
```

### ブロックのプロパティ

- **name:** ブロックの一意な識別子
- **type:** 常に `"registry:block"`
- **description:** ブロックの説明
- **registryDependencies:** このブロックが使用するshadcn/uiコンポーネント
- **files:** ブロックを構成するファイルのリスト
- **category:** ブロックのカテゴリ（dashboard, landing, authなど）
- **subcategory:** サブカテゴリ（オプション）

## ブロックを公開

ブロックの準備ができたら、メインリポジトリにプルリクエストを送信できます。

### ビルドスクリプトを実行

プルリクエストを作成する前に、ビルドスクリプトを実行してエラーがないことを確認します：

```bash
pnpm registry:build
```

このコマンドは：
- レジストリファイルを検証
- 依存関係をチェック
- ビルドエラーを検出

### スクリーンショットをキャプチャ

ブロックのスクリーンショットをキャプチャします。スクリーンショットは以下の要件を満たす必要があります：

- **解像度:** 1920x1080以上
- **フォーマット:** PNG
- **ライトモードとダークモード:** 両方のスクリーンショットを含める
- **保存場所:** `apps/www/public/blocks/[block-name].png`

### プルリクエストを作成

1. 変更をコミット：
```bash
git add .
git commit -m "feat: add my-block"
```

2. フォークにプッシュ：
```bash
git push origin username/my-new-block
```

3. GitHubでプルリクエストを作成

### プルリクエストの説明

プルリクエストには以下を含めてください：

1. **ブロックの説明:** 何を構築したか、どのように使用するか
2. **スクリーンショット:** ライトモードとダークモードの両方
3. **使用例:** ブロックの使用方法の例
4. **依存関係:** 必要な追加の依存関係
5. **テスト:** ブロックをテストした方法

## ブロックのベストプラクティス

### 1. アクセシビリティ

すべてのブロックはアクセシブルである必要があります：
- 適切なARIA属性を使用
- キーボードナビゲーションをサポート
- 十分なカラーコントラスト
- スクリーンリーダーのサポート

### 2. レスポンシブデザイン

ブロックはすべてのスクリーンサイズで動作する必要があります：
- モバイル（320px以上）
- タブレット（768px以上）
- デスクトップ（1024px以上）

### 3. パフォーマンス

パフォーマンスを最適化します：
- 不要な再レンダリングを避ける
- 画像を最適化
- 遅延読み込みを使用
- コード分割を検討

### 4. カスタマイズ可能

ブロックは簡単にカスタマイズできるようにします：
- props経由で設定可能
- CSS変数を使用
- 明確なコメントとドキュメント

### 5. 再利用性

ブロックは再利用可能に設計します：
- コンポーネントを小さく保つ
- ハードコードされた値を避ける
- 構成可能なインターフェース

## ブロックのカテゴリ

### Dashboard（ダッシュボード）
管理画面、分析ダッシュボード、データ可視化など

### Landing（ランディング）
ランディングページ、ヒーローセクション、機能セクションなど

### Auth（認証）
ログイン、登録、パスワードリセットフォームなど

### Marketing（マーケティング）
プライシングテーブル、証言セクション、CTAバナーなど

### E-commerce（Eコマース）
商品カード、ショッピングカート、チェックアウトフォームなど

### Blog（ブログ）
記事カード、ブログレイアウト、コメントセクションなど

## 例：シンプルなブロック

### ログインフォームブロック

```typescript
// apps/www/registry/new-york/blocks/login-01/page.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginBlock() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
          <CardDescription>
            アカウントにログインしてください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">メール</Label>
            <Input id="email" type="email" placeholder="m@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input id="password" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">ログイン</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
```

## サポート

質問や問題がある場合：

1. [GitHub Discussions](https://github.com/shadcn-ui/ui/discussions)で質問
2. [Discord](https://discord.gg/shadcn)でコミュニティに参加
3. [GitHub Issues](https://github.com/shadcn-ui/ui/issues)でバグを報告

## デプロイメント

### Vercelでshadcn/uiアプリをデプロイ

OpenAI、Sonos、Adobeなどに信頼されています。Vercelは、アプリと機能を大規模にデプロイするためのツールとインフラストラクチャを提供します。

[Vercelにデプロイ](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)

## クレジット

[shadcn](https://twitter.com/shadcn)が[Vercel](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)で作成。ソースコードは[GitHub](https://github.com/shadcn-ui/ui)で利用可能です。