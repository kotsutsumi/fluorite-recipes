# App Signing - アプリ署名ドキュメント

EAS（Expo Application Services）におけるアプリ署名認証情報の管理に関する包括的なガイド。

## 概要

アプリをアプリストアで配布するには、デジタル署名が必要です。EASは、認証情報の自動管理とローカル管理の両方をサポートし、チーム開発やセキュリティ要件に柔軟に対応します。

## 主要トピック

### 1. 自動管理される認証情報（Managed Credentials）

**リンク**: [managed-credentials.md](./app-signing/managed-credentials.md)

**概要**:
- EASが認証情報を自動的に生成・管理
- チーム間での認証情報の共有が容易
- `eas build`実行時に自動的に認証情報を生成

**主要機能**:
- **Android**: キーストア、FCM APIキー
- **iOS**: 配布証明書、プロビジョニングプロファイル、Apple Push Key
- Apple Developer Programメンバーシップが必要（iOS）
- EASサーバーで安全に保存・再利用

**使用方法**:
```bash
# ビルド時に自動生成
eas build

# プッシュ通知認証情報の設定
eas credentials
```

### 2. ローカル認証情報（Local Credentials）

**リンク**: [local-credentials.md](./app-signing/local-credentials.md)

**概要**:
- プロジェクトのルートに`credentials.json`を作成
- 独自のキーストア、証明書、プロファイルを管理
- `.gitignore`への追加が必須

**credentials.json 構造**:
```json
{
  "android": {
    "keystore": {
      "keystorePath": "android/keystores/release.keystore",
      "keystorePassword": "パスワード",
      "keyAlias": "キーエイリアス",
      "keyPassword": "キーパスワード"
    }
  },
  "ios": {
    "provisioningProfilePath": "ios/certs/profile.mobileprovision",
    "distributionCertificate": {
      "path": "ios/certs/dist-cert.p12",
      "password": "証明書パスワード"
    }
  }
}
```

**Android キーストア生成**:
```bash
keytool \
  -genkey -v \
  -storetype JKS \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass KEYSTORE_PASSWORD \
  -keypass KEY_PASSWORD \
  -alias KEY_ALIAS \
  -keystore release.keystore \
  -dname "CN=com.expo.your.android.package,OU=,O=,L=,S=,C=US"
```

