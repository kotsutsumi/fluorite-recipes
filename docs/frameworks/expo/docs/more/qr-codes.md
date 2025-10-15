# qr.expo.dev - QRコード生成サービス

## 概要

`qr.expo.dev`は、Expoブランドのカスタマイズ可能なQRコードを生成するためのクラウド関数サービスです。主にEAS Update、Development Builds、Expo Goアプリのプレビューやデバッグに使用されます。

## 主な用途

- **EAS Update プレビュー**: 特定のアップデートをプレビューするためのQRコード
- **Development Builds**: 開発ビルドを起動するためのQRコード
- **Expo Go**: Expo Goアプリでプロジェクトを開くためのQRコード

## 基本的な使用方法

### ベースURL

```
https://qr.expo.dev/eas-update
```

### 基本的なQRコード生成

```
https://qr.expo.dev/eas-update?projectId=YOUR_PROJECT_ID&runtimeVersion=1.0.0&channel=production
```

このURLにアクセスすると、指定されたパラメータに基づいてQRコードのSVG画像が生成されます。

## クエリパラメータ

### 必須パラメータ

#### `projectId`

**説明**: Expoプロジェクトの一意識別子

**例**:
```
projectId=550e8400-e29b-41d4-a716-446655440000
```

プロジェクトIDは、`app.json`または`app.config.js`の`extra.eas.projectId`で確認できます。

### オプションパラメータ

#### `runtimeVersion`

**説明**: ビルドのランタイムバージョン

**例**:
```
runtimeVersion=1.0.0
```

**デフォルト**: 指定しない場合、最新のランタイムバージョンが使用されます。

#### `channel`

**説明**: ビルドのチャンネル名

**例**:
```
channel=production
```

**デフォルト**: 指定しない場合、デフォルトチャンネルが使用されます。

#### `slug`

**説明**: Development Buildのターゲットスラッグ

**例**:
```
slug=my-app
```

**デフォルト**: `exp`

#### `format`

**説明**: レスポンスフォーマット

**オプション**:
- `svg` (デフォルト)
- `png`

**例**:
```
format=png
```

## QRコード生成方法

### 1. デバイスの特性による生成

デバイスの特性（プラットフォーム、アーキテクチャなど）に基づいて、最適なアップデートを取得するQRコードを生成します。

```
https://qr.expo.dev/eas-update?projectId=YOUR_PROJECT_ID&runtimeVersion=1.0.0&channel=production
```

### 2. 特定のアップデートIDによる生成

特定のアップデートIDを指定してQRコードを生成します。

```
https://qr.expo.dev/eas-update?projectId=YOUR_PROJECT_ID&updateId=550e8400-e29b-41d4-a716-446655440001
```

#### パラメータ

- `updateId`: 特定のアップデートの一意識別子

### 3. アップデートグループIDによる生成

アップデートグループIDを指定してQRコードを生成します。

```
https://qr.expo.dev/eas-update?projectId=YOUR_PROJECT_ID&groupId=550e8400-e29b-41d4-a716-446655440002
```

#### パラメータ

- `groupId`: アップデートグループの一意識別子

### 4. ブランチIDによる生成

特定のブランチの最新アップデートを取得するQRコードを生成します。

```
https://qr.expo.dev/eas-update?projectId=YOUR_PROJECT_ID&branchId=main
```

#### パラメータ

- `branchId`: ブランチの識別子

### 5. チャンネルIDによる生成

特定のチャンネルの最新アップデートを取得するQRコードを生成します。

```
https://qr.expo.dev/eas-update?projectId=YOUR_PROJECT_ID&channelId=production
```

#### パラメータ

- `channelId`: チャンネルの識別子

## 使用例

### 開発環境でのプレビュー

開発中のアップデートをテストするためのQRコードを生成：

```
https://qr.expo.dev/eas-update?projectId=your-project-id&runtimeVersion=1.0.0&channel=preview&format=svg
```

### 本番環境のチャンネル

本番環境のチャンネルにデプロイされた最新アップデートのQRコード：

```
https://qr.expo.dev/eas-update?projectId=your-project-id&runtimeVersion=1.0.0&channel=production&format=svg
```

### 特定のブランチ

特定のブランチの最新アップデートをプレビュー：

```
https://qr.expo.dev/eas-update?projectId=your-project-id&branchId=feature-branch&format=svg
```

### PNGフォーマット

PNG形式でQRコードを取得：

```
https://qr.expo.dev/eas-update?projectId=your-project-id&runtimeVersion=1.0.0&channel=production&format=png
```

## Development Buildとの統合

Development Buildアプリでは、生成されたQRコードをスキャンすることで、指定されたチャンネルの最新アップデートを自動的に取得できます。

### ワークフロー

1. `qr.expo.dev`でQRコードを生成
2. Development Buildアプリを起動
3. QRコードをスキャン
4. 指定されたチャンネルの最新アップデートがダウンロードされる
5. アプリが更新された状態で再起動される

## HTMLでの埋め込み

### SVG埋め込み

