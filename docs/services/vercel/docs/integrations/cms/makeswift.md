# Vercel Makeswift統合

Makeswiftは、コードを書くことなくReactウェブサイトを作成および管理するための、ノーコードウェブサイトビルダーです。ドラッグ＆ドロップインターフェースにより、レスポンシブなウェブページを簡単にデザインできます。

## はじめに

Vercel上でMakeswiftを使い始めるには、以下のテンプレートをデプロイしてください：

[Makeswift Next.js スターター](https://vercel.com/templates/next.js/makeswift-starter)

または、以下の手順に従って統合をインストールします：

### 1. Vercel CLIのインストール

環境変数を取得するために、[Vercel CLI](/docs/cli)をインストールします：

```bash
pnpm i -g vercel@latest
```

```bash
yarn global add vercel@latest
```

```bash
npm i -g vercel@latest
```

```bash
bun add -g vercel@latest
```

### 2. CMSの統合をインストール

[Makeswift統合](/integrations/makeswift)にアクセスし、インストール手順に従ってください。

### 3. 環境変数の取得

Makeswift統合をインストールした後、プロジェクトの環境変数を取得します：

```bash
vercel env pull
```

## プロジェクトのセットアップ

### 1. Next.js プロジェクトの作成

```bash
npx create-next-app@latest my-makeswift-site
cd my-makeswift-site
```

### 2. Makeswift パッケージのインストール

```bash
pnpm add @makeswift/runtime
```

### 3. Makeswift の設定

```typescript
// makeswift.config.ts
import { Makeswift } from '@makeswift/runtime/next';

export const makeswift = new Makeswift({
  siteId: process.env.MAKESWIFT_SITE_ID!,
});
```

### 4. API ルートの作成

```typescript
// app/api/makeswift/[...makeswift]/route.ts
import { makeswift } from '@/makeswift.config';

export const { GET, POST } = makeswift.runtime();
```

### 5. Catch-all ルートの作成

```typescript
// app/[[...path]]/page.tsx
import { Makeswift } from '@makeswift/runtime/next';
import { makeswift } from '@/makeswift.config';

export async function generateStaticParams() {
  const pages = await makeswift.getPages();

  return pages.map((page) => ({
    path: page.path.split('/').filter(Boolean),
  }));
}

export default async function Page({ params }: { params: { path?: string[] } }) {
  const path = '/' + (params.path?.join('/') ?? '');
  const snapshot = await makeswift.getPageSnapshot(path);

  if (snapshot == null) {
    return <div>ページが見つかりません</div>;
  }

  return <Makeswift snapshot={snapshot} />;
}
```

## カスタムコンポーネントの登録

### 1. コンポーネントの作成

```typescript
// components/Hero.tsx
import { ReactRuntime } from '@makeswift/runtime/react';

type HeroProps = {
  title: string;
  subtitle: string;
  backgroundImage: string;
};

export function Hero({ title, subtitle, backgroundImage }: HeroProps) {
  return (
    <div
      className="relative h-96 flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">{title}</h1>
        <p className="text-xl">{subtitle}</p>
      </div>
    </div>
  );
}

// Makeswift に登録
ReactRuntime.registerComponent(Hero, {
  type: 'hero',
  label: 'Hero',
  props: {
    title: ReactRuntime.controls.text({
      label: 'タイトル',
      defaultValue: 'Welcome',
    }),
    subtitle: ReactRuntime.controls.text({
      label: 'サブタイトル',
      defaultValue: 'To our website',
    }),
    backgroundImage: ReactRuntime.controls.image({
      label: '背景画像',
      defaultValue: '/default-hero.jpg',
    }),
  },
});
```

### 2. コンポーネントのエクスポート

```typescript
// makeswift/components.tsx
import { Hero } from '@/components/Hero';

export { Hero };
```

### 3. ランタイムの設定

```typescript
// makeswift.config.ts
import { Makeswift } from '@makeswift/runtime/next';
import { strict } from 'assert';

strict(process.env.MAKESWIFT_SITE_ID, 'MAKESWIFT_SITE_ID is required');

export const makeswift = new Makeswift({
  siteId: process.env.MAKESWIFT_SITE_ID,
});
```

## 利用可能なコントロール

Makeswift は以下のコントロールタイプを提供します：

### テキスト

```typescript
ReactRuntime.controls.text({
  label: 'タイトル',
  defaultValue: 'デフォルトテキスト',
})
```

### 画像

```typescript
ReactRuntime.controls.image({
  label: '画像',
  defaultValue: '/default.jpg',
})
```

### リンク

```typescript
ReactRuntime.controls.link({
  label: 'リンク',
})
```

### カラー

```typescript
ReactRuntime.controls.color({
  label: '色',
  defaultValue: '#000000',
})
```

### 数値

```typescript
ReactRuntime.controls.number({
  label: '数値',
  defaultValue: 0,
  min: 0,
  max: 100,
  step: 1,
})
```

### チェックボックス

```typescript
ReactRuntime.controls.checkbox({
  label: 'チェックボックス',
  defaultValue: false,
})
```

### 選択

```typescript
ReactRuntime.controls.select({
  label: '選択',
  options: [
    { label: 'オプション1', value: 'option1' },
    { label: 'オプション2', value: 'option2' },
  ],
  defaultValue: 'option1',
})
```

### リスト

```typescript
ReactRuntime.controls.list({
  label: 'リスト',
  type: ReactRuntime.controls.shape({
    type: {
      title: ReactRuntime.controls.text({ label: 'タイトル' }),
      description: ReactRuntime.controls.text({ label: '説明' }),
    },
  }),
})
```

## スタイリング

### Tailwind CSS の使用

```typescript
// components/Button.tsx
type ButtonProps = {
  text: string;
  variant: 'primary' | 'secondary';
};

export function Button({ text, variant }: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-md font-medium';
  const variantStyles = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]}`}>
      {text}
    </button>
  );
}
```

## 環境変数

`.env.local` ファイルに以下を追加：

```bash
MAKESWIFT_SITE_ID=your_site_id
MAKESWIFT_API_KEY=your_api_key
```

## デプロイ

### Vercel へのデプロイ

1. Vercel ダッシュボードでプロジェクトをインポート
2. 環境変数を設定：
   - `MAKESWIFT_SITE_ID`
   - `MAKESWIFT_API_KEY`
3. デプロイ

### 自動再デプロイの設定

Makeswift で変更を公開したときに自動的に再デプロイ：

1. Vercel で Deploy Hook を作成
2. Makeswift ダッシュボードで Settings → Webhooks
3. Webhook URL を追加

## ベストプラクティス

### パフォーマンス

- **ISR の使用**: ページを静的に生成し、定期的に再検証
- **画像最適化**: Next.js Image コンポーネントを使用
- **コード分割**: 動的インポートを使用

### 開発ワークフロー

- **コンポーネントライブラリ**: 再利用可能なコンポーネントを作成
- **型安全性**: TypeScript を使用
- **テスト**: コンポーネントをテスト

## トラブルシューティング

### ページが表示されない

1. 環境変数が正しく設定されているか確認
2. Makeswift サイト ID が正しいか確認
3. API ルートが正しく設定されているか確認

### コンポーネントが Makeswift に表示されない

1. コンポーネントが正しく登録されているか確認
2. ランタイムが正しく設定されているか確認
3. 開発サーバーを再起動

## 関連リソース

- [Makeswift 公式ドキュメント](https://www.makeswift.com/docs)
- [Makeswift テンプレート](https://vercel.com/templates/next.js/makeswift-starter)
- [Vercel Makeswift 統合](https://vercel.com/integrations/makeswift)
