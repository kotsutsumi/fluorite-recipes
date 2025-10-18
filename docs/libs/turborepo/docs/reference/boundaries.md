# boundaries

パッケージマネージャーのWorkspace違反をチェックすることで、Turborepoの機能が正しく動作することを保証します。

## 概要

Boundariesは、2つのタイプの違反をチェックする実験的なコマンドです:

1. パッケージのディレクトリ外のファイルをインポートすること
2. `package.json` で指定されていないパッケージをインポートすること

## タグシステム

`turbo.json` でパッケージにタグを追加できます。これにより、パッケージの依存関係とインポートを制御するルールを作成できます。

タグは「allow」と「deny」の両方の設定をサポートしています。

## 設定例

### 1. 内部パッケージのインポートを防ぐ

```json
{
  "boundaries": {
    "tags": {
      "public": {
        "dependencies": {
          "deny": ["internal"]
        }
      }
    }
  }
}
```

### 2. 公開パッケージが他の公開パッケージにのみ依存するように制限

```json
{
  "boundaries": {
    "tags": {
      "public": {
        "dependencies": {
          "allow": ["public"]
        }
      }
    }
  }
}
```

## 重要な注意事項

- これは実験的な機能です
- ルールは直接および間接的な依存関係に適用されます
- [Boundaries RFC](https://github.com/vercel/turborepo/discussions/9435) を通じてフィードバックを歓迎します
