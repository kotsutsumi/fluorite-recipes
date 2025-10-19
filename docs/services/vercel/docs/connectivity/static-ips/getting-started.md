# Static IPの概要

Static IPは、[Enterprise](/docs/plans/enterprise)および[Pro](/docs/plans/pro-plan)プランで利用可能な機能です。

このガイドでは、Vercelプロジェクトで Static IPs を設定し、IP許可リストを必要とするバックエンドサービスに接続する方法を説明します。

## 前提条件

開始する前に、以下が必要です：

- Vercelにデプロイされたプロジェクト
- IPアドレス制限のあるバックエンドサービス（データベース、API等）
- [Pro](/docs/plans/pro-plan)または[Enterprise](/docs/plans/enterprise)プラン

## セットアップ手順

### 1. 接続設定にアクセス

1. Vercelダッシュボードでプロジェクトを選択
2. プロジェクト設定に移動
3. 左側のメニューから「Connectivity」セクションをクリック

### 2. Static IPsを有効化

1. 「Enable Static IPs」ボタンをクリック
2. 確認ダイアログで「Enable」をクリック
3. 有効化が完了するまで数秒待つ

### 3. リージョンの設定

1. 「Manage Active Regions」をクリック
2. バックエンドサービスに近いリージョンを最大3つ選択
3. 推奨リージョン：
   - **北米**: us-east-1（バージニア）またはus-west-2（オレゴン）
   - **ヨーロッパ**: eu-west-1（アイルランド）
   - **アジア太平洋**: ap-northeast-1（東京）またはap-southeast-1（シンガポール）
4. 「Save」をクリック

選択したリージョンごとに共有VPC内の静的IPが割り当てられます。

### 4. 静的IPアドレスの取得

1. 「Connectivity」ページに戻る
2. 「Static IPs」セクションで割り当てられたIPアドレスを確認
3. 各リージョンの静的IPアドレスが表示されます

例：
```
us-east-1: 52.1.2.3
eu-west-1: 18.202.3.4
ap-northeast-1: 13.231.5.6
```

### 5. バックエンドサービスの設定

#### データベースの場合（例：Amazon RDS）

1. AWS RDSコンソールでデータベースインスタンスを選択
2. 「セキュリティグループ」を編集
3. インバウンドルールを追加：
   - タイプ: PostgreSQL（またはMySQL、その他）
   - ポート: 5432（またはデータベース固有のポート）
   - ソース: カスタム
   - IPアドレス: Vercelから取得した静的IP（複数ある場合はそれぞれ追加）
4. ルールを保存

#### MongoDB Atlasの場合

1. MongoDB Atlasダッシュボードでクラスターを選択
2. 「Network Access」タブに移動
3. 「Add IP Address」をクリック
4. 各静的IPアドレスを追加
5. 説明を入力（例：「Vercel Production - us-east-1」）
6. 「Confirm」をクリック

#### 外部APIの場合

APIプロバイダーのダッシュボードまたは設定で、Vercelの静的IPアドレスを許可リストに追加します。プロバイダーごとに手順が異なります。

### 6. 接続の確認

プロジェクトを再デプロイして、すべての送信トラフィックが静的IPを通じてルーティングされることを確認します：

1. プロジェクトを再デプロイ（新しいコミットをpushするか、手動で再デプロイ）
2. デプロイが完了したら、バックエンドサービスへの接続をテスト

#### テストコード例

```typescript
// app/api/test-connection/route.ts
import { Pool } from 'pg';

export async function GET() {
  try {
    const pool = new Pool({
      host: process.env.DB_HOST,
      port: 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();

    return Response.json({
      success: true,
      time: result.rows[0].now,
      message: 'Database connection successful',
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
```

このエンドポイントにアクセスして、接続が成功することを確認します。

## 環境変数の設定

バックエンド接続に必要な環境変数を設定します：

1. プロジェクト設定 > Environment Variables
2. 以下の変数を追加：
   - `DB_HOST`: データベースホスト名
   - `DB_PORT`: ポート番号
   - `DB_NAME`: データベース名
   - `DB_USER`: ユーザー名
   - `DB_PASSWORD`: パスワード（シークレットとしてマーク）
3. 環境を選択（Production、Preview、Development）
4. 「Save」をクリック

## 次のステップ

Static IPsの設定が完了したら：

### 監視とメンテナンス

- **接続ログの確認**: バックエンドサービスのログで、Vercelの静的IPからの接続を監視
- **使用状況の監視**: Vercel Analytics でデータ転送量を監視
- **パフォーマンスの最適化**: 接続プーリングやキャッシングを実装

### セキュリティの強化

- **TLS/SSL**: 常に暗号化された接続を使用
- **認証**: IPアドレスのホワイトリスト登録に加えて、強力な認証を使用
- **最小権限**: データベースユーザーには必要最小限の権限のみを付与
- **定期的なレビュー**: 許可リストを定期的に見直し、不要なエントリを削除

### トラブルシューティング

問題が発生した場合：

1. [Static IPs ドキュメント](/docs/connectivity/static-ips)の「トラブルシューティング」セクションを確認
2. バックエンドサービスのファイアウォールルールを再確認
3. 環境変数が正しく設定されているか確認
4. Vercel Functionsを使用しているか確認（Edge Runtimeは Static IPs を使用しない）

## 料金と制限

- **料金**: $100/月（プロジェクトごと）+ $0.15/GB（データ転送）
- **リージョン数**: 最大3つ
- **IPアドレス数**: リージョンごとに1つ以上
- **サポートされるランタイム**: Node.js、Python、Go、Ruby

## 関連ドキュメント

- [Static IPs 概要](/docs/connectivity/static-ips)
- [Connectivity](/docs/connectivity)
- [Environment Variables](/docs/projects/environment-variables)
- [Functions](/docs/functions)
- [Secure Compute](/docs/connectivity/secure-compute)（完全なネットワーク分離が必要な場合）

## サポート

問題が解決しない場合は、[Vercelサポート](https://vercel.com/support)にお問い合わせください。
