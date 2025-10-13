# 自動管理される認証情報の使用

EASでアプリの認証情報を自動的に管理する方法を学びます。

* * *

アプリをアプリストアで配布するには、キーストアや配布証明書などの認証情報でデジタル署名する必要があります。これにより、アプリの提供元が認証され、改ざんできないことが保証されます。FCM APIキーやApple Push Keyなどの他の認証情報は、プッシュ通知を送信するために必要ですが、アプリの署名には関与しません。

EAS Buildでアプリをビルドするために知っておく必要があるのはこれだけですが、詳細を知りたい場合は、[アプリ署名](/app-signing/app-credentials)ガイドを参照してください。

EASがあなたとあなたのチームのために認証情報を自動的に管理する方法について学びましょう。

## アプリ署名認証情報の生成

`eas build`を実行すると、まだ認証情報を生成していない場合は、生成するように求められます。簡単な手順に従って認証情報を生成してください。必要に応じて、認証情報はEASサーバーに保存されます。以降のアプリのビルドでは、別途指定しない限り、これらの認証情報が再利用されます。

iOSの認証情報（配布証明書、プロビジョニングプロファイル、およびプッシュキー）を生成するには、[Apple Developer Program](https://developer.apple.com/programs)のメンバーシップでサインインする必要があります。

> EASによる認証情報の管理や、EAS CLIを通じたApple Developerアカウントへのログインについてセキュリティ上の懸念がある場合は、[セキュリティ](/app-signing/security)ガイドを参照してください。それでも懸念が解消されない場合は、[secure@expo.dev](mailto:secure@expo.dev)に詳細をお問い合わせいただくか、代わりに[ローカル認証情報](/app-signing/local-credentials)を使用してください。

### プッシュ通知の認証情報

#### Android

EAS BuildのAndroidプッシュ通知認証情報のセットアップには、FCMでアプリを設定する必要があります。`eas credentials`を実行し、`Android`を選択してから、`Push Notifications: Manage your FCM Api Key`を選択し、適切なオプションを選択してキーを設定します。

#### iOS

まだPush Notificationsキーを設定していない場合、次回の`eas build`実行時にEAS CLIが設定を求めます。

`eas credentials`コマンドを使用してPush Notificationsキーを設定することもできます。コマンドを実行してください。
