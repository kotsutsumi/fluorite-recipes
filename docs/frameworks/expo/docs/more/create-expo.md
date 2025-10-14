# create-expo-app

## 概要

`create-expo-app`は、新しいExpoおよびReact Nativeプロジェクトを作成するためのコマンドラインツールです。様々なテンプレートから選択でき、プロジェクトのセットアップを迅速かつ簡単に行えます。

## 基本的な使用方法

### クイックスタート

```bash
npx create-expo-app@latest
```

このコマンドを実行すると、インタラクティブなプロンプトが表示され、プロジェクト名とテンプレートを選択できます。

### プロジェクト名を指定して作成

```bash
npx create-expo-app@latest my-app
```

### デフォルトオプションで作成

```bash
npx create-expo-app@latest my-app --yes
```

`--yes`フラグを使用すると、すべてのプロンプトをスキップしてデフォルトオプションを使用します。

## サポートされているパッケージマネージャー

`create-expo-app`は、以下のパッケージマネージャーをサポートしています：

### npm

```bash
npx create-expo-app@latest my-app
```

### Yarn

#### Yarn Classic (v1)

```bash
yarn create expo-app my-app
```

#### Yarn Modern (v3+)

```bash
yarn create expo-app my-app
```

**注意**: Yarn Modernを使用する場合、EAS Buildとの互換性のためにnodeLinkerを設定する必要があります：

`.yarnrc.yml`:
```yaml
nodeLinker: node-modules
```

### pnpm

```bash
pnpm create expo-app my-app
```

### Bun

```bash
bunx create-expo-app my-app
```

**注意**: Bunは実験的なサポートであり、一部の機能が正常に動作しない場合があります。

## コマンドラインオプション

### `--yes` / `-y`

すべてのプロンプトをスキップし、デフォルトオプションを使用します。

```bash
npx create-expo-app@latest my-app --yes
```

### `--no-install`

依存関係のインストールをスキップします。

```bash
npx create-expo-app@latest my-app --no-install
```

プロジェクト作成後、手動でインストールする必要があります：

```bash
cd my-app
npm install
```

### `--template`

使用するテンプレートを指定します。

```bash
npx create-expo-app@latest my-app --template blank
```

### `--example`

Expoの公式サンプルリポジトリからプロジェクトを初期化します。

```bash
npx create-expo-app@latest my-app --example with-router
```

### `--version` / `-v`

`create-expo-app`のバージョン番号を表示します。

```bash
npx create-expo-app@latest --version
```

### `--help` / `-h`

利用可能なオプションを表示します。

```bash
npx create-expo-app@latest --help
```

## 利用可能なテンプレート

### 1. default

**説明**: マルチスクリーンアプリで、推奨ツールを含みます。

**特徴**:
- Expo Router によるファイルベースルーティング
- TypeScript サポート
- 基本的なナビゲーション構造
- タブベースのレイアウト

```bash
npx create-expo-app@latest my-app --template default
```

### 2. blank

**説明**: 最小限の依存関係を持つシンプルなテンプレート。

**特徴**:
- 最小限のセットアップ
- JavaScript
- 単一画面

```bash
npx create-expo-app@latest my-app --template blank
```

### 3. blank-typescript

**説明**: TypeScriptサポート付きのblankテンプレート。

**特徴**:
- 最小限のセットアップ
- TypeScript設定済み
- 単一画面

```bash
npx create-expo-app@latest my-app --template blank-typescript
```

### 4. tabs

**説明**: Expo Routerによるファイルベースルーティングを含むテンプレート。

**特徴**:
- Expo Router
- タブナビゲーション
- TypeScript
- マルチスクリーン構造

```bash
npx create-expo-app@latest my-app --template tabs
```

### 5. bare-minimum

**説明**: ネイティブディレクトリ（`android`と`ios`）を含むテンプレート。

**特徴**:
- ネイティブプロジェクトディレクトリ
- カスタムネイティブコード対応
- 最小限のExpo SDK

```bash
npx create-expo-app@latest my-app --template bare-minimum
```

**注意**: このテンプレートは、ネイティブコードのカスタマイズが必要な場合にのみ使用してください。

## サンプルからの作成

Expoの公式サンプルリポジトリから、特定のユースケース向けのプロジェクトを作成できます。

### 利用可能なサンプル

```bash
# Expo Router を使用したナビゲーション
npx create-expo-app@latest my-app --example with-router

# TypeScript を使用した基本プロジェクト
npx create-expo-app@latest my-app --example with-typescript

# Redux を使用した状態管理
npx create-expo-app@latest my-app --example with-redux

# React Native Paper を使用したUI
npx create-expo-app@latest my-app --example with-react-native-paper
```

