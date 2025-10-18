# ファイルglob仕様

"ファイルglobは、Turborepo全体でさまざまなコンテキストでファイルを含めるまたは除外するために使用され、`turbo`に使用してほしいファイルを具体的に定義できます。"

## glob パターン

| パターン | 説明 |
|---------|-------------|
| `*` | ディレクトリ内のすべてのファイルにマッチ |
| `**` | すべてのファイルとサブディレクトリに再帰的にマッチ |
| `some-dir/` | `some-dir`ディレクトリとその内容にマッチ |
| `some-dir` | `some-dir`という名前のファイル、または`some-dir`ディレクトリとその内容にマッチ |
| `some-dir*` | `some-dir`で始まるファイルとディレクトリにマッチ、ディレクトリの場合は内容も含む |
| `*.js` | ディレクトリ内のすべての`.js`ファイルにマッチ |
| `!` | glob全体を否定（定義されたglobの末尾に自動的に`/**`を適用） |

## 例

| パターン | 説明 |
|---------|-------------|
| `dist/**` | `dist`ディレクトリ内のすべてのファイル、その内容、およびすべてのサブディレクトリにマッチ |
| `dist/` | `dist`ディレクトリとその内容にマッチ |
| `dist` | `dist`という名前のファイル、または`dist`ディレクトリ、その内容、およびすべてのサブディレクトリにマッチ |
| `dist/some-dir/**` | 現在のディレクトリ内の`dist/some-dir`ディレクトリとすべてのサブディレクトリ内のすべてのファイルにマッチ |
| `!dist` | `dist`ディレクトリとそのすべての内容を無視 |
| `dist*` | `dist`で始まるファイルとディレクトリにマッチ |
| `dist/*.js` | `dist`ディレクトリ内のすべての`.js`ファイルにマッチ |
| `!dist/*.js` | `dist`ディレクトリ内のすべての`.js`ファイルを無視 |
| `dist/**/*.js` | `dist`ディレクトリとそのサブディレクトリ内のすべての`.js`ファイルに再帰的にマッチ |
| `../scripts/**` | 1つ上のディレクトリの`scripts`ディレクトリ内のすべてのファイルとサブディレクトリにマッチ |

## 使用例

### `turbo.json`での使用

#### タスクの出力

```jsonc
{
  "tasks": {
    "build": {
      "outputs": ["dist/**", "build/**", "!dist/cache/**"]
    }
  }
}
```

この例では:
- `dist/**`: `dist`ディレクトリ内のすべてをキャッシュ
- `build/**`: `build`ディレクトリ内のすべてをキャッシュ
- `!dist/cache/**`: `dist/cache`ディレクトリを除外

#### タスクの入力

```jsonc
{
  "tasks": {
    "build": {
      "inputs": ["src/**/*.ts", "src/**/*.tsx", "!src/**/*.test.ts"]
    }
  }
}
```

この例では:
- `src/**/*.ts`: すべてのTypeScriptファイルを含む
- `src/**/*.tsx`: すべてのTypeScript JSXファイルを含む
- `!src/**/*.test.ts`: テストファイルを除外

#### グローバル依存関係

```jsonc
{
  "globalDependencies": [
    ".env",
    ".env.local",
    "tsconfig.json",
    "package.json"
  ]
}
```

### 複雑なパターン

#### 複数の除外

```jsonc
{
  "tasks": {
    "build": {
      "outputs": [
        "dist/**",
        "!dist/temp/**",
        "!dist/**/*.map",
        "!dist/cache/**"
      ]
    }
  }
}
```

#### 特定のファイルタイプ

```jsonc
{
  "tasks": {
    "lint": {
      "inputs": [
        "src/**/*.{ts,tsx,js,jsx}",
        "!src/**/*.test.{ts,tsx,js,jsx}",
        "!src/**/__tests__/**"
      ]
    }
  }
}
```

#### ネストされたディレクトリ

```jsonc
{
  "tasks": {
    "test": {
      "inputs": [
        "src/**/*.test.ts",
        "tests/**/*.ts",
        "__tests__/**/*.ts"
      ]
    }
  }
}
```

## glob パターンのベストプラクティス

### 1. 具体的に記述する

曖昧すぎるパターンは避け、必要なファイルを正確にマッチさせます:

```jsonc
// 良い例
{
  "outputs": ["dist/**/*.js", "dist/**/*.css"]
}

// 避けるべき例
{
  "outputs": ["**"]  // すべてにマッチしすぎる
}
```

### 2. 除外パターンを使用する

不要なファイルを明示的に除外します:

```jsonc
{
  "inputs": [
    "src/**",
    "!src/**/*.test.ts",
    "!src/**/__mocks__/**"
  ]
}
```

### 3. 一貫性を保つ

プロジェクト全体で一貫したパターンを使用します:

```jsonc
{
  "globalDependencies": [
    "*.config.js",
    "*.config.ts",
    ".env*"
  ]
}
```

### 4. パフォーマンスを考慮する

過度に広範なパターンはパフォーマンスに影響する可能性があります:

```jsonc
// 良い例: 具体的
{
  "inputs": ["src/**/*.ts"]
}

// 避けるべき例: 広範すぎる
{
  "inputs": ["**/*"]
}
```

### 5. 文書化する

複雑なパターンにはコメントを追加します:

```jsonc
{
  "tasks": {
    "build": {
      // すべてのTypeScriptファイルを含むが、テストとストーリーは除外
      "inputs": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "!src/**/*.test.{ts,tsx}",
        "!src/**/*.stories.{ts,tsx}"
      ]
    }
  }
}
```

## よくある使用例

### Next.jsアプリケーション

```jsonc
{
  "tasks": {
    "build": {
      "outputs": [
        ".next/**",
        "!.next/cache/**"
      ],
      "inputs": [
        "src/**",
        "public/**",
        "next.config.js",
        "!src/**/*.test.ts"
      ]
    }
  }
}
```

### TypeScriptライブラリ

```jsonc
{
  "tasks": {
    "build": {
      "outputs": [
        "dist/**",
        "types/**"
      ],
      "inputs": [
        "src/**/*.ts",
        "tsconfig.json",
        "!src/**/*.test.ts"
      ]
    }
  }
}
```

### モノレポパッケージ

```jsonc
{
  "globalDependencies": [
    "package.json",
    "tsconfig.json",
    ".eslintrc.js",
    ".prettierrc"
  ],
  "tasks": {
    "build": {
      "outputs": ["dist/**"],
      "inputs": [
        "src/**",
        "!src/**/*.test.ts",
        "!src/**/__tests__/**"
      ]
    }
  }
}
```

## トラブルシューティング

### パターンが期待どおりに機能しない場合

1. **`--dry-run`を使用**: どのファイルがマッチしているかを確認

```bash
turbo run build --dry-run
```

2. **パターンをテスト**: 単純なパターンから始めて、徐々に複雑にする

3. **除外を確認**: 除外パターン（`!`）が正しく配置されているか確認

4. **パスを確認**: 相対パスがパッケージルートからの相対パスであることを確認

## まとめ

glob パターンは、Turborepoでファイルを効率的に管理するための強力なツールです。具体的で一貫性のあるパターンを使用し、不要なファイルを明示的に除外することで、ビルドとキャッシングのパフォーマンスを最適化できます。
