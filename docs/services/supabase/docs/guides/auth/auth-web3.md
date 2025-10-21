# Web3でサインイン

## 概要

Web3ウォレットを使用してSupabaseでユーザーを認証します。サポートされているウォレットには以下が含まれます：

- すべてのSolanaウォレット
- すべてのEthereumウォレット

## 仕組み

Web3でのサインインは、[EIP 4361](https://eips.ethereum.org/EIPS/eip-4361)標準を使用して、ウォレットアドレスをオフチェーンで認証します。認証プロセスには以下が含まれます：

1. Web3ウォレットに事前定義されたメッセージへの署名を要求する
2. メッセージを解析してその有効性を検証する
3. ユーザーアカウントまたはセッションを作成する

### メッセージの例

```
example.com wants you to sign in with your Ethereum account:
0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2

I accept the ExampleOrg Terms of Service: https://example.com/tos

URI: https://example.com/login
Version: 1
Chain ID: 1
Nonce: 32891756
Issued At: 2021-09-30T16:25:24Z
Resources:
- https://example.com/my-web2-claim.json
```

## Web3プロバイダーの有効化

- ダッシュボードで認証プロバイダーに移動
- Web3ウォレットプロバイダーを有効化
- `supabase/config.toml`で設定：

```toml
[auth.web3.solana]
enabled = true

[auth.web3.ethereum]
enabled = true
```

## 潜在的な悪用の軽減

Web3ウォレットアカウントにはメール/電話番号の検証がないため、自動化されたアカウント作成が可能になります。推奨される対策：

- [Web3のレート制限を設定](/dashboard/project/_/auth/rate-limits)
- [CAPTCHA保護を有効化](/docs/guides/auth/auth-captcha)

## サインイン方法

### Ethereum

2つのアプローチ：

1. グローバルスコープで`window.ethereum`を検出する
2. ウォレット検出メカニズムを使用する（EIP-6963）

### Solana

グローバルの`window.solana`を使用します。

## 実装例

### Ethereumウォレットでサインイン

```javascript
const { data, error } = await supabase.auth.signInWithEthereum({
  address: '0x...',
  chainId: 1
})
```

### Solanaウォレットでサインイン

```javascript
const { data, error } = await supabase.auth.signInWithSolana({
  address: '...',
})
```

## セキュリティに関する考慮事項

- Web3認証は分散型アイデンティティを提供しますが、従来の認証方法とは異なるセキュリティモデルがあります
- ユーザーは自分の秘密鍵を安全に管理する責任があります
- アプリケーションレベルで追加のセキュリティ対策を実装することを検討してください
