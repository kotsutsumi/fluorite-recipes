# SAML シングルサインオン (SSO)

## 概要

SAML SSO（Security Assertion Markup Language Single Sign-On）は、サードパーティのIDプロバイダー（Okta、Auth0など）を使用してチームメンバーを管理する機能です。

### 対象プラン

- [Enterpriseプラン](/docs/plans/enterprise)
- [Proプラン](/docs/plans/pro)

### 必要な権限

- [オーナーロール](/docs/rbac/access-roles#owner-role)を持つユーザーのみがこの機能にアクセスできます

## 主な特徴

### シングルサインオン

- サードパーティのIDプロバイダーで一度ログインすれば、Vercelにもアクセス可能
- パスワードを個別に管理する必要がない
- 統一された認証体験

### 自動プロビジョニング

- 新規ユーザーが自動的にチームに追加される
- IDプロバイダーで承認されたユーザーが自動的にVercelにアクセス可能
- 手動でのユーザー招待が不要

### デプロイメントアクセス

- すべてのチームメンバーがプレビューおよび本番デプロイメントにログイン可能
- 統一された認証で簡単にアクセス

## SAML SSOの設定手順

### 前提条件

1. **エンタープライズまたはProプラン**: 適切なプランへの加入
2. **オーナー権限**: チームのオーナーロールが必要
3. **IDプロバイダーアカウント**: Okta、Auth0などのアカウント

### 設定プロセス

#### 1. Vercel側の設定開始

1. チームのオーナーとしてダッシュボードにアクセス
2. 「設定」タブに移動
3. 「セキュリティとプライバシー」セクションを選択
4. SAML シングルサインオンセクションで「設定」をクリック

#### 2. メタデータの取得

Vercelから以下の情報を取得：

- **Entity ID（エンティティID）**: Vercelの一意識別子
- **ACS URL（Assertion Consumer Service URL）**: SAMLレスポンスの受信URL
- **SSO URL**: シングルサインオンURL

#### 3. IDプロバイダーでの設定

選択したIDプロバイダーで新しいSAMLアプリケーションを作成：

1. 新しいSAMLアプリケーションを作成
2. Vercelから取得したメタデータを入力：
   - Entity ID
   - ACS URL
   - SSO URL
3. 属性マッピングを設定：
   - `email`: ユーザーのメールアドレス
   - `firstName`: 名（オプション）
   - `lastName`: 姓（オプション）
4. ユーザーまたはグループを割り当て

#### 4. Vercelでの設定完了

1. IDプロバイダーから以下の情報を取得：
   - **Sign-in URL**: IDプロバイダーのSSO URL
   - **X.509 Certificate**: 署名証明書
2. Vercelダッシュボードに情報を入力
3. 「保存」をクリック
4. テストログインで設定を確認

## SAMLの強制

### 概要

追加のセキュリティのため、チームメンバーにSAML SSOでのみログインを要求できます。

### 設定方法

1. SAML SSOが正しく設定されていることを確認
2. オーナーがSAML SSOで認証済みであることを確認
3. 「セキュリティとプライバシー」設定に移動
4. 「チームメンバーにSAMLでのログインを要求」トグルをオンに設定
5. 確認ダイアログで設定を確認

### 影響

SAML強制を有効にすると：

- すべてのチームメンバーはSAML SSOでのみログイン可能
- メール、GitHub、GitLabなどの他のログイン方法は無効化される
- 新規ユーザーは自動的にSAML SSOを使用

### 注意事項

- **ロックアウトのリスク**: 設定ミスがあると、すべてのユーザーがログインできなくなる可能性があります
- **テストの重要性**: 強制する前に、SAML SSOが正しく機能することを十分にテストしてください
- **緊急アクセス**: ロックアウトされた場合、Vercelサポートに連絡してください

## サポートされているSAMLプロバイダー

### 主要プロバイダー

Vercelは、以下のIDプロバイダーをサポートしています：

#### エンタープライズIDプロバイダー

- **Okta**: エンタープライズIDおよびアクセス管理
- **Auth0**: 柔軟な認証プラットフォーム
- **Google Workspace**: Googleのエンタープライズスイート
- **Microsoft Entra（旧Azure AD）**: Microsoftのクラウドベースのディレクトリサービス
- **Microsoft ADFS**: オンプレミスのActive Directory Federation Services
- **OneLogin**: クラウドベースのIDおよびアクセス管理

#### その他のプロバイダー

以下のプロバイダーもサポートされています：

- JumpCloud
- PingIdentity
- Rippling
- Duo Security
- LastPass
- Centrify
- RSA SecurID
- ForgeRock
- Shibboleth
- SimpleSAMLphp
- その他25以上のSAML 2.0互換プロバイダー

### SAML 2.0互換性

Vercelは、SAML 2.0標準に準拠したすべてのIDプロバイダーと互換性があります。

## 認証プロセス

### ユーザーログインフロー

1. **ユーザーがVercelにアクセス**
   - Vercelログインページにアクセス

2. **SAMLオプションを選択**
   - 「SAMLでSSOを続行」ボタンをクリック

3. **チームURLを入力**
   - チームのURL（例：`my-team`）を入力

4. **IDプロバイダーにリダイレクト**
   - Vercelがユーザーを設定済みのIDプロバイダーにリダイレクト

5. **IDプロバイダーで認証**
   - ユーザーがIDプロバイダーでログイン（すでにログイン済みの場合はスキップ）

6. **Vercelにリダイレクト**
   - 認証成功後、VercelにSAMLレスポンスが送信される

7. **Vercelアクセス許可**
   - Vercelがユーザーを認証し、ダッシュボードへのアクセスを許可

### セッション管理

- SAML SSOのセッションは、IDプロバイダーとVercelの両方で管理されます
- セッションの有効期限は、IDプロバイダーの設定に従います
- ユーザーがIDプロバイダーからログアウトすると、Vercelからもログアウトされます（シングルログアウト）

## 属性マッピング

### 必須属性

Vercelが正しく機能するために、以下の属性が必要です：

| SAML属性 | Vercel属性 | 説明 | 必須 |
|---------|-----------|------|------|
| `email` | メールアドレス | ユーザーの一意識別子 | はい |
| `firstName` | 名 | ユーザーの名 | いいえ |
| `lastName` | 姓 | ユーザーの姓 | いいえ |

### 属性フォーマット

```xml
<saml:AttributeStatement>
  <saml:Attribute Name="email">
    <saml:AttributeValue>user@example.com</saml:AttributeValue>
  </saml:Attribute>
  <saml:Attribute Name="firstName">
    <saml:AttributeValue>John</saml:AttributeValue>
  </saml:Attribute>
  <saml:Attribute Name="lastName">
    <saml:AttributeValue>Doe</saml:AttributeValue>
  </saml:Attribute>
</saml:AttributeStatement>
```

## プロバイダー固有の設定ガイド

### Okta

1. Oktaダッシュボードで「Applications」に移動
2. 「Create App Integration」をクリック
3. 「SAML 2.0」を選択
4. アプリ名を入力（例：「Vercel」）
5. Vercelから取得したメタデータを入力
6. 属性ステートメントを設定
7. ユーザーまたはグループを割り当て

### Auth0

1. Auth0ダッシュボードで「Applications」に移動
2. 「Create Application」をクリック
3. 「Regular Web Applications」を選択
4. 「Addons」タブで「SAML2 Web App」を有効化
5. Vercelから取得したメタデータを入力
6. 属性マッピングを設定

### Google Workspace

1. Google Admin Consoleで「Apps」に移動
2. 「Web and mobile apps」を選択
3. 「Add app」→「Add custom SAML app」をクリック
4. アプリ名を入力
5. Vercelから取得したメタデータを入力
6. 属性マッピングを設定
7. ユーザーまたはOUを割り当て

### Microsoft Entra（Azure AD）

1. Azure Portalで「Enterprise Applications」に移動
2. 「New application」をクリック
3. 「Create your own application」を選択
4. 「Integrate any other application」を選択
5. 「Single sign-on」で「SAML」を選択
6. Vercelから取得したメタデータを入力
7. ユーザーまたはグループを割り当て

## トラブルシューティング

### 問題1: ログインできない

**確認事項**:
- [ ] SAML設定が正しいか
- [ ] IDプロバイダーでユーザーが割り当てられているか
- [ ] 証明書が有効か

**解決策**:
1. SAML設定を再確認
2. IDプロバイダーでユーザーの割り当てを確認
3. 証明書の有効期限を確認

### 問題2: 属性マッピングエラー

**原因**: 必須属性（`email`）が送信されていない

**解決策**:
1. IDプロバイダーの属性マッピング設定を確認
2. `email`属性が正しく設定されているか確認
3. SAMLレスポンスをデバッグ

### 問題3: 証明書エラー

**原因**: X.509証明書が無効または期限切れ

**解決策**:
1. IDプロバイダーから最新の証明書を取得
2. Vercelダッシュボードで証明書を更新
3. テストログインで確認

### 問題4: ロックアウト

**原因**: SAML強制が有効で、設定ミスがある

**解決策**:
1. Vercelサポートに連絡（support@vercel.com）
2. 緊急アクセスを要請
3. SAML設定を修正

## セキュリティベストプラクティス

### 1. 証明書の管理

- X.509証明書を安全に保管
- 証明書の有効期限を追跡
- 期限切れ前に証明書を更新

### 2. SAML強制

- 本番環境で有効化する前に十分にテスト
- 緊急アクセス手順を文書化
- 定期的にSAML設定を確認

### 3. 監査とモニタリング

- SAML認証イベントをログに記録
- 異常なログインパターンを監視
- アクティビティログを定期的に確認

### 4. アクセス制御

- IDプロバイダーで適切なユーザー/グループを割り当て
- 最小権限の原則を適用
- 定期的にアクセス権限を確認

## ユースケース

### 1. エンタープライズセキュリティ

**シナリオ**: 大規模企業で統一された認証を実現

```
メリット:
- 一元化されたユーザー管理
- 強力な認証ポリシー（MFA等）の適用
- 監査証跡の一元管理
```

### 2. コンプライアンス要件

**シナリオ**: SOC2、ISO 27001などのコンプライアンス要件を満たす

```
対応:
- シングルサインオンによるアクセス制御
- 監査ログの記録
- セキュリティポリシーの一元管理
```

### 3. 多要素認証（MFA）

**シナリオ**: すべてのユーザーにMFAを強制

```
実装:
1. IDプロバイダーでMFAを有効化
2. SAML SSOを設定
3. Vercelへのアクセスに自動的にMFAが要求される
```

## ディレクトリ同期との組み合わせ

SAML SSOは、[ディレクトリ同期](/docs/directory-sync)と組み合わせることで、さらに強力なユーザー管理を実現できます：

```
SAML SSO: 認証（誰がログインするか）
ディレクトリ同期: プロビジョニング（誰がアクセスできるか）
```

### 組み合わせのメリット

- 自動的なユーザー追加/削除
- グループベースのロール割り当て
- リアルタイムの同期
- 統一されたユーザー管理

## 関連リソース

- [ディレクトリ同期](/docs/directory-sync)
- [2要素認証](/docs/two-factor-authentication)
- [役割とアクセス制御](/docs/rbac)
- [セキュリティベストプラクティス](/docs/security)
- [アクティビティログ](/docs/activity-log)
