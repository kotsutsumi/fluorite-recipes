# .easignoreを使用してファイルを無視する

ビルドプロセス中にEASが不要なファイルを無視するように設定する方法を学びます。

---

.easignoreファイルは、[EAS](https://expo.dev/eas)が[EAS Build](/build/introduction)サーバーにプロジェクトをアップロードする際に無視すべきファイルを定義します。

> 不要なファイルを無視することで、アプリのアーカイブサイズとアップロード時間を削減できます。

デフォルトでは、[EAS CLI](/build/setup#install-the-latest-eas-cli)は[.gitignore](https://git-scm.com/docs/gitignore)ファイル（存在する場合）を参照して、無視するファイルを決定します。.easignoreファイルを作成すると、EAS CLIは.gitignoreファイルよりも優先します。.easignoreファイルを作成する場合は、.gitignoreファイルからすべてのファイルとディレクトリを含め、無視したい追加のファイルを追加します。

## .easignoreファイルの作成

1. プロジェクトのルートに.easignoreファイルを作成します。

2. .gitignoreファイルの内容を.easignoreファイルにコピーします。次に、ビルドプロセスに不要なファイルを追加します。

.easignore
```
# .gitignoreファイルからすべてをここにコピー
# EAS Buildがアプリをビルドするために必要ないファイルとディレクトリを無視
/docs
# ネイティブディレクトリを無視（EAS Buildを使用している場合）
/android /ios
# テストカバレッジレポートを無視
/coverage
```

プロジェクトにandroidおよびiosディレクトリが含まれていない場合、[EAS Buildはこれらのネイティブディレクトリをコンパイル前に生成するためにPrebuildを実行](/workflow/prebuild#usage-with-eas-build)します。

3. ファイルを保存し、新しいビルドをトリガーします。

Terminal
```
eas build --platform ios --profile development
```

.easignoreファイルが正常に設定されました。

## .easignoreを使用してプロジェクトアップロードにファイルを追加する

gitignoreファイルにあるものを超えて追加のファイルを無視することに加えて、.easignoreファイルを使用して、ソース管理にコミットされていないファイルをEAS Buildアップロードに含めることもできます。これは、ビルドプロセスの直前にビルドに必要な一時ファイルを生成するカスタムスクリプトがある場合に便利です。

### ファイルを含めるには

.easignoreファイルで`!`プレフィックスを使用してファイルを含めます：

```
# デフォルトではすべてを無視
*

# ただし、これらのファイルは含める
!package.json
!app.json
!App.tsx
!src/**
!assets/**

# 生成された設定ファイルを含める
!generated-config.json
```

## .easignoreの構文

.easignoreファイルは、.gitignoreと同じ構文を使用します：

### パターン

- `*` - 任意の文字列に一致（スラッシュを除く）
- `**` - 任意の文字列に一致（スラッシュを含む）
- `?` - 任意の1文字に一致
- `[abc]` - ブラケット内の任意の文字に一致
- `[a-z]` - 範囲内の任意の文字に一致

### 特殊文字

- `/` で始まるパターンは、プロジェクトルートからの相対パスに一致
- `/` で終わるパターンは、ディレクトリのみに一致
- `!` で始まるパターンは、パターンを否定（ファイルを含める）
- `#` で始まる行はコメント

## 一般的な.easignoreパターン

### ドキュメントとテスト

```
# ドキュメント
/docs
/documentation
*.md
!README.md  # READMEは保持

# テストファイル
**/__tests__
**/*.test.ts
**/*.test.tsx
**/*.spec.ts
/coverage
/jest
```

### 開発ツール

```
# エディタ設定
.vscode
.idea
*.swp
*.swo

# デバッグファイル
.DS_Store
Thumbs.db
```

### ビルドアーティファクト

```
# ネイティブビルドディレクトリ
/android
/ios

# ビルド出力
/dist
/build
/.expo
```

### 依存関係とキャッシュ

```
# 依存関係（必要に応じて）
# node_modules  # 通常は.gitignoreから

# キャッシュ
.npm
.yarn
.pnpm-store
```

## ベストプラクティス

1. **.gitignoreから開始**: 常に.gitignoreの内容を含める
2. **段階的に追加**: 一度に少しずつファイルを追加してテスト
3. **ビルドサイズを監視**: .easignoreの変更後にビルドサイズを確認
4. **必要なファイルを含める**: ビルドに必要なファイルを誤って除外しないように
5. **コメントを追加**: パターンの理由を説明するコメントを追加

## 検証

.easignoreが正しく機能していることを確認するには：

1. ビルドを実行します
2. ビルドログの「Uploading project」セクションを確認します
3. アップロードサイズが予想より小さいことを確認します

```
Uploading project...
✓ Uploaded 12.3 MB (was 45.6 MB without .easignore)
```

## トラブルシューティング

### ビルドが失敗する場合

必要なファイルを除外していないか確認：

```bash
# 一時的に.easignoreをバックアップ
mv .easignore .easignore.backup

# .gitignoreのみでビルド
eas build --platform ios --profile development

# 成功した場合、.easignoreを段階的に復元
```

### アップロードサイズが大きすぎる場合

どのファイルが含まれているかを確認：

1. ビルドログを確認
2. 大きなファイルやディレクトリを特定
3. .easignoreに追加のパターンを追加

このドキュメントは、.easignoreを使用してEAS Buildのアップロードを最適化する方法について説明しています。
