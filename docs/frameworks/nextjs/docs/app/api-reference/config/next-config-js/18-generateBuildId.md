# generateBuildId

Next.jsは `next build` 中にIDを生成し、提供されているアプリケーションのバージョンを識別します。同じビルドを使用して複数のコンテナを起動する必要があります。

環境の各ステージごとに再ビルドする場合は、コンテナ間で使用する一貫したビルドIDを生成する必要があります。`next.config.js` で `generateBuildId` コマンドを使用します：

```javascript
module.exports = {
  generateBuildId: async () => {
    // これは何でもよく、最新のgitハッシュを使用しています
    return process.env.GIT_HASH
  },
}
```

この設定により、次のことができます：
- カスタムビルドIDを作成
- 異なるデプロイメントステージ間で一貫した識別を保証
- gitハッシュなどの環境固有の識別子を使用

この関数は非同期であり、現在のビルドを一意に識別する文字列を返す必要があります。
