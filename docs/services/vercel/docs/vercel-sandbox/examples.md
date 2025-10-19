# Vercel Sandboxの例

Vercel Sandboxは[すべてのプラン](/docs/plans)で[ベータ版](/docs/release-phases#beta)として利用可能です。

## プライベートリポジトリの使用

GitHubパーソナルアクセストークンまたはGitHub Appトークンで認証することにより、プライベートGitリポジトリから分離環境を作成します。

```typescript
import { Sandbox } from '@vercel/sandbox';
import ms from 'ms';

async function main() {
  const sandbox = await Sandbox.create({
    source: {
      url: 'https://github.com/vercel/some-private-repo.git',
      type: 'git',
      username: 'x-access-token',
      password: process.env.GIT_ACCESS_TOKEN!,
    },
    timeout: ms('5m'),
    ports: [3000],
  });

  const echo = await sandbox.runCommand('echo', ['Hello sandbox!']);
  console.log(`Message: ${await echo.stdout()}`);
}

main().catch(console.error);
```

### GitHubアクセストークンのオプション

#### きめ細かいパーソナルアクセストークン

きめ細かいトークンを作成する手順:

1. GitHub Settings → Developer settings → Personal access tokensに移動
2. 新しいトークンを生成
3. トークンを設定:
   - 説明的な名前を付ける
   - 有効期限を設定
   - リポジトリアクセスを選択
   - 最小限の権限を付与:
     - Contents: Read
     - Metadata: Read
4. トークンをコピー
5. 環境変数として設定

ターミナルコマンド:

```bash
export GIT_ACCESS_TOKEN=ghp_your_token_here
node --experimental-strip-types ./private-repo.ts
```

#### その他のGitHubメソッド

- クラシックパーソナルアクセストークンを作成
- GitHub Appインストールトークンを作成

## システムパッケージのインストール

`dnf`パッケージマネージャーを使用してシステムパッケージをインストール:

```typescript
const sandbox = await Sandbox.create();
await sandbox.runCommand({
  cmd: 'dnf',
  args: ['install', '-y', 'golang'],
  sudo: true,
});
```

注意: 昇格された権限で実行するには`sudo: true`を使用します。

## 実行中のSandboxのタイムアウト延長

実行中のサンドボックスのタイムアウトを延長できます:

```typescript
// 初期タイムアウト: 5分
const sandbox = await Sandbox.create({
  timeout: ms('5m'),
});

// さらに10分延長
await sandbox.extendTimeout(ms('10m'));
```
