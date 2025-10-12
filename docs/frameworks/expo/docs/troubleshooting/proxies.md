# プロキシ設定

Expo開発環境でプロキシを設定し、企業ネットワークや制限されたネットワーク環境で作業する方法を学びます。

## プロキシが必要な場合

**シナリオ**:
- 企業ネットワークでの開発
- ファイアウォールの背後での作業
- HTTPSトラフィックの検査が必要
- ネットワークトラフィックのデバッグ
- iOS開発（Apple Developer Portalへのアクセス）

**症状**:
- パッケージのインストール失敗
- Expo開発サーバーへの接続不可
- EAS Buildの失敗
- GitHubからのクローン失敗
- APIリクエストのタイムアウト

## macOSでのプロキシ設定

### システムプロキシの設定

#### 方法1: システム環境設定（推奨）

1. **システム環境設定** → **ネットワーク**を開く
2. 使用しているネットワーク接続を選択（Wi-Fi、Ethernetなど）
3. **詳細...**をクリック
4. **プロキシ**タブを選択
5. 設定するプロキシタイプを選択（HTTPプロキシ、HTTPSプロキシ、SOCKSプロキシ）
6. プロキシサーバーのアドレスとポートを入力

**例**:
```
HTTPプロキシサーバー: proxy.company.com
ポート: 8080

認証が必要な場合:
ユーザー名: your-username
パスワード: your-password
```

#### 方法2: 環境変数を設定

**~/.zshrc または ~/.bashrc に追加**:
```bash
# HTTPプロキシ
export HTTP_PROXY="http://proxy.company.com:8080"
export http_proxy="http://proxy.company.com:8080"

# HTTPSプロキシ
export HTTPS_PROXY="http://proxy.company.com:8080"
export https_proxy="http://proxy.company.com:8080"

# プロキシをバイパスするホスト
export NO_PROXY="localhost,127.0.0.1,.local"
export no_proxy="localhost,127.0.0.1,.local"

# 認証が必要な場合
# export HTTP_PROXY="http://username:password@proxy.company.com:8080"
```

**変更を適用**:
```bash
source ~/.zshrc
# または
source ~/.bashrc
```

### Charles Proxyの使用（推奨）

Charles Proxyは、macOS向けの強力なローカルプロキシアプリケーションです。

#### インストール

```bash
# Homebrewでインストール
brew install --cask charles

# または、手動でダウンロード
# https://www.charlesproxy.com/
```

#### 設定

1. Charles Proxyを起動
2. **Proxy** → **Proxy Settings**
3. **Port**: 8888（デフォルト）
4. **Enable transparent HTTP proxying**をチェック

#### macOSシステムプロキシとして設定

1. **Proxy** → **macOS Proxy**を選択
2. システム環境設定で自動的にプロキシが設定される

#### 外部プロキシサーバーの設定

**会社のプロキシサーバーを経由する場合**:

1. **Proxy** → **External Proxy Settings**
2. **Use external proxy servers**をチェック
3. **Web Proxy (HTTP)**の設定:
   ```
   Host: proxy.company.com
   Port: 8080
   Username: your-username
   Password: your-password
   ```

#### iOS Simulatorでの証明書インストール

**HTTPSトラフィックを検査する場合**:

1. **Help** → **SSL Proxying** → **Install Charles Root Certificate in iOS Simulators**
2. シミュレーターを再起動
3. **Settings** → **General** → **About** → **Certificate Trust Settings**
4. Charles Proxy CA証明書を信頼

### npmプロキシ設定

```bash
# プロキシを設定
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# 認証が必要な場合
npm config set proxy http://username:password@proxy.company.com:8080
npm config set https-proxy http://username:password@proxy.company.com:8080

# 設定を確認
npm config get proxy
npm config get https-proxy

# プロキシ設定を削除
npm config delete proxy
npm config delete https-proxy
```

**~/.npmrc を直接編集**:
```
proxy=http://proxy.company.com:8080
https-proxy=http://proxy.company.com:8080
strict-ssl=false  # 自己署名証明書の場合
```

### Yarnプロキシ設定

```bash
# プロキシを設定
yarn config set proxy http://proxy.company.com:8080
yarn config set https-proxy http://proxy.company.com:8080

# 設定を確認
yarn config get proxy
yarn config get https-proxy

# プロキシ設定を削除
yarn config delete proxy
yarn config delete https-proxy
```

**~/.yarnrc を直接編集**:
```
proxy "http://proxy.company.com:8080"
https-proxy "http://proxy.company.com:8080"
```

### Gitプロキシ設定

