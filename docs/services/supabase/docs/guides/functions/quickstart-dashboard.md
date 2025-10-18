# ダッシュボードを使用したEdge Functionsの概要

Supabaseを使用すると、ダッシュボードから直接Edge Functionsを作成できます。これにより、ローカル開発環境をセットアップせずに関数をデプロイできます。ダッシュボードのEdge Functions エディターには、DenoおよびSupabase固有のAPIのための組み込みの構文ハイライトとタイプチェック機能があります。

このガイドでは、Supabaseダッシュボードを使用して最初のEdge Functionを作成、テスト、デプロイする手順を説明します。10分以内にグローバルで動作する関数を持つことができます。

##### CLIを使用したい場合

Supabase CLIを使用して関数を作成およびデプロイすることもできます。[CLIクイックスタートガイド](/docs/guides/functions/quickstart)をご確認ください。

##### Supabaseを初めて使用する方

開始するには、Supabaseプロジェクトが必要です。まだない場合は、[database.new](https://database.new/)で新しいプロジェクトを作成してください。

## ステップ1: Edge Functions タブに移動

Supabaseプロジェクトダッシュボードに移動し、Edge Functions セクションを見つけます：

1. [Supabaseダッシュボード](/dashboard)に移動
2. プロジェクトを選択
3. 左サイドバーで**Edge Functions**をクリック

すべての関数を管理できるEdge Functions概要ページが表示されます。

## ステップ2: 最初の関数を作成

**「新しい関数をデプロイ」**ボタンをクリックし、**「エディターから」**を選択します。これにより、ダッシュボード内で直接関数を記述できるインラインエディターが開きます。
