# キャッシュのクリア（Windows）

WindowsでExpoおよびReact Nativeプロジェクトのキャッシュをクリアする方法を学びます。

## キャッシュクリアが必要な場合

**症状**:
- 古いコードが実行される
- 変更が反映されない
- ビルドエラーが解決しない
- 依存関係の問題
- 予期しない動作

**キャッシュクリアで解決できる問題**:
- 古いJavaScriptバンドル
- 破損したMetroキャッシュ
- 古いnode_modules
- Watchmanの問題
- パッケージマネージャーのキャッシュ

## Expo CLI（npm使用）

### 完全なキャッシュクリア手順

```bash
# ステップ1: node_modulesを削除
rm -rf node_modules

# ステップ2: npmキャッシュをクリア
npm cache clean --force

# ステップ3: 依存関係を再インストール
npm install

# ステップ4: Watchmanキャッシュをクリア
watchman watch-del-all

# ステップ5: Hasteマップキャッシュをクリア（Windows）
del %localappdata%\Temp\haste-map-*

# ステップ6: Metroキャッシュをクリア（Windows）
del %localappdata%\Temp\metro-cache

# ステップ7: 開発サーバーをクリアして起動
npx expo start --clear
```

### PowerShellを使用する場合

```powershell
# ステップ1: node_modulesを削除
Remove-Item -Recurse -Force node_modules

# ステップ2: npmキャッシュをクリア
npm cache clean --force

# ステップ3: 依存関係を再インストール
npm install

# ステップ4: Watchmanキャッシュをクリア
watchman watch-del-all

# ステップ5: Hasteマップキャッシュをクリア
Remove-Item -Recurse -Force $env:LOCALAPPDATA\Temp\haste-map-*

# ステップ6: Metroキャッシュをクリア
Remove-Item -Recurse -Force $env:LOCALAPPDATA\Temp\metro-cache

# ステップ7: 開発サーバーをクリアして起動
npx expo start --clear
```

### 各コマンドの説明

#### 1. node_modulesを削除

**コマンドプロンプト**:
```bash
rm -rf node_modules
```

**PowerShell**:
```powershell
Remove-Item -Recurse -Force node_modules
```

**目的**: すべてのインストール済みパッケージを削除

**理由**:
- 破損したパッケージファイル
- バージョンの不整合
- シンボリックリンクの問題

**注意**: Windowsでは削除に時間がかかる場合があります

#### 2. npmキャッシュをクリア

```bash
npm cache clean --force
```

**目的**: グローバルnpmキャッシュをクリア

**キャッシュの場所を確認**:
```bash
npm config get cache
# 出力例: C:\Users\YourName\AppData\Local\npm-cache
```

**手動でキャッシュディレクトリを削除**:
```powershell
Remove-Item -Recurse -Force $env:LOCALAPPDATA\npm-cache
```

#### 3. 依存関係を再インストール

```bash
npm install
```

**オプション**:
```bash
# より詳細なログを表示
npm install --verbose

# クリーンインストール
npm ci
```

#### 4. Watchmanキャッシュをクリア

```bash
watchman watch-del-all
```

**Watchmanがインストールされていない場合**:
```bash
# Chocolateyでインストール
choco install watchman

# または、手動でインストール
# https://facebook.github.io/watchman/docs/install#windows
```

**Watchmanが利用できない場合**:
このステップはスキップ可能です。Watchmanは主にmacOS/Linuxで使用されます。

#### 5. Hasteマップキャッシュをクリア

**コマンドプロンプト**:
```bash
del %localappdata%\Temp\haste-map-*
```

**PowerShell**:
```powershell
Remove-Item -Recurse -Force $env:LOCALAPPDATA\Temp\haste-map-*
```

**目的**: Metroバンドラーのモジュールマップをクリア

**手動で確認**:
```powershell
# 一時ディレクトリを表示
explorer $env:LOCALAPPDATA\Temp
```

#### 6. Metroキャッシュをクリア

**コマンドプロンプト**:
```bash
del %localappdata%\Temp\metro-cache
```

**PowerShell**:
```powershell
Remove-Item -Recurse -Force $env:LOCALAPPDATA\Temp\metro-cache
```

**目的**: Metroバンドラーのキャッシュをクリア

#### 7. 開発サーバーをクリアして起動

```bash
npx expo start --clear
```

**その他のオプション**:
```bash
# リセット状態で起動
npx expo start --clear --reset-cache

# オフラインモード
npx expo start --offline
```

## Expo CLI（Yarn使用）

### 完全なキャッシュクリア手順

```bash
# ステップ1: node_modulesを削除
rm -rf node_modules

# ステップ2: Yarnキャッシュをクリア
yarn cache clean

# ステップ3: 依存関係を再インストール
yarn

# ステップ4: Watchmanキャッシュをクリア
watchman watch-del-all

# ステップ5: Hasteマップキャッシュをクリア
del %localappdata%\Temp\haste-map-*

# ステップ6: Metroキャッシュをクリア
del %localappdata%\Temp\metro-cache

# ステップ7: 開発サーバーをクリアして起動
npx expo start --clear
```

