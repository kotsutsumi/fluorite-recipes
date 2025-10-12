# iOSアプリ拡張機能

iOSアプリ拡張機能のサポートとEAS Buildでの使用方法について学びます。

## 管理されたプロジェクト（実験的サポート）

アプリ拡張機能を使用すると、iOSでメインアプリを超えて機能を拡張できます。管理されたプロジェクトの場合、config pluginを使用してアプリ拡張機能を追加できます。以下は、`app.json`での設定例です：

```json
{
  "expo": {
    "extra": {
      "eas": {
        "build": {
          "experimental": {
            "ios": {
              "appExtensions": [
                {
                  "targetName": "myappextension",
                  "bundleIdentifier": "com.myapp.extension",
                  "entitlements": {
                    "com.apple.example": "entitlement value"
                  }
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

## Bareプロジェクト

bareプロジェクトの場合、EAS CLIは以下を行います：
- Xcodeプロジェクト内のアプリ拡張機能を自動的に検出
- 各ターゲットに必要な認証情報を生成
- `credentials.json`での手動の認証情報設定を許可

## アプリ拡張機能の種類

### 一般的なアプリ拡張機能

1. **Today Widget**: 通知センターに情報を表示
2. **Share Extension**: 他のアプリとコンテンツを共有
3. **Notification Content Extension**: 通知のカスタム UI
4. **Notification Service Extension**: 通知の内容を変更
5. **Action Extension**: 他のアプリ内でアクションを実行
6. **Keyboard Extension**: カスタムキーボードを提供
7. **Photo Editing Extension**: 写真アプリで編集機能を提供
8. **Intents Extension**: Siri とショートカットのサポート
9. **App Clip**: アプリの軽量版を提供

## アプリ拡張機能の設定

### Bare Reactプロジェクトでの手動設定

1. **Xcodeで拡張機能を作成**:
   - File → New → Target を選択
   - 拡張機能の種類を選択
   - ターゲット名とバンドル識別子を設定

2. **EAS Buildの設定**:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.myapp"
    }
  }
}
```

3. **認証情報の管理**:

EAS CLIが自動的に検出しますが、手動で管理する場合：

```json
{
  "ios": {
    "provisioningProfilePath": "ios/certs/profile.mobileprovision",
    "distributionCertificate": {
      "path": "ios/certs/dist-cert.p12",
      "password": "password"
    },
    "targets": {
      "myappextension": {
        "bundleIdentifier": "com.myapp.extension",
        "provisioningProfilePath": "ios/certs/extension-profile.mobileprovision"
      }
    }
  }
}
```

## プロビジョニングプロファイルの管理

アプリ拡張機能ごとに個別のプロビジョニングプロファイルが必要です：

1. **Apple Developer Console**で：
   - Identifiersセクションで新しいApp IDを作成
   - 拡張機能のバンドル識別子を使用
   - 必要な機能を有効化

2. **プロビジョニングプロファイルを作成**：
   - Profilesセクションで新しいプロファイルを作成
   - 拡張機能のApp IDを選択
   - 配布証明書とデバイスを選択

## エンタイトルメントの設定

拡張機能に特定のエンタイトルメントが必要な場合：

```json
{
  "expo": {
    "extra": {
      "eas": {
        "build": {
          "experimental": {
            "ios": {
              "appExtensions": [
                {
                  "targetName": "ShareExtension",
                  "bundleIdentifier": "com.myapp.share",
                  "entitlements": {
                    "com.apple.security.application-groups": [
                      "group.com.myapp"
                    ],
                    "keychain-access-groups": [
                      "$(AppIdentifierPrefix)com.myapp"
                    ]
                  }
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

## App Groupsの使用

メインアプリと拡張機能間でデータを共有するには：

1. **App Groupsを有効化**：

```json
{
  "ios": {
    "entitlements": {
      "com.apple.security.application-groups": [
        "group.com.myapp"
      ]
    }
  }
}
```

2. **コードでデータを共有**：

```typescript
// メインアプリまたは拡張機能から
import * as FileSystem from 'expo-file-system';

const groupIdentifier = 'group.com.myapp';
const sharedDirectory = FileSystem.documentDirectory + '../' + groupIdentifier + '/';

// データを書き込む
await FileSystem.writeAsStringAsync(
  sharedDirectory + 'shared-data.json',
  JSON.stringify(data)
);

// データを読み取る
const content = await FileSystem.readAsStringAsync(
  sharedDirectory + 'shared-data.json'
);
```

## ビルドとテスト

### 拡張機能を含むビルドの作成

```bash
# 開発ビルド
eas build --profile development --platform ios

# 本番ビルド
eas build --profile production --platform ios
```

### ローカルテスト

1. Xcodeでプロジェクトを開く
2. 拡張機能ターゲットを選択
3. シミュレーターまたはデバイスで実行

## トラブルシューティング

### 一般的な問題

1. **プロビジョニングプロファイルのエラー**:
   - すべてのターゲットに正しいバンドル識別子があることを確認
   - Apple Developer Consoleでプロファイルを更新

2. **ビルドの失敗**:
   - Xcodeプロジェクト設定を確認
   - すべてのターゲットが正しく設定されているか確認

3. **認証情報の問題**:
   - `eas credentials`を実行して認証情報を確認
   - 必要に応じて認証情報を再生成

## ベストプラクティス

1. **バンドル識別子の命名規則**: `com.company.app.extension-type`
2. **App Groupsの使用**: メインアプリと拡張機能間のデータ共有
3. **サイズの最適化**: 拡張機能は小さく保つ
4. **メモリ管理**: 拡張機能にはメモリ制限がある
5. **バックグラウンド処理**: 長時間実行タスクを避ける

このドキュメントは、ExpoアプリにiOSアプリ拡張機能を追加するためのカスタム機能をサポートする一環として提供されています。
