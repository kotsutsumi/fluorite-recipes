# Next.js 9.1

**投稿日**: 2019年10月7日（月曜日）

**著者**:
- JJ Kasper ([@_ijjk](https://twitter.com/_ijjk))
- Joe Haddad ([@timer150](https://twitter.com/timer150))
- Luis Alvarez ([@luis_fades](https://twitter.com/luis_fades))
- Tim Neutkens ([@timneutkens](https://twitter.com/timneutkens))

## 主なハイライト

**このリリースの新機能：**
- `src`ディレクトリサポート：`pages`ディレクトリを`src`フォルダー内にネストできるようになりました
- `public`ディレクトリサポート：アプリケーションのURLのルートにマウントするファイルを定義

**このリリースでのプレビュー：**
- 組み込みCSSサポート
- 静的エラーページ
- Module / Nomodule
- 改善されたバンドル分割

## 詳細セクション

### srcディレクトリサポート

Next.jsでは、ルートではなく`src/pages`ディレクトリを作成できるようになりました。これにより、convention-over-configurationアプローチを維持しながら、より柔軟なプロジェクト構造をサポートします。

### publicディレクトリサポート

新しい`public`ディレクトリが古い`static`ディレクトリを置き換えます。`public`内のファイルは、ドメインルートに直接マッピングされます。たとえば、`public/robots.txt`は`/robots.txt`でアクセスできます。

### 組み込みCSSサポート

現在styled-jsxを使用しているNext.jsは、ネイティブのCSSインポートサポートを追加しています。約50%のNext.jsユーザーがすでにCSSプラグインを追加していたため、この機能はスタイリングを合理化することを目指しています。

グローバルCSSインポートの例：
```jsx
// pages/_app.js
import '../styles/global.css';
import App from 'next/app';

export default App;
```

## 更新手順

更新するには、次を実行します：
```bash
npm i next@latest react@latest react-dom@latest
```

## コミュニティハイライト

- 800人以上のコントリビューター
- 41,350以上のGitHubスター
- examplesディレクトリ内の210以上の例
- 11,250人以上のコミュニティメンバー

このリリースは、開発者体験とパフォーマンスの最適化に焦点を当てた、Next.jsの継続的な進化を強調しています。
