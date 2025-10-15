# React Compiler

React Compilerは、Reactアプリケーションを自動的に最適化するビルド時ツールです。このセクションでは、コンパイラの機能、インストール方法、段階的な導入戦略、デバッグ方法について学びます。

## Introduction

[React Compilerが何をするかを学び、メモ化を自動的に処理し、手動の`useMemo`、`useCallback`、`React.memo`の必要性を排除する方法を理解します。](./react-compiler/introduction.md)

## Installation

[ビルドツールでReact Compilerをインストールし、設定する方法を学びます。](./react-compiler/installation.md)

## Incremental Adoption

[既存のコードベースに段階的にReact Compilerを導入するための戦略を学びます。](./react-compiler/incremental-adoption.md)

## Debugging and Troubleshooting

[予期しない動作が発生した場合、コンパイラエラーとランタイムの問題の違いを理解し、一般的な破壊的パターンを特定し、体系的なデバッグワークフローに従うためのデバッグガイドを使用します。](./react-compiler/debugging.md)

## Configuration and Reference

詳細な設定オプションとAPIリファレンス:

- [Configuration Options](/reference/react-compiler/configuration) - Reactバージョンの互換性を含むすべてのコンパイラ設定オプション
- [Directives](/reference/react-compiler/directives) - 関数レベルのコンパイル制御
- [Compiling Libraries](/reference/react-compiler/compiling-libraries) - 事前コンパイルされたライブラリの出荷

## Additional Resources

追加情報と議論については、[React Compiler Working Group](https://github.com/reactwg/react-compiler)を確認することをお勧めします。

---

**注意**: React Compilerは現在リリース候補（RC）段階です。全員にコンパイラを試してフィードバックを提供することを推奨しています。
