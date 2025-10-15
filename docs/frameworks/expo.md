# Expo フレームワークドキュメントインデックス

Expo Router モバイルクライアント開発で参照する公式ドキュメントを `docs/frameworks/expo/` 以下に収集。主要トピックと代表的なリンクを構造化してまとめています。

## 利用ガイド
- Expo CLI / EAS Platform のワークフロー別にセクション化。
- `path` は `docs/frameworks/expo/` からの相対パス。
- `key_files` でエントリポイント的なドキュメントを数点ピックアップ。

```yaml
resource_index:
  - uid: accounts
    title: "Accounts & Identity"
    path: "./expo/docs/accounts/"
    summary: "アカウント種別、SSO、2FA、監査ログ、APIアクセス権限を管理。"
    key_files:
      - "./expo/docs/accounts/account-types.md"
      - "./expo/docs/accounts/sso.md"
      - "./expo/docs/accounts/two-factor.md"

  - uid: additional-resources
    title: "Additional Resources"
    path: "./expo/docs/additional-resources.md"
    summary: "学習資料、コミュニティリソース、外部リンク集。"
    key_files:
      - "./expo/docs/additional-resources.md"

  - uid: app-signing
    title: "App Signing & Credentials"
    path: "./expo/docs/app-signing/"
    summary: "アプリ署名資格情報の取得、管理、同期と安全な運用。"
    key_files:
      - "./expo/docs/app-signing/app-credentials.md"
      - "./expo/docs/app-signing/local-credentials.md"
      - "./expo/docs/app-signing/security.md"

  - uid: bare
    title: "Bare Workflow Integration"
    path: "./expo/docs/bare/"
    summary: "Bare ワークフローへの移行、Expo モジュール導入、アップグレード手順。"
    key_files:
      - "./expo/docs/bare/overview.md"
      - "./expo/docs/bare/installing-expo-modules.md"
      - "./expo/docs/bare/upgrade.md"

  - uid: billing
    title: "Billing & Plans"
    path: "./expo/docs/billing/"
    summary: "Expo サービスの料金プラン、使用量課金、請求管理。"
    key_files:
      - "./expo/docs/billing/overview.md"
      - "./expo/docs/billing/usage-based-pricing.md"
      - "./expo/docs/billing/manage.md"

  - uid: brownfield
    title: "Brownfield Adoption"
    path: "./expo/docs/brownfield/"
    summary: "既存ネイティブアプリへ Expo 機能を段階的に導入するためのガイド。"
    key_files:
      - "./expo/docs/brownfield/overview.md"
      - "./expo/docs/brownfield/get-started.md"

  - uid: build
    title: "EAS Build Guides"
    path: "./expo/docs/build/"
    summary: "EAS Build の導入、CI/CD 設定、内部配布、GitHub 連携。"
    key_files:
      - "./expo/docs/build/introduction.md"
      - "./expo/docs/build/setup.md"
      - "./expo/docs/build/building-on-ci.md"

  - uid: build-reference
    title: "Build Reference"
    path: "./expo/docs/build-reference/"
    summary: "ビルドの詳細構成、キャッシュ、モノレポ対応、iOS/Android 固有設定。"
    key_files:
      - "./expo/docs/build-reference/build-configuration.md"
      - "./expo/docs/build-reference/ios-builds.md"
      - "./expo/docs/build-reference/android-builds.md"

  - uid: custom-builds
    title: "Custom Builds"
    path: "./expo/docs/custom-builds/"
    summary: "カスタムネイティブ機能を含んだビルドプロファイルの定義と関数連携。"
    key_files:
      - "./expo/docs/custom-builds/get-started.md"
      - "./expo/docs/custom-builds/functions.md"
      - "./expo/docs/custom-builds/schema.md"

  - uid: distribution
    title: "App Distribution"
    path: "./expo/docs/distribution/"
    summary: "アプリサイズ最適化、アプリストア提出、プロダクト移管プロセス。"
    key_files:
      - "./expo/docs/distribution/introduction.md"
      - "./expo/docs/distribution/app-stores.md"
      - "./expo/docs/distribution/app-size.md"

  - uid: eas
    title: "EAS Platform"
    path: "./expo/docs/eas/"
    summary: "EAS 全体像、JSON 設定、ホスティング、メタデータ、Webhook。"
    key_files:
      - "./expo/docs/eas/index.md"
      - "./expo/docs/eas/json.md"
      - "./expo/docs/eas/metadata/"

  - uid: eas-insights
    title: "EAS Insights"
    path: "./expo/docs/eas-insights/"
    summary: "ビルドとリリースのメトリクス可視化、Insights の概要。"
    key_files:
      - "./expo/docs/eas-insights/introduction.md"

  - uid: eas-update
    title: "EAS Update"
    path: "./expo/docs/eas-update/"
    summary: "OTA アップデートの導入、署名、配信パターン、ロールバック。"
    key_files:
      - "./expo/docs/eas-update/introduction.md"
      - "./expo/docs/eas-update/getting-started.md"
      - "./expo/docs/eas-update/deployment.md"

  - uid: guides
    title: "Feature Guides"
    path: "./expo/docs/guides/"
    summary: "Metro 設定、Monorepo 対応、Tailwind、各種外部サービス連携ガイド。"
    key_files:
      - "./expo/docs/guides/overview.md"
      - "./expo/docs/guides/monorepos.md"
      - "./expo/docs/guides/tailwind.md"

  - uid: linking
    title: "Deep Linking"
    path: "./expo/docs/linking/"
    summary: "iOS/Android のディープリンク設定、外部アプリ連携、リンクテスト。"
    key_files:
      - "./expo/docs/linking/overview.md"
      - "./expo/docs/linking/ios-universal-links.md"
      - "./expo/docs/linking/android-app-links.md"

  - uid: modules
    title: "Expo Modules"
    path: "./expo/docs/modules/"
    summary: "モジュール API 設計、ネイティブ連携、Autolinking、テスト手法。"
    key_files:
      - "./expo/docs/modules/overview.md"
      - "./expo/docs/modules/get-started.md"
      - "./expo/docs/modules/native-module-tutorial.md"

  - uid: regulatory-compliance
    title: "Regulatory Compliance"
    path: "./expo/docs/regulatory-compliance/"
    summary: "GDPR・HIPAA を含むデータ保護と運用上のコンプライアンス要件。"
    key_files:
      - "./expo/docs/regulatory-compliance/gdpr.md"
      - "./expo/docs/regulatory-compliance/hipaa.md"
      - "./expo/docs/regulatory-compliance/data-and-privacy-protection.md"

  - uid: router
    title: "Expo Router"
    path: "./expo/docs/router/"
    summary: "Expo Router の導入、ベーシック/アドバンスト構成、リファレンス。"
    key_files:
      - "./expo/docs/router/introduction.md"
      - "./expo/docs/router/basics/"
      - "./expo/docs/router/advanced/"

  - uid: submit
    title: "EAS Submit"
    path: "./expo/docs/submit/"
    summary: "App Store / Play Store への申請フロー、自動化、`eas submit` 設定。"
    key_files:
      - "./expo/docs/submit/introduction.md"
      - "./expo/docs/submit/ios.md"
      - "./expo/docs/submit/android.md"

  - uid: troubleshooting
    title: "Troubleshooting"
    path: "./expo/docs/troubleshooting/"
    summary: "キャッシュクリア、バージョン不整合、プロキシなどの一般的な問題対応。"
    key_files:
      - "./expo/docs/troubleshooting/overview.md"
      - "./expo/docs/troubleshooting/clear-cache-macos-linux.md"
      - "./expo/docs/troubleshooting/react-native-version-mismatch.md"

  - uid: tutorial
    title: "Tutorial Series"
    path: "./expo/docs/tutorial/"
    summary: "Expo アプリ開発のハンズオンチュートリアルと EAS Build 実践。"
    key_files:
      - "./expo/docs/tutorial/introduction.md"
      - "./expo/docs/tutorial/create-your-first-app.md"
      - "./expo/docs/tutorial/eas/introduction.md"

  - uid: workflow
    title: "Development Workflow"
    path: "./expo/docs/workflow/"
    summary: "開発モード、ログ取得、シミュレータ設定、Web 対応のワークフロー。"
    key_files:
      - "./expo/docs/workflow/overview.md"
      - "./expo/docs/workflow/ios-simulator.md"
      - "./expo/docs/workflow/common-development-errors.md"
```

## ナビゲーションメモ
- EAS 関連の導線は「build → build-reference → submit → eas-update」で連続的に参照。
- Expo Router の基本と応用は `router/introduction.md` と `router/basics/`・`router/advanced/` を順に閲覧。
- Bare / Brownfield ドキュメントは既存ネイティブアプリに Expo を導入するときの比較検討資料。
