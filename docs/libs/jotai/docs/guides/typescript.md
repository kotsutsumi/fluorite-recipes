# TypeScript

## バージョン要件

Jotaiは以下を必要とします：
- TypeScript 3.8+
- `strictNullChecks`を有効にする必要があります
- tsconfig.jsonに`"strict": true`を追加することを推奨します

## Atomの型処理

### Primitive Atoms

```typescript
// 型推論
const numAtom = atom(0)
const strAtom = atom('')

// 明示的な型指定
const numAtom = atom<number>(0)
const numAtom = atom<number | null>(0)
const arrAtom = atom<string[]>([])
```

Jotaiは初期値から型を推論できますが、より複雑な型の場合は明示的に指定することもできます。

### Derived Atoms

さまざまなderived atomタイプをサポートしています：

#### Read-Only Atoms

```typescript
const readOnlyAtom = atom((get) => get(numAtom))
const asyncReadOnlyAtom = atom(async (get) => await get(someAsyncAtom))
```

#### Write-Only Atoms

```typescript
const writeOnlyAtom = atom(null, (get, set, str: string) => set(fooAtom, str))
```

Write-only atomsの場合、read関数には`null`を渡します。

#### Read/Write Atoms

```typescript
const readWriteAtom = atom(
  (get) => get(strAtom),
  (get, set, num: number) => set(strAtom, String(num))
)
```

### Derived Atomsの明示的な型指定

より複雑なケースでは、明示的な型を指定できます：

```typescript
const asyncStrAtom = atom<Promise<string>>(async () => 'foo')

const writeOnlyAtom = atom<null, [string, number], void>(
  null,
  (get, set, stringValue, numberValue) => set(fooAtom, stringValue)
)
```

型パラメータは以下の通りです：
- 最初の型パラメータ：atomの値の型
- 2番目の型パラメータ：write関数の引数の型（配列として）
- 3番目の型パラメータ：write関数の戻り値の型

## useAtomでの型推論

`useAtom`フックは、atomの型に基づいて自動的に型付けされます：

```typescript
const [num, setNum] = useAtom(primitiveNumAtom)
// num: number, setNum: (update: number | ((prev: number) => number)) => void

const [num] = useAtom(readOnlyNumAtom)
// num: number
// setNumは存在しません

const [, setNum] = useAtom(writeOnlyNumAtom)
// numは存在しません
// setNum: (arg: number) => void
```

## Atom値の型の抽出

既存のatomから型を抽出することができます：

```typescript
import { ExtractAtomValue, useAtomValue } from 'jotai'

type NumValue = ExtractAtomValue<typeof numAtom>
// NumValue は number

const Component = () => {
  const num = useAtomValue(numAtom)
  // num: number
}
```

これは、atomの定義から型を再利用する場合に便利です。

## Async Atomsの型

Async atomsはpromiseを値として持つatomです：

```typescript
const asyncAtom = atom(async () => 'foo')
// 型: Atom<Promise<string>>

const Component = () => {
  const str = useAtomValue(asyncAtom)
  // str: string (useAtomValueは自動的にpromiseを解決します)
}
```

`useAtomValue`と`useAtom`は自動的にpromiseを解決するため、コンポーネント内では解決された値を直接使用できます。

## Write関数の型

Write関数は複数の引数を受け取り、値を返すことができます：

```typescript
const multiArgAtom = atom(
  null,
  (get, set, arg1: string, arg2: number, arg3: boolean) => {
    // ...
    return 'result'
  }
)

// 使用法
const [, setMultiArg] = useAtom(multiArgAtom)
setMultiArg('foo', 42, true)
```

## 高度な型パターン

### 条件付き型

条件付き型を使用して、atomの動作をカスタマイズできます：

```typescript
type MaybePromise<T> = T | Promise<T>

const flexibleAtom = atom<MaybePromise<string>>(async () => 'foo')
```

### ジェネリックAtoms

再利用可能なatom作成関数を作成できます：

```typescript
function atomFamily<T>(initialValue: T) {
  return atom<T>(initialValue)
}

const strAtom = atomFamily('')
const numAtom = atomFamily(0)
```

## 型安全性のベストプラクティス

1. **明示的な型を使用する**：複雑なatomには明示的な型を指定します
2. **型推論を活用する**：シンプルなケースではTypeScriptの型推論を信頼します
3. **ExtractAtomValueを使用する**：既存のatomから型を抽出します
4. **strictモードを有効にする**：tsconfig.jsonで`strict: true`を使用します

## トラブルシューティング

### 型エラー：型が正しく推論されない

明示的な型パラメータを提供してください：

```typescript
const myAtom = atom<MyType>(initialValue)
```

### Write関数の引数の型エラー

write-only atomには明示的な型を指定してください：

```typescript
const writeOnlyAtom = atom<null, [MyArgType], void>(
  null,
  (get, set, arg) => {
    // argはMyArgType型です
  }
)
```

### Async atomの型エラー

Promise型を明示的に指定してください：

```typescript
const asyncAtom = atom<Promise<MyType>>(async () => {
  // ...
})
```

## まとめ

JotaiはTypeScriptと深く統合されており、強力な型安全性を提供します。型推論を活用しつつ、必要に応じて明示的な型を指定することで、型安全なstate管理を実現できます。
