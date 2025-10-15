# Haptics

振動とハプティックフィードバックへのアクセスを提供するライブラリです。Android、iOS、Webプラットフォームで動作します。

## 概要

Expo Hapticsは、デバイスのハプティックエンジンを使用してユーザーに触覚フィードバックを提供します：

- **Android**: Vibratorシステムサービスを使用
- **iOS**: iOS 10以降でTaptic Engineを使用
- **Web**: Web Vibration APIを実装

## インストール

```bash
npx expo install expo-haptics
```

## 基本的な使用方法

```javascript
import * as Haptics from 'expo-haptics';
import { Button, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="軽いインパクト"
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      />
      <Button
        title="成功通知"
        onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
      />
      <Button
        title="選択フィードバック"
        onPress={() => Haptics.selectionAsync()}
      />
    </View>
  );
}
```

## API

### メソッド

#### `impactAsync(style)`

衝突や衝撃をシミュレートするハプティックフィードバックを生成します。

```javascript
import * as Haptics from 'expo-haptics';

// 軽い衝撃
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// 中程度の衝撃
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// 強い衝撃
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
```

**パラメータ:**
- `style`: `ImpactFeedbackStyle`の値

**スタイル:**
- `ImpactFeedbackStyle.Light`: 軽い衝撃
- `ImpactFeedbackStyle.Medium`: 中程度の衝撃
- `ImpactFeedbackStyle.Heavy`: 強い衝撃
- `ImpactFeedbackStyle.Rigid`: 硬い衝撃（iOS 13+）
- `ImpactFeedbackStyle.Soft`: 柔らかい衝撃（iOS 13+）

**戻り値:**
- 完了時に解決されるPromise

#### `notificationAsync(type)`

通知スタイルのハプティックフィードバックを提供します。

```javascript
import * as Haptics from 'expo-haptics';

// 成功
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// 警告
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

// エラー
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
```

**パラメータ:**
- `type`: `NotificationFeedbackType`の値

**タイプ:**
- `NotificationFeedbackType.Success`: 成功を示すフィードバック
- `NotificationFeedbackType.Warning`: 警告を示すフィードバック
- `NotificationFeedbackType.Error`: エラーを示すフィードバック

**戻り値:**
- 完了時に解決されるPromise

#### `selectionAsync()`

選択の変更を示すハプティックフィードバックを生成します。

```javascript
import * as Haptics from 'expo-haptics';

await Haptics.selectionAsync();
```

**用途:**
- ピッカーやセグメントコントロールでの選択変更
- リスト項目の選択
- トグルスイッチの切り替え

**戻り値:**
- 完了時に解決されるPromise

#### `performAndroidHapticsAsync(effectType)` (Android専用)

Android固有のハプティックエフェクトを実行します。

```javascript
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

if (Platform.OS === 'android') {
  await Haptics.performAndroidHapticsAsync(Haptics.AndroidHapticEffectType.CLICK);
}
```

**パラメータ:**
- `effectType`: `AndroidHapticEffectType`の値

**エフェクトタイプ:**
- `AndroidHapticEffectType.CLICK`: クリック効果
- `AndroidHapticEffectType.DOUBLE_CLICK`: ダブルクリック効果
- `AndroidHapticEffectType.HEAVY_CLICK`: 強いクリック効果
- `AndroidHapticEffectType.TICK`: チック効果

**戻り値:**
- 完了時に解決されるPromise

## 使用例

### ボタンのフィードバック

```javascript
import * as Haptics from 'expo-haptics';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function HapticButton({ onPress, title, feedbackStyle }) {
  const handlePress = async () => {
    await Haptics.impactAsync(feedbackStyle);
    onPress?.();
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

// 使用例
<HapticButton
  title="送信"
  feedbackStyle={Haptics.ImpactFeedbackStyle.Medium}
  onPress={() => console.log('送信')}
/>

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

### フォームバリデーション

```javascript
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { TextInput, Button, Alert, View } from 'react-native';

export default function HapticForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    if (!email.includes('@')) {
      // エラーフィードバック
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      );
      Alert.alert('エラー', '有効なメールアドレスを入力してください');
    } else {
      // 成功フィードバック
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
      Alert.alert('成功', 'フォームが送信されました');
    }
  };

  return (
    <View>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="メールアドレス"
        keyboardType="email-address"
      />
      <Button title="送信" onPress={handleSubmit} />
    </View>
  );
}
```

### スライダーのフィードバック

```javascript
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { View, Text, Slider } from 'react-native';

export default function HapticSlider() {
  const [value, setValue] = useState(50);
  const [lastHapticValue, setLastHapticValue] = useState(50);

  const handleValueChange = async (newValue) => {
    setValue(newValue);

    // 10単位で変化したらフィードバック
    if (Math.abs(newValue - lastHapticValue) >= 10) {
      await Haptics.selectionAsync();
      setLastHapticValue(newValue);
    }
  };

  return (
    <View>
      <Text>値: {Math.round(value)}</Text>
      <Slider
        value={value}
        onValueChange={handleValueChange}
        minimumValue={0}
        maximumValue={100}
      />
    </View>
  );
}
```

### スワイプアクション

```javascript
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { View, Text, PanResponder, StyleSheet } from 'react-native';