### Yarn固有のコマンド

#### Yarnキャッシュをクリア

```bash
yarn cache clean
```

**Yarnキャッシュの場所を確認**:
```bash
yarn cache dir
# 出力例: C:\Users\YourName\AppData\Local\Yarn\Cache\v6
```

**PowerShellで手動削除**:
```powershell
Remove-Item -Recurse -Force $env:LOCALAPPDATA\Yarn\Cache
```

## React Native CLI（npm使用）

```bash
# ステップ1: node_modulesを削除
rm -rf node_modules

# ステップ2: npmキャッシュをクリア
npm cache clean --force

# ステップ3: 依存関係を再インストール
npm install

# ステップ4: Watchmanキャッシュをクリア
watchman watch-del-all

# ステップ5: Metroキャッシュをクリア
del %localappdata%\Temp\react-*

# ステップ6: 開発サーバーをクリアして起動
npx react-native start --reset-cache
```

## React Native CLI（Yarn使用）

```bash
# ステップ1: node_modulesを削除
rm -rf node_modules

# ステップ2: Yarnキャッシュをクリア
yarn cache clean

# ステップ3: 依存関係を再インストール
yarn

# ステップ4: Watchmanキャッシュをクリア
watchman watch-del-all

# ステップ5: Metroキャッシュをクリア
del %localappdata%\Temp\react-*

# ステップ6: 開発サーバーをクリアして起動
npx react-native start --reset-cache
```

## プラットフォーム固有のキャッシュクリア

### Androidキャッシュのクリア

```bash
# Gradleキャッシュをクリア
cd android
gradlew clean
gradlew cleanBuildCache
cd ..

# Androidビルドフォルダをクリア
rm -rf android\app\build
rm -rf android\build

# Gradle globalキャッシュをクリア（PowerShell）
Remove-Item -Recurse -Force $env:USERPROFILE\.gradle\caches

# 開発サーバーを再起動
npx expo start --clear
```

**PowerShell版**:
```powershell
# プロジェクトルートから
cd android
.\gradlew.bat clean
.\gradlew.bat cleanBuildCache
cd ..

Remove-Item -Recurse -Force android\app\build
Remove-Item -Recurse -Force android\build
Remove-Item -Recurse -Force $env:USERPROFILE\.gradle\caches

npx expo start --clear
```

### iOSキャッシュのクリア（Windows with Mac build server）

```bash
# iOS開発はmacOSで行うため、通常はWindows上では不要
# Mac build serverを使用している場合はSSH経由で実行
```

## Windows固有の考慮事項

### 1. ファイルパスの長さ制限

**問題**: Windowsは260文字のパス長制限があります

**解決策**:

**レジストリを編集（Windows 10 1607以降）**:
1. `Win + R`を押して`regedit`を実行
2. `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem`に移動
3. `LongPathsEnabled`を作成/編集（DWORD値、1に設定）
4. PCを再起動

**Gitで長いパスを有効化**:
```bash
git config --system core.longpaths true
```

### 2. 管理者権限

**一部のコマンドは管理者権限が必要**:

```powershell
# PowerShellを管理者として起動
# スタートメニュー → PowerShell → 右クリック → 管理者として実行
```

### 3. ウイルス対策ソフトの除外

**node_modulesをスキャンから除外**:

- Windows Defenderを開く
- 設定 → ウイルスと脅威の防止 → 除外を管理
- プロジェクトの`node_modules`フォルダを追加

### 4. ファイルロックの問題

**ファイルが使用中の場合**:

```powershell
# プロセスを強制終了
taskkill /F /IM node.exe

# または、特定のポートを使用しているプロセスを終了
netstat -ano | findstr :8081
taskkill /PID <プロセスID> /F
```

## トラブルシューティング後のキャッシュクリア

### 問題が解決しない場合の追加手順

#### 1. グローバルパッケージを再インストール

```bash
# Expo CLIを再インストール
npm uninstall -g expo-cli
npm install -g expo-cli

# EAS CLIを再インストール
npm uninstall -g eas-cli
npm install -g eas-cli
```

#### 2. 環境変数を確認

```powershell
# 環境変数を表示
$env:PATH

# Node.jsのパスを確認
where node
where npm
```

#### 3. Node.jsを再インストール

```bash
# Node.jsバージョンを確認
node -v
npm -v

# nvmを使用（推奨）
# https://github.com/coreybutler/nvm-windows
nvm install 20
nvm use 20
```

#### 4. プロジェクトを完全にクリーン

**コマンドプロンプト**:
```bash
rm -rf node_modules
rm -rf android\app\build
rm -rf android\build
rm -rf .expo
del %localappdata%\Temp\metro-*
del %localappdata%\Temp\haste-map-*
npm cache clean --force
npm install
npx expo start --clear
```

