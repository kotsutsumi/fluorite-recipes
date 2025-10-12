# Expo Modules API 入門

Expo Modules APIを使用してネイティブモジュールを作成する方法を学びます。

## 概要

Expo Modules APIは、ネイティブモジュールを作成するための2つの主要な方法を提供します。

**2つのアプローチ**：
1. **ローカルモジュール**: 既存のExpoアプリにモジュールを追加
2. **スタンドアロンモジュール**: 再利用可能なモジュールをサンプルプロジェクトと共に作成

## 方法1: ローカルモジュールの作成

既存のExpoアプリにモジュールを追加します。

### ステップ1: モジュールの初期化

```bash
npx create-expo-module@latest --local
```

**プロンプト**：
```
? What is the name of the local module? › my-module
```

### ステップ2: プロジェクト構造の確認

コマンド実行後、新しい`modules`ディレクトリが作成されます。

```
project/
├── app/
├── modules/
│   └── my-module/
│       ├── android/
│       ├── ios/
│       ├── src/
│       │   └── index.ts
│       └── expo-module.config.json
├── package.json
└── app.json
```

### ステップ3: ネイティブプロジェクトの生成

```bash
npx expo prebuild --clean
```

**説明**: このコマンドは、ネイティブプロジェクト（Android Studio / Xcode）を生成します。

### ステップ4: モジュールのインポート

```typescript
// app/index.tsx
import { hello } from '../modules/my-module';

export default function App() {
  const message = hello();
  return <Text>{message}</Text>;
}
```

### ステップ5: 開発サーバーの起動

```bash
npx expo start
```

## 方法2: スタンドアロンモジュールの作成

再利用可能なモジュールをサンプルプロジェクトと共に作成します。

### ステップ1: モジュールの作成

```bash
npx create-expo-module@latest my-module
```

**プロンプト**：
```
? What is the name of the npm package? › expo-my-module
? What is the native module name? › MyModule
? What is the Android package name? › expo.modules.mymodule
```

### ステップ2: 生成されるプロジェクト構造

```
my-module/
├── android/                    # Android実装
│   └── src/
│       └── main/
│           └── java/
│               └── expo/
│                   └── modules/
│                       └── mymodule/
│                           └── MyModuleModule.kt
├── ios/                        # iOS実装
│   └── MyModule.swift
├── src/                        # TypeScript API
│   ├── index.ts
│   └── MyModule.types.ts
├── example/                    # サンプルアプリ
│   ├── app/
│   ├── android/
│   ├── ios/
│   └── package.json
├── expo-module.config.json     # モジュール設定
└── package.json
```

### ステップ3: サンプルアプリの起動

```bash
cd my-module
npx expo start
```

**動作確認**: サンプルアプリでモジュールをテストできます。

## モジュール開発ワークフロー

### 1. ネイティブコードの編集

#### iOS（Xcode）

```bash
# Xcodeでプロジェクトを開く
open ios/MyModule.xcworkspace
```

**編集対象**：
- `ios/MyModule.swift`
- `ios/MyModule.podspec`

#### Android（Android Studio）

```bash
# Android Studioでプロジェクトを開く
open -a "Android Studio" android/
```

**編集対象**：
- `android/src/main/java/expo/modules/mymodule/MyModuleModule.kt`
- `android/build.gradle`

### 2. モジュール関数の変更

**例（Swift）**：
```swift
// ios/MyModule.swift
public class MyModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MyModule")

    Function("hello") {
      return "Hello from Swift!"
    }

    Function("add") { (a: Int, b: Int) in
      return a + b
    }
  }
}
```

**例（Kotlin）**：
```kotlin
// android/src/main/java/.../MyModuleModule.kt
class MyModuleModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MyModule")

    Function("hello") {
      "Hello from Kotlin!"
    }

    Function("add") { a: Int, b: Int ->
      a + b
    }
  }
}
```

### 3. TypeScript APIの更新

```typescript
// src/index.ts
import { requireNativeModule } from 'expo-modules-core';

const MyModule = requireNativeModule('MyModule');

export function hello(): string {
  return MyModule.hello();
}

export function add(a: number, b: number): number {
  return MyModule.add(a, b);
}
```

### 4. アプリの再ビルド

```bash
# iOSの場合
npx expo run:ios

# Androidの場合
npx expo run:android

# または、開発ビルドを使用
npx expo start --dev-client
```

## モジュール設定

### expo-module.config.json