export default function SwipeAction() {
  const [deleted, setDeleted] = useState(false);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      // スワイプ距離が一定を超えたらフィードバック
      if (Math.abs(gestureState.dx) > 100) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    onPanResponderRelease: async (evt, gestureState) => {
      if (gestureState.dx < -150) {
        // 削除アクション
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
        setDeleted(true);
      }
    },
  });

  if (deleted) {
    return null;
  }

  return (
    <View {...panResponder.panHandlers} style={styles.item}>
      <Text>左にスワイプして削除</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
  },
});
```

### トグルスイッチ

```javascript
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Switch, View, Text } from 'react-native';

export default function HapticSwitch() {
  const [enabled, setEnabled] = useState(false);

  const toggleSwitch = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEnabled(previousState => !previousState);
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Switch
        value={enabled}
        onValueChange={toggleSwitch}
      />
      <Text>{enabled ? 'オン' : 'オフ'}</Text>
    </View>
  );
}
```

### ゲームコントロール

```javascript
import * as Haptics from 'expo-haptics';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

export default function GameControls() {
  const handleJump = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // ジャンプロジック
  };

  const handleShoot = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    // シュートロジック
  };

  const handleCollision = async () => {
    await Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Error
    );
    // 衝突処理
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleJump}>
        <Text>ジャンプ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleShoot}>
        <Text>シュート</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 10,
  },
});
```

### カスタムハプティックパターン

```javascript
import * as Haptics from 'expo-haptics';

async function playCustomPattern() {
  // 複数のハプティックを組み合わせる
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  await new Promise(resolve => setTimeout(resolve, 100));
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  await new Promise(resolve => setTimeout(resolve, 100));
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

// 使用例
<Button title="カスタムパターン" onPress={playCustomPattern} />
```

## プラットフォーム固有の考慮事項

### iOS

**制限事項:**
- 低電力モードではTaptic Engineが無効になります
- Taptic Engineがユーザーによって無効化されている場合があります
- シミュレーターではハプティックフィードバックは動作しません

**ベストプラクティス:**
- iOS 10以降でのみ完全にサポート
- 古いデバイスでは基本的な振動のみ

### Android

**制限事項:**
- デバイスによってハプティックエンジンの品質が異なります
- 一部のデバイスではハプティックが利用できない場合があります

**ベストプラクティス:**
- `performAndroidHapticsAsync()`でより細かい制御が可能
- バイブレーション権限は不要（システムサウンドとして扱われる）

### Web

**制限事項:**
- ブラウザとデバイスのサポートに依存
- HTTPSが必要
- ユーザーインタラクションが必要な場合があります

**ブラウザサポート:**
- Chrome/Edge: ✅
- Safari: ⚠️ 限定的
- Firefox: ✅

## プラットフォーム互換性

| プラットフォーム | サポート | エンジン |
|----------------|---------|----------|
| Android        | ✅      | Vibrator |
| iOS            | ✅      | Taptic Engine (iOS 10+) |
| Web            | ✅      | Vibration API |

## ベストプラクティス

1. **適度な使用**: 過度なハプティックはユーザー体験を損なう
2. **意味のあるフィードバック**: 重要なインタラクションにのみ使用
3. **プラットフォーム対応**: 各プラットフォームの制限を考慮
4. **設定の尊重**: ユーザーのデバイス設定を尊重
5. **テスト**: 実機で必ずテスト

## パフォーマンスの考慮事項

```javascript
// ❌ 悪い例 - 頻繁すぎるハプティック
onScroll={(event) => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}}

// ✅ 良い例 - 適切なタイミング
let lastHaptic = 0;
onScroll={(event) => {
  const now = Date.now();
  if (now - lastHaptic > 100) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    lastHaptic = now;
  }
}}
```

## アクセシビリティ

ハプティックフィードバックは、視覚や聴覚に障害のあるユーザーにとって重要なフィードバックメカニズムです：

```javascript
import * as Haptics from 'expo-haptics';

// 重要なアクションには明確なフィードバック
async function confirmDelete() {
  await Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Warning
  );
  // 削除確認ダイアログを表示
}
```

## トラブルシューティング

### ハプティックが動作しない

```javascript
// 問題: プラットフォームをチェックしていない
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

// 解決: エラーハンドリングを追加
try {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
} catch (error) {
  console.log('ハプティックフィードバックが利用できません:', error);
}
```

### iOSでハプティックが弱い

```javascript
// 問題: 適切なスタイルを使用していない
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

// 解決: より強いスタイルを使用
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
// または
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
```

## 関連リソース

- [iOS Human Interface Guidelines - Haptics](https://developer.apple.com/design/human-interface-guidelines/playing-haptics)
- [Android Haptic Feedback](https://developer.android.com/reference/android/view/HapticFeedbackConstants)
- [Web Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API)
