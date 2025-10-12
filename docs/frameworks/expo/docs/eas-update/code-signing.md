# EAS Updateでのエンドツーエンドコード署名

## 概要

- EAS ProductionまたはEnterpriseプランアカウントでのみ利用可能
- 公開鍵暗号を使用してアプリアップデートに暗号署名
- ISP、CDN、クラウドプロバイダー、EASによる改ざんを防止

## プロセス

### 1. 秘密鍵と証明書の生成

```bash
npx expo-updates codesigning:generate
```

- 秘密/公開鍵ペアとコード署名証明書を作成
- 秘密鍵をソース管理外に安全に保管

### 2. コード署名用プロジェクトの設定

```bash
npx expo-updates codesigning:configure
```

- コード署名設定で`app.json`を更新
- Continuous Native Generation を使用していない場合、ネイティブプロジェクトマニフェストファイルを変更

### 3. 署名されたアップデートの公開

```bash
eas update --private-key-path path/to/private-key.pem
```

- EAS CLIがローカルでアップデートに自動的に署名

### 4. 検証

- クライアントが埋め込まれた証明書に対してアップデート署名をチェック
- 署名が有効な場合のみアップデートを適用

## 追加機能

- 鍵のローテーションをサポート
- コード署名の削除を許可
- アップデート改ざんに対するセキュリティを提供

## ベストプラクティス

- 秘密鍵を安全に保管
- セキュリティのベストプラクティスとして定期的な鍵のローテーション
