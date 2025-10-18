# Babel

## babel/plugin-react-refresh

このプラグインは、Jotai atomにReact Refreshのサポートを追加し、開発中にステートがリセットされないことを保証します。

### 使用方法

Babel設定ファイルで：

```json
{
  "plugins": ["jotai/babel/plugin-react-refresh"]
}
```

カスタムatom関数名の場合：

```json
{
  "plugins": [
    ["jotai/babel/plugin-react-refresh", { "customAtomNames": ["customAtom"] }]
  ]
}
```

## babel/plugin-debug-label

Reactの開発ツールでatomを識別しやすくするために、atomに`debugLabel`を追加します。

次のようなコードを：

```javascript
export const countAtom = atom(0)
```

以下のように変換します：

```javascript
export const countAtom = atom(0)
countAtom.debugLabel = 'countAtom'
```

### 使用方法

```json
{
  "plugins": ["jotai/babel/plugin-debug-label"]
}
```

カスタムatom関数名の場合：

```json
{
  "plugins": [
    ["jotai/babel/plugin-debug-label", { "customAtomNames": ["customAtom"] }]
  ]
}
```

## babel/preset

Jotai固有のプラグインを含むBabelプリセット。

### 使用方法

```json
{
  "presets": ["jotai/babel/preset"]
}
```

カスタムatom名を使用する場合：

```json
{
  "presets": [["jotai/babel/preset", { "customAtomNames": ["customAtom"] }]]
}
```

### 例

- Next.js
- Parcel

## プラグインの利点

### React Refresh

- 開発中にatom stateを保持
- ホットリロード時のより良い開発体験
- Fast Refreshとの完全な互換性

### Debug Label

- React DevToolsでのより良いデバッグ体験
- Atom識別の簡素化
- 本番ビルドで自動的に最適化

## ベストプラクティス

1. 開発環境では常にこれらのプラグインを使用する
2. カスタムatom作成関数には`customAtomNames`オプションを使用する
3. プリセットを使用してすべてのプラグインを一度に適用する
4. 本番ビルドではプラグインが適切に最適化されることを確認する
