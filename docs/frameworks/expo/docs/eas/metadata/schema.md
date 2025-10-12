# EAS Metadataのスキーマ

> EAS Metadataはプレビュー段階であり、破壊的な変更が加えられる可能性があります。

EAS Metadataのストア設定には、通常アプリストアのダッシュボードから手動で提供される情報が含まれます。このドキュメントでは、設定オブジェクトの構造を概説します。

## 設定スキーマ

必須のプロパティは`configVersion`で、後方互換性のない変更をバージョン管理するのに役立ちます。

現在、EAS MetadataはApple App Storeのみをサポートしています。

### 主要なプロパティ

| プロパティ | 型 | 説明 |
|----------|------|-------------|
| `configVersion` | `number` | EAS Metadataストア設定スキーマバージョン |
| `apple` | `object` | App Storeの設定可能なプロパティ |
| `version` | `string` | メタデータ同期のためのアプリバージョン |
| `copyright` | `string` | 権利所有情報 |
| `advisory` | `AppleAdvisory` | App Storeの年齢制限アンケート |
| `categories` | `AppleCategories` | App Storeのカテゴリ |
| `info` | `Map<AppleLanguage, AppleInfo>` | ローカライズされたApp Storeプレゼンス |
| `release` | `AppleRelease` | アプリのリリース戦略 |
| `review` | `AppleReview` | App Storeレビューチーム情報 |

## カバーされるセクション

ドキュメントは以下の詳細なスキーマを提供します：
- Apple Advisory
- Apple Categories
- Apple Info（ローカライゼーション）
- Apple Release Strategies
- Apple Review Information

### 注目すべき機能

- 複数言語のローカライゼーションをサポート
- 設定可能な年齢制限
- 詳細なアプリストアメタデータ管理
- 柔軟なリリースとレビューの設定

> ヒント：自動補完と提案には[VS Code Expo Tools拡張機能](https://github.com/expo/vscode-expo#readme)を使用してください。
