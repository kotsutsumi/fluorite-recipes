# Expo Modulesのモッキング

Expo Modulesをテストのためにモックする方法を学びます。

## 概要

ネイティブ呼び出しをモックすることで、デバイス固有のコード制限をバイパスしてテストを実行できます。

**目的**: ネイティブ機能に依存するJavaScriptコードの単体テスト

**主な利点**：
- 実際のデバイスなしでテスト可能
- 一貫したモック動作
- 開発とテストがより容易

## 推奨されるテストアプローチ

### Jestとjest-expoの使用

```bash
npm install --save-dev jest-expo jest
```

**package.json**:
```json
{
  "scripts": {
    "test": "jest"
  },
  "jest": {
    "preset": "jest-expo"
  }
}
```

## モックの提供

### モックファイルの作成

モジュールの`mocks`ディレクトリにモックファイルを作成します。

**ディレクトリ構造**：
```
expo-my-module/
├── android/
├── ios/
├── src/
│   └── index.ts
├── mocks/
│   └── expo-my-module.ts  ← モックファイル
├── expo-module.config.json
└── package.json
```

### モック実装の例

```typescript
// mocks/expo-my-module.ts
export async function hasStringAsync(): Promise<boolean> {
  return false;
}

export function getTheme(): string {
  return 'light';
}

export function setTheme(theme: string): void {
  console.log(`Mock: Setting theme to ${theme}`);
}

export const Constants = {
  API_URL: 'https://mock-api.example.com',
  VERSION: '1.0.0-mock',
};
```

### Jestでの使用

```typescript
// __tests__/MyModule.test.ts
import * as MyModule from 'expo-my-module';

// 自動的にmocks/expo-my-module.tsが使用されます
describe('MyModule', () => {
  it('should return false for hasStringAsync', async () => {
    const result = await MyModule.hasStringAsync();
    expect(result).toBe(false);
  });

  it('should return light theme', () => {
    const theme = MyModule.getTheme();
    expect(theme).toBe('light');
  });

  it('should log when setting theme', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    MyModule.setTheme('dark');
    expect(consoleSpy).toHaveBeenCalledWith('Mock: Setting theme to dark');
  });
});
```

## 自動モック生成

### SourceKittenのインストール

```bash
brew install sourcekitten
```

### モックの生成

```bash
npx expo-modules-test-core generate-ts-mocks
```

**生成されるファイル**: `mocks/expo-my-module.ts`

**生成されるモックの例**：
```typescript
// 自動生成されたモック
export async function fetchDataAsync(url: string): Promise<string> {
  return '';
}

export function calculateSum(a: number, b: number): number {
  return 0;
}

export class MyView {
  constructor() {}

  setBackgroundColor(color: string): void {}

  getWidth(): number {
    return 0;
  }
}
```

## 高度なモッキング

### カスタムモック動作

```typescript
// mocks/expo-my-module.ts
let mockTheme = 'light';
const listeners: Array<(theme: string) => void> = [];

export function getTheme(): string {
  return mockTheme;
}

export function setTheme(theme: string): void {
  mockTheme = theme;
  listeners.forEach(listener => listener(theme));
}

export function addThemeListener(listener: (theme: string) => void): { remove: () => void } {
  listeners.push(listener);
  return {
    remove: () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    },
  };
}

// テスト用のヘルパー関数
export function __mockReset() {
  mockTheme = 'light';
  listeners.length = 0;
}
```

### 状態を持つモック

```typescript
// mocks/expo-storage.ts
const storage = new Map<string, string>();

export async function getItemAsync(key: string): Promise<string | null> {
  return storage.get(key) || null;
}

export async function setItemAsync(key: string, value: string): Promise<void> {
  storage.set(key, value);
}

export async function deleteItemAsync(key: string): Promise<void> {
  storage.delete(key);
}

export function __mockClear() {
  storage.clear();
}
```

### Promiseを使用したモック

```typescript
// mocks/expo-network.ts
let shouldFail = false;
let mockData = { data: 'mock data' };

export async function fetchDataAsync(url: string): Promise<any> {
  if (shouldFail) {
    throw new Error('Mock network error');
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 100);
  });
}

export function __mockSetShouldFail(value: boolean) {
  shouldFail = value;
}

export function __mockSetData(data: any) {
  mockData = data;
}
```

## テストの例

### 例1: 基本的なモックテスト

```typescript
// __tests__/theme.test.ts
import * as Settings from 'expo-settings';

describe('Settings', () => {
  beforeEach(() => {
    (Settings as any).__mockReset();
  });

  it('should have default theme', () => {
    expect(Settings.getTheme()).toBe('light');
  });

  it('should update theme', () => {
    Settings.setTheme('dark');
    expect(Settings.getTheme()).toBe('dark');
  });

  it('should notify listeners', () => {
    const listener = jest.fn();
    Settings.addThemeListener(listener);

    Settings.setTheme('dark');

    expect(listener).toHaveBeenCalledWith('dark');
  });
});
```

