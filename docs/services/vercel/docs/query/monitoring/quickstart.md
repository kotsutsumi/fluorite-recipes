# モニタリングクイックスタート

## 前提条件

- ProまたはEnterpriseプランへのアップグレード
- ProおよびEnterpriseチームは「Observability Plusにアップグレードしてモニタリングにアクセス」する必要があります

## 新しいクエリの作成

### ダッシュボードに移動

1. Monitoringタブに移動
2. 「Create New Query」ボタンをクリック
3. 「Edit Query」ボタンをクリックしてクエリ句を設定

### Visualize句を追加

- Visualize句を`requests`に設定
- 行われたリクエストの総数を表示
- クエリを実行してMonitoringチャートを確認

### Where句を追加

- Where句を使用してクエリデータをフィルタリング
- サンプルクエリ文:
  ```
  host = 'my-site.com' and like(request_path, '/posts%')
  ```
- `%`はワイルドカードとして機能し、`/posts`の後の文字に一致

### Group By句を追加

- グループ化基準を定義
- Group By句を`request_path`に設定
- リクエストパスでフィルタリングされたリクエストの合計を表示

### Limit句を追加

- クエリ結果の数を制御
- オプション: 5、10、25、50、または100件の結果
- 例: 5件のクエリ結果に制限を設定

### クエリの保存と実行

- クエリを保存
- 「Run Query」をクリック
- 最も多くリクエストされた上位5件の投稿を含むMonitoringチャートを表示

## 重要な注意事項

「Proプラン向けのモニタリングは2025年11月の次回請求サイクル終了時にサンセット予定」

## クエリの例

### ホスト名別のリクエスト

```sql
Visualize: requests
Group By: host
```

### エラー率の監視

```sql
Visualize: requests
Where: status >= 500
Group By: request_path
```

### 遅いリクエストの追跡

```sql
Visualize: duration
Where: duration > 1000
Group By: request_path
Limit: 10
```

## ベストプラクティス

### クエリの構築

1. シンプルなクエリから開始
2. 徐々にフィルタを追加
3. 結果を検証
4. 将来の使用のために保存

### パフォーマンスの最適化

- 適切なLimit値を使用
- 必要なフィールドのみをグループ化
- 関連する時間範囲を選択

### クエリの整理

- 説明的な名前を使用
- 関連するクエリをグループ化
- ドキュメント化された目的

## 次のステップ

- より複雑なクエリを探索
- [モニタリングリファレンス](/docs/query/monitoring/monitoring-reference)を確認
- [Observability Query](/docs/query)への移行を検討

## トラブルシューティング

### クエリが結果を返さない

- フィルタが厳しすぎないか確認
- 時間範囲を調整
- データが存在することを確認

### 予期しない結果

- Where句の構文を確認
- グループ化ロジックを確認
- サンプルデータで検証

## 関連リソース

- [モニタリングの概要](/docs/query/monitoring)
- [モニタリングリファレンス](/docs/query/monitoring/monitoring-reference)
- [料金と制限](/docs/query/monitoring/limits-and-pricing)
