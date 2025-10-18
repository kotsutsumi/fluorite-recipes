# Zustand Devtools ミドルウェア

## 概要
`devtools` ミドルウェアは、Reduxを必要とせずにRedux DevTools Extensionを使用したタイムトラベルデバッグを可能にします。

## 主な機能
- Zustandストアのデバッグを有効化
- Redux DevTools Extensionをサポート
- シンプルなストアとスライスベースのストアの両方で動作

## インストール
「`zustand/middleware` から `devtools` を使用するには、`@redux-devtools/extension` ライブラリをインストールする必要があります。」

## 基本的な使用方法

### シンプルなストアの例
```typescript
const useJungleStore = create<JungleStore>()(
  devtools((set) => ({
    bears: 0,
    addBear: () =>
      set((state) => ({ bears: state.bears + 1 }), undefined, 'jungle/addBear'),
  }))
)
```

### スライスパターンの例
```typescript
const useJungleStore = create<JungleStore>()(
  devtools((...args) => ({
    ...createBearSlice(...args),
    ...createFishSlice(...args),
  }))
)
```

## クリーンアップ
「ストアが不要になったら、ストアの `cleanup` メソッドを呼び出すことで、Redux DevToolsの接続をクリーンアップできます。」

```typescript
useStore.devtools.cleanup()
```

## トラブルシューティング
- 「デフォルトでは、Redux Devtoolsは一度に1つのストアしか表示しません」
- アクション名を指定しない場合、デフォルトで "anonymous" になります
- `anonymousActionType` パラメータで無名アクションタイプをカスタマイズできます

## 設定オプション
- `name`: DevTools接続のカスタム識別子
- `enabled`: DevToolsの有効/無効を切り替え（開発環境ではデフォルトで `true`）
- `anonymousActionType`: 名前のないアクションのカスタム名
- `store`: カスタムストア識別子
