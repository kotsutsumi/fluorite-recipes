# vercel install

`vercel install` コマンドは、[ネイティブ統合](/docs/integrations/create-integration#native-integrations)をインストールするために使用され、既存のインストールに[製品を追加](/docs/integrations/marketplace-product#create-your-product)するオプションがあります。

## 使用方法

まだ統合をインストールしていない場合、Vercelダッシュボードを開き、Vercel Marketplaceの利用規約に同意するよう求められます。その後、ダッシュボードで製品を追加するか、製品追加のステップをキャンセルするかを選択できます。

既存のプロバイダーとのインストールがある場合、CLIから直接、ダッシュボードで選択する内容に対応する一連の質問に答えて製品を追加できます。

### 使用例

```bash
vercel install acme
```

上記のコマンドは、ACMEの統合をインストールします。

`acme`の値は、マーケットプレイスのURLからプロバイダーのスラッグを参照して取得できます。例えば、`https://vercel.com/marketplace/gel`の場合、`acme`は`gel`になります。

## 統合の種類

- ネイティブ統合：Vercelプラットフォームに直接統合されたサービス
- マーケットプレイス統合：サードパーティが提供する統合

## インストールフロー

1. CLIコマンドを実行
2. ブラウザでVercelダッシュボードが開く
3. 統合の詳細を確認
4. 利用規約に同意
5. 製品を選択して追加
6. インストール完了

## グローバルオプション

以下の[グローバルオプション](/docs/cli/global-options)を`vercel install`コマンドで使用できます。