**PowerShell**:
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force android\app\build
Remove-Item -Recurse -Force android\build
Remove-Item -Recurse -Force .expo
Remove-Item -Recurse -Force $env:LOCALAPPDATA\Temp\metro-*
Remove-Item -Recurse -Force $env:LOCALAPPDATA\Temp\haste-map-*
npm cache clean --force
npm install
npx expo start --clear
```

## 便利なスクリプト

### package.jsonにカスタムスクリプトを追加

```json
{
  "scripts": {
    "start": "expo start",
    "clear": "expo start --clear",
    "reset:cmd": "rm -rf node_modules && npm install && npx expo start --clear",
    "reset:ps": "Remove-Item -Recurse -Force node_modules; npm install; npx expo start --clear",
    "deep-clean:cmd": "rm -rf node_modules android\\app\\build android\\build && npm cache clean --force && npm install && npx expo start --clear",
    "deep-clean:ps": "Remove-Item -Recurse -Force node_modules,android\\app\\build,android\\build; npm cache clean --force; npm install; npx expo start --clear"
  }
}
```

**使用方法**:
```bash
# コマンドプロンプト
npm run reset:cmd

# PowerShell
npm run reset:ps
```

### バッチファイルを作成

**clear-cache.bat**:
```batch
@echo off
echo Clearing Expo cache...

echo Step 1: Removing node_modules...
rmdir /s /q node_modules

echo Step 2: Clearing npm cache...
call npm cache clean --force

echo Step 3: Reinstalling dependencies...
call npm install

echo Step 4: Clearing Metro cache...
del /q %localappdata%\Temp\metro-cache

echo Step 5: Clearing Haste map...
del /q %localappdata%\Temp\haste-map-*

echo Step 6: Starting development server...
call npx expo start --clear

echo Cache cleared successfully!
pause
```

**使用方法**:
```bash
# バッチファイルを実行
clear-cache.bat
```

### PowerShellスクリプトを作成

**clear-cache.ps1**:
```powershell
Write-Host "Clearing Expo cache..." -ForegroundColor Green

Write-Host "Step 1: Removing node_modules..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

Write-Host "Step 2: Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

Write-Host "Step 3: Reinstalling dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Step 4: Clearing Metro cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force $env:LOCALAPPDATA\Temp\metro-cache -ErrorAction SilentlyContinue

Write-Host "Step 5: Clearing Haste map..." -ForegroundColor Yellow
Remove-Item -Recurse -Force $env:LOCALAPPDATA\Temp\haste-map-* -ErrorAction SilentlyContinue

Write-Host "Step 6: Starting development server..." -ForegroundColor Yellow
npx expo start --clear

Write-Host "Cache cleared successfully!" -ForegroundColor Green
Read-Host "Press Enter to exit"
```

**使用方法**:
```powershell
# PowerShellスクリプトを実行
.\clear-cache.ps1
```

## ベストプラクティス

### 1. 定期的なキャッシュクリア

```bash
# 週次でキャッシュをクリア
# Windowsタスクスケジューラで自動化可能
```

### 2. 問題発生時の最初のステップ

```bash
# 簡単なクリア
npx expo start --clear

# それでも解決しない場合
npm run reset
```

### 3. 大きな変更後のクリーン

```bash
# Expo SDKアップグレード後
npx expo install --fix
npm run deep-clean

# 新しい依存関係追加後
npm run reset
```

## 注意事項

### コマンド実行時の注意

**❌ 避けるべきこと**:
```powershell
# システムファイルを削除しない
Remove-Item -Recurse -Force C:\  # 危険！

# 管理者権限で不必要なコマンドを実行しない
```

**✅ 推奨**:
```bash
# プロジェクトディレクトリ内でのみ実行
cd C:\path\to\your\project
rm -rf node_modules
```

### バックアップの推奨

```bash
# 重要な変更前にバックアップ
# プロジェクトディレクトリ全体をコピー
xcopy /E /I C:\path\to\project C:\path\to\backup

# または、Gitを使用
git add .
git commit -m "Backup before cache clear"
```

## まとめ

Windowsでのキャッシュクリアは、以下の方法を提供します：

### 基本的なキャッシュクリア
1. node_modulesを削除
2. パッケージマネージャーキャッシュをクリア
3. 依存関係を再インストール
4. Watchmanをリセット（オプション）
5. Metro/Hasteマップキャッシュをクリア（`%localappdata%\Temp`）
6. 開発サーバーをクリアして起動

### Windows固有の考慮事項
- **ファイルパスの長さ制限**: レジストリ設定で対応
- **管理者権限**: 必要に応じて使用
- **ウイルス対策**: node_modulesを除外
- **ファイルロック**: プロセスを強制終了

### 便利なツール
- カスタムnpmスクリプト
- バッチファイル（.bat）
- PowerShellスクリプト（.ps1）

### ベストプラクティス
- 定期的なキャッシュクリア
- 問題発生時の段階的アプローチ
- 大きな変更後の完全クリーン
- 重要な変更前のバックアップ

これらの手順とツールを活用して、Windows環境でキャッシュ関連の問題を効率的に解決できます。
