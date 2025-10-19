# ISR 制限と料金

Incremental Static Regeneration（ISR）の使用制限と料金体系について説明します。

## 料金の概要

ISRの料金は、プランと特定のパラメータによって異なります。

### 課金対象

ISRでは、以下の3つの要素に対して課金されます:

1. **Image Transformations（画像変換）**
2. **Image Cache Reads（画像キャッシュ読み込み）**
3. **Image Cache Writes（画像キャッシュ書き込み）**

## Hobbyプランの使用制限

### 月間無料枠

| リソース | 無料枠 |
|---------|-------|
| Image Transformations | 5,000回 |
| Image Cache Reads | 300,000回 |
| Image Cache Writes | 100,000回 |

### 制限超過時の動作

- 無料枠を超えると、最適化が失敗します
- 個人的な非商用利用のみが対象

## 料金の詳細

### 測定と課金

ISRの読み込みと書き込みは、リージョンごとに価格設定されます。

### 測定単位

**8KBを単位として測定**:

- **Read Unit（読み込みユニット）**: ISRキャッシュから読み込まれる8KBのデータ
- **Write Unit（書き込みユニット）**: ISRキャッシュに書き込まれる8KBのデータ

### 課金タイミング

**使用時にのみ課金**:
- プロジェクト内の総画像数ではなく、実際に使用された画像に対してのみ課金

## Image Transformation（画像変換）の課金

### 課金対象

画像変換は、以下の場合に課金されます:

- **Cache MISS**: キャッシュにレスポンスが存在しない
- **Cache STALE**: キャッシュが古くなっている

### キャッシュキー

キャッシュキーは、以下の入力に基づいて生成されます:

- 画像URL
- 幅（width）
- 品質（quality）
- フォーマット（format）

**例**:

```typescript
// これらは異なるキャッシュキーを生成
<Image src="/photo.jpg" width={800} height={600} />
<Image src="/photo.jpg" width={400} height={300} />
```

## Image Cache Reads（画像キャッシュ読み込み）

### 測定方法

- **8KBユニット**で測定
- Cache HITの場合は課金されません

### 最近アクセスされた画像

同じリージョン内で最近アクセスされた画像は、追加コストが発生しません。

### 課金例

```
画像サイズ: 24KB
読み込みユニット: 3ユニット（24KB ÷ 8KB = 3）
```

## Image Cache Writes（画像キャッシュ書き込み）

### 測定方法

- **8KBユニット**で測定
- Cache MISSとCache STALEの場合に課金

### 課金例

```
画像サイズ: 40KB
書き込みユニット: 5ユニット（40KB ÷ 8KB = 5）
```

## ストレージ

### 制限

**ISRのストレージに制限はありません**

### キャッシュの有効期限

- キャッシュされたデータは、指定された期間保持されます
- 31日間アクセスがない場合、キャッシュは無効化されます

## ISRキャッシュリージョン

### リージョンの決定

ISRキャッシュリージョンは、ビルド時に決定されます。

**基準**:
- デフォルトのFunctionリージョンに基づく

### 推奨事項

**ユーザーベースに近いリージョンを設定**することを推奨します。

**Next.js設定例**:

```javascript
// next.config.js
module.exports = {
  // 関数のデフォルトリージョンを設定
  env: {
    VERCEL_REGION: 'iad1', // Washington D.C.
  },
};
```

## 追加料金

### Fast Data Transfer（高速データ転送）

変換された画像の配信に対して課金されます。

### Edge Requests（エッジリクエスト）

変換された画像のリクエストに対して課金されます。

## 最適化戦略

### 1. 長い時間ベースの再検証を設定

めったに変更されないコンテンツには、長い再検証時間を設定します。

```typescript
export const revalidate = 86400; // 24時間
```

### 2. オンデマンド再検証の活用

特定の更新イベントに対してのみ再検証を実行します。

```typescript
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  // コンテンツが実際に変更された場合のみ再検証
  const { updated } = await request.json();

  if (updated) {
    revalidatePath('/blog');
  }

  return Response.json({ success: true });
}
```

### 3. コンテンツの変更検出

コンテンツが変更されていない場合、書き込みユニットは課金されません。

**ベストプラクティス**:
- データの変更を検出してから再検証を実行
- 不必要な再検証を避ける

## 予期しない書き込みのデバッグ

### 非決定的な出力を避ける

以下のようなコードは、毎回異なる出力を生成するため、避けてください:

```typescript
// ❌ 避けるべき例
export default async function Page() {
  return (
    <div>
      <p>Current time: {new Date().toISOString()}</p>
      <p>Random number: {Math.random()}</p>
    </div>
  );
}
```

**理由**:
- `new Date()`や`Math.random()`は、実行ごとに異なる値を生成
- キャッシュが常に「変更された」と判断される
- 不必要な書き込みが発生

### 推奨される実装

```typescript
// ✅ 推奨される例
export const revalidate = 60;

export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  const result = await data.json();

  return (
    <div>
      <p>Last updated: {result.timestamp}</p>
      <p>Content: {result.content}</p>
    </div>
  );
}
```

## モニタリング

### 使用量の確認

ISRの読み込み/書き込みチャートは、以下でグループ化できます:

1. **Projects（プロジェクト別）**
2. **Regions（リージョン別）**

### ダッシュボードでの確認

1. Vercelダッシュボードにログイン
2. Usageタブを選択
3. ISRメトリクスを確認

### アラート設定

**Pro/Enterpriseプラン**:
- 使用量が制限に近づくとメールアラートを受信
- Spend Managementの設定が可能
- Webhookの設定またはプロジェクトの一時停止が可能

## Hobbyプランの制限

### 制限超過時の動作

1. 無料枠を超えると最適化が失敗
2. 既存のキャッシュは引き続き配信される
3. 新しい最適化リクエストはエラーを返す

### 非商用利用のみ

Hobbyプランは、個人的な非商用利用のみが対象です。

## Pro/Enterpriseプランの機能

### Spend Management（支出管理）

- 支出しきい値の設定
- アラート通知
- 自動プロジェクト一時停止

### 使用量アラート

使用量が制限に近づくと、メールアラートを受信します。

### Webhookの設定

使用量イベントに対するWebhookを設定できます。

## 技術的制限

### 最大変換画像サイズ

**10MB**

### ソース画像の最大幅/高さ

**8192ピクセル**

### サポートされているフォーマット

- JPEG
- PNG
- WebP
- AVIF

## ベストプラクティス

### 1. 適切な再検証間隔の設定

コンテンツの更新頻度に基づいて、適切な間隔を設定します。

### 2. オンデマンド再検証の活用

コンテンツが実際に変更された場合のみ再検証を実行します。

### 3. 非決定的な出力の排除

`new Date()`や`Math.random()`などの使用を避けます。

### 4. モニタリングの実施

定期的に使用量を確認し、コストを最適化します。

### 5. キャッシュ戦略の最適化

適切なキャッシュタグとパスを使用して、効率的な再検証を実現します。

## まとめ

ISRの料金体系を理解し、適切な最適化戦略を実装することで、コストを管理しながら高いパフォーマンスを維持できます。使用量のモニタリングと、非決定的な出力の排除が、コスト最適化の鍵となります。
