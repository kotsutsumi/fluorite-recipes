---
title: アプリの整合性
description: Android 上の Google の Play Integrity API および iOS 上の Apple の App Attest サービスへのアクセスを提供するライブラリ。
sourceCodeUrl: 'https://github.com/expo/expo/tree/main/packages/expo-app-integrity'
packageName: '@expo/app-integrity'
platforms: ['android', 'ios']
isAlpha: true
---

import APISection from '~/components/plugins/APISection';
import { APIInstallSection } from '~/components/plugins/InstallSection';

`@expo/app-integrity` は、正規のデバイスで実行されているアプリの正規のインストールによってのみバックエンド リソースにアクセスできるようにする API を提供します。 Android では Google の [Play Integrity API](https://developer.android.com/google/play/integrity) を、iOS では Apple の [App Attest サービス](https://developer.apple.com/documentation/devicecheck/establishing-your-app-s-integrity) を使用してアプリの信頼性を検証し、不正なクライアントの防止に役立ちます。 アプリや自動スクリプトがサーバーにリクエストを行うのを防ぎます。

一般に、`@expo/app-integrity` は、サーバーが次の違いを認識するのに役立ちます。

- **実際のデバイス**上で実行されている**実際のアプリ**
- その他（改変されたアプリ、スクリプト、エミュレータ）

これは、プラットフォームが推奨するアプリ構成証明サービスを使用して行われます。

## インストール

<APIInstallSection />

## Android での使用法

`@expo/app-integrity` は、整合性チェックに Play Integrity の [標準リクエスト フロー](https://developer.android.com/google/play/integrity/standard) を使用します。

＃＃＃ 構成

アプリで整合性 API を有効にする手順については、[Play Integrity セットアップ ガイド](https://developer.android.com/google/play/integrity/setup#set-integrity-responses) を参照してください。

### 整合性トークンプロバイダーの準備 (1 回)

整合性チェック要求を行う前に、整合性トークン プロバイダーを準備する必要があります。これは、アプリの起動時、または整合性チェックが必要になる前にバックグラウンドで行うことができます。

```js
import * as AppIntegrity from '@expo/app-integrity';

const cloudProjectNumber = 'your-cloud-project-number';
await AppIntegrity.prepareIntegrityTokenProvider(cloudProjectNumber);
```

### 整合性トークンをリクエストします (オンデマンド)

アプリが本物であることを確認したいサーバー リクエストを行うたびに、整合性トークンをリクエストし、復号化と検証のためにそれをアプリのバックエンド サーバーに送信します。その後、バックエンド サーバーがどのように行動するかを決定できます。

```js
const requestHash = '2cp24z...';
const result = await AppIntegrity.requestIntegrityCheck(requestHash);
```

[requestIntegrityCheck](#appintegrityrequestintegritycheckrequesthash) を呼び出す前に、[prepareIntegrityTokenProvider](#appintegrityprepareintegritytokenprovidercloudprojectnumber) が正常に呼び出されたことを確認してください。

この例では、`requestHash` は、検証される特定のユーザー アクションに固有のハッシュです。さまざまなユーザー アクションに対してさまざまなハッシュを使用して、[requestIntegrityCheck](#appintegrityprepareintegritytokenprovidercloudprojectnumber) を複数回呼び出すことができます。

成功したら、検証のために結果をサーバーに送信します。

> **注意**: アプリで同じトークン プロバイダーを長期間使用すると、トークン プロバイダーが期限切れになり、次のトークン リクエストで `ERR_APP_INTEGRITY_PROVIDER_INVALID` エラーが発生する可能性があります。このエラーは、`prepareIntegrityTokenProvider` を再度呼び出して新しいプロバイダーを要求することで処理する必要があります。

### 整合性判定を復号して検証する

サーバー内の整合性トークンを確認するには、[Play Integrity のガイド](https://developer.android.com/google/play/integrity/standard#decrypt-and) を参照してください。

### 追加リソース

- [Google Pay Integrity ドキュメント](https://developer.android.com/google/play/integrity/overview): `@expo/app-integrity` を強化する API と検証フローを理解するには、Google の公式ガイドを参照してください。

- [Play Integrity Standard リクエスト フロー](https://developer.android.com/google/play/integrity/standard): このページでは、Android 5.0 (API レベル 21) 以降でサポートされている、完全性判定のための標準 API リクエストの作成について説明します。アプリがサーバー呼び出しを行ってインタラクションが本物かどうかを確認するときはいつでも、整合性判定のための標準 API リクエストを行うことができます。

- [整合性判定について](https://developer.android.com/google/play/integrity/verdicts): 整合性判定は、デバイス、アプリ、アカウントの有効性に関する情報を伝達します。アプリのサーバーは、復号化され検証された判定で得られたペイロードを使用して、アプリ内の特定のアクションまたはリクエストを処理する最適な方法を決定できます。

- [エラー コードの処理](https://developer.android.com/google/play/integrity/reference/com/google/android/play/core/integrity/model/StandardIntegrityErrorCode): アプリが Play Integrity API リクエストを行って呼び出しが失敗した場合、アプリはエラー コードを受け取ります。これらのエラーは、ネットワーク接続の弱さなどの環境問題、API 統合の問題、悪意のあるアクティビティやアクティブな攻撃など、さまざまな理由で発生する可能性があります。

## iOS での使用法

＃＃＃ 構成

Xcode で、**署名と機能** に移動し、**+ 機能** をクリックし、**アプリ認証** を追加します。 Xcode は、必要な資格をアプリに自動的に追加します。

> **注意**: App Attest サービスを使用するには、Apple Developer Web サイトに登録した App ID がアプリに必要です。

サーバー上の検証ロジックについては、[サーバーに接続するアプリの検証](https://developer.apple.com/documentation/devicecheck/validating-apps-that-c​​onnect-to-your-server)を参照してください。

### デバイスがアプリの構成証明をサポートしているかどうかを確認します

すべてのデバイスが App Attest サービスを使用できるわけではないため、サービスにアクセスする前にアプリで互換性チェックを実行することが重要です。ユーザーのアプリが互換性チェックに合格しない場合は、サービスを適切にバイパスします。 `isSupported` プロパティを読み取ることで、空き状況を確認できます。

```js
import * as AppIntegrity from '@expo/app-integrity';

if (AppIntegrity.isSupported) {
  // Perform key generation and attestation.
}
// Continue with your server API access.
```

> **注意**: App Attest は iOS シミュレーターではサポートされていません。

> **情報** ほとんどのアプリ拡張機能は App Attest をサポートしていません。通常、これらの拡張機能でコードを実行する場合は、`isSupported` メソッド プロパティが `true` であっても、キーの生成と構成証明をバイパスします。 App Attest をサポートするアプリ拡張機能は、watchOS 9 以降の watchOS 拡張機能のみです。これらの拡張機能では、`isSupported` の結果を使用して、WatchKit 拡張機能が構成証明をバイパスするかどうかを示すことができます。

### キーペアを作成する

アプリを実行している各デバイスのユーザー アカウントごとに、`generateKey` メソッドを呼び出して、一意のハードウェア ベースの暗号化キー ペアを生成します。

```js
const keyId = await AppIntegrity.generateKey();
```

成功すると、メソッドはキー識別子 (`keyId`) を返します。後でキーにアクセスするために使用します。識別子なしではキーを使用する方法がなく、後で識別子を取得する方法もないため、識別子を永続ストレージに記録します。デバイスは、関連付けられた秘密キーを Secure Enclave に自動的に保存します。App Attest サービスは、そこから秘密キーを使用して署名を作成できますが、どのプロセスもそこから秘密キーを直接読み取ったり変更したりすることはできず、セキュリティが確保されます。

> **情報** App Clipでキーペアを作成した場合は、対応するアプリで同じキーペアを使用してください。これをサポートするには、完全なアプリからアクセスできる共有コンテナーに識別子を必ず保存してください。 [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/#sharing-a-database-between-appsextensions-ios) を使用したアプリ/拡張機能間のデータベース共有に関する Expo のガイドを参照するか、React Native MMKV の [App Groups / extensions](https://github.com/mrousavy/react-native-mmkv?tab=readme-ov-file#app-groups-or-extensions) 共有ストレージを使用して、両方のターゲットにわたって識別子を永続化します。

セキュリティ保護が弱くなるため、デバイス上の複数のユーザー間でキーを再利用しないでください。特に、単一の侵害されたデバイスを使用して、侵害されたバージョンのアプリを実行している複数のリモート ユーザーにサービスを提供する攻撃を検出することは困難になります。詳細については、[不正リスクの評価](https://developer.apple.com/documentation/devicecheck/assessing-fraud-risk)を参照してください。

### サーバーからチャレンジを取得します

サーバーに一意の 1 回限りのチャレンジをリクエストします。このチャレンジは以下の認証ステップに埋め込まれ、攻撃者が再利用できないようにします。推測が不可能になるように十分なエントロピーを提供するには、チャレンジは少なくとも 16 バイトの長さである必要があります。

### キーペアが有効であることを証明する

以下に示すように、前の手順で作成したサーバーからのチャレンジと一緒に `attestKey` メソッドに `keyId` を渡します。

```js
const attestationObject = await AppIntegrity.attestKey(keyId, challenge);
```

成功したら、受信した `attestationObject` と `keyId` を検証のためにサーバーに送信します。

メソッドが `ERR_APP_INTEGRITY_SERVER_UNAVAILABLE` エラーを返した場合は、後で同じキーを使用して構成証明を再試行してください。その他のエラーの場合は、キー識別子を破棄し、再試行するときに新しいキーを作成します。

> **情報** アプリにすでに毎日数百万人のアクティブ ユーザーがいて、アプリから認証を開始するために `attestKey` メソッドの呼び出しを開始したい場合は、ユーザーを安全に増加させるためのガイダンスについて、[アプリ認証サービスを使用するための準備](https://developer.apple.com/documentation/DeviceCheck/preparing-to-use-the-app-attest-service) を確認してください。

サーバーは、証明書オブジェクトを正常に検証できた場合、アプリ インスタンスが有効であるとみなします。この場合、キー識別子を永続的に保存してください。証明書オブジェクトではありません -将来的にサーバーリクエストに署名するためにアプリ内で使用します。

### 機密リクエストに対してアサーションを生成する

キーの構成証明の検証に成功すると、サーバーはアプリに対し、今後のサーバー リクエストの一部またはすべてに対してその正当性を主張するよう要求できます。アプリはリクエストに署名することでこれを行います。アプリで、サーバーから固有の 1 回限りのチャレンジを取得します。ここでは、リプレイ攻撃を避けるために、証明などにチャレンジを使用します。

```js
const challenge = 'A string from your server';
const request = {
  action: 'getGameLevel',
  levelId: '1234',
  challenge: challenge,
};
const assertion = await AppIntegrity.generateAssertion(keyId, JSON.stringify(request));
```

成功すると、アサーション オブジェクトとクライアント データがサーバーに渡されます。アサーション オブジェクトが検証に失敗した場合、リクエストの処理方法を決定するのはユーザーの責任です。

キーを使用して行うことができるアサーションの数に制限はありません。ただし、通常は、アプリがプレミアム コンテンツをダウンロードするときなど、アプリのライフ サイクルの重要な瞬間に行われるリクエスト用にアサーションを予約します。

### 再インストールを最初からやり直す

生成したキーは、アプリの定期的な更新を通じて有効のままですが、アプリの再インストール、デバイスの移行、またはバックアップからのデバイスの復元には有効ではありません。このような場合は、プロセスを最初から開始して新しいキーを生成する必要があります。新しいキーの生成をこれらのイベントのみ、または新しいユーザーの追加に限定するようにしてください。デバイス上のキー数を低く保つと、特定の種類の不正行為を検出するときに役立ちます。

### 追加リソース

- [Apple の App Attest ドキュメント](https://developer.apple.com/documentation/devicecheck/establishing-your-app-s-integrity): `@expo/app-integrity` を強化する API と検証フローを理解するには、Apple の公式ガイドを参照してください。

- [サーバーに接続するアプリの検証](https://developer.apple.com/documentation/devicecheck/validating-apps-that-c​​onnect-to-your-server): サーバー上のアプリの構成証明とアサーションを検証します。

- [不正リスクの評価](https://developer.apple.com/documentation/devicecheck/assessing-fraud-risk): サーバー間呼び出しを使用してリスク データを要求および分析します。

- [アプリ認証サービスを使用するための準備](https://developer.apple.com/documentation/devicecheck/preparing-to-use-the-app-attest-service): 開発環境で実装をテストし、徐々にユーザーをオンボーディングします。

## API

```js
import * as AppIntegrity from '@expo/app-integrity';
```

<APISection packageName="expo-app-integrity" apiName="AppIntegrity" />
