# WAF IP Blocking

Vercelのウェブアプリケーションファイアウォール（WAF）を使用して、特定のIPアドレスをブロックする方法について説明します。

## アクセス権限

- [開発者](/docs/rbac/access-roles#developer-role)または閲覧者（[Viewer Pro](/docs/rbac/access-roles#viewer-pro-role)または[Viewer Enterprise](/docs/rbac/access-roles#viewer-enterprise-role)）は、ファイアウォールの概要ページを表示できます
- [プロジェクト管理者](/docs/rbac/access-roles#project-administrators)または[チームメンバー](/docs/rbac/access-roles#member-role)は、ルールの設定、保存、適用が可能です

## プロジェクトレベルのIPブロック

すべての[プラン](/docs/plans)で利用可能です。

### IPアドレスのブロック方法

IPアドレスをブロックするには、以下の手順に従います：

1. プロジェクトのファイアウォールタブで「設定」を選択
2. IPブロックセクションまでスクロール
3. 「+ IPを追加」ボタンを選択
4. 「新しいドメイン保護の設定」モーダルで必要な情報を入力：
   - **Host**: アクセスをブロックするサイトのドメイン名
     - `https`プレフィックスを除いたURLから値をコピー可能
     - 正確なドメインと一致する必要がある（例：`my-site.com`、`www.my-site.com`）
     - すべてのサブドメインに対して個別のエントリが必要
   - **IP Address or CIDR**: ブロックするIPアドレスまたはCIDR範囲
     - 単一のIPアドレス：`192.0.2.1`
     - CIDR範囲：`192.0.2.0/24`
   - **Note** (オプション): このブロックルールの目的を説明するメモ
5. 「IPブロックルールを作成」ボタンを選択
6. 変更を確認し、「Publish」を選択して適用

### IPアドレスの形式

#### 単一IPアドレス

```
192.0.2.1
2001:db8::1
```

#### CIDR範囲

```
192.0.2.0/24        # 192.0.2.0 ～ 192.0.2.255
203.0.113.0/28      # 203.0.113.0 ～ 203.0.113.15
2001:db8::/32       # IPv6範囲
```

## IPブロックの使用例

### 単一の悪意のあるIPをブロック

```
Host: example.com
IP: 192.0.2.100
Note: Detected malicious activity from this IP
```

### 特定の国のIP範囲をブロック

```
Host: example.com
IP: 203.0.113.0/24
Note: Block traffic from specific ASN
```

### 複数のサブドメインで同じIPをブロック

```
# エントリ1
Host: www.example.com
IP: 192.0.2.50
Note: Spam source

# エントリ2
Host: api.example.com
IP: 192.0.2.50
Note: Spam source
```

## ワイルドカードの使用（カスタムルール）

すべてのドメインに対して一度にIPをブロックする場合は、カスタムルールを使用します：

1. ファイアウォールタブで「Configure」を選択
2. 「+ New Rule」を選択
3. ルールを設定：

```
IF IP address equals 192.0.2.100
THEN deny
```

このルールは、プロジェクトのすべてのドメインに適用されます。

## IPブロックの管理

### ブロックルールの表示

1. プロジェクトのファイアウォールタブに移動
2. 「IP Blocking」セクションを確認
3. すべてのアクティブなIPブロックルールが一覧表示されます

### ブロックルールの編集

1. 編集したいルールの横にある「Edit」をクリック
2. 必要な変更を行う
3. 「Update」をクリックして保存
4. 「Publish」で変更を適用

### ブロックルールの削除

1. 削除したいルールの横にある「Delete」をクリック
2. 削除を確認
3. 「Publish」で変更を適用

## IPブロックとカスタムルールの違い

| 機能 | IPブロック | カスタムルール |
|------|----------|--------------|
| 設定の簡単さ | シンプル | 柔軟 |
| ドメイン指定 | 個別に必要 | ワイルドカード可能 |
| 追加条件 | 不可 | 可能（パス、ヘッダーなど） |
| アクション | ブロックのみ | ログ、拒否、チャレンジ、バイパス |
| 永続的ブロック | 永続的 | 時間制限可能 |

## ベストプラクティス

1. **段階的なアプローチ**: 最初はログモードでテストし、問題ないことを確認してからブロック
2. **明確なドキュメント**: 各ブロックルールにメモを追加し、理由を記録
3. **定期的なレビュー**: 月次でブロックリストを見直し、不要なエントリを削除
4. **CIDR範囲の慎重な使用**: 広すぎる範囲は正当なユーザーもブロックする可能性がある
5. **モニタリング**: ファイアウォールログを確認し、ブロックの影響を監視

## トラブルシューティング

### 正当なユーザーがブロックされている

1. ファイアウォールログでブロックされたIPを確認
2. IPブロックリストとカスタムルールを確認
3. 必要に応じて例外ルールを追加またはブロックを解除

### IPブロックが機能しない

1. IPアドレスまたはCIDR範囲が正しく入力されているか確認
2. ドメイン指定が正しいか確認
3. 変更が公開されているか確認
4. キャッシュの影響を確認（キャッシュクリアまたは数分待つ）

### CIDR範囲の計算

CIDR範囲の計算には、以下のようなツールを使用できます：

- [CIDR Calculator](https://www.ipaddressguide.com/cidr)
- [Subnet Calculator](https://www.subnet-calculator.com/)

## 高度な使用例

### 地理的ブロッキング

特定の国からのアクセスをブロックする場合は、カスタムルールを使用：

```
IF country equals CN
THEN deny
```

### 時間ベースのブロック（Pro/Enterprise）

永続的アクションを使用して、一時的にIPをブロック：

```
IF IP address equals 192.0.2.100
THEN deny for 24 hours
```

### 複数の条件を組み合わせ

```
IF IP address is in list [192.0.2.0/24, 203.0.113.0/24]
AND path starts with /admin
THEN deny
```

詳細については、[Custom Rules](/docs/security/vercel-waf/custom-rules)と[Examples](/docs/security/vercel-waf/examples)を参照してください。
