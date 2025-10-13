# ローカルHTTPS開発の使用

ローカルHTTPS開発は、より安全で本番環境に近い開発環境を提供します。

## 前提条件

### mkcertのインストール

`mkcert`ツールが必要です。GitHubリポジトリからインストールできます：

```bash
# macOSの場合
brew install mkcert
brew install nss # Firefoxサポート用

# Linuxの場合
# https://github.com/FiloSottile/mkcert#linux からインストール手順を確認

# Windowsの場合
# https://github.com/FiloSottile/mkcert#windows からインストール手順を確認
```

## メリット

### 1. チームのスケーラビリティ

チームメンバー全員が同じHTTPS環境で開発できます。

### 2. 認証サポート

OAuth、ソーシャルログインなど、HTTPSが必要な認証機能をローカルでテストできます。

### 3. 本番環境パリティ

本番環境により近い環境でテストできます。

### 4. 簡単な共有

HTTPSを使用することで、他のデバイスやチームメンバーと安全に共有できます。

## プロジェクトのセットアップ

### 1. Expoプロジェクトの作成または移動

#### 新しいプロジェクトを作成

```bash
npx create-expo-app@latest example-app
cd example-app
```

#### 既存のプロジェクトに移動

```bash
cd your-expo-project
```

### 2. Expo開発サーバーの起動

```bash
npx expo start --web
```

これによりExpo開発サーバーがポート8081で起動します。

### 3. localhost証明書の生成

`mkcert`を使用してlocalhost証明書を生成します：

```bash
mkcert localhost
```

これにより、以下のファイルが生成されます：

- `localhost.pem`（証明書）
- `localhost-key.pem`（秘密鍵）

> **ヒント**: 初めて`mkcert`を使用する場合は、ローカル認証局をインストールしてください：

```bash
mkcert -install
```

### 4. SSLプロキシの起動

`local-ssl-proxy`を使用してSSLプロキシを起動します：

```bash
npx local-ssl-proxy --source 443 --target 8081 --cert localhost.pem --key localhost-key.pem
```

このコマンドは：

- **443ポート**（HTTPS）でリクエストを待ち受けます
- **8081ポート**（Expo開発サーバー）にプロキシします
- 生成された証明書と鍵を使用します

### 5. ブラウザで開く

ブラウザで以下にアクセスします：

```
https://localhost
```

## 高度な設定

### カスタムドメインの使用

#### hostsファイルの編集

カスタムドメイン（例：`myapp.local`）を使用する場合、hostsファイルを編集します：

```bash
# macOS/Linuxの場合
sudo nano /etc/hosts

# Windowsの場合
# C:\Windows\System32\drivers\etc\hosts を編集
```

以下を追加します：

```
127.0.0.1 myapp.local
```

#### カスタムドメインの証明書生成

```bash
mkcert myapp.local
```

#### SSLプロキシの起動（カスタムドメイン）

```bash
npx local-ssl-proxy --source 443 --hostname myapp.local --target 8081 --cert myapp.local.pem --key myapp.local-key.pem
```

#### ブラウザで開く

```
https://myapp.local
```

### 複数のポートの使用

複数のExpoプロジェクトを同時に実行する場合：

```bash
# プロジェクト1（ポート3000）
npx local-ssl-proxy --source 3443 --target 3000 --cert localhost.pem --key localhost-key.pem

# プロジェクト2（ポート4000）
npx local-ssl-proxy --source 4443 --target 4000 --cert localhost.pem --key localhost-key.pem
```

アクセス：

```
https://localhost:3443
https://localhost:4443
```

### 外部デバイスからのアクセス

#### ローカルネットワークIPの取得

```bash
# macOS/Linuxの場合
ifconfig | grep "inet "

# Windowsの場合
ipconfig
```

例：`192.168.1.100`

#### 証明書の生成

```bash
mkcert 192.168.1.100
```

#### SSLプロキシの起動

```bash
npx local-ssl-proxy --source 443 --target 8081 --cert 192.168.1.100.pem --key 192.168.1.100-key.pem
```

#### モバイルデバイスからのアクセス

モバイルデバイスで：

1. `mkcert`のルート証明書をインストール
2. `https://192.168.1.100`にアクセス

## トラブルシューティング

### ポートが使用中

別のポートを使用してください：

```bash
npx local-ssl-proxy --source 8443 --target 8081 --cert localhost.pem --key localhost-key.pem
```

アクセス：`https://localhost:8443`

### 証明書エラー

`mkcert -install`を実行してローカル認証局をインストールしてください：

```bash
mkcert -install
```

### プロキシが起動しない

`local-ssl-proxy`がインストールされているか確認してください：

```bash
npm install -g local-ssl-proxy
```

## セキュリティ考慮事項

### 証明書の管理

- **証明書をバージョン管理に含めない**: `.gitignore`に追加してください
- **証明書を共有しない**: 各開発者が自分の証明書を生成するべきです

### .gitignoreの更新

```gitignore
# mkcert証明書
*.pem
*.p12
```

## まとめ

ローカルHTTPS開発は、より安全で本番環境に近い開発環境を提供します。`mkcert`と`local-ssl-proxy`を使用することで、簡単にセットアップでき、HTTPSが必要な機能（認証、Cookie、Service Workersなど）をローカルでテストできます。
