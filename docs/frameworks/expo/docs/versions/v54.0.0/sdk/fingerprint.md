# Fingerprint

React Nativeプロジェクトのハッシュ（フィンガープリント）を生成するためのライブラリです。ネイティブレイヤーとJavaScriptレイヤー間の互換性を判断するために使用されます。

## 概要

Expo Fingerprintは、以下の要素をハッシュ化してプロジェクトのフィンガープリントを生成します：
- アプリの依存関係
- カスタムネイティブコード
- ネイティブプロジェクトファイル
- 設定ファイル

このフィンガープリントは、EAS Updateなどの機能で、アプリのネイティブコードとJavaScriptコードの互換性を確認するために使用されます。

## インストール

```bash
npx expo install @expo/fingerprint
```

## 基本的な使用方法

### CLIでの使用

```bash
# フィンガープリントを生成
npx @expo/fingerprint

# ヘルプを表示
npx @expo/fingerprint --help
```

### プログラムでの使用

```typescript
import { createFingerprintAsync } from '@expo/fingerprint';

const fingerprint = await createFingerprintAsync('/path/to/project');
console.log('プロジェクトフィンガープリント:', fingerprint.hash);
```

## 主要なAPI

### `createFingerprintAsync(projectRoot, options?)`

プロジェクトのフィンガープリントを作成します。

```typescript
import { createFingerprintAsync } from '@expo/fingerprint';

const fingerprint = await createFingerprintAsync(process.cwd(), {
  platforms: ['android', 'ios'],
  debug: false,
});

console.log('ハッシュ:', fingerprint.hash);
console.log('ソース:', fingerprint.sources);
```

**パラメータ:**
- `projectRoot`: プロジェクトのルートディレクトリパス
- `options`: オプション設定
  - `platforms`: ターゲットプラットフォーム（`['android', 'ios']`）
  - `debug`: デバッグモードを有効化
  - `ignorePaths`: 無視するパスのパターン

**戻り値:**
```typescript
{
  hash: string;
  sources: Array<{
    type: string;
    filePath: string;
    hash: string;
  }>;
}
```

### `createProjectHashAsync(projectRoot, options?)`

プロジェクトのネイティブハッシュ値を生成します。

```typescript
import { createProjectHashAsync } from '@expo/fingerprint';

const hash = await createProjectHashAsync(process.cwd());
console.log('プロジェクトハッシュ:', hash);
```

### `diffFingerprintChangesAsync(fingerprint1, fingerprint2)`

2つのフィンガープリントを比較して変更を検出します。

```typescript
import {
  createFingerprintAsync,
  diffFingerprintChangesAsync
} from '@expo/fingerprint';

const oldFingerprint = await createFingerprintAsync('/path/to/old');
const newFingerprint = await createFingerprintAsync('/path/to/new');

const diff = await diffFingerprintChangesAsync(
  oldFingerprint,
  newFingerprint
);

console.log('変更されたファイル:', diff);
```

## 設定オプション

### .fingerprintignore

`.gitignore`と同様の形式で、フィンガープリントの計算から除外するファイルを指定できます。

```
# .fingerprintignore

# ビルド成果物を除外
build/
*.log

# 一時ファイルを除外
tmp/
*.tmp

# 環境変数ファイルを除外
.env.local
```

**パターンマッチング:**
- minimatchを使用してパターンマッチングを実行
- グロブパターンをサポート
- 行コメントは`#`で開始

### fingerprint.config.js

より高度なカスタマイズには、設定ファイルを使用できます。

```javascript
// fingerprint.config.js

module.exports = {
  // ハッシュ前にソースを変換
  sourceTransform: (source) => {
    // センシティブなデータを削除
    if (source.filePath.includes('secrets')) {
      return null; // このファイルを除外
    }
    return source;
  },

  // 追加のソースを含める
  extraSources: async (projectRoot) => {
    return [
      {
        type: 'custom',
        filePath: 'custom-config.json',
        hash: await computeCustomHash(),
      },
    ];
  },

  // プラットフォーム固有の設定
  platforms: ['android', 'ios'],

  // デバッグモード
  debug: process.env.DEBUG === 'true',
};
```

## 使用例

### EAS Updateとの統合

```typescript
import { createFingerprintAsync } from '@expo/fingerprint';

async function checkCompatibility() {
  const currentFingerprint = await createFingerprintAsync(process.cwd());

  // EAS Updateのフィンガープリントと比較
  const isCompatible = currentFingerprint.hash === easUpdateFingerprint;

  if (!isCompatible) {
    console.log('ネイティブコードの変更が検出されました');
    console.log('新しいビルドが必要です');
  } else {
    console.log('OTAアップデート可能です');
  }
}
```

### CI/CDでの使用

```typescript
import { createFingerprintAsync, diffFingerprintChangesAsync } from '@expo/fingerprint';
import { readFileSync, writeFileSync } from 'fs';

async function checkNativeChanges() {
  // 以前のフィンガープリントを読み込み
  const previousFingerprint = JSON.parse(
    readFileSync('fingerprint.json', 'utf-8')
  );

  // 現在のフィンガープリントを生成
  const currentFingerprint = await createFingerprintAsync(process.cwd());

  // 差分を確認
  const changes = await diffFingerprintChangesAsync(
    previousFingerprint,
    currentFingerprint
  );

  if (changes.length > 0) {
    console.log('ネイティブコードの変更:');
    changes.forEach(change => {
      console.log(`- ${change.filePath}: ${change.type}`);
    });

    // 新しいビルドが必要
    process.exit(1);
  }

  // フィンガープリントを保存
  writeFileSync(
    'fingerprint.json',
    JSON.stringify(currentFingerprint, null, 2)
  );
}
```

