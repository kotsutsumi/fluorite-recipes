# Vercel Trusted IPs - 信頼できるIP

## 概要

Trusted IPs（信頼できるIP）は、デプロイメントへのアクセスを特定のIPアドレスに制限する高度なセキュリティ機能です。

### 対象プラン

- **エンタープライズプランでのみ利用可能**

### 必要な権限

以下のいずれかの役割が必要：
- オーナー
- メンバー
- 管理者

## 主な特徴

### サポートされるIPアドレス形式

- **IPv4アドレス**: 単一のIPアドレス（例：`203.0.113.10`）
- **IPv4 CIDRレンジ**: IPアドレスの範囲（例：`203.0.113.0/24`）

**注意**: IPv6は現在サポートされていません。

### 環境別の設定

プロジェクトの異なる環境で設定可能：

- **プレビューデプロイメント**: プレビュー環境のみ保護
- **本番デプロイメント**: 本番環境のみ保護
- **すべてのデプロイメント**: プレビューと本番の両方を保護

### 他の保護方法との連携

Trusted IPsは、以下の保護方法と組み合わせて使用できます：

- **Vercel認証**: 特定IPからアクセス + Vercelアカウントでログイン
- **パスワード保護**: 特定IPからアクセス + パスワード入力

## セキュリティ考慮事項

### 一般的な考慮事項

| 考慮事項 | 説明 |
|----------|------|
| 環境ごとの設定 | プレビュー、本番など異なる環境で個別に設定可能 |
| Vercel認証との連携 | Vercel認証と組み合わせて多層防御が可能 |
| 共有リンクでバイパス | 共有リンクや自動化バイパスで保護を無効化可能 |

### セキュリティ制限

#### Vercelファイアウォールが優先

- Vercelファイアウォールのブロッキングルールが優先される
- ファイアウォールでブロックされたIPは、Trusted IPsに追加しても拒否される

#### DDoS緩和

- DDoS緩和機能はTrusted IPs設定に影響を受けない
- 攻撃トラフィックは信頼できるIPからでもブロックされる可能性がある

## 管理方法

### ダッシュボードから管理

#### Trusted IPsの有効化と設定

1. Vercelダッシュボードからプロジェクトを選択
2. 「設定」タブに移動
3. 「デプロイメント保護」を選択
4. 「Trusted IPs」セクションを見つける
5. トグルを有効化
6. 「IPアドレスを追加」をクリック
7. 以下の情報を入力：
   - **IPアドレスまたはCIDRレンジ**: `203.0.113.10`または`203.0.113.0/24`
   - **メモ**: IPアドレスの説明（例：「本社オフィス」）
8. 保護する環境を選択
9. 「保存」をクリック

#### IPアドレスの編集

1. Trusted IPs設定に移動
2. 編集したいIPアドレスの「編集」アイコンをクリック
3. IPアドレスまたはメモを変更
4. 「保存」をクリック

#### IPアドレスの削除

1. Trusted IPs設定に移動
2. 削除したいIPアドレスの「削除」アイコンをクリック
3. 確認ダイアログで削除を確認

### API経由で管理

#### Trusted IPsの設定

```bash
curl -X PATCH "https://api.vercel.com/v9/projects/PROJECT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "trustedIps": {
      "deploymentType": "prod_deployment_urls_and_all_previews",
      "addresses": [
        {
          "value": "203.0.113.0/24",
          "note": "Office network"
        },
        {
          "value": "198.51.100.10",
          "note": "VPN gateway"
        }
      ]
    }
  }'
```

#### 環境タイプのオプション

- `preview`: プレビューデプロイメントのみ
- `prod_deployment_urls_and_all_previews`: 本番デプロイメントとプレビュー
- `all`: すべてのデプロイメント

#### Trusted IPsの削除

```bash
curl -X PATCH "https://api.vercel.com/v9/projects/PROJECT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "trustedIps": null
  }'
```

### Terraformで管理

```hcl
resource "vercel_project" "example" {
  name = "example-project"

  trusted_ips = {
    deployment_type = "prod_deployment_urls_and_all_previews"
    addresses = [
      {
        value = "203.0.113.0/24"
        note  = "Office network"
      },
      {
        value = "198.51.100.10"
        note  = "VPN gateway"
      }
    ]
  }
}
```

## IPアドレスの確認方法

### 現在のIPアドレスを確認

```bash
# cURL
curl https://api.ipify.org

# HTTPie
http https://api.ipify.org

# ブラウザ
# https://www.whatismyip.com/
```

### ネットワークのIPレンジを確認

企業ネットワークの場合、IT部門に以下を確認：

- 外部向けIPアドレス
- IPアドレスレンジ（CIDRノーテーション）
- VPNゲートウェイのIPアドレス

## CIDRノーテーション

### CIDRレンジの理解

CIDR（Classless Inter-Domain Routing）は、IPアドレスの範囲を表す方法です。

#### 一般的なCIDRレンジ

| CIDR | IPアドレス数 | 範囲の例 |
|------|-------------|---------|
| /32 | 1 | 203.0.113.10 |
| /31 | 2 | 203.0.113.10-11 |
| /30 | 4 | 203.0.113.8-11 |
| /29 | 8 | 203.0.113.8-15 |
| /28 | 16 | 203.0.113.0-15 |
| /24 | 256 | 203.0.113.0-255 |
| /16 | 65,536 | 203.0.0.0-255.255 |

### CIDRレンジの計算

```bash
# オンラインツール
# https://www.ipaddressguide.com/cidr

# コマンドライン（ipcalcツール）
ipcalc 203.0.113.0/24
```

## ユースケース

### 1. オフィスネットワークからのみアクセス

