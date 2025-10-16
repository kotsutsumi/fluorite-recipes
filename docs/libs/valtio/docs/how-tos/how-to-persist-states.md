# stateを永続化する方法

## localStorageで永続化する

stateがJSONシリアライズ可能であれば、かなり簡単です。

```js
const state = proxy(
  JSON.parse(localStorage.getItem('foo')) || {
    count: 0,
    text: 'hello',
  },
)

subscribe(state, () => {
  localStorage.setItem('foo', JSON.stringify(state))
})
```

シリアライズ不可能な値がある場合は、デシリアライズ後にそれらを追加し、シリアライズ時には除外します。

**[valtio-persist](https://github.com/Noitidart/valtio-persist)は、これを支援できるライブラリです。**
