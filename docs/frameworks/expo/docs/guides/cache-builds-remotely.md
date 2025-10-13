# ビルドキャッシュプロバイダーの使用

ビルドキャッシュは、プロジェクトフィンガープリントに基づいてビルドをリモートでキャッシュすることで、`npx expo run:[android|ios]`を高速化する機能です。一致するフィンガープリントを持つビルドが存在する場合、再コンパイルする代わりにキャッシュされたビルドをダウンロードして起動します。

## EASをビルドプロバイダーとして使用

### パッケージのインストール

```bash
npx expo install eas-build-cache-provider
```

### app.jsonの更新

```json
{
  "expo": {
    "buildCacheProvider": "eas"
  }
}
```

これで、Expo Application Services（EAS）をビルドキャッシュプロバイダーとして使用できます。

## カスタムビルドプロバイダーの作成

独自のビルドキャッシュプロバイダーを作成することもできます。カスタムビルドプロバイダーには、以下のメソッドの実装が必要です：

### 必須メソッド

#### 1. `resolveBuildCache`

既存のビルドを取得します。

```typescript
async resolveBuildCache(
  fingerprintHash: string
): Promise<string | null> {
  // キャッシュされたビルドのパスを返す
  // 見つからない場合はnull
}
```

#### 2. `uploadBuildCache`

新しいビルドバイナリをアップロードします。

```typescript
async uploadBuildCache(
  fingerprintHash: string,
  buildPath: string
): Promise<void> {
  // ビルドをリモートストレージにアップロード
}
```

#### 3. `calculateFingerprintHash`（オプション）

ハッシュアルゴリズムをカスタマイズします。

```typescript
async calculateFingerprintHash(
  fingerprint: Fingerprint
): Promise<string> {
  // カスタムハッシュ計算ロジック
}
```

### 実装手順

#### 1. tsconfig.jsonの作成

`provider/tsconfig.json`を作成します：

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "outDir": "./build",
    "rootDir": "./src"
  },
  "include": ["./src"]
}
```

#### 2. プロバイダーロジックの作成

`provider/src/index.ts`を作成します：

```typescript
import { BuildCacheProvider } from 'expo/cli';

export function createBuildCacheProvider(options: any): BuildCacheProvider {
  return {
    async resolveBuildCache(fingerprintHash: string) {
      // 実装...
      return null;
    },

    async uploadBuildCache(fingerprintHash: string, buildPath: string) {
      // 実装...
    }
  };
}
```

#### 3. エントリーポイントの作成

`provider.plugin.js`を作成します：

```javascript
const { createBuildCacheProvider } = require('./provider/build/index');

module.exports = createBuildCacheProvider;
```

#### 4. プロバイダープラグインのビルド

```bash
cd provider
npx tsc
```

#### 5. app.jsonの設定

```json
{
  "expo": {
    "buildCacheProvider": {
      "plugin": "./provider.plugin.js"
    }
  }
}
```

#### 6. プロバイダーのテスト

```bash
npx expo run:android
# または
npx expo run:ios
```

### カスタムオプションの渡し方

`app.json`でカスタムオプションを追加できます：

```json
{
  "expo": {
    "buildCacheProvider": {
      "plugin": "./provider.plugin.js",
      "options": {
        "myCustomKey": "XXX-XXX-XXX",
        "apiEndpoint": "https://api.example.com",
        "storageRegion": "us-west-2"
      }
    }
  }
}
```

プロバイダーでオプションを使用：

```typescript
export function createBuildCacheProvider(options: any): BuildCacheProvider {
  const { myCustomKey, apiEndpoint, storageRegion } = options;

  return {
    async resolveBuildCache(fingerprintHash: string) {
      // オプションを使用してビルドを取得
      const response = await fetch(
        `${apiEndpoint}/builds/${fingerprintHash}`,
        {
          headers: {
            'Authorization': `Bearer ${myCustomKey}`
          }
        }
      );
      // ...
    }
  };
}
```

## リファレンス実装

GitHub Releasesを使用したリファレンス実装が利用可能です：

[Build Cache Provider Example](https://github.com/expo/examples/tree/master/with-github-remote-build-cache-provider)

この例では、以下が実装されています：

- GitHub Releasesへのビルドのアップロード
- GitHub Releasesからのビルドのダウンロード
- フィンガープリントハッシュに基づくキャッシュの管理

## ビルドキャッシュの利点

### 1. 開発速度の向上

ビルド時間が大幅に短縮されます。

### 2. CI/CDの最適化

継続的インテグレーション/継続的デリバリーパイプラインが高速化されます。

### 3. リソースの節約

コンパイルリソースの使用が削減されます。

## まとめ

ビルドキャッシュプロバイダーは、Expo開発ワークフローを大幅に高速化する強力な機能です。EASをプロバイダーとして使用するか、カスタムプロバイダーを作成することで、ビルド時間を短縮し、開発効率を向上させることができます。
