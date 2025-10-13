# ネイティブモジュールチュートリアル

Expo Modules APIを使用してネイティブモジュールを作成する実践的なチュートリアルです。

## チュートリアル概要

このチュートリアルでは、テーマ設定を管理するネイティブモジュール`expo-settings`を作成します。

**学習内容**：
- ネイティブ関数の作成
- データの永続化（SharedPreferences / UserDefaults）
- イベントの発行
- 型安全性の実装

**サポートプラットフォーム**：
- Android（SharedPreferencesを使用）
- iOS（UserDefaultsを使用）
- TypeScriptインターフェース

## ステップ1: モジュールの初期化

### モジュールの作成

```bash
npx create-expo-module@latest expo-settings
```

**プロンプト**：
```
? What is the name of the npm package? › expo-settings
? What is the native module name? › ExpoSettings
? What is the Android package name? › expo.modules.exposettings
```

### 不要なファイルの削除

```bash
cd expo-settings

# デフォルトのビューファイルを削除
rm ios/ExpoSettingsView.swift
rm android/src/main/java/expo/modules/exposettings/ExpoSettingsView.kt
rm src/ExpoSettingsView.tsx
rm src/ExpoSettings.types.ts

# Webファイルを削除
rm src/ExpoSettingsView.web.tsx
```

## ステップ2: Androidの実装

### SharedPreferencesの設定

```kotlin
// android/src/main/java/expo/modules/exposettings/ExpoSettingsModule.kt
package expo.modules.exposettings

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.content.Context
import android.content.SharedPreferences

class ExpoSettingsModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw IllegalStateException("React context not available")

  private val sharedPreferences: SharedPreferences
    get() = context.getSharedPreferences("ExpoSettings", Context.MODE_PRIVATE)

  override fun definition() = ModuleDefinition {
    Name("ExpoSettings")

    // テーマの取得
    Function("getTheme") {
      sharedPreferences.getString("theme", "system") ?: "system"
    }

    // テーマの設定
    Function("setTheme") { theme: String ->
      sharedPreferences.edit().putString("theme", theme).apply()
    }
  }
}
```

### イベントの追加

```kotlin
class ExpoSettingsModule : Module() {
  // ... 前のコード

  override fun definition() = ModuleDefinition {
    Name("ExpoSettings")

    // イベントの定義
    Events("onChangeTheme")

    Function("getTheme") {
      sharedPreferences.getString("theme", "system") ?: "system"
    }

    Function("setTheme") { theme: String ->
      sharedPreferences.edit().putString("theme", theme).apply()

      // イベントを発行
      sendEvent("onChangeTheme", mapOf(
        "theme" to theme
      ))
    }
  }
}
```

## ステップ3: iOSの実装

### UserDefaultsの設定

```swift
// ios/ExpoSettingsModule.swift
import ExpoModulesCore

public class ExpoSettingsModule: Module {
  private let userDefaults = UserDefaults.standard
  private let themeKey = "theme"

  public func definition() -> ModuleDefinition {
    Name("ExpoSettings")

    // テーマの取得
    Function("getTheme") {
      return userDefaults.string(forKey: themeKey) ?? "system"
    }

    // テーマの設定
    Function("setTheme") { (theme: String) in
      userDefaults.set(theme, forKey: themeKey)
    }
  }
}
```

### イベントの追加

```swift
public class ExpoSettingsModule: Module {
  // ... 前のコード

  public func definition() -> ModuleDefinition {
    Name("ExpoSettings")

    // イベントの定義
    Events("onChangeTheme")

    Function("getTheme") {
      return userDefaults.string(forKey: themeKey) ?? "system"
    }

    Function("setTheme") { (theme: String) in
      userDefaults.set(theme, forKey: themeKey)

      // イベントを発行
      sendEvent("onChangeTheme", [
        "theme": theme
      ])
    }
  }
}
```

## ステップ4: TypeScriptインターフェースの作成

### 基本的なAPI

```typescript
// src/index.ts
import { requireNativeModule } from 'expo-modules-core';

const ExpoSettings = requireNativeModule('ExpoSettings');

export function getTheme(): string {
  return ExpoSettings.getTheme();
}

export function setTheme(theme: string): void {
  ExpoSettings.setTheme(theme);
}
```

### イベントリスナーの追加

