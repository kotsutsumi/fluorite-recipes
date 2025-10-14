# Contacts

デバイスのシステム連絡先へのアクセスを提供するライブラリです。

## インストール

```bash
npx expo install expo-contacts
```

## 使用方法

```javascript
import * as Contacts from 'expo-contacts';
import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

export default function App() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          setContacts(data);
        }
      }
    })();
  }, []);

  return (
    <View>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>{item.name} - {item.emails?.[0]?.email}</Text>
        )}
      />
    </View>
  );
}
```

## API

```javascript
import * as Contacts from 'expo-contacts';
```

## メソッド

### `Contacts.addContactAsync(contact, containerId)`

新しい連絡先を追加します。

**パラメータ**

- **contact** (`Contact`) - 追加する連絡先データ
- **containerId** (`string`、オプション) - コンテナID（iOSのみ）

**戻り値**

`Promise<string>` - 新しく作成された連絡先のIDを返します。

---

### `Contacts.getContactsAsync(options)`

連絡先リストを取得します。

**パラメータ**

- **options** (`ContactQuery`、オプション) - クエリオプション

**戻り値**

`Promise<ContactResponse>` - 連絡先データとページング情報を含むPromiseを返します。

---

### `Contacts.getContactByIdAsync(id, fields)`

IDで連絡先を取得します。

**パラメータ**

- **id** (`string`) - 連絡先ID
- **fields** (`FieldType[]`、オプション) - 取得するフィールド

**戻り値**

`Promise<Contact | undefined>` - 連絡先データを返します。

---

### `Contacts.getPagedContactsAsync(options)`

ページングされた連絡先リストを取得します。

**パラメータ**

- **options** (`PagedContactQuery`) - ページングオプション

**戻り値**

`Promise<ContactResponse>` - ページングされた連絡先データを返します。

---

### `Contacts.presentFormAsync(contactId, contact, options)`

ネイティブの連絡先フォームを表示します。

**パラメータ**

- **contactId** (`string | null`) - 既存の連絡先ID、または新規作成の場合は`null`
- **contact** (`Contact`、オプション) - フォームに表示する連絡先データ
- **options** (`FormOptions`、オプション) - フォームオプション

**戻り値**

`Promise<void>` - フォームが閉じられたときに解決されるPromiseを返します。

---

### `Contacts.presentContactPickerAsync()`

ネイティブの連絡先ピッカーを表示します。

**戻り値**

`Promise<Contact | null>` - 選択された連絡先、またはキャンセルされた場合は`null`を返します。

---

### `Contacts.removeContactAsync(contactId)`

連絡先を削除します。

**パラメータ**

- **contactId** (`string`) - 削除する連絡先のID

**戻り値**

`Promise<void>` - 削除が完了したときに解決されるPromiseを返します。

---

### `Contacts.updateContactAsync(contact)`

既存の連絡先を更新します。

**パラメータ**

- **contact** (`Contact`) - 更新する連絡先データ（IDを含む）

**戻り値**

`Promise<string>` - 更新された連絡先のIDを返します。

---

### `Contacts.requestPermissionsAsync()`

連絡先へのアクセス許可を要求します。

**戻り値**

`Promise<PermissionResponse>` - パーミッションステータスを含むPromiseを返します。

---

### `Contacts.getPermissionsAsync()`

現在のパーミッションステータスを取得します。

**戻り値**

`Promise<PermissionResponse>` - 現在のパーミッションステータスを返します。

## 定数

### `Contacts.Fields`

取得する連絡先フィールドを指定する定数です。

```typescript
enum Fields {
  ID = 'id',
  Name = 'name',
  FirstName = 'firstName',
  MiddleName = 'middleName',
  LastName = 'lastName',
  Nickname = 'nickname',
  PhoneNumbers = 'phoneNumbers',
  Emails = 'emails',
  Addresses = 'addresses',
  Birthday = 'birthday',
  Note = 'note',
  Image = 'image',
  Company = 'company',
  JobTitle = 'jobTitle',
  Department = 'department',
  SocialProfiles = 'socialProfiles',
  InstantMessageAddresses = 'instantMessageAddresses',
  UrlAddresses = 'urlAddresses',
  Dates = 'dates',
  Relationships = 'relationships'
}
```

## 型

### `Contact`

連絡先データを表す型です。

```typescript
interface Contact {
  id?: string;
  contactType?: string;
  name?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  nickname?: string;
  phoneNumbers?: PhoneNumber[];
  emails?: Email[];
  addresses?: Address[];
  birthday?: Birthday;
  note?: string;
  image?: Image;
  company?: string;
  jobTitle?: string;
  department?: string;
  socialProfiles?: SocialProfile[];
  instantMessageAddresses?: InstantMessageAddress[];
  urlAddresses?: UrlAddress[];
  dates?: Date[];
  relationships?: Relationship[];
}
```

### `ContactQuery`

連絡先クエリオプションを表す型です。

```typescript
interface ContactQuery {
  fields?: FieldType[];
  sort?: SortType;
  name?: string;
  id?: string | string[];
  groupId?: string;
  containerId?: string;
}
```

### `ContactResponse`

連絡先クエリの応答を表す型です。

```typescript
interface ContactResponse {
  data: Contact[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

## パーミッション

### Android

`AndroidManifest.xml`に以下のパーミッションを追加してください：

```xml
<uses-permission android:name="android.permission.READ_CONTACTS" />
<uses-permission android:name="android.permission.WRITE_CONTACTS" />
```

### iOS

`Info.plist`に以下を追加してください：

```xml
<key>NSContactsUsageDescription</key>
<string>アプリが連絡先にアクセスする理由を説明してください</string>
```

または`app.json`の場合：

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSContactsUsageDescription": "アプリが連絡先にアクセスする理由を説明してください"
      }
    }
  }
}
```

## 設定プラグイン

`app.json`で設定プラグインを使用して、連絡先パーミッションのメッセージを設定できます：

```json
{
  "expo": {
    "plugins": [
      [
        "expo-contacts",
        {
          "contactsPermission": "$(PRODUCT_NAME)が連絡先にアクセスできるようにします。"
        }
      ]
    ]
  }
}
```

## プラットフォームサポート

- Android
- iOS
- Web（制限あり）
