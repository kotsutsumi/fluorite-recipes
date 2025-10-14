# Localization

デバイスのネイティブなユーザーローカライゼーション情報へのインターフェースを提供するライブラリです。

## 概要

`expo-localization` は、Android、iOS、tvOS、およびWebプラットフォームで、ネイティブなユーザーローカライゼーション情報にアクセスするためのインターフェースを提供します。このライブラリを使用することで、ユーザーのロケール設定を取得し、特定の地域や言語に合わせてアプリの体験をカスタマイズできます。

## 主な機能

- デバイスのロケールデータにアクセス
- 特定の地域や言語に合わせてアプリの体験をカスタマイズ
- 以下のような国際化ライブラリとの互換性:
  - lingui-js
  - react-i18next
  - react-intl
  - i18n-js

## インストール

```bash
npx expo install expo-localization
```

## 使用方法

### ロケール情報の取得

```javascript
import { getLocales, getCalendars } from 'expo-localization';

// ユーザーのロケール設定を取得
const locales = getLocales();
console.log(locales[0].languageTag); // 例: "ja-JP"

// ユーザーのカレンダー設定を取得
const calendars = getCalendars();
console.log(calendars[0].calendar); // 例: "gregorian"
```

### React Hooksの使用

```javascript
import { useLocales, useCalendars } from 'expo-localization';

function MyComponent() {
  const locales = useLocales();
  const calendars = useCalendars();

  return (
    <View>
      <Text>言語: {locales[0].languageTag}</Text>
      <Text>地域コード: {locales[0].regionCode}</Text>
    </View>
  );
}
```

## API

### メソッド

#### `getLocales()`

ユーザーのロケール設定を取得します。

**戻り値:**
- `Locale[]` - ロケール情報の配列

#### `getCalendars()`

ユーザーのカレンダー設定を取得します。

**戻り値:**
- `Calendar[]` - カレンダー情報の配列

### Hooks

#### `useLocales()`

ロケール情報を取得するReact Hookです。

**戻り値:**
- `Locale[]` - ロケール情報の配列

#### `useCalendars()`

カレンダー設定を取得するReact Hookです。

**戻り値:**
- `Calendar[]` - カレンダー情報の配列

## 型定義

### Locale

ロケール情報には以下が含まれます:

- `languageTag`: 言語タグ（例: "ja-JP"）
- `languageCode`: 言語コード（例: "ja"）
- `textDirection`: テキストの方向（"ltr" または "rtl"）
- `digitGroupingSeparator`: 数字のグループ化区切り文字
- `decimalSeparator`: 小数点区切り文字
- `measurementSystem`: 測定システム（"metric" または "us"）
- `currencyCode`: 通貨コード（例: "JPY"）
- `currencySymbol`: 通貨記号（例: "¥"）
- `regionCode`: 地域コード（例: "JP"）
- `temperatureUnit`: 温度単位（"celsius" または "fahrenheit"）

### Calendar

カレンダー情報には以下が含まれます:

- `calendar`: カレンダーの種類（例: "gregorian"）
- `timeZone`: タイムゾーン（例: "Asia/Tokyo"）
- `uses24hourClock`: 24時間制の使用有無
- `firstWeekday`: 週の最初の曜日

## プラットフォーム固有の動作

### iOS

- iOSでは、ロケール設定はアプリの実行中は一定のままです
- アプリを再起動すると、新しいロケール設定が反映されます

### Android

- Androidでは、実行時にロケールの変更が可能です
- アプリがフォアグラウンドに戻ったときにロケールデータを更新することが推奨されます

## 推奨事項

- アプリがフォアグラウンドに戻ったときにロケールデータを更新することをお勧めします
- 国際化ライブラリ（i18n-js、react-intl、react-i18nextなど）と組み合わせて使用することで、完全な多言語対応が実現できます

## サポートプラットフォーム

- Android
- iOS
- tvOS
- Web
