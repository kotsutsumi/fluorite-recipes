# Next.js 10.1

**投稿日**: 2021年3月29日（月曜日）

**著者**:
- Belén Curcio
- JJ Kasper
- Joe Haddad
- Lee Robinson
- Luis Alvarez
- Shu Ding
- Steven
- Tim Neutkens

## 主な改善点

### 1. 3倍高速なリフレッシュ

- 「変更なしで200ms高速なリフレッシュ」
- 既存のコードを変更せずにFast Refreshのパフォーマンスを改善

### 2. インストール時間の改善

- インストールサイズが58%削減
- 依存関係が56%削減
- 平均インストール時間を約15秒から約5秒に短縮

### 3. `next/image`の改善

- Apple Silicon（M1）サポートを追加
- 新しいレイアウトオプション：
  * `layout=fill`
  * `layout=fixed`
  * `layout=responsive`
  * `layout=intrinsic`
- カスタム画像ローダーサポート

### 4. Next.js Commerce Shopify統合

- eコマースアプリケーション用のプロバイダー非依存UI
- 柔軟なデータレイヤー

### 5. 追加機能

- カスタム500エラーページ
- `tsconfig.json`での`extends`サポート
- プレビューモードの検出
- ルーターメソッドが上部にスクロール
- ドキュメントの改善

## まとめ

このブログ記事は、Next.js 10.1における継続的な最適化と開発者体験の改善を強調しています。
