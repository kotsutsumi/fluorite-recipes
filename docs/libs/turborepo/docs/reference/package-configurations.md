# パッケージ設定

パッケージ設定により、モノレポ内の特定のパッケージに対してタスク設定をカスタマイズできます。

## 概要

"Turborepoでは、任意のパッケージ内の`turbo.json`でルート設定を拡張できます"。これにより、他のパッケージに影響を与えることなく、専門化されたタスク設定を作成できます。

## 仕組み

1. パッケージディレクトリに`turbo.json`ファイルを追加します
2. `"extends": ["//"]`を使用してルート設定を継承します
3. タスク固有の設定をオーバーライドまたは追加します

## 主な利点

- 単一のワークスペース内で多様なアプリとパッケージの設定をサポート
- パッケージオーナーが専門化されたタスクを維持できる
- タスク設定の柔軟性を提供

## 例

### フレームワーク固有の設定

複数のフレームワーク（例：Next.jsとSvelteKit）を持つモノレポの場合、パッケージ固有のビルド設定を作成できます:

```jsonc
// ルートのturbo.json
{
  "tasks": {
    "build": {
      "outputs": [".next/**", "!.next/cache/**"]
    }
  }
}
```

```jsonc
// SvelteKitアプリのturbo.json
{
  "extends": ["//"],
  "tasks": {
    "build": {
      "outputs": [".svelte-kit/**"]
    }
  }
}
```

この例では、SvelteKitアプリが独自のビルド出力パターンを持ち、ルート設定の`.next/**`パターンをオーバーライドしています。

### 専門化されたタスク

パッケージ固有のタスクと依存関係を定義できます:

```jsonc
{
  "extends": ["//"],
  "tasks": {
    "build": {
      "dependsOn": ["compile"]
    },
    "compile": {}
  }
}
```

この設定では:
- `build`タスクが`compile`タスクに依存
- `compile`タスクはこのパッケージにのみ存在

### 異なるキャッシング戦略

特定のパッケージに対してキャッシング動作をカスタマイズします:

```jsonc
{
  "extends": ["//"],
  "tasks": {
    "test": {
      "cache": false,
      "outputLogs": "full"
    }
  }
}
```

### 環境変数の設定

パッケージ固有の環境変数要件を定義します:

```jsonc
{
  "extends": ["//"],
  "tasks": {
    "build": {
      "env": ["API_ENDPOINT", "FEATURE_FLAG"],
      "passThroughEnv": ["BUILD_ID"]
    }
  }
}
```

## 制限事項

パッケージ設定を使用する際の重要な制限事項:

1. **`workspace#task`構文は使用できません**: パッケージ設定では、他のパッケージのタスクを参照できません
2. **`tasks`キーの値のみオーバーライド可能**: グローバル設定オプションは継承のみで、オーバーライドできません
3. **ルートの`turbo.json`は`extends`を使用できません**: `extends`キーはパッケージレベルの設定でのみ有効です

## 実験的機能

パッケージ設定は、パッケージ間の依存関係ルールを定義するための実験的な"Boundaries Tags"もサポートしています。

```jsonc
{
  "extends": ["//"],
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

## トラブルシューティング

設定がどのように解決され、結合されるかを確認するには、`--dry-run`フラグを使用します:

```bash
turbo run build --dry-run
```

これにより、実際にタスクを実行することなく、最終的な設定とタスクグラフが表示されます。

## ベストプラクティス

1. **ルートで共通設定を定義**: すべてのパッケージに適用される設定はルートの`turbo.json`に配置
2. **必要な場合のみオーバーライド**: パッケージ固有の`turbo.json`は、そのパッケージに固有の設定のみに使用
3. **一貫性を保つ**: 可能な限り、パッケージ間で類似したパターンを使用
4. **文書化**: パッケージ固有の設定の理由を、コメントまたはREADMEで説明

## 完全な例

以下は、さまざまなフレームワークとビルド要件を持つモノレポの完全な例です:

```jsonc
// ルートのturbo.json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "cache": true
    },
    "lint": {
      "cache": true
    }
  }
}
```

```jsonc
// apps/next-app/turbo.json
{
  "extends": ["//"],
  "tasks": {
    "build": {
      "outputs": [".next/**", "!.next/cache/**"],
      "env": ["NEXT_PUBLIC_API_URL"]
    }
  }
}
```

```jsonc
// apps/svelte-app/turbo.json
{
  "extends": ["//"],
  "tasks": {
    "build": {
      "outputs": [".svelte-kit/**"],
      "env": ["VITE_API_URL"]
    }
  }
}
```

```jsonc
// packages/ui-library/turbo.json
{
  "extends": ["//"],
  "tasks": {
    "build": {
      "outputs": ["dist/**", "types/**"]
    },
    "test": {
      "cache": false,
      "outputLogs": "full"
    }
  }
}
```

この設定により、各パッケージは独自の要件を維持しながら、ルートレベルで定義された共通の規約の恩恵を受けることができます。
