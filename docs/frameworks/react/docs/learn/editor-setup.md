# エディタのセットアップ

エディタを適切に設定することで、コードが読みやすく、素早く書けるようになります。さらに、書いている途中でバグを検出するのにも役立ちます！ エディタの設定をするのが初めてである、あるいは現在使用しているエディタをチューンアップしたいという場合、いくつかのおすすめがあります。

## このページで学ぶこと

- 最も人気があるエディタの紹介
- コードを自動フォーマットする方法

## エディタを選ぶ

[VS Code](https://code.visualstudio.com/) は、現在最も一般的に使用されているエディタのひとつです。マーケットプレイスには多くの拡張機能があり、GitHub のような人気のサービスとも良く統合されています。以下で説明する多くの機能も、VS Code に拡張機能として追加することができるため、高度にカスタマイズできます。

他に React コミュニティで使用されている人気のテキストエディタとしては以下のようなものがあります：

- [WebStorm](https://www.jetbrains.com/webstorm/) は、JavaScript に特化した統合開発環境です。
- [Sublime Text](https://www.sublimetext.com/) は、JSX や TypeScript のサポート、[シンタックスハイライト](https://stackoverflow.com/a/70960574/458193)、オートコンプリート機能を組み込みで有しています。
- [Vim](https://www.vim.org/) は、あらゆる種類のテキストの作成や編集を効率的に行うために作られた、高度にカスタマイズ可能なテキストエディタです。ほとんどの UNIX システムや Apple の macOS には "vi" として含まれています。

## テキストエディタ機能のお勧め

一部のエディタにはこれらの機能が組み込まれていますが、他のエディタでは拡張機能を追加する必要があるかもしれません。お使いのエディタがどのようなサポートを提供しているか確認してください！

### リント

コードリンタは、書きながらコード内の問題を見つけて、問題を早期に修正できるようにしてくれます。[ESLint](https://eslint.org/) は、人気の JavaScript 用オープンソースリンタです。

- [React に適した構成の ESLint をインストール](https://www.npmjs.com/package/eslint-config-react-app)（[Node がインストールされていることを確認してください！](https://nodejs.org/en/download/current/)）
- [VS Code に公式の ESLint 拡張機能を統合する](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**プロジェクトに対して [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) のすべてのルールを有効にしていることを確認してください。** これらは必須であり、最も重大なバグを早期にキャッチします。推奨される [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) プリセットにはすでにこれらが含まれています。

### フォーマット

他の貢献者とコードを共有する際に最もやりたくないことは、[タブとスペース](https://www.google.com/search?q=tabs+vs+spaces)についての議論に巻き込まれることです！幸いなことに、[Prettier](https://prettier.io/) は、事前設定されたルールに従ってコードを再フォーマットすることで、コードをクリーンに保ってくれます。Prettier を実行すると、すべてのタブがスペースに変換され、インデント、引用符なども設定に従って変更されます。理想的なセットアップでは、ファイルを保存すると Prettier が実行され、これらの編集を素早く行ってくれます。

以下の手順で [VS Code に Prettier 拡張機能](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)をインストールできます：

1. VS Code を起動する
2. クイックオープンを使用する（Ctrl/Cmd+P を押す）
3. `ext install esbenp.prettier-vscode` を貼り付ける
4. Enter を押す

#### 保存時のフォーマット

理想的には、保存するたびにコードをフォーマットするべきです。VS Code にはこのための設定があります！

1. VS Code で、`Ctrl/Cmd + Shift + P` を押す
2. "settings" と入力する
3. Enter を押す
4. 検索バーに "format on save" と入力する
5. "format on save" オプションにチェックが入っていることを確認する！

> **注意**
>
> ESLint のプリセットにフォーマットルールがある場合、Prettier と競合する可能性があります。ESLint がロジカルなミスをキャッチするためだけに使用され、フォーマットは *行わない* ように、[`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) を使用して ESLint プリセット内のすべてのフォーマットルールを無効にすることをお勧めします。プルリクエストがマージされる前にファイルがフォーマットされていることを強制したい場合は、継続的インテグレーションのために [`prettier --check`](https://prettier.io/docs/en/cli.html#--check) を使用してください。