```json
{
  "platforms": ["ios", "android", "web"],
  "ios": {
    "modules": ["MyModule"]
  },
  "android": {
    "modules": ["expo.modules.mymodule.MyModuleModule"]
  }
}
```

**設定項目**：
- `platforms`: サポートするプラットフォーム
- `ios.modules`: iOSモジュールクラス名
- `android.modules`: Androidモジュールの完全修飾クラス名

## プロジェクトへのモジュール追加

### ローカルモジュールの使用

**package.json**:
```json
{
  "dependencies": {
    "my-module": "file:./modules/my-module"
  }
}
```

### npm/yarnでのインストール

```bash
# ローカルパス
npm install ./modules/my-module

# npmパッケージ
npm install expo-my-module
```

## テストとデバッグ

### 1. コンソールログの使用

**Swift**:
```swift
Function("debug") {
  print("Debug message from Swift")
}
```

**Kotlin**:
```kotlin
Function("debug") {
  Log.d("MyModule", "Debug message from Kotlin")
}
```

### 2. ブレークポイントの設定

- **Xcode**: ソースコードの行番号をクリック
- **Android Studio**: ソースコードの行番号をクリック

### 3. ネイティブデバッガーの使用

```bash
# iOSデバッガー
npx expo run:ios --configuration Debug

# Androidデバッガー
npx expo run:android --variant Debug
```

## 次のステップ

### 推奨されるチュートリアル

1. **[ネイティブモジュールチュートリアル](./native-module-tutorial.md)**
   - ネイティブ関数の作成
   - イベントの発行
   - 型安全性の実装

2. **[ネイティブビューチュートリアル](./native-view-tutorial.md)**
   - カスタムUIコンポーネントの作成
   - プロップスとイベントの処理
   - レイアウトの管理

### 参考資料

- **[Expo Modules API リファレンス](./module-api.md)**
- **[サードパーティライブラリの統合](./third-party-library.md)**
- **[既存ライブラリの移行](./existing-library.md)**

## よくある問題と解決策

### 問題1: モジュールが見つからない

**エラー**: `Unable to resolve module`

**解決策**：
```bash
# キャッシュをクリア
npx expo start --clear

# 依存関係を再インストール
rm -rf node_modules
npm install
```

### 問題2: ネイティブビルドが失敗する

**エラー**: Build failed with native error

**解決策**：
```bash
# プロジェクトをクリーンビルド
npx expo prebuild --clean
npx expo run:ios --configuration Release
npx expo run:android --variant release
```

### 問題3: モジュールの変更が反映されない

**原因**: ネイティブコードの変更は再ビルドが必要

**解決策**：
```bash
# アプリを再ビルド
npx expo run:ios
npx expo run:android
```

## ベストプラクティス

### 1. 明確な命名規則

```typescript
// ✅ 推奨
export function getUserLocation(): Promise<Location>

// ❌ 非推奨
export function getUL(): Promise<any>
```

### 2. 型安全性の確保

```typescript
// src/MyModule.types.ts
export interface Location {
  latitude: number;
  longitude: number;
}

export function getUserLocation(): Promise<Location> {
  return MyModule.getUserLocation();
}
```

### 3. エラーハンドリング

```swift
Function("getUserLocation") {
  do {
    let location = try getLocation()
    return location
  } catch {
    throw Exception(name: "LocationError", description: error.localizedDescription)
  }
}
```

### 4. ドキュメントの作成

```typescript
/**
 * ユーザーの現在位置を取得します。
 * @returns {Promise<Location>} 緯度と経度を含む位置情報
 * @throws {Error} 位置情報の取得に失敗した場合
 */
export function getUserLocation(): Promise<Location> {
  return MyModule.getUserLocation();
}
```

## まとめ

Expo Modules APIを使い始めるには、以下の2つの方法があります：

1. **ローカルモジュール**: `npx create-expo-module@latest --local`
   - 既存のExpoアプリに追加
   - プロジェクト固有の機能
   - 迅速なプロトタイピング

2. **スタンドアロンモジュール**: `npx create-expo-module@latest my-module`
   - 再利用可能なモジュール
   - npmパッケージとして公開可能
   - サンプルアプリ付き

**主な開発ステップ**：
1. モジュールの初期化
2. ネイティブコードの編集（Xcode / Android Studio）
3. TypeScript APIの更新
4. アプリの再ビルドとテスト

**推奨される次のステップ**：
- ネイティブモジュールチュートリアルを実行
- Expo Modules APIリファレンスを確認
- カスタムネイティブ機能を実験

これらのステップに従って、Expo Modules APIを使用したネイティブモジュール開発を開始できます。
