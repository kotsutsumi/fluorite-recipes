# atomWithBroadcast

## 概要
`atomWithBroadcast`は、BroadcastChannel APIを使用してブラウザのタブやフレーム間でatomを共有するためのJotaiユーティリティです。

## 主要な機能
- 同一オリジン上のブラウジングコンテキスト間の通信を可能にします
- ウィンドウ、タブ、フレーム、ワーカー間で状態を共有します
- 基本的なコンテキスト間の状態同期を提供します

## 制限事項
> MDNドキュメントによると、BroadcastChannelでは初期化中にメッセージを受信することはサポートされていません

## コード例
```typescript
const broadAtom = atomWithBroadcast('count', 0)

const ListOfThings = () => {
  const [count, setCount] = useAtom(broadAtom)

  return (
    <div>
      {count}
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

## 実装の詳細
この関数は、特定のキーを持つブロードキャストチャネルを作成し、atomが異なるブラウジングコンテキスト間で通信できるようにします。リスナーのSetを使用し、コンテキスト間でのメッセージパッシングを管理します。

## 潜在的なユースケース
- ブラウザタブ間での状態の同期
- タブ間通信の実装
- localStorageを使用せずにシンプルな状態を共有
