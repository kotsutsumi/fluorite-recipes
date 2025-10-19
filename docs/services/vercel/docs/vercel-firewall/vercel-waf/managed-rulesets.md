# WAF マネージドルールセット

マネージドルールセットは、[Open Worldwide Application Security Project (OWASP) Top Ten](https://owasp.org/www-project-top-ten/)などの標準に基づいて事前定義されたWAFルールのコレクションで、プロジェクトのファイアウォールダッシュボードで有効化および設定できます。

## 現在利用可能なルールセット

- [OWASPコアルールセット](#owaspコアルールセットの設定)
- [ボット保護マネージドルールセット](#ボット保護マネージドルールセットの設定)
- [AIボットマネージドルールセット](#aiボットマネージドルールセットの設定)

## アクセスロール

- ファイアウォール概要ページを表示するには、[開発者](/docs/rbac/access-roles#developer-role)または閲覧者（[Viewer Pro](/docs/rbac/access-roles#viewer-pro-role)または[Viewer Enterprise](/docs/rbac/access-roles#viewer-enterprise-role)）である必要があります
- ルールと設定を構成、保存、適用するには、[プロジェクト管理者](/docs/rbac/access-roles#project-administrators)または[チームメンバー](/docs/rbac/access-roles#member-role)である必要があります

## OWASPコアルールセットの設定

OWASPコアルールセットは[エンタープライズプラン](/docs/plans/enterprise)で利用可能です。[料金情報はこちら](/docs/security/vercel-waf/usage-and-pricing#managed-ruleset-pricing)。

### OWASPコアルールセットとは

OWASP Core Rule Set（CRS）は、Web アプリケーションを保護するための汎用的な攻撃検出ルールのセットです。以下の脅威から保護します：

- SQLインジェクション
- クロスサイトスクリプティング（XSS）
- ローカルファイルインクルージョン（LFI）
- リモートファイルインクルージョン（RFI）
- リモートコード実行（RCE）
- PHPインジェクション攻撃
- HTTPプロトコル違反
- その他のOWASP Top 10の脅威

### OWASPルールセットを設定するには

1. [プロジェクトダッシュボード](/docs/projects/project-dashboard)からファイアウォールタブを選択
2. 「Configure」を選択
3. 「Managed Rulesets」セクションまでスクロール
4. 「OWASP Core Rule Set」で「Enable」を選択
5. パラノイアレベルを選択（1-4）
   - **レベル1**: 基本的な保護、誤検知が最も少ない
   - **レベル2**: 中程度の保護、バランスの取れた設定
   - **レベル3**: 厳格な保護、誤検知の可能性が高まる
   - **レベル4**: 最大限の保護、誤検知のリスクが最も高い
6. アクションを選択：
   - **Log**: リクエストを記録し、通過させる（テスト推奨）
   - **Challenge**: ブラウザチャレンジを要求
   - **Deny**: リクエストをブロック
7. 「Save」を選択
8. 「Review Changes」で変更を確認
9. 「Publish」で本番環境に適用

### パラノイアレベルの選択

| レベル | 保護レベル | 誤検知リスク | 推奨用途 |
|--------|----------|------------|---------|
| 1 | 基本 | 低 | 一般的なWebサイト |
| 2 | 中 | 中 | 多くのアプリケーション |
| 3 | 高 | 高 | セキュリティ重視のアプリ |
| 4 | 最大 | 非常に高 | 極めて機密性の高いアプリ |

### ベストプラクティス

1. **ログモードから開始**: 最初は「Log」アクションで有効化し、1-2週間監視
2. **段階的に厳格化**: レベル1から始めて、問題がなければ徐々にレベルを上げる
3. **誤検知の確認**: ファイアウォールログを定期的にチェック
4. **例外ルールの作成**: 正当なトラフィックがブロックされる場合は、バイパスルールを作成

## ボット保護マネージドルールセットの設定

ボット保護マネージドルールセットは、悪意のあるボットからアプリケーションを保護します。

### 保護される脅威

- スクレイピングボット
- ブルートフォース攻撃
- クレデンシャルスタッフィング
- インベントリ買い占め
- コンテンツスクレイピング
- 不正なボット

### 設定方法

1. ファイアウォールタブで「Configure」を選択
2. 「Managed Rulesets」セクションで「Bot Protection」を選択
3. 「Enable」を選択
4. アクションを選択（Log、Challenge、Deny）
5. 「Save」して「Publish」

### 既知の良いボットの扱い

以下のような正当なボットは自動的に許可されます：

- 検索エンジンクローラー（Google、Bing、Yahoo等）
- ソーシャルメディアボット
- モニタリングサービス
- Webhookプロバイダー

## AIボットマネージドルールセットの設定

AIボットマネージドルールセットは、AIモデルのトレーニングやデータ収集を目的とするボットをブロックします。

### 対象となるボット

- AIモデルトレーニング用のクローラー
- データ収集ボット
- 大規模言語モデル（LLM）のトレーニングボット
- 無断のコンテンツ取得ボット

### 設定方法

1. ファイアウォールタブで「Configure」を選択
2. 「Managed Rulesets」セクションで「AI Bot Protection」を選択
3. 「Enable」を選択
4. アクションを選択（Log、Challenge、Deny）
5. 「Save」して「Publish」

## カスタムルールとの併用

マネージドルールセットとカスタムルールを組み合わせることで、より柔軟な保護が可能です。

### マネージドルールセットのバイパス

特定の条件でマネージドルールセットをバイパスする：

```
IF path starts with /api/public
AND user-agent contains "TrustedBot"
THEN bypass
```

このバイパスルールを、マネージドルールセットより上位に配置します。

### カスタムルールのバイパス

独自のカスタムルールをバイパスする場合：

```
IF IP address is in list [203.0.113.0/24]
THEN bypass
```

## ルールセットの無効化

マネージドルールセットを無効にする：

1. ファイアウォールタブで「Configure」を選択
2. 該当するマネージドルールセットを見つける
3. 「Disable」を選択
4. 「Save」して「Publish」

## モニタリングと調整

### ファイアウォールログの確認

1. ファイアウォールタブで「Logs」を選択
2. マネージドルールセットによってトリガーされたイベントをフィルタリング
3. 誤検知がないか確認

### 誤検知への対応

正当なトラフィックがブロックされている場合：

1. ログで具体的なルールを特定
2. バイパスルールを作成して特定の条件を除外
3. パラノイアレベルを下げる（OWASPの場合）
4. アクションを「Deny」から「Challenge」に変更

## 使用例

### ECサイトの保護

```
OWASP CRS: Level 2, Challenge
Bot Protection: Enabled, Challenge
AI Bot Protection: Enabled, Deny
```

### API エンドポイントの保護

```
OWASP CRS: Level 3, Deny
Bot Protection: Enabled, Deny
Custom Rule: 信頼できるAPIクライアントをバイパス
```

### コンテンツサイトの保護

```
OWASP CRS: Level 1, Log
Bot Protection: Enabled, Challenge
AI Bot Protection: Enabled, Deny
Custom Rule: 検索エンジンクローラーをバイパス
```

## 制限事項

- OWASPコアルールセットはEnterpriseプランのみ
- ボット保護とAIボット保護はすべてのプランで利用可能
- 複数のマネージドルールセットを同時に有効化可能
- ルールセットの詳細な設定変更は不可（パラノイアレベルとアクションのみ）

詳細については、[Usage and Pricing](/docs/security/vercel-waf/usage-and-pricing)を参照してください。
