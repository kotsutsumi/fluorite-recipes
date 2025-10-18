# registry.json

## スキーマについて

`registry.json` スキーマは、カスタムコンポーネントレジストリを定義するために使用されます。

## 定義

### $schema

`$schema` プロパティは、`registry.json` ファイルのスキーマを指定するために使用されます。

```json
{
   "$schema": "https://ui.shadcn.com/schema/registry.json"
}
```

### name

レジストリの名前を指定するプロパティ。データ属性やその他のメタデータに使用されます。

```json
{
   "name": "acme"
}
```

### homepage

レジストリのホームページを指定します。データ属性やその他のメタデータに使用されます。

```json
{
   "homepage": "https://acme.com"
}
```

### items

レジストリ内のアイテム。各アイテムは [registry-item スキーマ仕様](https://ui.shadcn.com/schema/registry-item.json) に従う必要があります。

```json
{
   "items": [
     {
       "name": "hello-world",
       "type": "registry:block",
       "title": "Hello World",
       "description": "A simple hello world component.",
       "registryDependencies": [
         "button",
         "@acme/input-form",
         "https://example.com/r/foo"
       ],
       "dependencies": ["is-even@3.0.0", "motion"],
       "files": [
         {
           "path": "registry/new-york/hello-world/hello-world.tsx",
           "type": "registry:component"
         }
       ]
     }
   ]
}
```

詳細については、[registry-item スキーマのドキュメント](/docs/registry/registry-item-json)を参照してください。

## 使用方法

`registry.json` ファイルは、レジストリのルートディレクトリに配置する必要があります。CLIは、このファイルを使用してレジストリ内のアイテムを検索およびインストールします。

## 例

完全な `registry.json` ファイルの例：

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "my-components",
  "homepage": "https://example.com",
  "items": [
    {
      "name": "button",
      "type": "registry:ui",
      "files": [
        {
          "path": "ui/button.tsx",
          "type": "registry:component"
        }
      ]
    },
    {
      "name": "card",
      "type": "registry:ui",
      "registryDependencies": ["button"],
      "files": [
        {
          "path": "ui/card.tsx",
          "type": "registry:component"
        }
      ]
    }
  ]
}
```
