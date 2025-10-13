# eas.jsonでEAS Submitを設定

`eas.json`は、EAS CLIとサービスの設定ファイルです。このファイルを使用して、AndroidとiOSの送信を設定できます。

## ファイルの場所

`eas.json`は、プロジェクトのルート（`package.json`の隣）に配置します。

## 設定プロファイル

### デフォルトプロファイル

プロファイルを指定しない場合、デフォルトの「production」プロファイルが使用されます。

### 複数のプロファイル

異なる設定で複数の送信プロファイルを作成できます：

```json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "../path/to/api-xxx-yyy-zzz.json",
        "track": "production"
      },
      "ios": {
        "ascAppId": "your-app-store-connect-app-id"
      }
    },
    "preview": {
      "android": {
        "serviceAccountKeyPath": "../path/to/api-xxx-yyy-zzz.json",
        "track": "internal"
      },
      "ios": {
        "ascAppId": "your-app-store-connect-app-id"
      }
    }
  }
}
```

### プロファイルの拡張

`extends`キーを使用して、他のプロファイルを拡張できます：

```json
{
  "submit": {
    "base": {
      "android": {
        "serviceAccountKeyPath": "../path/to/api-key.json"
      }
    },
    "production": {
      "extends": "base",
      "android": {
        "track": "production"
      }
    },
    "staging": {
      "extends": "base",
      "android": {
        "track": "internal"
      }
    }
  }
}
```

## 送信コマンド

特定のプロファイルを使用して送信：

```bash
eas submit --platform ios --profile <profile-name>
```

```bash
eas submit --platform android --profile <profile-name>
```

## Android設定オプション

- `serviceAccountKeyPath`: Google Service Account Keyファイルへのパス
- `track`: 送信先トラック（internal/alpha/beta/production）

## iOS設定オプション

- `ascAppId`: App Store Connect アプリID
- `appleId`: Apple ID（オプション）
- `appleTeamId`: Apple Team ID（オプション）

## CI/CDでの使用

`eas.json`設定は、CI/CDワークフローで特に有効です：

- 環境ごとに異なる送信設定を使用
- 認証情報を一元管理
- チーム全体で設定を共有

## ベストプラクティス

1. **認証情報のセキュリティ**: Service Account Keyファイルをソースコントロールにコミットしない
2. **環境の分離**: production、staging、preview用に別々のプロファイルを使用
3. **バージョン管理**: `eas.json`をGitで管理（機密情報を除く）
4. **ドキュメント化**: 各プロファイルの目的をチーム内で文書化

## 設定の検証

EAS Updateダッシュボードで設定を確認できます：
- プロファイル設定
- 送信履歴
- エラーログ

詳細については、[EAS Submitドキュメント](/frameworks/expo/docs/submit/introduction)を参照してください。
