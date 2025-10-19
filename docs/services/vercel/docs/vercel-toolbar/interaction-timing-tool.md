# インタラクションタイミングツール

## 概要

インタラクションタイミングツールは、すべてのVercelプランで利用可能で、開発者がインタラクションレイテンシを検査するのに役立ちます。主な目的は、Core Web VitalsメトリックであるInteraction to Next Paint（INP）の良好なスコアを確保することです。

## インタラクションタイミングツールへのアクセス

ツールにアクセスするには：

1. ツールバーメニューを開く
2. 「Interaction Timing」オプションを選択
3. インタラクションが検出されると、バッジに現在のINPが表示される
4. 画面の右側にポップオーバーが開く

### ツールの機能

- 各インタラクションのタイムラインを表示
- 入力遅延、処理、レンダリングレイテンシを表示
- インタラクションパフォーマンスの詳細な内訳を提供

## インタラクションタイミングツールの設定

設定を変更するには：

1. ツールバーメニューを開く
2. 「Preferences」を選択
3. Measure Interaction Timing設定を選択：
   - 「On」：200msを超えるインタラクションのトーストを表示
   - 「On (Silent)」：トーストを表示せずにタイミングを追跡
   - 「Off」：トラッキングを完全に無効化

## 関連リソース

- [プレビューデプロイメントの概要](/docs/deployments/environments#preview-environment-pre-production)
- [プレビューデプロイメントでのコメント使用](/docs/comments/using-comments)
- [Draft Mode](/docs/draft-mode)
