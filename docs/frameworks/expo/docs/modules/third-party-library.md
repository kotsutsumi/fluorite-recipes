# サードパーティライブラリの統合

Expo Modulesを使用してサードパーティネイティブライブラリをラップする方法を学びます。

## 概要

サードパーティライブラリをReact Nativeで使用するために、Expo Modulesでラップします。

**目的**: ネイティブライブラリをReact Nativeコンポーネントとして公開

**例**: チャートライブラリ（MPAndroidChart、Charts）をラップ

## ステップ1: 新しいモジュールの作成

### モジュールの初期化

```bash
npx create-expo-module@latest expo-radial-chart
```

**オプション**：
- **既存プロジェクト内**: `--local` フラグを使用
- **スタンドアロン**: デフォルト（サンプルアプリ付き）

### プロジェクト構造

```
expo-radial-chart/
├── android/                    # Android実装
│   ├── build.gradle
│   └── src/
│       └── main/
│           └── java/
│               └── expo/
│                   └── modules/
│                       └── radialchart/
│                           ├── ExpoRadialChartView.kt
│                           └── ExpoRadialChartModule.kt
├── ios/                        # iOS実装
│   ├── ExpoRadialChart.podspec
│   └── ExpoRadialChartView.swift
├── src/                        # TypeScript API
│   ├── index.ts
│   └── ExpoRadialChartView.tsx
└── example/                    # サンプルアプリ
```

## ステップ2: ネイティブ依存関係の追加

### Android（build.gradle）

```gradle
// android/build.gradle
dependencies {
  implementation project(':expo-modules-core')

  // MPAndroidChart ライブラリ
  implementation 'com.github.PhilJay:MPAndroidChart:v3.1.0'
}
```

**repositories セクション**：
```gradle
allprojects {
  repositories {
    google()
    mavenCentral()
    maven { url 'https://jitpack.io' }
  }
}
```

### iOS（.podspec）

```ruby
# ios/ExpoRadialChart.podspec
Pod::Spec.new do |s|
  s.name           = 'ExpoRadialChart'
  s.version        = '1.0.0'
  s.summary        = 'Radial chart module for Expo'
  s.description    = 'A radial chart module wrapping Charts library'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = { :ios => '13.4', :tvos => '13.4' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  # Charts ライブラリ
  s.dependency 'Charts', '~> 5.1.0'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
```

## ステップ3: TypeScript型定義

### データ型の定義

```typescript
// src/ExpoRadialChart.types.ts
import { ViewStyle } from 'react-native';

export type Series = {
  color: string;
  percentage: number;
  label?: string;
};

export type ExpoRadialChartViewProps = {
  style?: ViewStyle;
  data: Series[];
  centerText?: string;
  holeRadius?: number;
  transparentCircleRadius?: number;
  animationDuration?: number;
};
```

### TypeScriptコンポーネント

```typescript
// src/ExpoRadialChartView.tsx
import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';
import { ExpoRadialChartViewProps } from './ExpoRadialChart.types';

const NativeView: React.ComponentType<ExpoRadialChartViewProps> =
  requireNativeViewManager('ExpoRadialChart');

export default function ExpoRadialChartView(props: ExpoRadialChartViewProps) {
  return <NativeView {...props} />;
}
```

### エクスポート

```typescript
// src/index.ts
export { default as ExpoRadialChartView } from './ExpoRadialChartView';
export type { ExpoRadialChartViewProps, Series } from './ExpoRadialChart.types';
```

## ステップ4: Android実装

### ビューコンポーネント

```kotlin
// android/src/main/java/expo/modules/radialchart/ExpoRadialChartView.kt
package expo.modules.radialchart

import android.content.Context
import android.graphics.Color
import com.github.mikephil.charting.charts.PieChart
import com.github.mikephil.charting.data.PieData
import com.github.mikephil.charting.data.PieDataSet
import com.github.mikephil.charting.data.PieEntry
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class ExpoRadialChartView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private val pieChart = PieChart(context).apply {
    setUsePercentValues(true)
    description.isEnabled = false
    isDrawHoleEnabled = true
    setHoleColor(Color.WHITE)
    setTransparentCircleColor(Color.WHITE)
    setTransparentCircleAlpha(110)
    holeRadius = 58f
    transparentCircleRadius = 61f
    setDrawCenterText(true)
    rotationAngle = 0f
    isRotationEnabled = true
    isHighlightPerTapEnabled = true

    legend.isEnabled = false
  }

  init {
    addView(pieChart)
  }

  fun setData(seriesData: List<Map<String, Any>>) {
    val entries = seriesData.map { series ->
      val percentage = (series["percentage"] as? Double) ?: 0.0
      val label = series["label"] as? String ?: ""
      PieEntry(percentage.toFloat(), label)
    }

    val dataSet = PieDataSet(entries, "").apply {
      sliceSpace = 3f
      selectionShift = 5f

      colors = seriesData.map { series ->
        val colorString = series["color"] as? String ?: "#000000"
        Color.parseColor(colorString)
      }
    }

    val data = PieData(dataSet).apply {
      setValueTextSize(11f)
      setValueTextColor(Color.WHITE)
    }

    pieChart.data = data
    pieChart.invalidate()
  }

  fun setCenterText(text: String) {
    pieChart.centerText = text
  }

  fun setHoleRadius(radius: Float) {
    pieChart.holeRadius = radius
  }

  fun setTransparentCircleRadius(radius: Float) {
    pieChart.transparentCircleRadius = radius
  }

  fun setAnimationDuration(duration: Int) {
    pieChart.animateY(duration)
  }

  override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
    super.onLayout(changed, l, t, r, b)
    pieChart.layout(0, 0, r - l, b - t)
  }
}
```