**シナリオ**: 社内からのみプレビューデプロイメントにアクセス

```json
{
  "trustedIps": {
    "deploymentType": "preview",
    "addresses": [
      {
        "value": "203.0.113.0/24",
        "note": "本社オフィス"
      },
      {
        "value": "198.51.100.0/24",
        "note": "支社オフィス"
      }
    ]
  }
}
```

### 2. VPN経由のアクセスのみ許可

**シナリオ**: 企業VPN経由でのみアクセス可能

```json
{
  "trustedIps": {
    "deploymentType": "all",
    "addresses": [
      {
        "value": "192.0.2.10",
        "note": "VPNゲートウェイ"
      }
    ]
  }
}
```

### 3. 外部プロキシ経由のリクエストのみ許可

**シナリオ**: リバースプロキシ経由のみアクセス可能

```json
{
  "trustedIps": {
    "deploymentType": "all",
    "addresses": [
      {
        "value": "198.51.100.50",
        "note": "リバースプロキシ"
      }
    ]
  }
}
```

### 4. 複数の拠点からのアクセス

**シナリオ**: グローバル企業で複数のオフィスからアクセス

```json
{
  "trustedIps": {
    "deploymentType": "prod_deployment_urls_and_all_previews",
    "addresses": [
      {
        "value": "203.0.113.0/24",
        "note": "東京オフィス"
      },
      {
        "value": "198.51.100.0/24",
        "note": "ニューヨークオフィス"
      },
      {
        "value": "192.0.2.0/24",
        "note": "ロンドンオフィス"
      }
    ]
  }
}
```

## 複数の保護方法との組み合わせ

### Trusted IPs + Vercel認証

```json
{
  "trustedIps": {
    "deploymentType": "all",
    "addresses": [
      {
        "value": "203.0.113.0/24",
        "note": "Office network"
      }
    ]
  },
  "ssoProtection": {
    "deploymentType": "all"
  }
}
```

**効果**: オフィスネットワークからアクセスし、かつVercelアカウントでログインしているユーザーのみアクセス可能

### Trusted IPs + パスワード保護

```json
{
  "trustedIps": {
    "deploymentType": "all",
    "addresses": [
      {
        "value": "203.0.113.0/24",
        "note": "Office network"
      }
    ]
  },
  "passwordProtection": {
    "deploymentType": "all",
    "password": "strong-password"
  }
}
```

**効果**: オフィスネットワークからアクセスし、かつパスワードを入力したユーザーのみアクセス可能

## トラブルシューティング

### 問題1: アクセスが拒否される

**確認事項**:
- [ ] 現在のIPアドレスが許可リストに含まれているか
- [ ] CIDRレンジが正しく設定されているか
- [ ] VPNに接続しているか（VPNが必要な場合）

**解決策**:
```bash
# 現在のIPアドレスを確認
curl https://api.ipify.org

# 許可リストに追加されているか確認
# プロジェクト設定 > デプロイメント保護 > Trusted IPs
```

### 問題2: 動的IPアドレスの問題

**原因**: ISPが動的IPアドレスを割り当てている

**解決策**:
1. **VPNを使用**: 静的IPアドレスを提供するVPNサービス
2. **広いCIDRレンジ**: より広いIPレンジを許可（セキュリティリスクあり）
3. **他の保護方法**: パスワード保護やVercel認証を代わりに使用

### 問題3: IPv6アドレス

**原因**: IPv6はサポートされていない

**解決策**:
1. IPv4アドレスを使用
2. IPv4を強制する設定を有効化
3. または、他の保護方法を使用

### 問題4: 404エラーが表示される

**原因**: IPアドレスが許可リストに含まれていない

**説明**: Trusted IPsでブロックされたアクセスは、セキュリティ上の理由から404エラーを返します（403ではなく）。

**解決策**:
1. 現在のIPアドレスを確認
2. 許可リストにIPアドレスを追加

## ベストプラクティス

### 1. メモの活用

各IPアドレスに分かりやすいメモを追加：

```json
{
  "addresses": [
    {
      "value": "203.0.113.0/24",
      "note": "本社オフィス - 東京"
    },
    {
      "value": "198.51.100.10",
      "note": "VPNゲートウェイ - NordVPN"
    }
  ]
}
```

### 2. 定期的なレビュー

- 月次または四半期ごとにTrusted IPsリストを確認
- 不要なIPアドレスを削除
- 新しいオフィスやVPNを追加

### 3. 最小権限の原則

- 必要最小限のIPアドレス/レンジのみを許可
- 広すぎるCIDRレンジは避ける（例：`0.0.0.0/0`）

### 4. 多層防御

Trusted IPsを他の保護方法と組み合わせる：

```json
{
  "trustedIps": { ... },
  "ssoProtection": { ... }
}
```

## セキュリティのヒント

### IPスプーフィング対策

- Trusted IPsはEdgeレベルで適用される
- IPスプーフィングは実質的に不可能
- 信頼できる保護レイヤー

### ログとモニタリング

- アクティビティログでTrusted IPs設定の変更を追跡
- 不正なアクセス試行を監視
- 異常なパターンを検出

### コンプライアンス

- 規制要件に応じてIPベースの制限を実装
- 監査証跡として設定変更を記録
- コンプライアンスレポートに含める

## 関連リソース

- [デプロイメント保護](/docs/deployment-protection)
- [デプロイメント保護の方法](/docs/deployment-protection/methods-to-protect-deployments)
- [Vercel認証](/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication)
- [パスワード保護](/docs/deployment-protection/methods-to-protect-deployments/password-protection)
- [Vercelファイアウォール](/docs/vercel-firewall)
- [セキュリティベストプラクティス](/docs/security)