サンプルの完全なリストは、[Expo Examples リポジトリ](https://github.com/expo/examples)で確認できます。

## プロジェクト構造

### defaultテンプレートの構造

```
my-app/
├── app/                    # Expo Router のルートディレクトリ
│   ├── (tabs)/            # タブナビゲーション
│   │   ├── index.tsx      # ホーム画面
│   │   └── explore.tsx    # 探索画面
│   ├── _layout.tsx        # ルートレイアウト
│   └── +not-found.tsx     # 404画面
├── assets/                # 画像、フォント、その他のアセット
│   ├── images/
│   └── fonts/
├── components/            # 再利用可能なコンポーネント
│   ├── ThemedText.tsx
│   └── ThemedView.tsx
├── constants/             # 定数とテーマ
│   └── Colors.ts
├── hooks/                 # カスタムReactフック
│   └── useColorScheme.ts
├── app.json               # Expo設定
├── package.json           # 依存関係
└── tsconfig.json          # TypeScript設定
```

### blankテンプレートの構造

```
my-app/
├── assets/                # アセット
├── App.js                 # メインアプリケーションファイル
├── app.json               # Expo設定
└── package.json           # 依存関係
```

## パッケージマネージャー別の設定

### npm

追加の設定は不要です。

```bash
npx create-expo-app@latest my-app
cd my-app
npm start
```

### Yarn Classic (v1)

追加の設定は不要です。

```bash
yarn create expo-app my-app
cd my-app
yarn start
```

### Yarn Modern (v3+)

`.yarnrc.yml`を設定する必要があります：

```yaml
nodeLinker: node-modules
```

EAS Buildを使用する場合も、この設定が必要です。

```bash
yarn create expo-app my-app
cd my-app
echo "nodeLinker: node-modules" > .yarnrc.yml
yarn install
yarn start
```

### pnpm

追加の設定は不要ですが、一部のネイティブ依存関係で問題が発生する可能性があります。

```bash
pnpm create expo-app my-app
cd my-app
pnpm start
```

### Bun

実験的なサポートです。

```bash
bunx create-expo-app my-app
cd my-app
bun start
```

## プロジェクト作成後の次のステップ

### 1. 開発サーバーの起動

```bash
cd my-app
npx expo start
```

### 2. デバイスでアプリを実行

#### Expo Go アプリを使用

1. iOSまたはAndroidデバイスにExpo Goアプリをインストール
2. 表示されるQRコードをスキャン

#### iOS シミュレーター

```bash
npx expo start --ios
```

#### Android エミュレーター

```bash
npx expo start --android
```

#### Web ブラウザ

```bash
npx expo start --web
```

### 3. Development Build の作成（推奨）

本番レベルのアプリには、Development Buildの使用を推奨します。

```bash
npx expo install expo-dev-client
npx expo prebuild
```

### 4. EAS Build の設定

```bash
npm install -g eas-cli
eas login
eas build:configure
```

## トラブルシューティング

### ポート競合

デフォルトポート（19000）が使用されている場合：

```bash
npx expo start --port 8081
```

### キャッシュの問題

```bash
npx expo start --clear
```

### 依存関係の問題

```bash
rm -rf node_modules
npm install
```

### ネイティブモジュールの問題

```bash
npx expo prebuild --clean
```

## ベストプラクティス

### 1. 適切なテンプレートを選択

- **学習目的**: `blank`または`blank-typescript`
- **本番アプリ**: `default`または`tabs`
- **ネイティブカスタマイズ**: `bare-minimum`（必要な場合のみ）

### 2. TypeScriptを使用

TypeScriptは型安全性を提供し、大規模アプリケーションの保守性を向上させます。

```bash
npx create-expo-app@latest my-app --template blank-typescript
```

### 3. バージョン管理

プロジェクト作成直後にGitリポジトリを初期化します：

```bash
cd my-app
git init
git add .
git commit -m "Initial commit"
```

### 4. 環境変数の管理

機密情報は`.env`ファイルに保存し、`.gitignore`に追加します：

```bash
# .gitignore
.env
.env.local
```

### 5. 依存関係の管理

`expo install`を使用して、互換性のあるバージョンをインストールします：

```bash
npx expo install expo-camera expo-location
```

## よくある質問（FAQ）

### Q: Expo GoとDevelopment Buildの違いは？

**A**: Expo Goは、カスタムネイティブコードなしでExpoアプリを実行するためのサンドボックスアプリです。Development Buildは、カスタムネイティブコードを含むビルドで、本番アプリに推奨されます。

### Q: テンプレートを後から変更できますか？

**A**: いいえ、テンプレートは初期プロジェクト構造を提供するだけです。後から手動でファイルを追加・変更する必要があります。

### Q: 既存のReact Nativeプロジェクトに使用できますか？

**A**: いいえ、`create-expo-app`は新規プロジェクト専用です。既存のReact NativeプロジェクトにExpoを追加するには、[公式ガイド](https://docs.expo.dev/bare/installing-expo-modules/)を参照してください。

### Q: オフラインで使用できますか？

**A**: 初回実行時にはインターネット接続が必要ですが、テンプレートはキャッシュされるため、以降はオフラインでも使用できます。

## リソース

- [Expo ドキュメント](https://docs.expo.dev/)
- [Expo Examples リポジトリ](https://github.com/expo/examples)
- [Expo GitHub リポジトリ](https://github.com/expo/expo)
- [Expo Forums](https://forums.expo.dev/)
- [Discord コミュニティ](https://chat.expo.dev/)

## まとめ

`create-expo-app`は、Expoプロジェクトを素早く開始するための強力なツールです。様々なテンプレートとオプションを提供し、プロジェクトのニーズに合わせてカスタマイズできます。

新しいプロジェクトを開始する際は、適切なテンプレートを選択し、ベストプラクティスに従って、効率的な開発ワークフローを確立しましょう。