### モジュール定義

```kotlin
// android/src/main/java/expo/modules/radialchart/ExpoRadialChartModule.kt
package expo.modules.radialchart

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoRadialChartModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoRadialChart")

    View(ExpoRadialChartView::class) {
      Prop("data") { view: ExpoRadialChartView, data: List<Map<String, Any>> ->
        view.setData(data)
      }

      Prop("centerText") { view: ExpoRadialChartView, text: String ->
        view.setCenterText(text)
      }

      Prop("holeRadius") { view: ExpoRadialChartView, radius: Double ->
        view.setHoleRadius(radius.toFloat())
      }

      Prop("transparentCircleRadius") { view: ExpoRadialChartView, radius: Double ->
        view.setTransparentCircleRadius(radius.toFloat())
      }

      Prop("animationDuration") { view: ExpoRadialChartView, duration: Int ->
        view.setAnimationDuration(duration)
      }
    }
  }
}
```

## ステップ5: iOS実装

### ビューコンポーネント

```swift
// ios/ExpoRadialChartView.swift
import ExpoModulesCore
import Charts

class ExpoRadialChartView: ExpoView {
  private let pieChartView = PieChartView()

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)

    pieChartView.usePercentValuesEnabled = true
    pieChartView.drawSlicesUnderHoleEnabled = false
    pieChartView.holeRadiusPercent = 0.58
    pieChartView.transparentCircleRadiusPercent = 0.61
    pieChartView.chartDescription.enabled = false
    pieChartView.setExtraOffsets(left: 5, top: 10, right: 5, bottom: 5)
    pieChartView.drawCenterTextEnabled = true
    pieChartView.rotationAngle = 0
    pieChartView.isRotationEnabled = true
    pieChartView.highlightPerTapEnabled = true

    pieChartView.legend.enabled = false

    addSubview(pieChartView)
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    pieChartView.frame = bounds
  }

  func setData(_ seriesData: [[String: Any]]) {
    var entries: [PieChartDataEntry] = []

    for series in seriesData {
      guard let percentage = series["percentage"] as? Double else { continue }
      let label = series["label"] as? String ?? ""
      let entry = PieChartDataEntry(value: percentage, label: label)
      entries.append(entry)
    }

    let dataSet = PieChartDataSet(entries: entries, label: "")
    dataSet.sliceSpace = 3
    dataSet.selectionShift = 5

    var colors: [NSUIColor] = []
    for series in seriesData {
      if let colorString = series["color"] as? String {
        let color = UIColor(hexString: colorString)
        colors.append(color)
      }
    }
    dataSet.colors = colors

    let data = PieChartData(dataSet: dataSet)
    data.setValueTextColor(.white)
    data.setValueFont(.systemFont(ofSize: 11))

    pieChartView.data = data
  }

  func setCenterText(_ text: String) {
    pieChartView.centerText = text
  }

  func setHoleRadius(_ radius: Double) {
    pieChartView.holeRadiusPercent = radius / 100.0
  }

  func setTransparentCircleRadius(_ radius: Double) {
    pieChartView.transparentCircleRadiusPercent = radius / 100.0
  }

  func setAnimationDuration(_ duration: Int) {
    pieChartView.animate(yAxisDuration: TimeInterval(duration) / 1000.0)
  }
}

// UIColor extension for hex strings
extension UIColor {
  convenience init(hexString: String) {
    let hex = hexString.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
    var int = UInt64()
    Scanner(string: hex).scanHexInt64(&int)
    let a, r, g, b: UInt64
    switch hex.count {
    case 3: // RGB (12-bit)
      (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
    case 6: // RGB (24-bit)
      (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
    case 8: // ARGB (32-bit)
      (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
    default:
      (a, r, g, b) = (255, 0, 0, 0)
    }
    self.init(red: CGFloat(r) / 255, green: CGFloat(g) / 255, blue: CGFloat(b) / 255, alpha: CGFloat(a) / 255)
  }
}
```

