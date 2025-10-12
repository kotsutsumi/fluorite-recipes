# Next.js 9.3

**投稿日**: 2020年3月9日（月曜日）

**著者**:
- JJ Kasper ([@_ijjk](https://twitter.com/_ijjk))
- Joe Haddad ([@timer150](https://twitter.com/timer150))
- Luis Alvarez ([@luis_fades](https://twitter.com/luis_fades))
- Shu Uesugi ([@chibicode](https://twitter.com/chibicode))
- Tim Neutkens ([@timneutkens](https://twitter.com/timneutkens))

## 主な機能

このブログ記事では、Next.js 9.3のいくつかの重要な改善を紹介しています：

### 1. 次世代の静的サイト生成（SSG）サポート

- 新しいデータフェッチメソッドを通じた組み込み最適化静的生成
- `getStaticProps`、`getStaticPaths`、`getServerSideProps`を導入

### 2. プレビューモード

- 静的に生成されたページをバイパスして、CMSのドラフトを表示可能

### 3. 組み込みSassサポート

- `.scss`ファイルでのグローバルスタイルシートインポート
- `.module.scss`でのCSSモジュールサポート

### 4. 404ページの自動静的最適化

- 404ページを静的に提供することで、速度と信頼性を向上

### 5. ランタイムの最適化

- 32 kB小さいランタイムサイズ
- バンドルサイズを削減する強力な最適化

### 6. コミュニティ

- Next.jsにはコミュニティインタラクションのためのGitHub Discussionsが追加

## 更新手順

```bash
npm i next@latest react@latest react-dom@latest
```

## まとめ

この記事では、`getStaticProps`や`getStaticPaths`などの新しいデータフェッチメソッドについて詳細な説明を提供し、静的サイト生成とサーバーサイドレンダリングに使用する方法をコード例で示しています。
