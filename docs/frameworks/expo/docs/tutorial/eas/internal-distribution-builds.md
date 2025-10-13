# 内部配信ビルドを作成して共有

## 内部配信ビルド

内部配信ビルドにより、チームメンバーとアプリの更新を共有し、技術的および非技術的な利害関係者の両方がフィードバックを提供できるようになります。主要な配信方法には以下が含まれます：

### 配信オプション
- Android：Google Playベータ
- iOS：TestFlight

### EAS Buildの利点
EAS Buildは、簡素化された手順で共有可能なビルドリンクを作成することで、より高速な配信を提供します。

## 内部配信ビルドの作成

### 1. プレビュービルドプロファイルを設定
`eas.json`でプレビュープロファイルをセットアップ：

```json
{
  "build": {
    "preview": {
      "distribution": "internal"
    }
  }
}
```

### 2. ビルドを作成

#### Android
ビルドコマンドを実行：
```bash
eas build --platform android --profile preview
```

#### iOS
最初にデバイスを登録：
```bash
eas device:create
```

次にビルドを作成：
```bash
eas build --platform ios --profile preview
```

### 3. インストール
- ビルド詳細ページを開く
- Expo Orbitまたはインストールリンクを使用
- QRコードまたはリンクをテストデバイスに送信

### 4. 実行
- デバイスでアプリアイコンをタップ
- 開発サーバーは不要

## 主要な考慮事項
- Androidは.apk形式を使用
- iOSはad hocプロビジョニングプロファイルが必要
- Enterpriseプロビジョニングはより広範な配信オプションを提供

## まとめ

AndroidとiOS用の内部配信ビルドを正常に作成し、簡単なアプリのテストとフィードバック収集を可能にしました。
