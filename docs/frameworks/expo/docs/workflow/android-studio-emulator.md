# Android Studioエミュレーターのセットアップ

AndroidアプリをExpoで開発するには、Android Studioエミュレーターをセットアップする必要があります。

## 前提条件

### 1. Watchmanのインストール

Watchmanは、ファイルシステムの変更を監視するツールです。

#### macOS

```bash
brew update
brew install watchman
```

#### Linux

[Watchmanインストールガイド](https://facebook.github.io/watchman/docs/install.html)を参照してください。

#### Windows

Watchmanはオプションです（推奨）。

### 2. Java Development Kit（JDK）バージョン17のインストール

#### macOS

```bash
brew install openjdk@17
```

環境変数を設定：

```bash
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

#### Windows

[AdoptOpenJDK](https://adoptopenjdk.net/)からJDK 17をダウンロードしてインストールします。

#### Linux

```bash
sudo apt-get install openjdk-17-jdk
```

### サポートされるプラットフォーム

- **macOS**
- **Windows**
- **Linux**

## Android Studioの設定

### 1. Android Studioのダウンロードとインストール

[Android Studio](https://developer.android.com/studio)をダウンロードしてインストールします。

### 2. Android SDKのインストール

Android Studioを開き、セットアップウィザードに従います：

1. **Android SDK Platform 35（Android 15）をインストール**

   - **SDK Manager**を開く（**Tools** → **SDK Manager**）
   - **SDK Platforms**タブを選択
   - **Android 15.0（"VanillaIceCream"）**にチェック
   - **Apply**をクリック

2. **追加のSDKツールをインストール**

   **SDK Tools**タブで以下をインストール：
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools

### 3. 環境変数の設定

#### macOS/Linux

`~/.zshrc`または`~/.bash_profile`に追加：

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

設定を適用：

```bash
source ~/.zshrc
# または
source ~/.bash_profile
```

#### Windows

1. **システム環境変数を開く**
   - **システムのプロパティ** → **環境変数**

2. **`ANDROID_HOME`を作成**
   - 変数名：`ANDROID_HOME`
   - 変数値：`C:\Users\<YourUsername>\AppData\Local\Android\Sdk`

3. **PATHに追加**
   - `%ANDROID_HOME%\emulator`
   - `%ANDROID_HOME%\platform-tools`

### 4. インストールの確認

```bash
# Android SDKが正しくインストールされているか確認
adb version
```

## エミュレーターの作成

### 1. Virtual Device Managerを開く

Android Studioで：

1. **Tools** → **Device Manager**をクリック

### 2. デバイスハードウェアを選択

1. **Create Device**をクリック
2. **Phone**カテゴリから推奨デバイスを選択（最新のPixelデバイスを推奨）
3. **Next**をクリック

### 3. OSバージョンを選択

1. 推奨されるシステムイメージを選択（例：**Android 15 "VanillaIceCream"**）
2. **Download**をクリック（まだダウンロードしていない場合）
3. **Next**をクリック

### 4. エミュレーターを作成して設定

1. エミュレーター名を設定（例：**Pixel 7 API 35**）
2. **Advanced Settings**で追加設定を行う（オプション）：
   - RAM: 2048 MB以上
   - Internal Storage: 2048 MB以上
3. **Finish**をクリック

### 5. エミュレーターを起動

Device Managerで**Play**アイコン▶️をクリックしてエミュレーターを起動します。

## Expoでの使用

### エミュレーターでアプリを実行

```bash
# Expo開発サーバーを起動
npx expo start

# Androidエミュレーターで開く（'a'キーを押す）
```

または、直接実行：

```bash
npx expo run:android
```

## トラブルシューティング

### 複数の`adb`バージョンによるバージョン不一致

#### 症状

```
adb: error: version mismatch
```

#### 解決策

Android SDKディレクトリからシステムディレクトリに`adb`を手動でコピーします：

##### macOS

```bash
cp ~/Library/Android/sdk/platform-tools/adb /usr/local/bin/adb
```

##### Linux

```bash
sudo cp ~/Android/Sdk/platform-tools/adb /usr/bin/adb
```

##### Windows

```cmd
copy "C:\Users\<YourUsername>\AppData\Local\Android\Sdk\platform-tools\adb.exe" "C:\Windows\System32\adb.exe"
```

### エミュレーターが起動しない

#### 解決策

1. **仮想化が有効か確認**

##### macOS

仮想化はデフォルトで有効です。

##### Windows

BIOSで**Intel VT-x**または**AMD-V**を有効にします。

##### Linux

```bash
egrep -c '(vmx|svm)' /proc/cpuinfo
```

0以外の値が返されれば、仮想化が有効です。

2. **エミュレーターを削除して再作成**

Virtual Device Managerでエミュレーターを削除し、再作成します。

### アプリがエミュレーターに表示されない

#### 解決策

1. **エミュレーターが実行中か確認**

```bash
adb devices
```

2. **Metroキャッシュをクリア**

```bash
npx expo start --clear
```

3. **アプリを再ビルド**

```bash
npx expo run:android
```

## 高度な設定

### エミュレーターのパフォーマンス改善

#### Graphics設定

1. エミュレーター設定を開く（歯車アイコン）
2. **Graphics**を**Hardware - GLES 2.0**に設定

#### CPUコア数の増加

1. **Advanced Settings**を開く
2. **CPU cores**を増やす（推奨：4コア）

### スナップショットの使用

エミュレーターの起動を高速化するには、スナップショットを有効にします：

1. エミュレーター設定を開く
2. **Boot option**を**Quick boot**に設定
3. **Save quick boot state**にチェック

## まとめ

Android Studioエミュレーターのセットアップは、Expoでのモバイルアプリ開発に不可欠です。適切に設定することで、物理デバイスなしで効率的にAndroidアプリを開発およびテストできます。
