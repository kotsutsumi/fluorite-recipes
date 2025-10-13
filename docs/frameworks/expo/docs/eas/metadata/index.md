# EAS Metadata

## 概要

EAS Metadataは、コマンドラインからアプリストアのプレゼンスを自動化および維持するためのツールです。主な機能には以下が含まれます：

> EAS Metadataはプレビュー段階であり、破壊的な変更が加えられる可能性があります。

### 主な利点
- アプリストア情報の送信を自動化
- `store.config.json`ファイルを使用してストアの詳細を提供
- `eas metadata:push`でストア設定を素早くプッシュ
- アプリストアでのリジェクト問題を事前に特定
- アプリ送信におけるチームコラボレーションを可能に

### コマンド例
```
eas metadata:push
```

### 推奨ツール
VS Codeユーザーの場合、[Expo Tools拡張機能](https://github.com/expo/vscode-expo#readme)が`store.config.json`ファイルの自動補完と提案を提供します。

## はじめにセクション
1. [イントロダクション](/eas/metadata/getting-started)
2. [ストア設定のカスタマイズ](/eas/metadata/config)
3. [ストア設定スキーマ](/eas/metadata/schema)

## 追加の注記
- 現在プレビュー段階
- 破壊的な変更が加えられる可能性あり
- アプリストア送信プロセスの簡素化を目指す
