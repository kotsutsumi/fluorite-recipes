# registry-item.json

## 概要

`registry-item.json` スキーマは、カスタムレジストリアイテムを定義するために使用されます。これは、コンポーネント、フック、スタイル、その他のリソースを登録および管理するための詳細な仕様を提供します。

## 定義

### $schema

レジストリアイテムのスキーマを指定するプロパティ。

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json"
}
```

### name

レジストリ内でアイテムを識別するための一意の名前。

```json
{
  "name": "button"
}
```

### title

人間が読みやすいアイテムのタイトル。簡潔で説明的な名前を付けます。

```json
{
  "title": "Button Component"
}
```

### description

レジストリアイテムの詳細な説明。

```json
{
  "description": "A customizable button component with various styles and sizes."
}
```

### type

アイテムの種類を指定するプロパティ。サポートされているタイプ：

- `registry:block`: 複数のファイルを持つ複雑なコンポーネント
- `registry:component`: シンプルなコンポーネント
- `registry:ui`: UIコンポーネント
- `registry:lib`: ライブラリとユーティリティ
- `registry:hook`: Reactフック
- `registry:theme`: テーマ設定
- `registry:style`: スタイルファイル

```json
{
  "type": "registry:ui"
}
```

### dependencies

npmパッケージの依存関係を指定します。バージョンを指定できます。

```json
{
  "dependencies": [
    "react@^18.0.0",
    "class-variance-authority",
    "clsx"
  ]
}
```

### devDependencies

開発時のnpmパッケージ依存関係。

```json
{
  "devDependencies": [
    "@types/react@^18.0.0"
  ]
}
```

### registryDependencies

他のレジストリアイテムへの依存関係を定義します。名前、名前空間、URLで指定可能。

```json
{
  "registryDependencies": [
    "button",
    "@acme/card",
    "https://example.com/r/utils.json"
  ]
}
```

### files

レジストリアイテムのファイルを指定します。各ファイルには、パス、タイプ、およびオプションでターゲットがあります。

```json
{
  "files": [
    {
      "path": "ui/button.tsx",
      "type": "registry:component",
      "target": "components/ui/button.tsx"
    }
  ]
}
```

#### ファイルプロパティ

- `path`: ソースファイルのパス
- `type`: ファイルのタイプ（`registry:component`、`registry:lib`など）
- `target`: インストール先のパス（オプション）
- `content`: ファイルの内容（オプション、動的生成時に使用）

### cssVars

CSS変数を定義するために使用します。テーマ、ライト、ダークモードの変数を設定できます。

```json
{
  "cssVars": {
    "light": {
      "--primary": "222.2 47.4% 11.2%",
      "--primary-foreground": "210 40% 98%"
    },
    "dark": {
      "--primary": "210 40% 98%",
      "--primary-foreground": "222.2 47.4% 11.2%"
    }
  }
}
```

### tailwind

Tailwindの設定を定義します。

```json
{
  "tailwind": {
    "config": {
      "theme": {
        "extend": {
          "colors": {
            "primary": "hsl(var(--primary))"
          }
        }
      }
    },
    "plugins": ["@tailwindcss/typography"]
  }
}
```

### docs

ドキュメントや使用方法の説明。

```json
{
  "docs": "このボタンコンポーネントは、さまざまなスタイルとサイズをサポートしています。"
}
```

### meta

追加のメタデータ。

```json
{
  "meta": {
    "featured": true,
    "category": "ui",
    "tags": ["button", "interactive"]
  }
}
```

## 完全な例

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "button",
  "title": "Button",
  "description": "A customizable button component",
  "type": "registry:ui",
  "dependencies": [
    "class-variance-authority",
    "clsx"
  ],
  "registryDependencies": [],
  "files": [
    {
      "path": "ui/button.tsx",
      "type": "registry:component",
      "target": "components/ui/button.tsx"
    }
  ],
  "cssVars": {
    "light": {
      "--primary": "222.2 47.4% 11.2%"
    },
    "dark": {
      "--primary": "210 40% 98%"
    }
  },
  "tailwind": {
    "config": {
      "theme": {
        "extend": {
          "colors": {
            "primary": "hsl(var(--primary))"
          }
        }
      }
    }
  },
  "docs": "基本的なボタンコンポーネント",
  "meta": {
    "featured": true
  }
}
```

## ベストプラクティス

1. **明確な命名**: わかりやすいname、titleを使用
2. **詳細な説明**: descriptionで機能を明確に説明
3. **適切な型指定**: 正しいtypeを選択
4. **依存関係の管理**: 必要な依存関係をすべて記載
5. **ドキュメントの提供**: docsフィールドで使用方法を説明

## 検証

レジストリアイテムは、スキーマに対して自動的に検証されます。エラーがある場合、CLIが警告を表示します。