```bash
# グローバル設定
git config --global http.proxy http://proxy.company.com:8080
git config --global https.proxy http://proxy.company.com:8080

# 特定のリポジトリのみ
git config http.proxy http://proxy.company.com:8080
git config https.proxy http://proxy.company.com:8080

# 設定を確認
git config --get http.proxy
git config --get https.proxy

# プロキシ設定を削除
git config --global --unset http.proxy
git config --global --unset https.proxy
```

**~/.gitconfig を直接編集**:
```
[http]
    proxy = http://proxy.company.com:8080
[https]
    proxy = http://proxy.company.com:8080
```

## Windowsでのプロキシ設定

### システムプロキシの設定

#### 方法1: Windows設定

1. **設定** → **ネットワークとインターネット** → **プロキシ**を開く
2. **手動プロキシセットアップ**セクション
3. **プロキシサーバーを使う**をオンにする
4. アドレスとポートを入力:
   ```
   プロキシサーバーのアドレス: proxy.company.com
   ポート: 8080
   ```
5. **保存**をクリック

#### 方法2: 環境変数を設定

**PowerShellで一時的に設定**:
```powershell
$env:HTTP_PROXY = "http://proxy.company.com:8080"
$env:HTTPS_PROXY = "http://proxy.company.com:8080"
$env:NO_PROXY = "localhost,127.0.0.1,.local"
```

**システム環境変数として永続的に設定**:

1. **システムのプロパティ** → **環境変数**を開く
2. **システム環境変数**セクションで**新規**をクリック
3. 以下の変数を追加:
   ```
   変数名: HTTP_PROXY
   変数値: http://proxy.company.com:8080

   変数名: HTTPS_PROXY
   変数値: http://proxy.company.com:8080

   変数名: NO_PROXY
   変数値: localhost,127.0.0.1,.local
   ```

### Fiddlerの使用

Fiddlerは、Windows向けの無料プロキシデバッグツールです。

#### インストール

```bash
# Chocolateyでインストール
choco install fiddler

# または、手動でダウンロード
# https://www.telerik.com/fiddler
```

#### 設定

1. Fiddlerを起動
2. **Tools** → **Options** → **Connections**
3. **Port**: 8888（デフォルト）
4. **Allow remote computers to connect**をチェック

### npmプロキシ設定

```bash
# プロキシを設定
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# 自己署名証明書の場合
npm config set strict-ssl false

# 設定を確認
npm config list
```

### Yarnプロキシ設定

```bash
# プロキシを設定
yarn config set proxy http://proxy.company.com:8080
yarn config set https-proxy http://proxy.company.com:8080

# 設定を確認
yarn config list
```

### Gitプロキシ設定

```bash
# グローバル設定
git config --global http.proxy http://proxy.company.com:8080
git config --global https.proxy http://proxy.company.com:8080

# 設定を確認
git config --list
```

## Linuxでのプロキシ設定

### システムプロキシの設定

#### 環境変数を設定

**~/.bashrc または ~/.zshrc に追加**:
```bash
# HTTPプロキシ
export HTTP_PROXY="http://proxy.company.com:8080"
export http_proxy="http://proxy.company.com:8080"

# HTTPSプロキシ
export HTTPS_PROXY="http://proxy.company.com:8080"
export https_proxy="http://proxy.company.com:8080"

# FTPプロキシ
export FTP_PROXY="http://proxy.company.com:8080"
export ftp_proxy="http://proxy.company.com:8080"

# プロキシをバイパス
export NO_PROXY="localhost,127.0.0.1,.local"
export no_proxy="localhost,127.0.0.1,.local"
```

**変更を適用**:
```bash
source ~/.bashrc
# または
source ~/.zshrc
```

### GNOME（Ubuntu）での設定

1. **Settings** → **Network** → **Network Proxy**
2. **Manual**を選択
3. プロキシサーバーとポートを入力
4. **Apply system wide**をクリック

### npmプロキシ設定

```bash
# プロキシを設定
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# 設定を確認
npm config get proxy
```

### Gitプロキシ設定

```bash
# グローバル設定
git config --global http.proxy http://proxy.company.com:8080
git config --global https.proxy http://proxy.company.com:8080
```

## Expo固有のプロキシ設定

### EAS CLIプロキシ設定

```bash
# 環境変数を設定
export HTTPS_PROXY=http://proxy.company.com:8080

# EASコマンドを実行
eas build --platform ios
```

### Metro Bundlerプロキシ設定

**metro.config.js**:
```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// プロキシ設定を追加
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // プロキシ設定をここに追加
      next();
    };
  },
};

module.exports = config;
```

## プロキシのテスト

### 接続テスト

