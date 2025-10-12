# 追加プラットフォームサポート

Expo Modulesに追加プラットフォーム（Web、macOS、tvOS、Windows）のサポートを追加する方法を学びます。

## 概要

Expo Modulesは、AndroidとiOS以外のプラットフォームもサポートします。

**主要プラットフォーム**：
- Android
- iOS

**追加サポートプラットフォーム**：
- macOS
- tvOS
- Web
- Windows（実験的）

## 現在のプラットフォームサポート状況

| プラットフォーム | サポート状況 | 備考 |
|--------------|-----------|------|
| Android | ✅ 完全サポート | - |
| iOS | ✅ 完全サポート | - |
| macOS | ✅ サポート | react-native-macosが必要 |
| tvOS | ✅ サポート | react-native-tvosが必要 |
| Web | ✅ サポート | - |
| Windows | 🧪 実験的 | react-native-windowsが必要 |

## macOSサポートの追加

### ステップ1: expo-module.config.jsonの設定

```json
{
  "platforms": ["apple"],
  "apple": {
    "modules": ["MyModule"]
  }
}
```

**`"apple"`**: iOS、macOS、tvOSをまとめて指定

### ステップ2: Podspecの更新

```ruby
# ios/MyModule.podspec
Pod::Spec.new do |s|
  s.name           = 'MyModule'
  s.version        = '1.0.0'
  s.summary        = 'My custom module'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'

  # プラットフォームの宣言
  s.platforms      = {
    :ios => '13.4',
    :osx => '10.15',
    :tvos => '13.4'
  }

  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
```

### ステップ3: react-native-macosのセットアップ

```bash
# プロジェクトにreact-native-macosを追加
npx react-native-macos-init
```

### ステップ4: プラットフォーム固有のコード

```swift
// ios/MyModule.swift
import ExpoModulesCore

#if os(iOS)
import UIKit
#elseif os(macOS)
import AppKit
#elseif os(tvOS)
import UIKit
#endif

public class MyModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MyModule")

    Function("getPlatform") {
      return platformName()
    }

    Function("showNativeAlert") { (title: String, message: String) in
      showAlert(title: title, message: message)
    }
  }

  private func platformName() -> String {
    #if os(iOS)
    return "iOS"
    #elseif os(macOS)
    return "macOS"
    #elseif os(tvOS)
    return "tvOS"
    #else
    return "Unknown"
    #endif
  }

  private func showAlert(title: String, message: String) {
    #if os(iOS) || os(tvOS)
    DispatchQueue.main.async {
      let alert = UIAlertController(
        title: title,
        message: message,
        preferredStyle: .alert
      )
      alert.addAction(UIAlertAction(title: "OK", style: .default))

      if let topController = UIApplication.shared.windows.first?.rootViewController {
        topController.present(alert, animated: true)
      }
    }
    #elseif os(macOS)
    DispatchQueue.main.async {
      let alert = NSAlert()
      alert.messageText = title
      alert.informativeText = message
      alert.alertStyle = .informational
      alert.addButton(withTitle: "OK")
      alert.runModal()
    }
    #endif
  }
}
```

## tvOSサポートの追加

### ステップ1: react-native-tvosのセットアップ

```bash
# プロジェクトにreact-native-tvosを追加
npx react-native init MyTVApp --template react-native-tvos
```

### ステップ2: tvOS固有の機能

```swift
// ios/MyModule.swift
#if os(tvOS)
import UIKit

public class MyModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MyModule")

    Function("handleTVRemote") {
      // tvOSリモコン処理
      return "TV Remote support enabled"
    }

    Function("focusGuide") {
      // フォーカスガイドの設定
      return "Focus guide configured"
    }
  }
}
#endif
```

### ステップ3: tvOS専用UI

```swift
#if os(tvOS)
class MyTVView: ExpoView {
  private let button = UIButton(type: .system)

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)

    button.setTitle("Press Me", for: .normal)
    button.titleLabel?.font = UIFont.systemFont(ofSize: 40)

    // tvOS用のフォーカス設定
    button.addTarget(self, action: #selector(buttonPressed), for: .primaryActionTriggered)

    addSubview(button)
  }

  @objc func buttonPressed() {
    print("Button pressed on tvOS")
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    button.frame = bounds
  }

  // tvOSのフォーカス処理
  override var canBecomeFocused: Bool {
    return true
  }
}
#endif
```

## Webサポートの追加

### ステップ1: Web実装の作成

```typescript
// src/MyModuleView.web.tsx
import * as React from 'react';
import { ViewStyle } from 'react-native';

export interface MyModuleViewProps {
  style?: ViewStyle;
  message?: string;
}

export default function MyModuleView(props: MyModuleViewProps) {
  return (
    <div style={props.style as React.CSSProperties}>
      <p>{props.message || 'Hello from Web'}</p>
    </div>
  );
}
```

### ステップ2: Web専用モジュール

```typescript
// src/MyModule.web.ts
export function getPlatform(): string {
  return 'web';
}

export function showNativeAlert(title: string, message: string): void {
  window.alert(`${title}\n\n${message}`);
}

export function getWindowSize(): { width: number; height: number } {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}
```

### ステップ3: プラットフォーム固有のエクスポート

