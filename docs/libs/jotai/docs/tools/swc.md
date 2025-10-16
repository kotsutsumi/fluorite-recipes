# SWC

⚠️ 注意: これらのプラグインは実験的なものです。フィードバックは[Githubリポジトリ](https://github.com/pmndrs/swc-jotai)で歓迎されます。

## @swc-jotai/react-refresh

このプラグインは、Jotai atomにReact Refreshのサポートを追加します。これにより、React Refreshを使用した開発中にステートがリセットされないことが保証されます。

### 使用方法

以下でインストールします：

```bash
npm install --save-dev @swc-jotai/react-refresh
```

プラグインを`.swcrc`に追加できます：

```json
{
  "jsc": {
    "experimental": {
      "plugins": [["@swc-jotai/react-refresh", {}]]
    }
  }
}
```

Next.jsの実験的なSWCプラグイン機能でこのプラグインを使用できます：

```javascript
module.exports = {
  experimental: {
    swcPlugins: [['@swc-jotai/react-refresh', {}]],
  },
}
```

## @swc-jotai/debug-label

Jotaiはキーではなくオブジェクト参照に基づいています。このプラグインは、識別子に基づいて各atomに`debugLabel`を追加します。

プラグインはこのコードを：

```javascript
export const countAtom = atom(0)
```

次のように変換します：

```javascript
export const countAtom = atom(0)
countAtom.debugLabel = 'countAtom'
```

### 使用方法

以下でインストールします：

```bash
npm install --save-dev @swc-jotai/debug-label
```

プラグインを`.swcrc`に追加できます：

```json
{
  "jsc": {
    "experimental": {
      "plugins": [["@swc-jotai/debug-label", {}]]
    }
  }
}
```

### カスタムatom名

カスタムatomに対してプラグインを有効にできます：

```javascript
module.exports = {
  experimental: {
    swcPlugins: [
      ['@swc-jotai/debug-label', { atomNames: ['customAtom'] }],
    ],
  },
}
```

## 注意事項

- これらのプラグインはSWCの実験的機能を使用します
- Next.js 13以降では、実験的なSWCプラグインサポートが必要です
- プラグインのパフォーマンスと互換性は変更される可能性があります