### 例2: 非同期モックテスト

```typescript
// __tests__/storage.test.ts
import * as Storage from 'expo-storage';

describe('Storage', () => {
  beforeEach(() => {
    (Storage as any).__mockClear();
  });

  it('should store and retrieve item', async () => {
    await Storage.setItemAsync('key', 'value');
    const result = await Storage.getItemAsync('key');
    expect(result).toBe('value');
  });

  it('should return null for non-existent key', async () => {
    const result = await Storage.getItemAsync('non-existent');
    expect(result).toBeNull();
  });

  it('should delete item', async () => {
    await Storage.setItemAsync('key', 'value');
    await Storage.deleteItemAsync('key');
    const result = await Storage.getItemAsync('key');
    expect(result).toBeNull();
  });
});
```

### 例3: エラーハンドリングのテスト

```typescript
// __tests__/network.test.ts
import * as Network from 'expo-network';

describe('Network', () => {
  afterEach(() => {
    (Network as any).__mockSetShouldFail(false);
  });

  it('should fetch data successfully', async () => {
    (Network as any).__mockSetData({ message: 'success' });
    const result = await Network.fetchDataAsync('https://example.com');
    expect(result).toEqual({ message: 'success' });
  });

  it('should handle network errors', async () => {
    (Network as any).__mockSetShouldFail(true);
    await expect(Network.fetchDataAsync('https://example.com')).rejects.toThrow('Mock network error');
  });
});
```

## Jest設定

### jest.config.js

```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^expo-my-module$': '<rootDir>/mocks/expo-my-module.ts',
  },
};
```

### jest.setup.js

```javascript
// jest.setup.js
import 'react-native-gesture-handler/jestSetup';

// グローバルモックの設定
jest.mock('expo-my-module', () => require('./mocks/expo-my-module'));

// コンソール警告の抑制
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
```

## ベストプラクティス

### 1. 一貫したモックAPI

```typescript
// ✅ 推奨: 実際のAPIと同じシグネチャ
export async function fetchDataAsync(url: string): Promise<Data> {
  return mockData;
}

// ❌ 非推奨: 異なるシグネチャ
export function fetchData(url: string): Data {
  return mockData;
}
```

### 2. テスト用ヘルパー関数

```typescript
// ✅ 推奨: テスト用ヘルパー
export function __mockReset() {
  // モック状態をリセット
}

export function __mockSetData(data: any) {
  // モックデータを設定
}
```

### 3. 詳細なエラーメッセージ

```typescript
// ✅ 推奨: 詳細なエラー
if (!url) {
  throw new Error('Mock: URL is required for fetchDataAsync');
}

// ❌ 非推奨: 曖昧なエラー
if (!url) {
  throw new Error('Error');
}
```

### 4. 型安全性の維持

```typescript
// ✅ 推奨: 型定義を含める
export interface Data {
  id: string;
  name: string;
}

export async function fetchDataAsync(url: string): Promise<Data> {
  return { id: '1', name: 'mock' };
}
```

## トラブルシューティング

### 問題1: モックが適用されない

**原因**: モックファイルの配置が間違っている

**解決策**：
```
expo-my-module/
├── mocks/
│   └── expo-my-module.ts  ← 正しい場所
```

### 問題2: TypeScriptエラー

**原因**: 型定義が不足している

**解決策**：
```typescript
// mocks/expo-my-module.ts
export interface MyType {
  // 型定義
}

export function myFunction(): MyType {
  // 実装
}
```

### 問題3: Jest設定エラー

**原因**: transformIgnorePatternsが正しくない

**解決策**：
```javascript
transformIgnorePatterns: [
  'node_modules/(?!(expo-.*|@expo.*))',
],
```

## まとめ

Expo Modulesのモッキングは、以下の戦略を提供します：

### 主な戦略
- Jest と jest-expo preset の使用
- mocks ディレクトリへのモックファイル配置
- 自動モック生成（generate-ts-mocks）
- カスタムモック動作の実装

### 利点
- ネイティブ機能に依存するコードの単体テスト
- 実際のデバイスなしでテスト実行
- 一貫したモック動作
- 開発とテストの容易化

### ベストプラクティス
- 一貫したモックAPI
- テスト用ヘルパー関数の提供
- 詳細なエラーメッセージ
- 型安全性の維持

**自動生成**：
```bash
brew install sourcekitten
npx expo-modules-test-core generate-ts-mocks
```

これらのパターンを活用して、Expo Modulesの包括的なテストを実装できます。
