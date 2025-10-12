# crossOrigin

`crossOrigin` オプションを使用して、[`next/script`](/docs/app/guides/scripts)コンポーネントによって生成されるすべての `<script>` タグに[`crossOrigin` 属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)を追加し、クロスオリジンリクエストの処理方法を定義できます。

## 設定

```javascript
module.exports = {
  crossOrigin: 'anonymous',
}
```

## オプション

- `'anonymous'`: [`crossOrigin="anonymous"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin#anonymous)属性を追加します。
- `'use-credentials'`: [`crossOrigin="use-credentials"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin#use-credentials)属性を追加します。

この設定により、Next.jsアプリケーションでクロスオリジンスクリプトの読み込み方法を制御し、リソースアクセスとセキュリティの管理に柔軟性を提供できます。
