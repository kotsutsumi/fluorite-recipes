# Vercel Sharable Links - 共有可能リンク

## 概要

Sharable Links（共有可能リンク）は、外部ユーザーが特定のデプロイメントに安全にアクセスできる機能です。

### 対象プラン

すべてのVercelプランで利用可能

### 主な特徴

- Vercelアカウントを持たないユーザーとデプロイメントを共有
- デプロイメントへのコメント機能も含まれる
- セキュアなアクセス制御

## 誰が Sharable Links を作成できるか

### 非本番ドメイン（プレビューデプロイメント）

以下のいずれかの役割が必要：

**チームメンバー:**
- Developer ロール以上

**プロジェクトメンバー:**
- Project Developer ロール以上

### 本番ドメイン

以下のいずれかの役割が必要：

**チームメンバー:**
- Member ロール以上

**プロジェクトメンバー:**
- Project Administrator ロール

## Sharable Links の作成手順

### ダッシュボードから作成

1. Vercelダッシュボードにログイン
2. 共有したいプロジェクトを選択
3. 「デプロイメント」タブに移動
4. 共有したいデプロイメントを選択
5. 右上の「Share」ボタンをクリック
6. ドロップダウンメニューから「Anyone with the link」を選択
7. リンクが自動的に生成されます
8. 「Copy Link」をクリックしてリンクをコピー

### APIから作成

```bash
curl -X POST "https://api.vercel.com/v1/deployments/DEPLOYMENT_ID/sharable-link" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**レスポンス**:
```json
{
  "id": "sharable_xxxxxxxxxxxxx",
  "url": "https://your-deployment.vercel.app?sharable-link=xxxxxxxxxxxxx",
  "createdAt": 1234567890000
}
```

## Sharable Links の使用方法

### リンクの共有

生成されたリンクを、以下の方法で共有できます：

- メール
- Slack、Microsoft Teamsなどのメッセージングアプリ
- プロジェクト管理ツール（Jira、Asana等）
- その他のコミュニケーションチャネル

### リンクの形式

```
https://your-deployment.vercel.app?sharable-link=xxxxxxxxxxxxx
```

**注意**: クエリパラメータ`sharable-link`が含まれています。

## コメント機能

### コメントの有効化

Sharable Linksでアクセスしたユーザーは、デプロイメントにコメントを残すことができます。

#### コメント機能の使用方法

1. Sharable Linkでデプロイメントにアクセス
2. ページの右下にコメントアイコンが表示されます
3. アイコンをクリックしてコメントを追加
4. コメントは特定の要素に紐付けることができます

#### コメントの管理

プロジェクトメンバーは、以下の操作が可能：

- コメントの閲覧
- コメントへの返信
- コメントの解決
- コメントの削除

### コメント通知

新しいコメントが追加されると、プロジェクトメンバーに通知されます：

- メール通知
- Vercelダッシュボード内の通知

## Sharable Links の管理

### リンクの確認

現在のSharable Linksは、プロジェクト設定で確認できます：

1. プロジェクト設定に移動
2. 「デプロイメント保護」タブを選択
3. 「アクセス」タブをクリック
4. 「All Access」セクションを展開
5. 「Sharable Links」で現在のリンクを確認

### リンクの無効化

Sharable Linkを無効化する方法：

#### 方法1: ダッシュボードから無効化

1. デプロイメントページに移動
2. 「Share」ボタンをクリック
3. 「Anyone with the link」から「Team members only」に変更

#### 方法2: APIから無効化

```bash
curl -X DELETE "https://api.vercel.com/v1/deployments/DEPLOYMENT_ID/sharable-link/LINK_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### リンクの再生成

既存のSharable Linkを無効化して新しいリンクを生成：

1. 既存のリンクを無効化
2. 新しいリンクを作成（上記の作成手順を参照）

## 制限事項

### Hobbyプランの制限

Hobbyプランの開発者は、以下の制限があります：

- **アカウントごとに1つのSharable Linkのみ作成可能**
- 複数のデプロイメントで共有リンクを使用する場合、既存のリンクを無効化する必要があります

### ProおよびEnterpriseプラン

- Sharable Linksの数に制限なし
- 複数のデプロイメントで同時に使用可能

