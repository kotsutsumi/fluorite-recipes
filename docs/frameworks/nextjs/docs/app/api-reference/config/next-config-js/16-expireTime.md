# expireTime

ISRが有効なページの `Cache-Control` ヘッダーでCDNが消費するカスタム `stale-while-revalidate` 有効期限時間を指定できます。

`next.config.js` を開き、`expireTime` 設定を追加します：

```javascript
module.exports = {
  // 秒単位で1時間
  expireTime: 3600,
}
```

これで `Cache-Control` ヘッダーを送信する際、有効期限時間は特定の再検証期間に応じて計算されます。

例えば、パスで15分の再検証があり、有効期限時間が1時間の場合、生成される `Cache-Control` ヘッダーは `s-maxage=900, stale-while-revalidate=2700` となり、設定された有効期限時間より15分短い間、古い状態を保つことができます。
