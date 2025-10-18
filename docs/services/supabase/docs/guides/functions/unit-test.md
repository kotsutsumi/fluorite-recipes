# Supabase Edge Functionsのテスト

## 主要なポイント

### テストフレームワーク

- JavaScript/TypeScriptテストにはDenoの組み込みテストランナーを使用
- `supabase/functions/tests`ディレクトリにテストを作成することを推奨
- テストファイルは`[function-name]-test.ts`という命名規則に従う

### テストスクリプトの構造例

ドキュメントでは、以下を示す包括的なテストスクリプトの例を提供しています:

#### 1. 必要なライブラリのインポート

```typescript
import { assert, assertEquals } from 'jsr:@std/assert@1'
import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js@2'
import 'jsr:@std/dotenv/load'
```

#### 2. Supabaseクライアントの設定

環境変数から設定を読み込み、クライアントを初期化します。

#### 3. 主要なテスト関数

- `testClientCreation()`: データベース接続を検証
- `testHelloWorld()`: Edge Functionのレスポンスをテスト

### ローカルテストのワークフロー

Edge Functionsをローカルでテストするには:

#### 1. Supabaseサーバーを起動

```bash
supabase start
```

#### 2. Edge Functionsを起動

```bash
supabase functions serve
```

#### 3. 環境変数ファイルを作成

必要なシークレットを含む`.env`ファイルを作成します。

#### 4. Denoでテストを実行

```bash
deno test --allow-all supabase/functions/tests/function-one-test.ts
```

### ベストプラクティス

- プレースホルダー値を実際のSupabase設定に置き換える
- わかりやすいテスト名を使用する
- 接続の成功と期待される関数のレスポンスの両方を検証する

## 追加リソース

- [Denoテストドキュメント](https://docs.deno.com/runtime/manual/basics/testing/)
- [完全なガイド（Mansueliのブログ）](https://blog.mansueli.com/testing-supabase-edge-functions-with-deno-test)
