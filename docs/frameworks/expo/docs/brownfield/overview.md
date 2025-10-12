# Brownfieldアプリへのexpo統合

既存のネイティブアプリにExpoツールを統合する方法の概要です。

## Brownfieldとは

### Brownfieldアプリ

Brownfieldアプリは、既存のネイティブアプリで、React Nativeが単一の画面や機能に追加されているアプリです。

**特徴**：
- 既存のネイティブコードベース
- React Nativeは一部の機能にのみ使用
- ネイティブとReact Nativeが共存

### Greenfieldアプリ

Greenfieldアプリは、ExpoまたはReact Nativeで最初から作成されたアプリです。

**特徴**：
- React Nativeが中心
- ネイティブコードは最小限
- Expoツールをフル活用

## Expoツールの互換性

Brownfieldシナリオでの、Expoツールの互換性を確認してください。

### 完全サポート

以下のExpoツールは、Brownfieldアプリで完全にサポートされています：

#### Expo SDK

すべてのExpo SDKパッケージが使用できます。

**例**：
```bash
npx expo install expo-camera expo-location
```

#### Expo Modules API

カスタムネイティブモジュールを作成できます。

**例**：
```bash
npx create-expo-module@latest --local
```

#### Expo CLI

Expo CLIを使用して、プロジェクトを管理できます。

**例**：
```bash
npx expo start
npx expo run:android
npx expo run:ios
```

#### EAS Build

クラウドでビルドを作成できます。

**例**：
```bash
eas build --platform android
eas build --platform ios
```

#### EAS Submit

アプリストアに提出できます。

**例**：
```bash
eas submit --platform android
eas submit --platform ios
```

#### EAS Update

Over-the-Air (OTA) アップデートを配信できます。

**例**：
```bash
eas update --branch production
```

### サポートされていない

以下のExpoツールは、Brownfieldアプリでサポートされていません：

#### Expo Router

Expo Routerは、Greenfieldアプリでのみ使用できます。

**理由**：
- アプリ全体のルーティング構造を定義
- 既存のネイティブナビゲーションと競合

**代替案**：
- React Navigation
- ネイティブナビゲーション

#### Expo Dev Client

Expo Dev Clientは、Greenfieldアプリでのみ使用できます。

**理由**：
- アプリ全体の開発環境を定義
- 既存のネイティブセットアップと競合

**代替案**：
- 標準のReact Nativeデバッグツール
- ネイティブデバッグツール

## 重要な注意事項

### 実験的サポート

Brownfieldアプリへの統合サポートは、まだ実験的です。

**意味**：
- すべてのExpo機能がシームレスに動作するわけではない
- ドキュメントが不完全な場合がある
- 予期しない問題が発生する可能性がある

### 適応の課題

既存のネイティブプロジェクトにExpoを統合する際、適応の課題が発生する可能性があります。

**一般的な課題**：
- ネイティブとReact Nativeのビルド設定の競合
- 依存関係のバージョン管理
- ネイティブモジュールの互換性

### ドキュメントの制限

ドキュメントは、すべてのBrownfieldシナリオをカバーしているわけではありません。

**推奨**：
- 問題が発生した場合は、GitHubで報告
- コミュニティフォーラムで質問
- 実験的に試行錯誤

## 次のステップ

### 統合ガイドの確認

「既存のネイティブ（Brownfield）アプリにExpoを追加する方法」ガイドを確認してください。

**内容**：
- 詳細な統合手順
- プラットフォーム固有の設定
- トラブルシューティング

### GitHubでの問題報告

問題が発生した場合は、GitHubで報告してください。

**リポジトリ**：
- [expo/expo](https://github.com/expo/expo)

**報告内容**：
- 問題の詳細
- 再現手順
- 期待される動作
- 実際の動作

## Brownfield統合の利点

### 既存のコードベースを維持

既存のネイティブコードベースを維持しながら、React Nativeを段階的に導入できます。

### チームのスキルを活用

ネイティブとReact Nativeの両方のスキルを活用できます。

### 段階的な移行

アプリ全体を一度に書き換えることなく、段階的に移行できます。

## Brownfield統合の課題

### ビルド設定の複雑さ

ネイティブとReact Nativeのビルド設定を統合する必要があります。

### 依存関係の管理

ネイティブとReact Nativeの依存関係を管理する必要があります。

### デバッグの複雑さ

ネイティブとReact Nativeの両方をデバッグする必要があります。

## ベストプラクティス

### 1. 小さく始める

単一の画面や機能から始めてください。

### 2. 段階的に拡大

成功したら、段階的に範囲を拡大してください。

### 3. 十分にテスト

ネイティブとReact Nativeの両方を十分にテストしてください。

### 4. チームとのコミュニケーション

チームメンバーと密にコミュニケーションを取ってください。

## サポートされているツールの詳細

### Expo SDK

Expo SDKは、多くの便利なライブラリを提供します。

**主なライブラリ**：
- `expo-camera`: カメラアクセス
- `expo-location`: 位置情報アクセス
- `expo-file-system`: ファイルシステムアクセス
- `expo-notifications`: プッシュ通知

### EAS Build

EAS Buildは、クラウドでビルドを作成します。

**利点**：
- ローカルマシンのセットアップ不要
- 一貫したビルド環境
- 高速なビルド時間

### EAS Update

EAS Updateは、OTAアップデートを配信します。

**利点**：
- アプリストアの審査を待たずに更新
- バグ修正を迅速に配信
- A/Bテストのサポート

## 互換性テーブル

| ツール | Brownfieldサポート | 制限事項 |
|--------|-------------------|---------|
| Expo SDK | ✅ 完全サポート | なし |
| Expo Modules API | ✅ 完全サポート | なし |
| Expo CLI | ✅ 完全サポート | なし |
| EAS Build | ✅ 完全サポート | なし |
| EAS Submit | ✅ 完全サポート | なし |
| EAS Update | ✅ 完全サポート | なし |
| Expo Router | ❌ サポートなし | アプリ全体のルーティングが必要 |
| Expo Dev Client | ❌ サポートなし | アプリ全体の開発環境が必要 |

## まとめ

Brownfieldアプリへのexpo統合は、段階的にReact Nativeを導入する優れた方法です。すべてのExpoツールがサポートされているわけではありませんが、Expo SDK、EAS Build、EAS Updateなどの主要なツールは完全にサポートされています。統合は実験的であるため、問題が発生した場合は、GitHubで報告してください。
