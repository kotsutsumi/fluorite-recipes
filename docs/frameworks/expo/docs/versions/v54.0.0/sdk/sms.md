# SMS

AndroidおよびiOSでSMSメッセージを送信するためのシステムUI/アプリへのアクセスを提供するライブラリです。

## インストール

ターミナルで以下のコマンドを実行してライブラリをインストールします。

```bash
npx expo install expo-sms
```

## 概要

Expo SMSは、AndroidおよびiOSプラットフォームでSMSメッセージを送信するためのシステムUIへのアクセスを提供します。

## プラットフォームサポート

- Android
- iOS

## API リファレンス

### isAvailableAsync()

デバイスでSMSが利用可能かどうかを確認します。

```javascript
const isAvailable = await SMS.isAvailableAsync();
```

**戻り値**: SMSが利用可能な場合は`true`を返すPromise。

**注意**: iOSシミュレーターとブラウザでは常に`false`を返します。

### sendSMSAsync(addresses, message, options)

受信者とメッセージが事前入力されたデフォルトのSMSアプリを開きます。

```javascript
const { result } = await SMS.sendSMSAsync(
  ['0123456789', '9876543210'],
  'サンプルメッセージ'
);
```

**パラメータ**:
- `addresses` (string[]): 電話番号の配列
- `message` (string): SMSのテキスト
- `options` (オプション): 添付ファイルなどの設定

**戻り値**: SMSアクションの結果を含むPromise:
- `'cancelled'` - ユーザーがSMSをキャンセルした
- `'sent'` - ユーザーがSMSを送信した
- `'unknown'` - 結果が不明（iOSのみ）

## 使用例

### 基本的な使用

```javascript
import * as SMS from 'expo-sms';

const sendMessage = async () => {
  const isAvailable = await SMS.isAvailableAsync();

  if (isAvailable) {
    const { result } = await SMS.sendSMSAsync(
      ['0123456789'],
      'こんにちは！'
    );

    console.log(result); // 'sent', 'cancelled', 'unknown'
  }
};
```

### 添付ファイル付きSMS

```javascript
const { result } = await SMS.sendSMSAsync(
  ['0123456789'],
  'サンプルメッセージ',
  {
    attachments: {
      uri: 'path/myfile.png',
      mimeType: 'image/png',
      filename: 'myfile.png'
    }
  }
);
```

## 型定義

### SMSAttachment

ファイル添付を記述します。

- `uri` (string): ファイルのURI
- `mimeType` (string): ファイルのMIMEタイプ
- `filename` (string): ファイル名

### SMSOptions

SMS送信の設定。

- `attachments` (SMSAttachment): 添付するファイル

### SMSResponse

SMS送信結果を表します。

- `result` ('sent' | 'cancelled' | 'unknown'): 送信結果

## プラットフォーム固有の動作

- **iOS**: シミュレーターでは利用できません
- **Android**: アクティビティが終了するまでメッセージは送信されません
