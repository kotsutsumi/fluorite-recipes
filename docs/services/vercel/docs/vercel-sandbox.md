# Vercel Sandbox

## 概要

Vercel SandboxはすべてのVercelプランで利用可能なベータ機能で、一時的なコンピューティング環境で信頼できないコードやユーザー生成コードを安全に実行するように設計されています。

## 主なユースケース

- 本番システムをリスクにさらすことなく、信頼できないコードを実行
- 動的でインタラクティブな体験を構築
- 分離環境でバックエンドロジックをテスト
- 開発サーバーを実行

## 開始方法

### 前提条件

- [Vercel CLI](https://vercel.com/docs/cli)

### Sandboxの作成

#### 環境のセットアップ

```bash
pnpm i @vercel/sandbox ms
pnpm add -D @types/ms @types/node
```

#### 認証

```bash
vercel link
vercel env pull
```

#### Sandboxスクリプトの例(next-dev.ts)

```typescript
import ms from 'ms';
import { Sandbox } from '@vercel/sandbox';
import { setTimeout } from 'timers/promises';
import { spawn } from 'child_process';

async function main() {
  const sandbox = await Sandbox.create({
    source: {
      url: 'https://github.com/vercel/sandbox-example-next.git',
      type: 'git',
    },
    resources: { vcpus: 4 },
    timeout: ms('10m'),
    ports: [3000],
    runtime: 'node22',
  });

  // 依存関係のインストールと開発サーバーの起動
  // ... (スクリプトの残り)
}

main().catch(console.error);
```

#### Sandboxの起動

```bash
node --env-file .env.local --experimental-strip-types ./next-dev.ts
```

## 認証方法

1. Vercel OIDCトークン(推奨)
2. チーム/プロジェクトIDを持つアクセストークン

## システム仕様

### ランタイム

- `node22`
- `python3.13`

### 利用可能なパッケージ

ベースシステム: Amazon Linux 2023
追加パッケージは`dnf`を使用してインストール可能

## 可観測性

Vercelダッシュボードでサンドボックスの詳細を表示:

- プロジェクトのObservabilityタブ
- Sandboxesセクション
- 使用量の追跡

## 重要な注意事項

- ベータ機能であり、予告なく変更される可能性があります
- 本番環境での使用には注意が必要