### カスタムトランスフォーム

```javascript
// fingerprint.config.js

module.exports = {
  sourceTransform: (source) => {
    // 動的な値を安定化
    if (source.filePath.endsWith('app.json')) {
      const content = JSON.parse(source.contents);

      // タイムスタンプを削除
      delete content.expo.extra.buildTimestamp;

      return {
        ...source,
        contents: JSON.stringify(content, null, 2),
      };
    }

    return source;
  },
};
```

### センシティブデータの除外

```javascript
// fingerprint.config.js

module.exports = {
  sourceTransform: (source) => {
    // APIキーやシークレットを含むファイルを除外
    const sensitivePatterns = [
      /secrets\./,
      /\.env/,
      /credentials/,
    ];

    const isSensitive = sensitivePatterns.some(pattern =>
      pattern.test(source.filePath)
    );

    if (isSensitive) {
      return null; // ファイルを除外
    }

    return source;
  },

  // または.fingerprintignoreで管理
  ignorePaths: [
    '**/.env*',
    '**/secrets.*',
    '**/credentials.*',
  ],
};
```

## 高度な使用方法

### カスタムハッシュアルゴリズム

```typescript
import { createFingerprintAsync } from '@expo/fingerprint';
import crypto from 'crypto';

async function createCustomFingerprint() {
  const fingerprint = await createFingerprintAsync(process.cwd());

  // カスタムハッシュロジックを適用
  const customHash = crypto
    .createHash('sha256')
    .update(fingerprint.hash)
    .update('custom-salt')
    .digest('hex');

  return {
    ...fingerprint,
    customHash,
  };
}
```

### マルチプラットフォームフィンガープリント

```typescript
import { createFingerprintAsync } from '@expo/fingerprint';

async function createPlatformFingerprints() {
  const platforms = ['android', 'ios'];
  const fingerprints = {};

  for (const platform of platforms) {
    fingerprints[platform] = await createFingerprintAsync(
      process.cwd(),
      { platforms: [platform] }
    );
  }

  return fingerprints;
}

const fingerprints = await createPlatformFingerprints();
console.log('Android:', fingerprints.android.hash);
console.log('iOS:', fingerprints.ios.hash);
```

## 制限事項

### Config Pluginsの制限

関数ベースのconfig pluginは、シリアライゼーションに課題があります：

```javascript
// 制限あり - 関数は完全にシリアライズできない
export default {
  plugins: [
    (config) => {
      // この関数はフィンガープリントに完全には反映されません
      return config;
    }
  ]
};

// 推奨 - 文字列ベースのplugin参照
export default {
  plugins: [
    ['expo-camera', { cameraPermission: 'カメラを使用します' }]
  ]
};
```

### 動的設定の課題

動的に生成される設定値は、フィンガープリントを不安定にする可能性があります：

```javascript
// 問題あり
export default {
  extra: {
    buildTime: new Date().toISOString(), // 毎回変わる
  }
};

// 解決策: sourceTransformで安定化
module.exports = {
  sourceTransform: (source) => {
    if (source.filePath.endsWith('app.json')) {
      const content = JSON.parse(source.contents);
      delete content.extra.buildTime;
      return {
        ...source,
        contents: JSON.stringify(content, null, 2),
      };
    }
    return source;
  },
};
```

## プラットフォーム互換性

| プラットフォーム | サポート |
|----------------|---------|
| Android        | ✅      |
| iOS            | ✅      |
| Web            | ❌      |

## ベストプラクティス

1. **バージョン管理**: フィンガープリントをバージョン管理に含める
2. **CI/CD統合**: ビルドプロセスでフィンガープリントチェックを実行
3. **センシティブデータの除外**: `.fingerprintignore`でセキュリティを確保
4. **動的値の安定化**: `sourceTransform`で一貫性を保つ
5. **定期的な検証**: フィンガープリントの変更を定期的に確認

## トラブルシューティング

### フィンガープリントが頻繁に変わる

```javascript
// 問題: 動的な値がフィンガープリントに含まれている
// 解決策: 動的な値を除外または安定化

module.exports = {
  sourceTransform: (source) => {
    // タイムスタンプなどの動的な値を削除
    // または一定の値に正規化
    return normalizeSource(source);
  },
};
```

### 特定のファイルが無視されない

```
# .fingerprintignoreで正しいパターンを使用
**/node_modules/**
**/build/**
**/*.log
```

### デバッグモード

```typescript
const fingerprint = await createFingerprintAsync(process.cwd(), {
  debug: true, // 詳細なログを出力
});
```

## 関連リソース

- [EAS Update ドキュメント](https://docs.expo.dev/eas-update/introduction/)
- [Config Plugins](https://docs.expo.dev/config-plugins/introduction/)
- [minimatch パターン](https://github.com/isaacs/minimatch)
