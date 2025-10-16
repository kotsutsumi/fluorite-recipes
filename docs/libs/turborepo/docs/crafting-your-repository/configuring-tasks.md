# タスクの設定

Turborepoにおけるタスクの設定方法について包括的に説明します。

## タスクとは

- タスクはTurborepoが実行するスクリプトです
- ルートの`turbo.json`ファイルで定義します
- Turborepoは、`package.json`のスクリプトからタスク名に一致するものを検索します

## タスクの並列化

Turborepoは自動的にタスクを並列化して速度を最大化します：

```bash
turbo run lint build test
```

このコマンドは、`lint`、`build`、`test`タスクを同時に実行します（依存関係がない限り）。

## 基本的なタスク設定

### `turbo.json`の例

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**", "test/**"]
    },
    "lint": {
      "cache": false
    }
  }
}
```

## タスクの依存関係

`dependsOn`キーを使用してタスクの順序を指定します。

### 構文

#### `^`構文：依存関係内のタスクを先に実行

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

この設定は、パッケージをビルドする前に、その依存関係のすべての`build`タスクを実行します。

#### 同じパッケージ内のタスク依存関係

```json
{
  "tasks": {
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

`test`を実行する前に、同じパッケージの`build`を実行します。

#### 特定のパッケージへの依存関係

```json
{
  "tasks": {
    "web#build": {
      "dependsOn": ["@repo/ui#build"]
    }
  }
}
```

`@repo/web`の`build`は、`@repo/ui`の`build`に依存します。

## タスク設定オプション

### `outputs`

キャッシュするファイル/ディレクトリを指定します：

```json
{
  "tasks": {
    "build": {
      "outputs": [".next/**", "dist/**", "build/**"]
    }
  }
}
```

### `inputs`

どのファイルがタスクのハッシュに影響するかを定義します：

```json
{
  "tasks": {
    "test": {
      "inputs": ["src/**/*.ts", "test/**/*.test.ts"]
    }
  }
}
```

### `cache`

タスクのキャッシング動作を制御します：

```json
{
  "tasks": {
    "dev": {
      "cache": false
    },
    "build": {
      "cache": true
    }
  }
}
```

### `env`

タスクに影響する環境変数を指定します：

```json
{
  "tasks": {
    "build": {
      "env": ["NODE_ENV", "API_URL"]
    }
  }
}
```

### `persistent`

長時間実行タスク用の設定：

```json
{
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## 高度な設定

### ルートタスク

ルートパッケージでのみ実行されるタスク：

```json
{
  "tasks": {
    "//#format": {
      "cache": false
    }
  }
}
```

実行方法：

```bash
turbo run format
```

### 複雑な依存関係グラフのためのトランジットノード

複数の依存関係を持つタスクの最適化：

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build", "build"]
    },
    "deploy": {
      "dependsOn": ["test", "lint"]
    }
  }
}
```

## 実用例

### 典型的なWebアプリケーションの設定

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"],
      "env": ["NODE_ENV"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**", "test/**"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "inputs": ["src/**", "*.js", "*.ts"],
      "outputs": []
    },
    "type-check": {
      "dependsOn": ["^build"],
      "inputs": ["src/**", "*.ts", "*.tsx"],
      "outputs": []
    }
  }
}
```

## ベストプラクティス

1. **明確な依存関係を定義**：タスクの実行順序が予測可能になります
2. **outputs を適切に設定**：キャッシングの効率が向上します
3. **inputs を活用**：不要なタスクの再実行を防ぎます
4. **長時間実行タスクには`persistent`を使用**：開発サーバーなど
5. **環境変数を明示**：再現可能なビルドを保証します

## 次のステップ

タスクの設定方法を理解したら、次はタスクの実行について学びましょう。Turborepoのパワフルなフィルタリングと並列実行機能を活用できます。
