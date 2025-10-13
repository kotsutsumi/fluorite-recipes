# シングルサインオン（SSO） - Expoドキュメント

## 概要
シングルサインオン（SSO）は、ProductionおよびEnterpriseプランのお客様が利用でき、組織がIDプロバイダーを通じてExpoユーザーを管理できるようにします。

## IDプロバイダーのサポート
Expo SSOは以下のIDプロバイダーをサポートします：
- Okta
- OneLogin
- Microsoft Entra ID
- Google Workspace

OpenID Connect Discovery 1.0仕様を実装しています。

## 組織でのSSOのセットアップ

> 「組織アカウントは、Ownerロールを持つ少なくとも1人の非SSOユーザーを維持する必要があります。」

手順：
1. 組織アカウントのオーナーとしてログイン
2. Settings > Organization settingsに移動
3. SSO設定を作成
4. 設定詳細を入力：
   - クライアントID
   - クライアントシークレット
   - IdPサブドメイン/テナントID

## SSOユーザーのサインイン方法

### Expo Webサイト
1. expo.dev/sso-loginに移動
2. 組織名を入力
3. IDプロバイダー経由でログイン
4. Expoユーザー名を選択

### CLIログイン
- Expo CLI：`npx expo login --sso`
- EAS CLI：`eas login --sso`

### Expo Go
1. 「Continue with SSO」をクリック
2. Webサイトのサインイン手順に従う

## SSOユーザーの制限
- SSO組織にのみ所属可能
- 追加の組織を作成できない
- SSO組織を離れることができない
- Expoフォーラムにログインできない
- 個人的にEASにサブスクライブできない

## SSO管理

### 既存ユーザーの移行
1. 現在のアカウントからログアウト
2. SSOログインページに移動
3. 新しいSSOアカウントを作成
4. 古いユーザーアカウントを削除

### SSOユーザーの削除
- IDプロバイダーで削除または無効化
- Members設定から手動で削除可能

### 請求と廃止
- アクティブなProductionまたはEnterprise Planが必要
- 少なくとも1人の非SSOオーナーアカウントを維持する必要があります

## 重要な注記
- SSO設定とアカウント削除にはExpoサポートへの連絡が必要
- ユーザー名はプラットフォーム全体で一意である必要があります
