# MailComposer

システムのネイティブUIを使用してメールを作成・送信するためのライブラリです。

## 概要

`expo-mail-composer` は、システムのネイティブUIを使用してメールを作成・送信する機能を提供します。Android、iOS（実機のみ）、およびWebプラットフォームをサポートしています。

## 主な機能

- システムUIでメールを作成
- iOSシミュレーターでは使用不可
- 添付ファイル、受信者、件名、本文のカスタマイズをサポート

## インストール

```bash
npx expo install expo-mail-composer
```

## 使用方法

### 基本的なメール作成

```javascript
import * as MailComposer from 'expo-mail-composer';
import { Button } from 'react-native';

export default function App() {
  const sendEmail = async () => {
    const result = await MailComposer.composeAsync({
      recipients: ['example@example.com'],
      subject: 'お問い合わせ',
      body: 'こんにちは、',
    });
    console.log(result.status);
  };

  return <Button title="メールを送信" onPress={sendEmail} />;
}
```

### HTMLメールの作成

```javascript
import * as MailComposer from 'expo-mail-composer';

async function sendHtmlEmail() {
  await MailComposer.composeAsync({
    recipients: ['user@example.com'],
    subject: 'HTMLメール',
    body: '<h1>こんにちは</h1><p>これはHTMLメールです。</p>',
    isHtml: true,
  });
}
```

### 添付ファイル付きメール

```javascript
import * as MailComposer from 'expo-mail-composer';

async function sendEmailWithAttachment() {
  await MailComposer.composeAsync({
    recipients: ['user@example.com'],
    subject: '添付ファイル',
    body: 'ファイルを添付しました。',
    attachments: ['file:///path/to/file.pdf'],
  });
}
```

### CC/BCC付きメール

```javascript
import * as MailComposer from 'expo-mail-composer';

async function sendEmailWithCcBcc() {
  await MailComposer.composeAsync({
    recipients: ['to@example.com'],
    ccRecipients: ['cc@example.com'],
    bccRecipients: ['bcc@example.com'],
    subject: 'CC/BCC付きメール',
    body: 'このメールはCCとBCCを含みます。',
  });
}
```

## API

### メソッド

#### `composeAsync(options)`

メールモーダル/インテントを指定されたデータで開きます。

**パラメータ:**
- `options: MailComposerOptions` - メール作成のオプション

**戻り値:**
- `Promise<MailComposerResult>` - メール送信状態を含む結果

#### `isAvailableAsync()`

MailComposer APIがアプリで使用可能かどうかを確認します。

**戻り値:**
- `Promise<boolean>` - 使用可能な場合は `true`

#### `getClients()`

デバイスで利用可能なメールクライアントのリストを取得します。

**戻り値:**
- `Promise<string[]>` - メールクライアント名の配列

## 型定義

### MailComposerOptions

```typescript
{
  recipients?: string[];      // 受信者のメールアドレス
  ccRecipients?: string[];    // CCのメールアドレス
  bccRecipients?: string[];   // BCCのメールアドレス
  subject?: string;           // メールの件名
  body?: string;              // メールの本文
  isHtml?: boolean;           // HTMLフォーマットを使用するか
  attachments?: string[];     // 添付ファイルのURI配列
}
```

### MailComposerResult

```typescript
{
  status: MailComposerStatus;
}
```

### MailComposerStatus

```typescript
enum MailComposerStatus {
  SENT = 'sent',              // メールが送信された
  CANCELLED = 'cancelled',    // メール作成がキャンセルされた
  SAVED = 'saved',            // メールが下書きに保存された
  UNDETERMINED = 'undetermined' // 状態が不明（主にAndroid）
}
```

## プラットフォーム固有の動作

### iOS

- iOSシミュレーターでは使用できません（実機のみ）
- Mailアプリにサインインしている必要があります
- メール送信の状態（送信済み、キャンセル、保存）が正確に報告されます

### Android

- 状態報告が制限される場合があります
- ほとんどの場合 `UNDETERMINED` を返します
- デバイスにメールクライアントがインストールされている必要があります

### Web

- ブラウザのデフォルトメールクライアントを使用します
- 機能が制限される場合があります

## 使用例

### メール可用性の確認

```javascript
import * as MailComposer from 'expo-mail-composer';
import { Alert } from 'react-native';

async function checkMailAvailability() {
  const isAvailable = await MailComposer.isAvailableAsync();

  if (!isAvailable) {
    Alert.alert(
      'メール利用不可',
      'このデバイスではメールを送信できません。'
    );
    return false;
  }

  return true;
}
```

### 完全なメール作成例

```javascript
import * as MailComposer from 'expo-mail-composer';
import { Button, View, Alert } from 'react-native';

export default function EmailScreen() {
  const sendFeedback = async () => {
    // メールが利用可能か確認
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('エラー', 'メールを送信できません');
      return;
    }

    // メールを作成
    const result = await MailComposer.composeAsync({
      recipients: ['support@example.com'],
      subject: 'アプリのフィードバック',
      body: 'ご意見をお聞かせください...',
      isHtml: false,
    });

    // 結果を処理
    if (result.status === MailComposer.MailComposerStatus.SENT) {
      Alert.alert('成功', 'メールが送信されました');
    } else if (result.status === MailComposer.MailComposerStatus.CANCELLED) {
      Alert.alert('キャンセル', 'メール送信がキャンセルされました');
    }
  };

  return (
    <View>
      <Button title="フィードバックを送信" onPress={sendFeedback} />
    </View>
  );
}
```

## 重要な注意事項

1. **iOS実機のみ**: iOSシミュレーターでは動作しません
2. **メール設定必須**: iOSではMailアプリにサインインしている必要があります
3. **状態報告の制限**: Androidでは送信状態の報告が制限されます
4. **添付ファイル形式**: 添付ファイルはファイルURIとして指定する必要があります

## サポートプラットフォーム

- Android: サポート
- iOS: デバイスのみ（シミュレーター不可）
- Web: サポート
