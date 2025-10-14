# IntentLauncher

## 概要

IntentLauncherは、AndroidインテントをはAndroidインテントを起動するためのExpoライブラリで、開発者が特定の設定画面を開いたり、システムレベルのアクションを実行したりすることができます。

## インストール

```bash
npx expo install expo-intent-launcher
```

## 使用例

```javascript
import { startActivityAsync, ActivityAction } from 'expo-intent-launcher';

// 位置情報設定を開く
startActivityAsync(ActivityAction.LOCATION_SOURCE_SETTINGS);
```

## 主要なメソッド

### `startActivityAsync(activityAction, params)`

- 特定のAndroidアクティビティを起動
- さまざまな事前定義されたアクティビティアクションをサポート
- アクティビティの結果とともにPromiseを返す

### `openApplication(packageName)`

- パッケージ名でアプリケーションを開く

### `getApplicationIconAsync(packageName)`

- アプリケーションのアイコンをbase64エンコードされたPNGとして取得

## 注目すべき機能

- 事前定義された`ActivityAction`定数の広範なリスト
- システム設定、アプリケーション、特定のアクティビティの起動をサポート
- Android固有の機能
- 詳細な結果コードとパラメータを提供

## プラットフォーム

- Androidのみ

このライブラリは、Androidシステムインテントと設定をプログラム的に操作するための包括的な方法を提供します。
