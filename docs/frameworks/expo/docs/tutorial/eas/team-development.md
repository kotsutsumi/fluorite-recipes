# プレビューをチームと共有

## 概要
このチュートリアルでは、EAS Updateを使用してExpoでチームとオーバーザエア（OTA）更新とプレビューを共有する方法を説明します。

## 主要なステップ

### 1. expo-updatesライブラリをインストール
```bash
npx expo install expo-updates
```

### 2. EAS Updateを設定
- `eas update:configure`を実行
- `eas.json`のビルドプロファイルに`channel`を追加

### 3. 開発ビルドを作成
```bash
eas build --platform android --profile development
```

### 4. アプリコードを変更
例：ボタンテキストを変更
```typescript
<Button theme="primary" label="写真を選択" onPress={pickImageAsync} />
```

### 5. 更新を公開
```bash
eas update --channel development --message "最初のボタンラベルを変更"
```

### 6. 更新をプレビュー
- 開発ビルドでExpoアカウントにログイン
- Extensionsタブを開く
- 「Branch: development」を見つける
- 「Open」をタップして更新にアクセス

### 7. プレビュー/本番ビルドと共有
- 特定のチャンネルに更新を公開
```bash
eas update --channel preview --message "最初のボタンラベルを変更"
```

## 主要な概念
- 更新はアプリストアリリース間の小さなバグを修正し、変更をプッシュします
- チャンネルはビルドをグループ化します
- 更新は特定のビルドチャンネルをターゲットにできます
- チームメンバーは更新を自動的に受信できます

## 追加の注記
- Expoアカウントへのログインが必要
- プラットフォーム間で更新が機能します
- 変更を確認するにはアプリを強制終了して再度開く