**iOS 前提条件**:
- 有料のApple Developerアカウント
- 配布証明書
- プロビジョニングプロファイル
- [Apple Developer Portal](https://developer.apple.com/account/resources/certificates/list)で生成

### 3. 認証情報の同期（Syncing Credentials）

**リンク**: [syncing-credentials.md](./app-signing/syncing-credentials.md)

**概要**:
- EASサーバーとローカル間で認証情報を同期
- `eas credentials`コマンドを使用

**ダウンロード手順**:
```bash
# 1. プロジェクトルートで実行
eas credentials

# 2. プラットフォームを選択
# 3. "Credentials.json: Upload/Download credentials..."を選択
# 4. "Download credentials from EAS to credentials.json"を選択
```

**アップロード手順**:
```bash
# 1. プロジェクトルートで実行
eas credentials

# 2. プラットフォームを選択
# 3. "Credentials.json: Upload/Download credentials..."を選択
# 4. "Upload credentials from credentials.json to EAS"を選択
```

**iOS 追加手順**:
- 配布証明書をキーチェーンにインストール
- Xcodeで「Signing & Capabilities」を開く
- プロビジョニングプロファイルをインポート・選択

### 4. 既存の認証情報の使用（Existing Credentials）

**リンク**: [existing-credentials.md](./app-signing/existing-credentials.md)

**概要**:
- 既存の認証情報をEAS Buildで使用
- 2つのオプション: 自動管理 or ローカル管理

**手順**:
1. `credentials.json`でローカル認証情報として設定
2. `eas credentials`を実行
3. プラットフォームを選択
4. "credentials.jsonの値でExpoサーバー上の認証情報を更新する"を選択

**関連リソース**:
- [ローカル認証情報ガイド](./app-signing/local-credentials.md)
- [認証情報の同期](./app-signing/syncing-credentials.md)

### 5. アプリ認証情報の詳細（App Credentials）

**リンク**: [app-credentials.md](./app-signing/app-credentials.md)

#### Android アプリ認証情報

**キーストア**:
- 秘密鍵と公開証明書を含む
- Google Playは全てのAndroidアプリに証明書署名を要求

**App Signing by Google Play**:
1. 最初のリリースをGoogle Playにアップロード
2. "App signing by Google Play"通知を受け入れる
3. Googleがアプリ署名鍵を管理

**キーストア復旧**:
```bash
# 1. 認証情報をダウンロード
eas credentials

# 2. キーストアを.pem形式にエクスポート
# 3. Googleサポートに連絡して鍵をリセット
```

#### iOS アプリ認証情報

**3つの主要な認証情報**:

1. **配布証明書（Distribution Certificate）**
   - Apple Developerアカウントごとに1つ
   - 全てのアプリに使用可能
   - 有効期限切れは本番アプリに影響しない

2. **プッシュ通知キー（Push Notification Key）**
   - アカウントごとに最大2つ
   - プッシュ通知の送受信に使用
   - 有効期限なし

3. **プロビジョニングプロファイル（Provisioning Profile）**
   - アプリ固有
   - 配布証明書に関連付けられる
   - 12ヶ月後に有効期限切れ

**認証情報管理コマンド**:
```bash
# 認証情報の管理
eas credentials

# 認証情報に再署名
eas build:resign
```

**重要な注意事項**:
- キーストアは非公開に保つ（デバッグキーストアは例外）
- 認証情報の変更は本番アプリに自動的に影響しない
- Expoサーバーから削除のみ可能（`eas credentials`でクリア）

### 6. Apple Developer Programのロールと権限

**リンク**: [apple-developer-program-roles-and-permissions.md](./app-signing/apple-developer-program-roles-and-permissions.md)

**概要**:
- EAS BuildでiOSビルドを作成する際に必要な権限
- アカウントタイプによる認証情報生成権限の違い

**アカウントロールの重要なポイント**:

**個人アカウント**:
- アカウント所有者のみが認証情報を生成可能

**組織アカウント**:
- アカウント所有者と管理者: 常に認証情報を生成可能
- アプリマネージャー: "証明書、識別子、プロファイルへのアクセス"が有効な場合のみ生成可能

**認可ユーザーの手順**:

生成が必要な認証情報:
- 配布署名証明書
- Ad hocプロビジョニングプロファイル
- 配布プロビジョニングプロファイル
- プッシュキー

```bash
# 自動生成・同期
eas login
eas credentials
```

**チーム開発者の手順**:
```bash
# iOS ビルド実行
eas build -p ios

# アクセス権がない場合
# 'n'を押してログインをスキップ
# 既存の認証情報を使用可能
```

**追加情報**:

**事前生成された認証情報のアップロード**:
- 開発者権限を持つユーザーが追加可能
- .p12および.mobileprovisionファイルが必要
- 配布証明書パスワードが必要

**プロビジョニングプロファイルの考慮事項**:
- iOSの機能変更時に更新が必要
- 年1回期限切れ、更新が必要

**フェデレーテッドApple Developerアカウント**:
- EAS CLIはメール/パスワードログインのみ受け入れ
- ビルドと提出にはASC APIトークンを使用可能

### 7. セキュリティ（Security）

**リンク**: [security.md](./app-signing/security.md)

**概要**:
- Expoの認証情報と機密データの取り扱い
- セキュリティ原則と暗号化戦略

**主なハイライト**:

#### 認証情報の暗号化
- **保管時暗号化**: Google Cloudによってデータを暗号化
- **追加暗号化**: KMS（Key Management Service）を使用

#### 対象となる認証情報
- Androidプッシュ通知認証情報
- Androidビルド認証情報
- iOSプッシュ通知認証情報
- iOSビルド認証情報
- Apple/Google Developer アカウント認証情報
- App Store 提出認証情報

#### セキュリティの原則
- **短時間復号化**: 必要な時だけ復号化
- **再生成可能**: ほとんどの認証情報は失われても再生成可能
- **二要素認証**: 推奨セキュリティ対策
- **一時保存**: 機密トークンは自動的に削除

#### Android認証情報
- プッシュ通知キーは再生成可能
- キーストアは重要、失われると更新の問題が発生

#### iOS認証情報
- 配布証明書は再発行可能
- プロビジョニングプロファイルは更新可能
- プッシュキーは管理が必要

#### セキュリティのベストプラクティス
- 二要素認証を有効にする
- 定期的な認証情報のローテーション
- アクセス権限の最小化
- 監査ログの確認

**高セキュリティ向けの推奨事項**:
> 上記の情報がセキュリティ要件を満たさない場合、独自のインフラストラクチャでスタンドアロンアプリのビルドを実行することをお勧めします。

**侵害・損失時の影響**:
各認証情報タイプごとに「侵害された場合の影響」と「失われた場合の影響」のセクションを提供し、潜在的なリスクと緩和戦略について透明性を確保。

## LLM解析のための構造化情報

### 認証情報管理の決定フロー

```
開始
  ↓
既存の認証情報がある?
  ├─ はい → credentials.jsonでローカル設定 → EASにアップロード or ローカル使用
  └─ いいえ → 自動管理 or ローカル生成を選択
      ↓
  自動管理を選択?
      ├─ はい → eas build実行 → 自動生成 → EASサーバーに保存
      └─ いいえ → credentials.json作成 → 手動生成 → ローカル管理
```

### プラットフォーム別要件マトリクス

| プラットフォーム | 必須認証情報 | 生成方法 | 有効期限 |
|--------------|------------|---------|---------|
| Android | キーストア | keytool | 無期限 |
| Android | FCM APIキー | Firebase Console | 無期限 |
| iOS | 配布証明書 | Apple Developer Portal | 1年 |
| iOS | プロビジョニングプロファイル | Apple Developer Portal | 1年 |
| iOS | Apple Push Key | Apple Developer Portal | 無期限 |

### コマンドリファレンス

| コマンド | 用途 | プラットフォーム |
|---------|------|---------------|
| `eas build` | ビルド実行・認証情報自動生成 | Android, iOS |
| `eas credentials` | 認証情報の管理・同期 | Android, iOS |
| `eas build:resign` | 認証情報の再署名 | iOS |
| `eas login` | Expoアカウントログイン | All |

### セキュリティレベル別推奨アプローチ

| セキュリティ要件 | 推奨アプローチ | 理由 |
|---------------|-------------|------|
| 標準 | 自動管理される認証情報 | 簡単、チーム共有が容易 |
| 高 | ローカル認証情報 | 完全なコントロール |
| 最高 | 独自インフラでビルド | カスタムセキュリティポリシー |

### トラブルシューティングクイックリファレンス

| 問題 | 解決策 | 関連ドキュメント |
|------|-------|---------------|
| キーストア紛失 | Googleサポートに連絡、鍵リセット | [app-credentials.md](./app-signing/app-credentials.md) |
| iOS証明書期限切れ | Apple Developer Portalで更新 | [app-credentials.md](./app-signing/app-credentials.md) |
| 認証情報同期エラー | `eas credentials`で再同期 | [syncing-credentials.md](./app-signing/syncing-credentials.md) |
| Apple権限不足 | アカウント管理者に権限付与依頼 | [apple-developer-program-roles-and-permissions.md](./app-signing/apple-developer-program-roles-and-permissions.md) |

## 関連リソース

- [EAS Build ドキュメント](../build.md)
- [EAS Submit ドキュメント](../submit/)
- [Apple Developer Portal](https://developer.apple.com/account/resources/certificates/list)
- [Google Play Console](https://play.google.com/console/)
- [Firebase Console](https://console.firebase.google.com/)

## ベストプラクティス

1. **認証情報の保護**
   - `credentials.json`を`.gitignore`に追加
   - パスワードを環境変数で管理
   - 二要素認証を有効化

2. **チーム開発**
   - 自動管理される認証情報を使用
   - 適切なApple Developerロールを割り当て
   - 監査ログを定期的に確認

3. **定期メンテナンス**
   - iOS証明書の有効期限を監視（年1回更新）
   - プロビジョニングプロファイルの更新
   - 認証情報のローテーション

4. **バックアップ**
   - キーストアと証明書のバックアップを作成
   - 安全な場所に保管
   - パスワード管理ツールを使用
