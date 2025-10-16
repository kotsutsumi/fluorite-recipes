# turbo.jsonの設定

`turbo.json`は、Turborepoのタスク実行、キャッシング、リポジトリ全体の設定を制御する設定ファイルです。

## グローバルオプション

### `extends`

ルートの`turbo.json`から設定を継承します。

- 有効な値は`["//"]`のみです
- パッケージの`turbo.json`でのみ使用できます

```jsonc
{
  "extends": ["//"]
}
```

### `globalDependencies`

すべてのタスクのハッシュに含まれるファイルのglob パターンのリストです。

これらのファイルへの変更により、すべてのタスクがキャッシュミスします。

```jsonc
{
  "globalDependencies": [".env", "tsconfig.json"]
}
```

### `globalEnv`

すべてのタスクのハッシュに影響を与える環境変数のリストです。

これらの変数への変更により、すべてのタスクがキャッシュミスします。

```jsonc
{
  "globalEnv": ["GITHUB_TOKEN", "PACKAGE_VERSION"]
}
```

### `globalPassThroughEnv`

すべてのタスクで使用可能にする環境変数のリストです。

"Strict Environment Variable Mode"を有効にします。

```jsonc
{
  "globalPassThroughEnv": ["AWS_SECRET_KEY"]
}
```

### `ui`

ターミナルUIの選択。

- オプション: `"stream"`（デフォルト）または`"tui"`
- `stream`: タスクログをストリーミングして表示
- `tui`: インタラクティブなテキストユーザーインターフェース

```jsonc
{
  "ui": "tui"
}
```

### `noUpdateNotifier`

更新通知を無効にします。

- デフォルト: `false`

```jsonc
{
  "noUpdateNotifier": true
}
```

### `concurrency`

最大並行タスク実行数を制御します。

- 整数または百分率で指定可能
- デフォルト: `10`

```jsonc
{
  "concurrency": "10"
}
```

または

```jsonc
{
  "concurrency": "50%"
}
```

### `dangerouslyDisablePackageManagerCheck`

パッケージマネージャーの検証をバイパスします。

- デフォルト: `false`
- 使用する前に影響を理解してください

```jsonc
{
  "dangerouslyDisablePackageManagerCheck": true
}
```

### `cacheDir`

ファイルシステムキャッシュディレクトリを指定します。

- デフォルト: `".turbo/cache"`

```jsonc
{
  "cacheDir": ".turbo/cache"
}
```

### `daemon`

パフォーマンス最適化のためのバックグラウンドプロセスを有効/無効にします。

- デフォルト: `true`

```jsonc
{
  "daemon": true
}
```

### `envMode`

環境変数へのアクセスを制御します。

- オプション: `"strict"`または`"loose"`
- `strict`: 明示的に宣言された環境変数のみ使用可能
- `loose`: すべての環境変数が使用可能

```jsonc
{
  "envMode": "strict"
}
```

### `tags`

実験的機能: パッケージ境界のためのタグ付け。

```jsonc
{
  "tags": {
    "ui-library": {},
    "backend-service": {}
  }
}
```

## タスクの定義

タスクは`tasks`オブジェクトで定義され、各キーは`turbo run`で実行できるタスクを表します。

```jsonc
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "cache": false
    }
  }
}
```

## タスクオプション

### `dependsOn`

タスクの依存関係を指定します。

```jsonc
{
  "tasks": {
    "build": {
      "dependsOn": ["^build", "prebuild"]
    }
  }
}
```

- `^build`: 依存パッケージの`build`タスクを先に実行
- `prebuild`: 同じパッケージの`prebuild`タスクを先に実行

### `env`

タスクのハッシュに影響を与える環境変数を定義します。

```jsonc
{
  "tasks": {
    "build": {
      "env": ["API_URL", "API_KEY"]
    }
  }
}
```

### `passThroughEnv`

タスクのランタイムで使用可能にする特定の環境変数。