### モジュール定義

```swift
// ios/ExpoRadialChartModule.swift
import ExpoModulesCore

public class ExpoRadialChartModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoRadialChart")

    View(ExpoRadialChartView.self) {
      Prop("data") { (view: ExpoRadialChartView, data: [[String: Any]]) in
        view.setData(data)
      }

      Prop("centerText") { (view: ExpoRadialChartView, text: String) in
        view.setCenterText(text)
      }

      Prop("holeRadius") { (view: ExpoRadialChartView, radius: Double) in
        view.setHoleRadius(radius)
      }

      Prop("transparentCircleRadius") { (view: ExpoRadialChartView, radius: Double) in
        view.setTransparentCircleRadius(radius)
      }

      Prop("animationDuration") { (view: ExpoRadialChartView, duration: Int) in
        view.setAnimationDuration(duration)
      }
    }
  }
}
```

## ステップ6: サンプルアプリの作成

### データの準備

```typescript
// example/App.tsx
import { StyleSheet, View } from 'react-native';
import { ExpoRadialChartView, Series } from 'expo-radial-chart';

const sampleData: Series[] = [
  { color: '#FF6384', percentage: 30, label: 'Red' },
  { color: '#36A2EB', percentage: 25, label: 'Blue' },
  { color: '#FFCE56', percentage: 20, label: 'Yellow' },
  { color: '#4BC0C0', percentage: 15, label: 'Green' },
  { color: '#9966FF', percentage: 10, label: 'Purple' },
];

export default function App() {
  return (
    <View style={styles.container}>
      <ExpoRadialChartView
        style={styles.chart}
        data={sampleData}
        centerText="Total: 100%"
        holeRadius={58}
        transparentCircleRadius={61}
        animationDuration={1000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  chart: {
    width: 300,
    height: 300,
  },
});
```

### サンプルアプリの実行

```bash
cd expo-radial-chart
npx expo start
```

## ベストプラクティス

### 1. 一貫したAPI

プラットフォーム間で一貫したAPIを提供します。

```typescript
// ✅ 推奨: 両プラットフォームで同じAPI
<ExpoRadialChartView data={sampleData} />

// ❌ 非推奨: プラットフォーム固有のAPI
{Platform.OS === 'ios' ? <IOSChart /> : <AndroidChart />}
```

### 2. プロップスのバリデーション

```kotlin
Prop("data") { view: ExpoRadialChartView, data: List<Map<String, Any>> ->
  if (data.isEmpty()) {
    throw IllegalArgumentException("Data cannot be empty")
  }
  view.setData(data)
}
```

### 3. エラーハンドリング

```swift
Prop("data") { (view: ExpoRadialChartView, data: [[String: Any]]) in
  guard !data.isEmpty else {
    throw Exception(name: "InvalidData", description: "Data cannot be empty")
  }
  view.setData(data)
}
```

### 4. ドキュメントの充実

```typescript
/**
 * Radial chart component for displaying data in a pie chart format.
 *
 * @param data - Array of series data with color and percentage
 * @param centerText - Text to display in the center of the chart
 * @param holeRadius - Radius of the hole in the center (0-100)
 * @param transparentCircleRadius - Radius of the transparent circle (0-100)
 * @param animationDuration - Duration of the animation in milliseconds
 *
 * @example
 * ```tsx
 * <ExpoRadialChartView
 *   data={[
 *     { color: '#FF6384', percentage: 30, label: 'Red' },
 *     { color: '#36A2EB', percentage: 70, label: 'Blue' },
 *   ]}
 *   centerText="Total: 100%"
 *   animationDuration={1000}
 * />
 * ```
 */
```

## まとめ

サードパーティライブラリをExpo Modulesでラップするには、以下のステップを実行します：

1. **新しいモジュールの作成**: `npx create-expo-module`
2. **ネイティブ依存関係の追加**: build.gradleと.podspec
3. **TypeScript型定義の作成**: propsとデータ構造
4. **プラットフォーム固有のコードの実装**: KotlinとSwift
5. **サンプルアプリの作成**: 使用例とテスト

**主な機能**：
- クロスプラットフォーム対応
- 一貫したReact Native API
- プラットフォーム固有のニュアンスの処理

**サポートされる依存関係タイプ**：
- **Android**: AAR、JAR、Mavenパッケージ
- **iOS**: Framework、CocoaPods

これらのパターンを活用して、任意のネイティブライブラリをExpo Modulesでラップできます。
