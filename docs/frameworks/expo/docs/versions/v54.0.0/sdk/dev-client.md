# DevClient

開発ビルドを作成し、便利な開発ツールを含むライブラリです。

## インストール

```bash
npx expo install expo-dev-client
```

## 使用方法

```javascript
import * as DevClient from 'expo-dev-client';

// 開発メニューを開く
DevClient.openMenu();

// 開発メニューを閉じる
DevClient.closeMenu();

// 開発メニューを非表示にする
DevClient.hideMenu();
```

## 設定

`app.json`で設定できます：

```json
{
  "expo": {
    "plugins": [
      [
        "expo-dev-client",
        {
          "launchMode": "most-recent"
        }
      ]
    ]
  }
}
```

## API

```javascript
import * as DevClient from 'expo-dev-client';
```

## メソッド

### `DevClient.closeMenu()`

開発メニューを閉じます。

**戻り値**

`void`

---

### `DevClient.hideMenu()`

開発メニューを非表示にします。UIから完全に削除されます。

**戻り値**

`void`

---

### `DevClient.openMenu()`

開発メニューを開きます。

**戻り値**

`void`

---

### `DevClient.registerDevMenuItems(items)`

カスタムメニュー項目を登録します。

**パラメータ**

- **items** (`ExpoDevMenuItem[]`) - 登録するメニュー項目の配列

**戻り値**

`void`

## 型

### `ExpoDevMenuItem`

開発メニュー項目を表す型です。

```typescript
interface ExpoDevMenuItem {
  name: string;
  callback: () => void;
  shouldCollapse?: boolean;
}
```

- **name** - メニュー項目の表示名
- **callback** - 項目が選択されたときに呼び出される関数
- **shouldCollapse** - 実行後にメニューを閉じるかどうか（オプション）

## 設定オプション

### `launchMode`

プロジェクトの起動動作を決定します。

- **most-recent** - 最近開いたプロジェクトを自動的に起動
- **launcher** - 常にランチャー画面を表示

### `addGeneratedScheme`

URLスキームの登録を制御します。

- `true` - 自動的にURLスキームを生成して登録（デフォルト）
- `false` - URLスキームを生成しない

## カスタムメニュー項目の例

```javascript
import * as DevClient from 'expo-dev-client';

DevClient.registerDevMenuItems([
  {
    name: 'キャッシュをクリア',
    callback: async () => {
      // キャッシュクリア処理
      console.log('キャッシュがクリアされました');
    },
    shouldCollapse: true,
  },
  {
    name: 'デバッグモード切替',
    callback: () => {
      // デバッグモード切替処理
      console.log('デバッグモードが切り替わりました');
    },
  },
]);
```

## 機能

### 設定可能なランチャーUI

開発ビルドを起動したときに表示されるランチャー画面をカスタマイズできます。

### 改善されたデバッグツール

- エラートレース
- パフォーマンスモニター
- ネットワークインスペクター
- コンソールログ

### 強力な開発者メニューUI

カスタムアクションを追加できる拡張可能な開発者メニューを提供します。

## TVサポート

SDK 54以降で完全にサポートされています：

- **Android TV** - フル機能
- **Apple TV** - ローカルおよびトンネル操作の基本サポート

## デバイスでの使用

開発ビルドを使用すると、実際のデバイスで以下のことができます：

1. 複数のプロジェクトを切り替える
2. カスタムネイティブコードをテストする
3. 開発中のアプリを配布する
4. 高度なデバッグツールを使用する

## ベストプラクティス

1. **カスタムメニュー項目は慎重に使用する** - 開発に本当に必要な項目のみを追加
2. **`shouldCollapse`を適切に設定** - 長時間実行される操作にはfalseを使用
3. **エラーハンドリングを実装** - コールバック内で例外をキャッチ
4. **本番ビルドでは無効化** - 開発ビルドのみで有効にする

## プラットフォームサポート

- Android
- iOS
- tvOS
