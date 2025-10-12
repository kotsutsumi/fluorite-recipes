# publicフォルダ

`public`フォルダは、画像、フォント、その他のファイルなどの静的アセットを提供するために使用されます。`public`内のファイルは、ベースURL（`/`）から始まるコードで参照できます。

## 説明

`public`ディレクトリ内のファイルは、アプリケーションのルートからアクセスできます。たとえば、`public/avatars/me.png`に画像を追加した場合、`/avatars/me.png`パスでアクセスできます。

## 例

### 基本的な使用方法

```tsx title="app/page.tsx"
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="/avatar.png"
      alt="アバター画像"
      width={500}
      height={500}
    />
  )
}
```

### 動的アセット参照

`public`フォルダから動的にアセットを参照できます。

```tsx title="app/components/avatar.tsx"
import Image from 'next/image'

export function Avatar({ id, alt }: { id: string; alt: string }) {
  return (
    <Image
      src={`/avatars/${id}.png`}
      alt={alt}
      width={64}
      height={64}
    />
  )
}
```

### ロボットとファビコン

```
public/
├── favicon.ico
├── robots.txt
├── sitemap.xml
└── images/
    ├── hero.png
    └── logo.svg
```

これらのファイルは、次のようにアクセスできます。

- `/favicon.ico`
- `/robots.txt`
- `/sitemap.xml`
- `/images/hero.png`
- `/images/logo.svg`

### SVGアイコン

```tsx title="app/components/logo.tsx"
export function Logo() {
  return <img src="/logo.svg" alt="ロゴ" width={120} height={40} />
}
```

## 知っておくべきこと

### ディレクトリ名

- ディレクトリの名前は`public`である必要があります。名前を変更することはできず、静的アセットを提供するために使用される唯一のディレクトリです
- `public`ディレクトリは、プロジェクトのルートに配置する必要があります。`app`や`pages`の内部には配置できません

### キャッシング

- Next.jsは、`public`フォルダ内のアセットを安全にキャッシュできません。なぜなら、それらは変更される可能性があるためです
- 適用されるデフォルトのキャッシングヘッダーは次のとおりです。

```
Cache-Control: public, max-age=0
```

### ビルド時の出力

- ビルド時（`next build`）に、Next.jsは`public`ディレクトリ内のすべてのアセットを`.next/static/`ディレクトリにコピーします

### 静的エクスポート

- [静的エクスポート](/docs/app/building-your-application/deploying/static-exports)を使用する場合、`public`フォルダ内のアセットは出力ディレクトリにコピーされます

### メタデータファイル

- 静的メタデータファイル（`robots.txt`、`favicon.ico`など）の場合、`app`フォルダ内の[特別なメタデータファイル](/docs/app/api-reference/file-conventions/metadata)を使用することをお勧めします

### ベストプラクティス

#### アセットの整理

サブディレクトリを使用してアセットを整理することをお勧めします。

```
public/
├── images/
│   ├── hero.png
│   └── avatar.png
├── fonts/
│   ├── custom-font.woff2
│   └── custom-font.woff
└── icons/
    ├── facebook.svg
    └── twitter.svg
```

#### バージョニング

ファイル名にハッシュやバージョンを含めることで、ブラウザキャッシングを制御できます。

```
public/
├── logo-v1.svg
├── logo-v2.svg
└── styles-abc123.css
```

#### 画像最適化

`public`フォルダの画像には、Next.jsの画像最適化は適用されません。最適化するには、`next/image`コンポーネントを使用します。

```tsx title="app/page.tsx"
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="/hero.png"
      alt="ヒーロー画像"
      width={1200}
      height={600}
      priority
    />
  )
}
```

## 参照

- [`next/image`](/docs/app/api-reference/components/image)
- [メタデータファイル](/docs/app/api-reference/file-conventions/metadata)
- [静的エクスポート](/docs/app/building-your-application/deploying/static-exports)

## バージョン履歴

| バージョン | 変更内容                            |
| ---------- | ----------------------------------- |
| `v13.0.0`  | `public`フォルダが導入されました（`pages`から移行） |
| `v9.0.0`   | `public`フォルダが`pages`で導入されました |