## セキュリティ考慮事項

### アクセス制御

- **リンクを知っている人は誰でもアクセス可能**
- リンクは秘密に保つべき
- 必要がなくなったらリンクを無効化

### ベストプラクティス

1. **最小限のアクセス**: 必要な人にのみリンクを共有
2. **定期的な見直し**: 不要になったリンクは削除
3. **機密情報**: 機密情報を含むデプロイメントは慎重に共有
4. **有効期限**: 長期間使用しないリンクは無効化

## ユースケース

### 1. クライアントレビュー

**シナリオ**: クライアントにプレビューデプロイメントを共有してフィードバックを収集

```
1. プレビューデプロイメントを作成
2. Sharable Linkを生成
3. クライアントにリンクを送信
4. クライアントがコメント機能でフィードバック
5. フィードバックに基づいて修正
```

### 2. ステークホルダーレビュー

**シナリオ**: 社内のステークホルダー（非開発者）にデプロイメントを共有

```
1. 新機能のプレビューデプロイメント作成
2. Sharable Linkを生成
3. プロダクトマネージャー、デザイナー、マーケティングチームに共有
4. 各ステークホルダーがコメントでフィードバック
```

### 3. 外部パートナーとの協業

**シナリオ**: 統合パートナーとAPIの動作確認

```
1. API統合のプレビューデプロイメント作成
2. Sharable Linkを生成
3. パートナー企業の開発者に共有
4. パートナーがテストと確認
```

### 4. QAチーム

**シナリオ**: 外部QAチームにテスト環境を提供

```
1. テスト用デプロイメント作成
2. Sharable Linkを生成
3. QAチームに共有
4. QAチームがテストとバグ報告
```

## コメント機能の活用

### 効果的なコメント

1. **具体的**: 何が問題か、どこにあるかを明確に
2. **スクリーンショット**: 必要に応じて画像を添付
3. **再現手順**: バグの場合、再現方法を記載
4. **優先度**: 重要度を明記

### コメントのワークフロー

```
1. レビュアーがコメントを追加
   ↓
2. 開発者が通知を受信
   ↓
3. 開発者がコメントを確認
   ↓
4. 開発者が修正を実施
   ↓
5. 開発者がコメントを解決
   ↓
6. レビュアーが確認
```

## トラブルシューティング

### 問題1: リンクが機能しない

**確認事項**:
- [ ] リンクが正しくコピーされているか
- [ ] デプロイメントがまだ存在するか
- [ ] リンクが無効化されていないか

**解決策**:
1. リンクを再生成
2. デプロイメントの状態を確認

### 問題2: コメント機能が表示されない

**確認事項**:
- [ ] Sharable Link経由でアクセスしているか
- [ ] ブラウザの設定でJavaScriptが有効か
- [ ] アドブロッカーが影響していないか

**解決策**:
1. ブラウザのキャッシュをクリア
2. 別のブラウザで試す

### 問題3: Hobbyプランで複数のリンクが作成できない

**原因**: Hobbyプランは1つのSharable Linkのみ許可

**解決策**:
1. 既存のリンクを無効化
2. 新しいリンクを作成
3. または、Proプランにアップグレード

## 実装例

### Next.js での Sharable Link チェック

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sharableLink = request.nextUrl.searchParams.get('sharable-link');

  if (sharableLink) {
    // Sharable Link経由のアクセス
    const response = NextResponse.next();

    // カスタム処理を追加
    response.headers.set('X-Access-Type', 'sharable-link');

    return response;
  }

  return NextResponse.next();
}
```

### アナリティクスでのSharable Link追跡

```javascript
// analytics.js
export function trackSharableLinkAccess() {
  const urlParams = new URLSearchParams(window.location.search);
  const sharableLink = urlParams.get('sharable-link');

  if (sharableLink) {
    // アナリティクスイベントを送信
    analytics.track('Sharable Link Access', {
      link: sharableLink,
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
    });
  }
}
```

## 関連リソース

- [デプロイメント保護](/docs/deployment-protection)
- [デプロイメント保護のバイパス方法](/docs/deployment-protection/methods-to-bypass-deployment-protection)
- [コメント機能](/docs/comments)
- [役割とアクセス制御](/docs/rbac)