```typescript
// src/index.ts
import { EventEmitter, requireNativeModule } from 'expo-modules-core';

const ExpoSettings = requireNativeModule('ExpoSettings');
const emitter = new EventEmitter(ExpoSettings);

export function getTheme(): string {
  return ExpoSettings.getTheme();
}

export function setTheme(theme: string): void {
  ExpoSettings.setTheme(theme);
}

export function addThemeListener(listener: (event: { theme: string }) => void) {
  return emitter.addListener('onChangeTheme', listener);
}
```

## ステップ5: 型安全性の実装

### 列挙型の定義

```typescript
// src/ExpoSettings.types.ts
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export interface ThemeChangeEvent {
  theme: Theme;
}
```

### Androidでの列挙型の使用

```kotlin
// android/src/main/java/expo/modules/exposettings/ExpoSettingsModule.kt
package expo.modules.exposettings

import expo.modules.kotlin.types.Enumerable

enum class Theme(val value: String) : Enumerable {
  LIGHT("light"),
  DARK("dark"),
  SYSTEM("system");
}

class ExpoSettingsModule : Module() {
  // ... SharedPreferencesの設定

  override fun definition() = ModuleDefinition {
    Name("ExpoSettings")
    Events("onChangeTheme")

    Function("getTheme") {
      val themeValue = sharedPreferences.getString("theme", "system") ?: "system"
      Theme.values().find { it.value == themeValue } ?: Theme.SYSTEM
    }

    Function("setTheme") { theme: Theme ->
      sharedPreferences.edit().putString("theme", theme.value).apply()

      sendEvent("onChangeTheme", mapOf(
        "theme" to theme.value
      ))
    }
  }
}
```

### iOSでの列挙型の使用

```swift
// ios/ExpoSettingsModule.swift
import ExpoModulesCore

enum Theme: String, Enumerable {
  case light
  case dark
  case system
}

public class ExpoSettingsModule: Module {
  private let userDefaults = UserDefaults.standard
  private let themeKey = "theme"

  public func definition() -> ModuleDefinition {
    Name("ExpoSettings")
    Events("onChangeTheme")

    Function("getTheme") -> Theme {
      let themeValue = userDefaults.string(forKey: themeKey) ?? "system"
      return Theme(rawValue: themeValue) ?? .system
    }

    Function("setTheme") { (theme: Theme) in
      userDefaults.set(theme.rawValue, forKey: themeKey)

      sendEvent("onChangeTheme", [
        "theme": theme.rawValue
      ])
    }
  }
}
```

### TypeScript型の更新

```typescript
// src/index.ts
import { EventEmitter, requireNativeModule, Subscription } from 'expo-modules-core';
import { Theme, ThemeChangeEvent } from './ExpoSettings.types';

const ExpoSettings = requireNativeModule('ExpoSettings');
const emitter = new EventEmitter(ExpoSettings);

export function getTheme(): Theme {
  return ExpoSettings.getTheme();
}

export function setTheme(theme: Theme): void {
  ExpoSettings.setTheme(theme);
}

export function addThemeListener(
  listener: (event: ThemeChangeEvent) => void
): Subscription {
  return emitter.addListener<ThemeChangeEvent>('onChangeTheme', listener);
}

export { Theme } from './ExpoSettings.types';
```

## ステップ6: サンプルアプリでのテスト

### サンプルアプリの実装

```typescript
// example/App.tsx
import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import * as ExpoSettings from 'expo-settings';
import { Theme } from 'expo-settings';

export default function App() {
  const [theme, setTheme] = useState<Theme>(Theme.SYSTEM);

  useEffect(() => {
    // 初期テーマを取得
    const currentTheme = ExpoSettings.getTheme();
    setTheme(currentTheme);

    // テーマ変更リスナーを追加
    const subscription = ExpoSettings.addThemeListener((event) => {
      setTheme(event.theme);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleSetTheme = (newTheme: Theme) => {
    ExpoSettings.setTheme(newTheme);
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor(theme) }]}>
      <Text style={styles.text}>Current Theme: {theme}</Text>

      <Button
        title="Set Light Theme"
        onPress={() => handleSetTheme(Theme.LIGHT)}
      />

      <Button
        title="Set Dark Theme"
        onPress={() => handleSetTheme(Theme.DARK)}
      />

      <Button
        title="Set System Theme"
        onPress={() => handleSetTheme(Theme.SYSTEM)}
      />
    </View>
  );
}

function getBackgroundColor(theme: Theme): string {
  switch (theme) {
    case Theme.LIGHT:
      return '#ffffff';
    case Theme.DARK:
      return '#000000';
    case Theme.SYSTEM:
      return '#f0f0f0';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
```