```jsonc
{
  "tasks": {
    "build": {
      "passThroughEnv": ["AWS_SECRET_KEY"]
    }
  }
}
```

### `outputs`

タスク完了後にキャッシュするファイルを指定します。

```jsonc
{
  "tasks": {
    "build": {
      "outputs": ["dist/**", "build/**", "!dist/cache/**"]
    }
  }
}
```

- glob パターンをサポート
- `!`で除外パターンを指定

### `cache`

タスク出力のキャッシングを有効/無効にします。

- デフォルト: `true`

```jsonc
{
  "tasks": {
    "dev": {
      "cache": false
    }
  }
}
```

### `inputs`

タスクの変更を判断するための入力ファイルを定義します。

```jsonc
{
  "tasks": {
    "build": {
      "inputs": ["src/**/*.ts", "package.json"]
    }
  }
}
```

### `outputLogs`

ログの詳細度を制御します。

- オプション: `"full"`, `"hash-only"`, `"new-only"`, `"errors-only"`, `"none"`

```jsonc
{
  "tasks": {
    "build": {
      "outputLogs": "new-only"
    }
  }
}
```

### `persistent`

長時間実行されるタスクをマークします。

```jsonc
{
  "tasks": {
    "dev": {
      "persistent": true,
      "cache": false
    }
  }
}
```

### `interactive`

タスクのstdinインタラクションを有効にします。

```jsonc
{
  "tasks": {
    "generate": {
      "interactive": true
    }
  }
}
```

### `interruptible`

persistentタスクの再起動を有効にします。

```jsonc
{
  "tasks": {
    "dev": {
      "persistent": true,
      "interruptible": true
    }
  }
}
```

### `with`

現在のタスクと並行して追加のタスクを実行します。

```jsonc
{
  "tasks": {
    "test": {
      "with": {
        "dev": {
          "persistent": true
        }
      }
    }
  }
}
```

## 境界設定

実験的機能: タグを使用してパッケージ間の依存関係ルールと依存元ルールを定義します。

### `tags`

パッケージの依存関係ルールを定義します。

```jsonc
{
  "boundaries": {
    "tags": {
      "ui-library": {
        "dependencies": {
          "allow": ["ui-library", "shared"],
          "ban": ["backend-service"]
        }
      }
    }
  }
}
```

### `dependencies`

許可/禁止するパッケージの依存関係を指定します。

```jsonc
{
  "boundaries": {
    "tags": {
      "backend-service": {
        "dependencies": {
          "allow": ["backend-service", "shared"],
          "ban": ["ui-library"]
        }
      }
    }
  }
}
```

### `dependents`

特定のタグをインポートできるパッケージを制御します。

```jsonc
{
  "boundaries": {
    "tags": {
      "internal-tools": {
        "dependents": {
          "ban": ["public-library"]
        }
      }
    }
  }
}
```

## リモートキャッシング

### `enabled`

リモートキャッシングを有効/無効にします。

- デフォルト: `true`

```jsonc
{
  "remoteCache": {
    "enabled": true
  }
}
```

### `signature`

アーティファクトの署名検証を有効にします。

- デフォルト: `false`

```jsonc
{
  "remoteCache": {
    "signature": true
  }
}
```

### `preflight`

キャッシュ操作前にOPTIONSリクエストを実行します。

- デフォルト: `false`

```jsonc
{
  "remoteCache": {
    "preflight": true
  }
}
```

### `timeout`

キャッシュ操作のタイムアウトを設定します。

- デフォルト: `30`（秒）

```jsonc
{
  "remoteCache": {
    "timeout": 60
  }
}
```

### `apiUrl`

リモートキャッシュエンドポイントを設定します。

```jsonc
{
  "remoteCache": {
    "apiUrl": "https://cache.example.com"
  }
}
```

### `teamId` / `teamSlug`

リモートキャッシュチームの詳細を指定します。

```jsonc
{
  "remoteCache": {
    "teamId": "team_1234567890",
    "teamSlug": "my-team"
  }
}
```
