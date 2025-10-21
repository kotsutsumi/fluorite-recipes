# vercel promote

`vercel promote`コマンドは、既存のデプロイメントを本番環境に昇格させるために使用します。

## 使用方法

```bash
vercel promote [deployment-id or url]
```

指定したデプロイメントを本番環境に昇格させます。

## オプション

### タイムアウト

`--timeout`オプションは、プロモーションの完了を待つ時間を指定します。

- デフォルトは`3m`（3分）
- タイムアウト`0`は即時終了

例：

```bash
vercel promote https://example-app-6vd6bhoqt.vercel.app --timeout=5m
```

### Yes

`--yes`オプションで確認プロンプトをバイパスできます。

```bash
vercel promote my-deployment --yes
```

## 動作

1. 指定されたデプロイメントを選択
2. 本番環境のドメインを割り当て
3. トラフィックを新しいデプロイメントに切り替え

## 使用シナリオ

- ステージング環境でテスト済みのデプロイメントを本番環境に昇格
- プレビューデプロイメントを本番環境に昇格
- ゼロダウンタイムでの本番環境更新

## グローバルオプション

以下のグローバルオプションを使用できます：

- `--cwd`
- `--debug`
- `--help`
- など、標準的なCLIグローバルオプションに対応

## 関連コマンド

- [`vercel rollback`](/docs/cli/rollback) - 以前のデプロイメントにロールバック
- [`vercel deploy --prod`](/docs/cli/deploy) - 本番環境への直接デプロイ
