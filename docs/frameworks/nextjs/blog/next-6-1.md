# Next.js 6.1

**投稿日**: 2018年6月27日（水曜日）

**著者**: Tim Neutkens ([@timneutkens](https://twitter.com/timneutkens))

## 主なハイライト

- ホットリロードの信頼性向上
- コードベースの改善
- Next.jsコードモッド
- nextjs.orgがオープンソース化

## 主な変更点

### 1. ホットリロードの改善

- `react-hot-loader`依存関係を削除
- Next.jsの内部ホットリロード機能を維持
- 開発モードと本番モードをより一貫性のあるものに

### 2. ページ拡張子のサポート

- カスタムページ拡張子（`.ts`、`.tsx`、`.mdx`など）の自動ホットリロードを追加
- Next.jsプラグインの設定を簡素化

### 3. コードベースの強化

- `server/build`ディレクトリをトップレベルの`build`に移動
- Flow型アノテーションを追加
- `.next/dist`を`.next/server`にリネーム

### 4. URLプロパティのコードモッド

- ページコンポーネントの魔法のような`url`プロパティを非推奨化
- 推奨される代替として`withRouter`を導入
- コードを自動的に移行するための`next-codemod`を作成

## コード移行例

旧スタイル：
```jsx
class Page extends React.Component {
  render() {
    const { url } = this.props;
    return <div>{url.pathname}</div>;
  }
}
```

新スタイル：
```jsx
import { withRouter } from 'next/router';
class Page extends React.Component {
  render() {
    const { router } = this.props;
    return <div>{router.pathname}</div>;
  }
}
export default withRouter(Page);
```

## オープンソース化

このブログ記事では、nextjs.orgがオープンソース化され、コミュニティの貢献を募集していることも発表されました。