```html
<img
  src="https://qr.expo.dev/eas-update?projectId=your-project-id&runtimeVersion=1.0.0&channel=production&format=svg"
  alt="Expo QR Code"
  width="200"
  height="200"
/>
```

### PNG埋め込み

```html
<img
  src="https://qr.expo.dev/eas-update?projectId=your-project-id&runtimeVersion=1.0.0&channel=production&format=png"
  alt="Expo QR Code"
  width="200"
  height="200"
/>
```

## マークダウンでの使用

```markdown
![Expo QR Code](https://qr.expo.dev/eas-update?projectId=your-project-id&runtimeVersion=1.0.0&channel=production&format=svg)
```

## スクリプトでの使用

### cURLでダウンロード

```bash
curl -o qr-code.svg "https://qr.expo.dev/eas-update?projectId=your-project-id&runtimeVersion=1.0.0&channel=production&format=svg"
```

### JavaScriptでの使用

```javascript
const projectId = 'your-project-id';
const runtimeVersion = '1.0.0';
const channel = 'production';
const format = 'svg';

const qrCodeUrl = `https://qr.expo.dev/eas-update?projectId=${projectId}&runtimeVersion=${runtimeVersion}&channel=${channel}&format=${format}`;

console.log('QR Code URL:', qrCodeUrl);
```

### Pythonでの使用

```python
import requests

project_id = 'your-project-id'
runtime_version = '1.0.0'
channel = 'production'
format_type = 'svg'

qr_code_url = f'https://qr.expo.dev/eas-update?projectId={project_id}&runtimeVersion={runtime_version}&channel={channel}&format={format_type}'

response = requests.get(qr_code_url)

if response.status_code == 200:
    with open('qr-code.svg', 'wb') as f:
        f.write(response.content)
    print('QR code downloaded successfully')
else:
    print(f'Error: {response.status_code}')
```

## CI/CDパイプラインでの使用

### GitHub Actions

```yaml
name: Generate QR Code

on:
  push:
    branches: [main]

jobs:
  generate-qr:
    runs-on: ubuntu-latest
    steps:
      - name: Generate QR Code
        run: |
          curl -o qr-code.svg "https://qr.expo.dev/eas-update?projectId=${{ secrets.EXPO_PROJECT_ID }}&runtimeVersion=1.0.0&channel=production&format=svg"

      - name: Upload QR Code
        uses: actions/upload-artifact@v3
        with:
          name: qr-code
          path: qr-code.svg
```

### GitLab CI

```yaml
generate-qr:
  stage: deploy
  script:
    - curl -o qr-code.svg "https://qr.expo.dev/eas-update?projectId=${EXPO_PROJECT_ID}&runtimeVersion=1.0.0&channel=production&format=svg"
  artifacts:
    paths:
      - qr-code.svg
```

## ベストプラクティス

### 1. プロジェクトIDの保護

プロジェクトIDは公開されても問題ありませんが、セキュリティのベストプラクティスとして、環境変数に保存することを推奨します。

```bash
export EXPO_PROJECT_ID=your-project-id
```

### 2. ランタイムバージョンの管理

ランタイムバージョンは、アプリのバイナリバージョンと一致させる必要があります。

### 3. チャンネルの使い分け

- `production`: 本番環境
- `staging`: ステージング環境
- `preview`: プレビュー環境
- `development`: 開発環境

### 4. フォーマットの選択

- **SVG**: スケーラブルで、Webページへの埋め込みに適しています
- **PNG**: 固定サイズの画像が必要な場合に使用

### 5. QRコードのサイズ

QRコードは、スキャンしやすいように十分な大きさ（最低200x200ピクセル）で表示してください。

## トラブルシューティング

### QRコードがスキャンできない

**原因**:
- QRコードが小さすぎる
- 画像が低品質
- プロジェクトIDが無効

**解決策**:
- QRコードのサイズを大きくする（推奨: 200x200ピクセル以上）
- SVGフォーマットを使用する
- プロジェクトIDを確認する

### アップデートが取得されない

**原因**:
- 指定されたチャンネルにアップデートが存在しない
- ランタイムバージョンが一致しない
- ネットワーク接続の問題

**解決策**:
- EAS Updateでアップデートを公開する
- ランタイムバージョンを確認する
- ネットワーク接続を確認する

### 404エラー

**原因**:
- プロジェクトIDが無効
- URLパラメータが間違っている

**解決策**:
- プロジェクトIDを確認する
- URLパラメータの構文を確認する

## 関連リソース

- [EAS Update ドキュメント](https://docs.expo.dev/eas-update/introduction/)
- [Development Builds](https://docs.expo.dev/development/introduction/)
- [Expo Go](https://docs.expo.dev/get-started/expo-go/)
- [Expo プロジェクトの設定](https://docs.expo.dev/workflow/configuration/)

## まとめ

`qr.expo.dev`は、Expoアプリのアップデートやプレビューを簡単に共有するための便利なサービスです。URLパラメータをカスタマイズすることで、様々なシナリオに対応したQRコードを生成できます。

開発ワークフローに統合することで、チームメンバーやテスターとのアプリ共有が効率的になります。