```bash
# curlでテスト
curl -x http://proxy.company.com:8080 https://www.google.com

# npmでテスト
npm --proxy http://proxy.company.com:8080 search expo

# Gitでテスト
git -c http.proxy=http://proxy.company.com:8080 clone https://github.com/expo/expo.git
```

### プロキシ接続の確認

```bash
# 環境変数を確認
echo $HTTP_PROXY
echo $HTTPS_PROXY

# npmプロキシ設定を確認
npm config get proxy
npm config get https-proxy

# Gitプロキシ設定を確認
git config --get http.proxy
git config --get https.proxy
```

## 一般的な問題と解決策

### 問題1: SSL証明書エラー

**エラーメッセージ**:
```
Error: unable to verify the first certificate
```

**解決策**:
```bash
# npmで厳密なSSLを無効化
npm config set strict-ssl false

# Gitで証明書検証を無効化（セキュリティリスクあり）
git config --global http.sslVerify false

# 証明書をインストール（推奨）
# Charles ProxyまたはFiddlerのルート証明書をインストール
```

### 問題2: 認証が必要なプロキシ

**解決策**:
```bash
# ユーザー名とパスワードを含める
export HTTP_PROXY="http://username:password@proxy.company.com:8080"
export HTTPS_PROXY="http://username:password@proxy.company.com:8080"

# 特殊文字をURLエンコード
# パスワードに特殊文字（@, #, など）が含まれる場合
# @ → %40, # → %23
export HTTP_PROXY="http://user%40domain:p%40ssw0rd@proxy.company.com:8080"
```

### 問題3: プロキシのバイパスが必要

**解決策**:
```bash
# NO_PROXY環境変数を設定
export NO_PROXY="localhost,127.0.0.1,.local,.internal"

# npmで特定のドメインをバイパス
npm config set noproxy "localhost,127.0.0.1"
```

### 問題4: 自動プロキシ設定スクリプト（PAC）

**解決策**:
```bash
# PAC URLを取得
# システム環境設定 → ネットワーク → 詳細 → プロキシ

# PACファイルからプロキシサーバーを抽出
curl http://proxy-pac.company.com/proxy.pac
```

## ベストプラクティス

### 1. 環境別のプロキシ設定

**~/.zshrc**:
```bash
# 会社ネットワーク
alias proxy-on='export HTTP_PROXY=http://proxy.company.com:8080 && export HTTPS_PROXY=http://proxy.company.com:8080'

# 自宅ネットワーク
alias proxy-off='unset HTTP_PROXY && unset HTTPS_PROXY'

# 現在のプロキシ設定を確認
alias proxy-status='echo "HTTP_PROXY: $HTTP_PROXY" && echo "HTTPS_PROXY: $HTTPS_PROXY"'
```

### 2. プロキシ設定の自動化

**~/.zshrc**:
```bash
# ネットワークロケーションに基づいて自動設定
if [ "$(networksetup -getcurrentlocation)" = "Work" ]; then
    export HTTP_PROXY="http://proxy.company.com:8080"
    export HTTPS_PROXY="http://proxy.company.com:8080"
fi
```

### 3. プロキシログの確認

**Charles Proxyでログを確認**:
1. Charles Proxyを起動
2. **Sequence**ビューでリクエストを確認
3. 失敗したリクエストを特定

### 4. セキュアな認証情報の管理

```bash
# 認証情報を.netrcファイルに保存
# ~/.netrc
machine proxy.company.com
login username
password password

# ファイルの権限を制限
chmod 600 ~/.netrc
```

## まとめ

プロキシ設定は、以下の方法で構成できます：

### 主要なプロキシ設定方法
- **システムレベル**: OS設定、環境変数
- **ツール固有**: npm、Yarn、Git
- **アプリケーション**: Charles Proxy（macOS）、Fiddler（Windows）

### 設定が必要な場所
- システム環境変数（HTTP_PROXY、HTTPS_PROXY、NO_PROXY）
- npm/Yarn設定（~/.npmrc、~/.yarnrc）
- Git設定（~/.gitconfig）
- EAS CLI（環境変数）

### 一般的な問題の解決
- **SSL証明書エラー**: 証明書をインストール、または strict-ssl を無効化
- **認証プロキシ**: ユーザー名とパスワードをURLに含める
- **プロキシバイパス**: NO_PROXY環境変数を設定
- **PAC**: 自動プロキシ設定スクリプトからプロキシを抽出

### ベストプラクティス
- 環境別のプロキシ設定エイリアスを作成
- ネットワークロケーションに基づいて自動設定
- プロキシログを確認してデバッグ
- 認証情報を安全に管理（.netrc、環境変数）

これらの設定とツールを活用して、企業ネットワークや制限されたネットワーク環境でExpo開発を効率的に行うことができます。
