# Expo Modules API 概要

Expo Modules APIを使用してSwiftとKotlinでネイティブモジュールを作成する方法を学びます。

## Expo Modules APIとは

Expo Modules APIは、SwiftとKotlinでネイティブモジュールを記述できるAPIです。

**定義**: React Nativeアプリにネイティブコードを通じて新しい機能を追加できるAPI

**目的**: モダンな言語機能を活用し、最小限のボイラープレートコードでネイティブ機能を統合

## 主な特徴

### 1. モダンな言語サポート

SwiftとKotlinの最新機能を活用できます。

**サポート言語**：
- **iOS**: Swift（Objective-Cではない）
- **Android**: Kotlin（Javaではない）

**利点**：
- 型安全性
- Null安全性
- モダンな構文
- 簡潔なコード

### 2. 一貫した開発体験

プラットフォーム間で一貫したAPIを提供します。

**統一されたパターン**：
```swift
// iOS (Swift)
public class ExpoModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MyModule")
    Function("sayHello") { (name: String) in
      return "Hello \(name)!"
    }
  }
}
```

```kotlin
// Android (Kotlin)
class ExpoModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MyModule")
    Function("sayHello") { name: String ->
      "Hello $name!"
    }
  }
}
```

### 3. 最小限のボイラープレート

従来のネイティブモジュール作成と比較して、大幅にコード量を削減できます。

**比較**：
- **従来のReact Nativeモジュール**: 100-200行以上のボイラープレート
- **Expo Modules API**: 10-20行で実装可能

### 4. React Native New Architectureサポート

新しいReact Nativeアーキテクチャを自動的にサポートします。

**自動サポート機能**：
- Turbo Modules互換性
- Fabric Renderer対応
- 後方互換性の維持

### 5. 自動的な後方互換性

既存のReact Nativeアプリと自動的に互換性があります。

## ユースケース

### 1. カスタムネイティブ機能の統合

プラットフォーム固有の機能にアクセスします。

**例**：
- デバイスセンサー
- Bluetoothデバイス
- NFCリーダー
- ファイルシステムアクセス

### 2. サードパーティSDKのラップ

既存のネイティブSDKをReact Nativeで使用可能にします。

**例**：
```typescript
// ネイティブSDKをラップ
import { NativeAnalytics } from './modules/native-analytics';

NativeAnalytics.trackEvent('user_login', {
  userId: '123',
  timestamp: Date.now(),
});
```

### 3. プラットフォーム固有の機能追加

iOSとAndroidの特定の機能を実装します。

**例**：
- iOS: Apple Pay、HealthKit
- Android: Google Pay、Wear OS

### 4. システム機能へのアクセス

既存のライブラリでカバーされていないシステム機能にアクセスします。

## 使用すべきとき

### ✅ 推奨されるケース

1. **既存のライブラリが要件を満たさない**
   - カスタム実装が必要
   - 特定の機能が不足

2. **企業の必須サービス統合**
   - 社内SDK
   - カスタムプロトコル

3. **ユニークなシステム機能へのアクセス**
   - 新しいOSの機能
   - 専門的なハードウェア連携

### ❌ 推奨されないケース

1. **既存のライブラリで十分な場合**
   - 既に実装されている機能
   - コミュニティで検証済みのソリューション

2. **単純なJavaScript実装で可能な場合**
   - ネイティブコードが不要
   - パフォーマンス要件が低い

## パフォーマンス考慮事項

### アプリサイズへの影響

**影響**: 数百キロバイト程度

**内訳**：
- Expo Modules Core: ~200-300KB
- 各モジュール: 10-50KB

### 実行パフォーマンス

**パフォーマンス**: React NativeのTurbo Modulesと同等

**ベンチマーク**：
- ネイティブメソッド呼び出し: 100,000回/秒以上
- オーバーヘッド: ほぼ無視できる（< 0.1ms）

### メモリ使用量

**メモリ**: 最小限の追加メモリ使用

**最適化**：
- 遅延初期化
- メモリ効率的なデータ構造
- 自動メモリ管理

