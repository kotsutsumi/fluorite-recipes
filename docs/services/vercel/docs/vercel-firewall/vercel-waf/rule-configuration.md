# ルール設定リファレンス

各カスタムルールに対して、着信トラフィックの[パラメータ](#パラメータ)から1つ以上の条件を設定し、特定の値と[演算子](#演算子)を使用して比較できます。新しい条件ごとに、AND（両方の条件を満たす）またはOR（いずれかの条件を満たす）演算子を使用して、前の条件と組み合わせる方法を選択できます。

また、すべての条件が満たされた場合に実行される[アクション](#アクション)を指定します。

## パラメータ

### カスタムルールパラメータ

| パラメータ | 説明 | 例 | 注意 |
|-----------|------|------|------|
| リクエストパス | 着信リクエストの完全なパス。常に先頭に `/` が付く | `/api`, `/signup/new` | |
| ルート | フレームワークが決定した `x-matched-path` | `/blog/[slug]` | ルートに一致する場合、ミドルウェア後にカスタムルールが実行されます |
| サーバーアクション名 | コードベースで定義されたNext.jsサーバーアクション名 | `app/auth/actions.ts#getUser` | Next.js 15.5以降が必要 |
| 生パス | フレームワークレベルでの解析や正規化を無視した生のリクエストパス | `/api/`, `/signup/new/` | |
| メソッド | リクエストに使用されたHTTPメソッド | `GET`, `POST` | |
| ユーザーエージェント | リクエストに使用されたHTTPユーザーエージェント | `curl/7.64.1`, `Mozilla/5.0` | |
| ホスト | リクエストのホスト名 | `example.com` | |
| クエリ文字列 | URLのクエリ文字列部分 | `?search=test&page=1` | |
| Cookie | リクエストのCookie | `session=abc123` | |
| ヘッダー | HTTPヘッダー | `Authorization: Bearer token` | |
| IPアドレス | クライアントのIPアドレス | `192.0.2.1` | |
| 国 | IPアドレスから判定した国コード | `US`, `JP` | ISO 3166-1 alpha-2 |
| ASN | 自律システム番号 | `AS15169` (Google) | |
| JA3指紋 | TLSクライアント指紋 | `e7d705a3286e19ea42f587b344ee6865` | |
| JA4指紋 | 改良版TLS指紋 | `t13d1516h2_8daaf6152771_02713d6af862` | |

## 演算子

各パラメータに対して、以下の演算子を使用できます：

| 演算子 | 説明 | 例 |
|--------|------|-----|
| Equals | 完全一致 | パス equals `/api/login` |
| Does not equal | 完全不一致 | メソッド does not equal `GET` |
| Contains | 部分一致 | ユーザーエージェント contains `bot` |
| Does not contain | 部分不一致 | パス does not contain `/admin` |
| Starts with | 前方一致 | パス starts with `/api/` |
| Ends with | 後方一致 | パス ends with `.json` |
| Matches regex | 正規表現一致 | パス matches regex `^/api/v[0-9]+/` |
| Does not match regex | 正規表現不一致 | パス does not match regex `\\.xml$` |
| Is in list | リストに含まれる | 国 is in list `[CN, RU, KP]` |
| Is not in list | リストに含まれない | IPアドレス is not in list `[192.0.2.0/24]` |
| Is empty | 空である | Cookie is empty |
| Is not empty | 空でない | ヘッダー "Authorization" is not empty |

## アクション

条件が満たされた場合に実行されるアクション：

| アクション | 説明 | HTTPステータス |
|-----------|------|---------------|
| Log | リクエストを記録し、通過させる | - |
| Deny | リクエストをブロック | 403 Forbidden |
| Challenge | ブラウザチャレンジを要求 | - |
| Bypass | 他のルールをスキップ | - |
| Rate Limit | レート制限を適用 | 429 Too Many Requests |
| Redirect | 別のURLにリダイレクト | 301/302 |

### 永続的アクション（Pro/Enterprise）

特定の期間、IPアドレスをブロックし続ける：

- 1時間
- 24時間
- 7日間
- カスタム期間

## ルール設定の例

### 管理者パスの保護

```
IF path starts with /admin
AND IP address is not in list [203.0.113.0/24]
THEN deny
```

### API レート制限

```
IF path starts with /api
THEN rate limit (100 requests per minute, by IP address)
```

### 疑わしいボットのチャレンジ

```
IF user-agent contains "bot"
AND JA3 fingerprint does not match regex ^[a-f0-9]{32}$
THEN challenge
```

### 特定の国からのアクセスブロック

```
IF country is in list [XX, YY, ZZ]
AND path does not start with /public
THEN deny for 24 hours
```

## ベストプラクティス

1. **テストから始める**: 新しいルールは最初に「Log」アクションで作成し、影響を確認
2. **明確な条件**: できるだけ具体的な条件を設定し、誤検知を防ぐ
3. **順序に注意**: バイパスルールを最初に配置し、その後にブロックルールを配置
4. **パフォーマンス**: 複雑な正規表現は避け、シンプルな条件を優先
5. **監視**: ルール適用後は、ファイアウォールログを定期的に確認

詳細な例は[Examples](/docs/security/vercel-waf/examples)を参照してください。