### サンプルアプリの起動

```bash
cd expo-settings
npx expo start
```

## ステップ7: 非同期関数の追加

### Androidでの非同期関数

```kotlin
import expo.modules.kotlin.Promise

Function("saveThemeAsync") { theme: Theme, promise: Promise ->
  try {
    sharedPreferences.edit().putString("theme", theme.value).apply()

    sendEvent("onChangeTheme", mapOf(
      "theme" to theme.value
    ))

    promise.resolve(true)
  } catch (e: Exception) {
    promise.reject("SAVE_ERROR", "Failed to save theme", e)
  }
}
```

### iOSでの非同期関数

```swift
AsyncFunction("saveThemeAsync") { (theme: Theme, promise: Promise) in
  userDefaults.set(theme.rawValue, forKey: themeKey)

  sendEvent("onChangeTheme", [
    "theme": theme.rawValue
  ])

  promise.resolve(true)
}
```

### TypeScriptでの非同期関数

```typescript
export async function saveThemeAsync(theme: Theme): Promise<boolean> {
  return await ExpoSettings.saveThemeAsync(theme);
}
```

## 主な機能

### 1. データの永続化

- **Android**: SharedPreferences
- **iOS**: UserDefaults
- **クロスプラットフォーム**: 一貫したAPI

### 2. イベントの発行

```typescript
// リスナーの登録
const subscription = ExpoSettings.addThemeListener((event) => {
  console.log('Theme changed:', event.theme);
});

// リスナーの解除
subscription.remove();
```

### 3. 型安全性

```typescript
// 型チェックされる
ExpoSettings.setTheme(Theme.LIGHT); // ✅

// エラー
ExpoSettings.setTheme('invalid'); // ❌ TypeScript error
```

## ベストプラクティス

### 1. エラーハンドリング

```kotlin
Function("setTheme") { theme: Theme ->
  try {
    sharedPreferences.edit().putString("theme", theme.value).apply()
    sendEvent("onChangeTheme", mapOf("theme" to theme.value))
  } catch (e: Exception) {
    throw Exception("Failed to set theme: ${e.message}")
  }
}
```

### 2. バリデーション

```swift
Function("setTheme") { (theme: Theme) in
  guard Theme.allCases.contains(theme) else {
    throw Exception(name: "InvalidTheme", description: "Invalid theme value")
  }

  userDefaults.set(theme.rawValue, forKey: themeKey)
  sendEvent("onChangeTheme", ["theme": theme.rawValue])
}
```

### 3. ドキュメント

```typescript
/**
 * アプリのテーマを取得します。
 * @returns {Theme} 現在のテーマ設定
 */
export function getTheme(): Theme {
  return ExpoSettings.getTheme();
}

/**
 * アプリのテーマを設定します。
 * @param {Theme} theme - 設定するテーマ
 */
export function setTheme(theme: Theme): void {
  ExpoSettings.setTheme(theme);
}
```

## まとめ

このチュートリアルでは、以下を学びました：

1. **モジュールの初期化**: `npx create-expo-module@latest`
2. **ネイティブ実装**: SharedPreferences（Android）、UserDefaults（iOS）
3. **イベントの発行**: `Events()`と`sendEvent()`
4. **型安全性**: 列挙型による型制約
5. **TypeScriptインターフェース**: 一貫したAPI
6. **非同期関数**: Promise / AsyncFunction

**主な機能**：
- テーマ設定の取得と保存
- アプリ再起動後もテーマを保持
- テーマ変更時にイベントを発行
- 型安全なAPI（light、dark、system）

**コード構造**：
```
expo-settings/
├── android/
│   └── src/main/java/.../ExpoSettingsModule.kt
├── ios/
│   └── ExpoSettingsModule.swift
├── src/
│   ├── index.ts
│   └── ExpoSettings.types.ts
└── example/
    └── App.tsx
```

これらのパターンを活用して、独自のネイティブモジュールを作成できます。