## プラットフォームサポート

### 主要サポート

- ✅ **Android**: 完全サポート
- ✅ **iOS**: 完全サポート
- ✅ **Web**: 完全サポート

### 実験的サポート

- 🧪 **macOS**: 実験的サポート
- 🧪 **tvOS**: 実験的サポート

### プラットフォーム別の機能

| 機能 | Android | iOS | Web |
|-----|---------|-----|-----|
| ネイティブモジュール | ✅ | ✅ | ✅ |
| ネイティブビュー | ✅ | ✅ | ✅ |
| イベント | ✅ | ✅ | ✅ |
| 非同期関数 | ✅ | ✅ | ✅ |
| TypeScript型 | ✅ | ✅ | ✅ |

## アーキテクチャ

### レイヤー構造

```
┌─────────────────────────────────┐
│   React Native / Expo App       │
│   (JavaScript / TypeScript)     │
└─────────────┬───────────────────┘
              │
              ↓
┌─────────────────────────────────┐
│   Expo Modules API              │
│   (Bridge / Type System)        │
└─────────────┬───────────────────┘
              │
              ↓
┌─────────────────────────────────┐
│   Native Code                   │
│   (Swift / Kotlin)              │
└─────────────────────────────────┘
```

### コンポーネント

1. **Module Definition**: モジュールの構造定義
2. **Type System**: JavaScriptとネイティブ間の型変換
3. **Event Emitter**: ネイティブからJavaScriptへのイベント送信
4. **View Manager**: ネイティブUIコンポーネントの管理

## 開発者体験

### 推奨される開発者

- ✅ ネイティブモジュール開発の簡単な体験を求める開発者
- ✅ カスタムネイティブ統合が必要なプロジェクト
- ✅ 開発者に優しいネイティブコード実装を好む開発者

### 学習曲線

**難易度レベル**：
- **JavaScript開発者**: 中程度（SwiftまたはKotlinの基礎知識が必要）
- **ネイティブ開発者**: 低い（既存の知識を活用可能）
- **React Native開発者**: 低～中程度（新しいAPIパターンの学習）

### ツールサポート

- ✅ TypeScript型定義の自動生成
- ✅ IDE統合（Xcode、Android Studio）
- ✅ ホットリロード対応
- ✅ デバッグツール

## Expo Modules vs React Native Turbo Modules

### Expo Modules APIの利点

| 機能 | Expo Modules | Turbo Modules |
|-----|--------------|---------------|
| ボイラープレート | 最小限 | 多い |
| 言語サポート | Swift / Kotlin | Objective-C++ / Java |
| 型安全性 | 自動 | 手動 |
| 学習曲線 | 低い | 高い |
| Web対応 | ✅ | ❌ |

### Turbo Modulesの利点

- React Nativeコアとの統合
- より細かい制御
- 長期的な安定性

## まとめ

Expo Modules APIは、以下の特徴を持つネイティブモジュール開発フレームワークです：

1. **モダンな言語**: SwiftとKotlinでネイティブコードを記述
2. **最小限のボイラープレート**: 簡潔なコードで実装可能
3. **一貫した開発体験**: プラットフォーム間で統一されたAPI
4. **自動型変換**: TypeScriptとネイティブコード間の型安全性
5. **パフォーマンス**: Turbo Modulesと同等のパフォーマンス

**主なユースケース**：
- カスタムネイティブ機能の統合
- サードパーティSDKのラップ
- プラットフォーム固有の機能追加
- システム機能へのアクセス

**推奨される開発者**：
- ネイティブモジュール開発の簡単な体験を求める開発者
- カスタムネイティブ統合が必要なプロジェクト
- 開発者に優しいネイティブコード実装を好む開発者

**重要な注意事項**：
ほとんどのExpoおよびReact Native開発者は、ネイティブコードを書く必要はありません。一般的なユースケースには多数のライブラリが既に存在します。

これらの機能を活用して、効率的にカスタムネイティブ機能を実装できます。
