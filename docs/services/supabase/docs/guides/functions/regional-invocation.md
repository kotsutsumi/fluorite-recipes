# リージョナル呼び出し

## 概要

Edge Functionsは自動的にユーザーに最も近いリージョンで実行され、ネットワークレイテンシを削減します。ただし、集中的なデータベースやストレージ操作の場合、データベースと同じリージョンで実行することでより良いパフォーマンスが得られます。

### リージョン固有の実行が推奨されるシナリオ

- **バルクデータベース操作**: 多数のレコードの追加または編集
- **ファイルアップロード**: 大きなファイルまたは複数のアップロードの処理
- **複雑なクエリ**: 複数のデータベースラウンドトリップを必要とする操作

## 利用可能なリージョン

### アジア太平洋

- `ap-northeast-1` (東京)
- `ap-northeast-2` (ソウル)
- `ap-south-1` (ムンバイ)
- `ap-southeast-1` (シンガポール)
- `ap-southeast-2` (シドニー)

### 北米

- `ca-central-1` (カナダ中部)
- `us-east-1` (バージニア北部)
- `us-west-1` (カリフォルニア北部)
- `us-west-2` (オレゴン)

### ヨーロッパ

- `eu-central-1` (フランクフルト)
- `eu-west-1` (アイルランド)
- `eu-west-2` (ロンドン)
- `eu-west-3` (パリ)

### 南米

- `sa-east-1` (サンパウロ)

## 使用方法

リージョンを指定するには以下の方法があります:

1. Supabaseクライアントライブラリ
2. `x-region` HTTPヘッダー

### JavaScriptの例

```javascript
import { createClient, FunctionRegion } from '@supabase/supabase-js'

const { data, error } = await supabase.functions.invoke('function-name', {
  // ...
  region: FunctionRegion.UsEast1, // us-east-1リージョンで実行
})
```

### cURLの例

```bash
curl --request POST 'https://<project_ref>.supabase.co/functions/v1/function-name' \
 --header 'x-region: us-east-1' # us-east-1リージョンで実行
```

## 追加の注意事項

`x-region`ヘッダーを追加できないリクエストの場合は、リージョン固有のURLを使用できます。詳細については、公式ドキュメントを参照してください。
