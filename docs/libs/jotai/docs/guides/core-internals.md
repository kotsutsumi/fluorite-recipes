# コアの内部構造

このドキュメントでは、React用の状態管理ライブラリであるJotaiの内部実装を、コアメカニズムの2つの簡略化されたバージョンを通じて探ります。

## 第1バージョン

### 主要な概念

- atomは、設定オブジェクトを返す関数です
- WeakMapを使用してatomの状態を追跡し、メモリリークを防ぎます
- `useAtom`フックは、現在の値とsetter関数を返します
- atomの値が変更されたときにリスナーに通知することで、状態の更新を管理します

### コード例（簡略化されたAtom実装）

```javascript
export const atom = (initialValue) => ({ init: initialValue })

const atomStateMap = new WeakMap()

const getAtomState = (atom) => {
  let atomState = atomStateMap.get(atom)
  if (!atomState) {
    atomState = { value: atom.init, listeners: new Set() }
    atomStateMap.set(atom, atomState)
  }
  return atomState
}

export const useAtom = (atom) => {
  const atomState = getAtomState(atom)
  const [value, setValue] = useState(atomState.value)

  // atomの状態とリスナーを管理
  useEffect(() => {
    const callback = () => setValue(atomState.value)
    atomState.listeners.add(callback)

    callback() // 初期値を設定
    return () => atomState.listeners.delete(callback)
  }, [atomState])

  const setAtom = (nextValue) => {
    atomState.value = nextValue
    atomState.listeners.forEach((l) => l())
  }

  return [value, setAtom]
}
```

### 主要な特徴

- 単純な状態管理メカニズム
- リスナーベースの更新通知
- WeakMapを使用した効率的なメモリ管理

## 第2バージョン

### 機能強化

- 派生atom（他のatomに依存するatom）をサポート
- 依存関係追跡を実装
- atomのより複雑な読み取りと書き込みメカニズム
- 状態が変更されたときの依存atomの再帰的通知

### 主要な機能

```javascript
export const atom = (read, write) => {
  if (typeof read === 'function') {
    return { read, write }
  }
  const config = {
    init: read,
    read: (get) => get(config),
    write:
      write ||
      ((get, set, update) => {
        set(config, typeof update === 'function' ? update(get(config)) : update)
      }),
  }
  return config
}

const atomStateMap = new WeakMap()

const getAtomState = (atom) => {
  let atomState = atomStateMap.get(atom)
  if (!atomState) {
    atomState = {
      value: atom.init,
      listeners: new Set(),
      dependents: new Set(),
    }
    atomStateMap.set(atom, atomState)
  }
  return atomState
}
```

### 読み取りと書き込みのメカニズム

```javascript
const readAtom = (atom) => {
  const atomState = getAtomState(atom)
  const get = (a) => {
    if (a === atom) {
      return atomState.value
    }
    const aState = getAtomState(a)
    aState.dependents.add(atom) // 依存関係を追跡
    return readAtom(a) // 再帰的な読み取り
  }
  const value = atom.read(get)
  atomState.value = value
  return value
}

const writeAtom = (atom, update) => {
  const atomState = getAtomState(atom)
  const get = (a) => {
    const aState = getAtomState(a)
    return aState.value
  }
  const set = (a, v) => {
    if (a === atom) {
      atomState.value = v
      atomState.dependents.forEach((d) => {
        if (d !== atom) readAtom(d)
      })
      atomState.listeners.forEach((l) => l())
      return
    }
    writeAtom(a, v)
  }
  atom.write(get, set, update)
}
```

### 主要な機能

- atomは、読み取り専用、書き込み専用、または読み取り/書き込み設定を持つことができます
- `dependents`セットを通じた依存関係追跡
- 再帰的な状態更新と通知

## まとめ

このドキュメントは、Reactアプリケーションにおける状態管理へのJotaiの柔軟でプリミティブなアプローチを強調しています。

### 第1バージョンの特徴
- シンプルな状態管理
- 基本的なリスナーパターン
- WeakMapベースのストレージ

### 第2バージョンの特徴
- 派生atomのサポート
- 依存関係グラフの追跡
- より高度な読み取り/書き込みロジック
- 再帰的な更新伝播

Jotaiは、Reactの状態管理のための柔軟で効率的なソリューションを提供します。