```typescript
// src/index.ts
import { Platform } from 'react-native';

let MyModule: any;

if (Platform.OS === 'web') {
  MyModule = require('./MyModule.web');
} else {
  MyModule = require('./MyModule');
}

export const { getPlatform, showNativeAlert } = MyModule;

export default MyModule;
```

## Windowsサポート（実験的）

### ステップ1: react-native-windowsのセットアップ

```bash
# プロジェクトにreact-native-windowsを追加
npx react-native-windows-init --overwrite
```

### ステップ2: Windows実装

```cpp
// windows/MyModule/MyModule.h
#pragma once

#include "winrt/Microsoft.ReactNative.h"

namespace winrt::MyModule::implementation
{
    REACT_MODULE(MyModule);
    struct MyModule
    {
        REACT_INIT(Initialize)
        void Initialize(winrt::Microsoft::ReactNative::ReactContext const& reactContext) noexcept;

        REACT_METHOD(GetPlatform)
        void GetPlatform(winrt::Microsoft::ReactNative::ReactPromise<winrt::hstring> const& promise) noexcept;
    };
}
```

## プラットフォーム間での違いの処理

### UIフレームワークの違い

| プラットフォーム | UIフレームワーク |
|--------------|--------------|
| iOS / tvOS | UIKit |
| macOS | AppKit |
| Android | Views / Jetpack Compose |
| Web | HTML / CSS |
| Windows | WinUI / XAML |

### コンパイラディレクティブの使用

```swift
// Swift
#if os(iOS)
  // iOS実装
#elseif os(macOS)
  // macOS実装
#elseif os(tvOS)
  // tvOS実装
#endif
```

```kotlin
// Kotlin
#if ANDROID
  // Android実装
#endif
```

### Platform.selectの使用

```typescript
// TypeScript
import { Platform } from 'react-native';

const platformSpecificCode = Platform.select({
  ios: () => {
    // iOS実装
  },
  android: () => {
    // Android実装
  },
  macos: () => {
    // macOS実装
  },
  web: () => {
    // Web実装
  },
  windows: () => {
    // Windows実装
  },
  default: () => {
    // デフォルト実装
  },
});
```

## Polyfillとエイリアス

### react-native-macosのPolyfill

react-native-macosとexpo-modules-coreは、プラットフォーム間の違いを吸収するPolyfillを提供します。

**例**：
- `UIColor` → `NSColor`（macOS）
- `UIView` → `NSView`（macOS）
- `UIImage` → `NSImage`（macOS）

### エイリアスの使用

```swift
#if os(iOS) || os(tvOS)
typealias PlatformColor = UIColor
typealias PlatformView = UIView
typealias PlatformImage = UIImage
#elseif os(macOS)
typealias PlatformColor = NSColor
typealias PlatformView = NSView
typealias PlatformImage = NSImage
#endif

// 統一されたコード
let color = PlatformColor.red
let view = PlatformView()
```

## ベストプラクティス

### 1. プラットフォーム固有のコードを最小化

```swift
// ✅ 推奨: 共通コードを最大化
func processData(_ data: String) -> String {
  return data.uppercased()
}

// プラットフォーム固有は必要な部分のみ
func showUI() {
  #if os(iOS)
    showIOSUI()
  #elseif os(macOS)
    showMacOSUI()
  #endif
}
```

### 2. 一貫したAPIを提供

```typescript
// すべてのプラットフォームで同じAPI
export function showNativeAlert(title: string, message: string): void {
  // プラットフォーム固有の実装は内部で処理
}
```

### 3. プラットフォーム機能の検出

```typescript
export function isFeatureSupported(feature: string): boolean {
  switch (feature) {
    case 'native-alert':
      return Platform.OS !== 'web';
    case 'window-size':
      return Platform.OS === 'web' || Platform.OS === 'windows';
    default:
      return false;
  }
}
```

### 4. ドキュメントでプラットフォームサポートを明記

```typescript
/**
 * Shows a native alert dialog.
 *
 * @param title - Alert title
 * @param message - Alert message
 *
 * @platform ios
 * @platform android
 * @platform macos
 * @platform tvos
 */
export function showNativeAlert(title: string, message: string): void {
  // ...
}
```

## まとめ

Expo Modulesに追加プラットフォームサポートを追加するには、以下のステップを実行します：

### macOS
1. expo-module.config.jsonで`"apple"`プラットフォームを指定
2. PodspecでmacOSプラットフォームを宣言
3. react-native-macosをセットアップ
4. コンパイラディレクティブでプラットフォーム固有のコードを処理

### tvOS
1. Podspecでtvプラットフォームを宣言
2. react-native-tvosをセットアップ
3. tvOS固有のUI（フォーカス、リモコン）を実装

### Web
1. `.web.tsx` / `.web.ts`ファイルを作成
2. Web APIを使用して実装
3. プラットフォーム固有のエクスポートを設定

### Windows（実験的）
1. react-native-windowsをセットアップ
2. C++でWindows実装を作成

**重要な考慮事項**：
- プラットフォーム間でAPIが異なる
- UIフレームワークが異なる（UIKit、AppKit、Views、HTML、WinUI）
- Polyfillとエイリアスを活用
- プラットフォーム固有のコードを最小化

これらのパターンを活用して、マルチプラットフォーム対応のExpo Modulesを作成できます。
