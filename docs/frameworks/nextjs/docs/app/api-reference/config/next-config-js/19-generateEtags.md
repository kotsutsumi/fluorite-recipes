# generateEtags

Next.jsはデフォルトですべてのページに対して[etag](https://en.wikipedia.org/wiki/HTTP_ETag)を生成します。キャッシュ戦略によっては、HTMLページのetag生成を無効にしたい場合があります。

`next.config.js` を開き、`generateEtags` オプションを無効にします：

```javascript
module.exports = {
  generateEtags: false,
}
```
