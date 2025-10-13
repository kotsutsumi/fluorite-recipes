# サイトマップ

Expo Routerのサイトマップ機能を学びます。

## サイトマップとは

Expo Routerは、アプリ内のすべてのルートをリスト化する`/_sitemap`ルートを自動的に生成します。デバッグやルート構造の確認に便利です。

## アクセス方法

開発サーバーで以下のURLにアクセスします：

```
http://localhost:8081/_sitemap
```

## サイトマップの無効化

### app.jsonでの設定

サイトマップが不要な場合は、設定で無効化できます。

```json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          "sitemap": false
        }
      ]
    ]
  }
}
```

## ディープリンクのテスト

### uri-scheme CLIの使用

`uri-scheme`コマンドラインツールを使用して、ネイティブリンクをテストできます。

```bash
npx uri-scheme open exp://192.168.87.39:19000/--/form-sheet --ios
```

**パラメータ**：
- IPアドレスは、`npx expo start`を実行した際に表示されるものを使用
- `--ios`はiOSシミュレーターで開く
- `--android`はAndroidエミュレーターで開く

### ブラウザでのテスト

SafariやChromeなどのブラウザでディープリンクをテストすることもできます。

```
exp://localhost:8081/--/about
```

## 使用例

### プロジェクト構造の確認

サイトマップを使用して、ルート構造を視覚的に確認できます。

**プロジェクト構造**：
```
app/
├── index.tsx
├── about.tsx
├── (tabs)/
│   ├── home.tsx
│   └── profile.tsx
└── users/
    └── [id].tsx
```

**サイトマップ出力**：
```
/_sitemap
/
/about
/(tabs)/home
/(tabs)/profile
/users/[id]
```

### ディープリンクURLの生成

サイトマップを参考に、ディープリンクURLを生成できます。

```bash
# ホーム画面
npx uri-scheme open exp://192.168.87.39:19000/--/ --ios

# About画面
npx uri-scheme open exp://192.168.87.39:19000/--/about --ios

# ユーザー詳細画面
npx uri-scheme open exp://192.168.87.39:19000/--/users/123 --ios
```

## まとめ

Expo Routerのサイトマップは、以下の特徴があります：

1. **自動生成**: すべてのルートを自動的にリスト化
2. **デバッグ支援**: ルート構造の確認に便利
3. **ディープリンクテスト**: uri-schemeツールと組み合わせて使用
4. **設定可能**: 必要に応じて無効化可能

これらの機能を活用して、効率的なルートデバッグとディープリンクテストを実施できます。
