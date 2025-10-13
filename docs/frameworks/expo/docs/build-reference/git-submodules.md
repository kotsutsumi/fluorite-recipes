# Gitサブモジュールの使用

EAS Buildを使用する場合、Gitサブモジュールを初期化するための特定の手順があります：

## サブモジュールの初期化

1. サブモジュールリポジトリにアクセスする権限を持つbase64エンコードされたプライベートSSHキーでシークレットを作成します。

2. `eas-build-pre-install` npmフックを追加して、サブモジュールをチェックアウトします。以下はスクリプトの例です：

```bash
#!/usr/bin/env bash

mkdir -p ~/.ssh

# 環境変数からプライベートキーを復元し、公開キーを生成
umask 0177
echo "$SSH_KEY_BASE64" | base64 -d > ~/.ssh/id_rsa
umask 0022
ssh-keygen -y -f ~/.ssh/id_rsa > ~/.ssh/id_rsa.pub

# gitプロバイダーを既知のホストのリストに追加
ssh-keyscan github.com >> ~/.ssh/known_hosts

git submodule update --init
```

重要なポイント：
- デフォルトでは、作業ディレクトリのコンテンツ（サブモジュールを含む）がEAS Buildにアップロードされます
- CIでビルドする場合、または`cli.requireCommit`を`true`に設定している場合は、サブモジュールを初期化する必要があります
- このスクリプトは、ビルドプロセス中にSSHアクセスを設定し、サブモジュールを初期化するのに役立ちます

## シークレットの設定

SSHキーをシークレットとして追加するには：

```bash
# SSHキーをbase64エンコード
cat ~/.ssh/id_rsa | base64

# シークレットを作成
eas secret:create --scope project --name SSH_KEY_BASE64 --value your-base64-encoded-key
```

## package.jsonの設定

```json
{
  "scripts": {
    "eas-build-pre-install": "bash scripts/eas-build-pre-install.sh"
  }
}
```

このドキュメントは、EAS Buildを使用してExpoプロジェクトでGitサブモジュールを処理するためのガイダンスを提供します。
