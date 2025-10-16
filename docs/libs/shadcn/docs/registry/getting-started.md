# コンポーネントレジストリの概要

## はじめに

このガイドは、独自のコンポーネントレジストリを設定する方法を説明します。既存のプロジェクトにコンポーネントがあり、それをレジストリに変換したい場合を想定しています。

新しいレジストリプロジェクトを開始する場合は、[レジストリテンプレート](https://github.com/shadcn-ui/registry-template)を使用できます。

## 要件

カスタムレジストリは自由に設計およびホストできますが、レジストリアイテムは[registry-item スキーマ仕様](/docs/registry/registry-item-json)に準拠する必要があります。

## registry.json

`registry.json` はレジストリのエントリポイントで、レジストリの名前、ホームページ、およびレジストリ内のアイテムを定義します。

レジストリのルートエンドポイントに、このファイル（またはJSONペイロード）が存在する必要があります。`shadcn` CLIは、`build`コマンドを実行すると自動的にこのファイルを生成します。

## レジストリアイテムの追加

### コンポーネントの作成

最初のコンポーネントを追加します。以下は、シンプルな`<HelloWorld />`コンポーネントの例です：

```tsx
import { Button } from "@/components/ui/button"
export function HelloWorld() {
  return <Button>Hello World</Button>
}
```

### レジストリへのコンポーネントの追加

`registry.json`にコンポーネント定義を追加する必要があります：

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "my-registry",
  "homepage": "https://example.com",
  "items": [
    {
      "name": "hello-world",
      "type": "registry:component",
      "files": [
        {
          "path": "components/hello-world.tsx",
          "type": "registry:component"
        }
      ]
    }
  ]
}
```
