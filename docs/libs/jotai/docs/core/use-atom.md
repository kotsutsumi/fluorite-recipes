# useAtom

## 概要

`useAtom`は、Jotaiでアトムの状態を読み取りおよび更新するためのフックです。Reactの`useState`と同様に、アトムの値と更新関数のタプルを返します。

## 主な特徴

- 最初の使用時にアトムの値を作成
- プリミティブアトムと派生アトムの両方をサポート
- アトムの依存関係を動的に管理
- オンデマンドでアトムを作成可能

## 基本的な使い方

```javascript
const [value, setValue] = useAtom(anAtom)
```

## 重要な注意事項

- アトムを作成する際は参照の等価性が重要です
- 毎回のレンダーでアトムを再作成すると無限ループが発生する可能性があります
- Reactが追加の再レンダーをトリガーする場合があります

## シグネチャ

```typescript
// 書き込み可能なアトム
function useAtom<Value, Update>(
  atom: WritableAtom<Value, Update>,
  options?: { store?: Store }
): [Value, SetAtom<Update>]

// 読み取り専用アトム
function useAtom<Value>(
  atom: Atom<Value>,
  options?: { store?: Store }
): [Value, never]
```

## 関連フック

- `useAtomValue`: 読み取り専用のアトムアクセス
- `useSetAtom`: 読み取りなしでアトムを更新

## 依存関係の管理

- 依存関係は「read」関数が呼び出されるたびにリフレッシュされます
- 依存関係のあるアトムは動的に追跡および更新されます

## アトム作成戦略

- コンポーネントの外部または内部でアトムを作成可能
- レンダー関数内でアトムを作成する場合は、メモ化のために`useRef`または`useMemo`を使用
- キャッシングとパラメータ化されたアトムをサポート

このドキュメントは、Jotaiの状態管理で`useAtom`フックを効果的に使用するための包括的なガイダンスを提供します。
