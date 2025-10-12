# キャッシング

EAS Hostingでのキャッシング戦略と実装方法を説明します。

## キャッシングの概要

効果的なキャッシングにより、パフォーマンスが向上し、サーバー負荷が軽減されます。EAS Hostingは、ブラウザキャッシュとCDNキャッシュの両方をサポートしています。

## APIルートのキャッシング

### 基本的なキャッシング

`Cache-Control`ヘッダーを使用してキャッシング動作を指定します：

```typescript
// app/api/data+api.ts
export async function GET(request: Request) {
  const data = await fetchData();

  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
```

この設定では：
- レスポンスは1時間（3600秒）キャッシュされます
- ブラウザとCDNの両方でキャッシュされます

## キャッシュ可能性ディレクティブ

### public

```typescript
'Cache-Control': 'public, max-age=3600'
```

- **使用場面**: すべてのユーザーに同じレスポンス
- **動作**: ブラウザとCDN両方でキャッシュ可能
- **例**: 公開API、静的データ

### private

```typescript
'Cache-Control': 'private, max-age=3600'
```

- **使用場面**: ユーザー固有のデータ
- **動作**: ユーザーのブラウザのみでキャッシュ
- **例**: ユーザープロファイル、個人設定

### no-store

```typescript
'Cache-Control': 'no-store'
```

- **使用場面**: 機密データ、リアルタイムデータ
- **動作**: キャッシュなし
- **例**: 金融取引、認証トークン

### no-cache

```typescript
'Cache-Control': 'no-cache'
```

- **使用場面**: 常に検証が必要なデータ
- **動作**: キャッシュされるが、使用前に検証が必要
- **例**: 定期的に更新されるデータ

## キャッシングヘッダー

### Cache-Control

ブラウザとEAS Hosting CDN両方に影響：

```typescript
export async function GET(request: Request) {
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=7200'
    }
  });
}
```

ディレクティブの説明：
- `max-age=3600`: ブラウザキャッシュは1時間
- `s-maxage=7200`: CDNキャッシュは2時間

### CDN-Cache-Control

EAS Hosting CDNのみを対象：

```typescript
export async function GET(request: Request) {
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=300',
      'CDN-Cache-Control': 'public, max-age=7200'
    }
  });
}
```

この設定では：
- ブラウザ: 5分間キャッシュ
- CDN: 2時間キャッシュ

## 有効期限戦略

### max-age

レスポンスがキャッシュに保持される期間：

```typescript
// 1時間キャッシュ
'Cache-Control': 'public, max-age=3600'

// 1日キャッシュ
'Cache-Control': 'public, max-age=86400'

// 1週間キャッシュ
'Cache-Control': 'public, max-age=604800'
```

### stale-while-revalidate

古いコンテンツを提供しながら、バックグラウンドで更新：

```typescript
export async function GET(request: Request) {
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300'
    }
  });
}
```

動作：
1. 60秒間は新鮮なレスポンスを提供
2. 60-360秒の間は古いレスポンスを提供しつつ、バックグラウンドで更新
3. 360秒後は新しいレスポンスを取得

### stale-if-error

APIルート失敗時のフォールバック：

```typescript
export async function GET(request: Request) {
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=300, stale-if-error=3600'
    }
  });
}
```

動作：
- 通常は5分間キャッシュ
- エラー発生時は、最大1時間古いキャッシュを提供

## アセットキャッシング

### デフォルトキャッシュ

デプロイメントアセットのデフォルト設定：
- **ブラウザキャッシュ**: 3600秒（1時間）
- **内部キャッシュ**: 無期限

### カスタムアセットキャッシング

静的アセットのキャッシング設定：

```typescript
// public/images/logo.png
// 自動的に長期キャッシュが適用される
```

EAS Hostingは自動的に：
- 長期キャッシュヘッダーを追加
- コンテンツハッシュでバージョン管理
- 効率的な無効化を実現

## 実用的なキャッシングパターン

### パターン1: 静的API

```typescript
// ほとんど変更されないデータ
export async function GET(request: Request) {
  const staticData = await getStaticData();

  return Response.json(staticData, {
    headers: {
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800'
    }
  });
}
```

### パターン2: 動的API

```typescript
// 頻繁に更新されるデータ
export async function GET(request: Request) {
  const dynamicData = await getDynamicData();

  return Response.json(dynamicData, {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300'
    }
  });
}
```

### パターン3: ユーザー固有データ

```typescript
// ユーザー固有のデータ
export async function GET(request: Request) {
  const userId = await getUserId(request);
  const userData = await getUserData(userId);

  return Response.json(userData, {
    headers: {
      'Cache-Control': 'private, max-age=300'
    }
  });
}
```

### パターン4: リアルタイムデータ

```typescript
// リアルタイムデータ（キャッシュなし）
export async function GET(request: Request) {
  const realtimeData = await getRealtimeData();

  return Response.json(realtimeData, {
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}
```

## キャッシュとクォータ

### 重要な注意事項

> キャッシュされたリクエストもリクエストクォータにカウントされます。

これは以下を意味します：
- CDNキャッシュヒットもカウント対象
- メトリクスは通常のリクエストと同様に追跡
- キャッシング戦略でコストを最適化

## キャッシュの無効化

### 新しいデプロイメント

新しいデプロイメントにより：
- すべてのアセットURLが変更されます
- 古いキャッシュが自動的に無効化されます
- 新しいキャッシュポリシーが適用されます

### 手動無効化

特定のキャッシュを無効化するには：
1. 新しいバージョンをデプロイ
2. URLパラメータでバージョン管理
3. APIレスポンスでキャッシュ制御を調整

## パフォーマンスの最適化

### ヒット率の向上

```typescript
// 長期キャッシュで高いヒット率を実現
export async function GET(request: Request) {
  const cacheableData = await getCacheableData();

  return Response.json(cacheableData, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'CDN-Cache-Control': 'public, max-age=604800'
    }
  });
}
```

### 段階的なキャッシュ戦略

```typescript
// 多層キャッシング
const headers = {
  'Cache-Control': 'public, max-age=60',           // ブラウザ: 1分
  'CDN-Cache-Control': 'public, max-age=3600',     // CDN: 1時間
};
```

## デバッグとモニタリング

### キャッシュステータスの確認

ブラウザ開発者ツールで：
1. Network タブを開く
2. リクエストを選択
3. Response Headers を確認
4. `Cache-Control`と`Age`ヘッダーを確認

### キャッシュパフォーマンスの測定

EAS Hostingダッシュボードで：
- キャッシュヒット率を確認
- レスポンス時間を監視
- CDNパフォーマンスを分析

## ベストプラクティス

1. **適切なキャッシュ時間**: データの更新頻度に基づいて設定
2. **段階的キャッシング**: ブラウザとCDNで異なる期間を設定
3. **エラーハンドリング**: `stale-if-error`でフォールバックを提供
4. **バックグラウンド更新**: `stale-while-revalidate`で UX を向上
5. **プライバシー保護**: ユーザー固有データには`private`を使用

## 次のステップ

- [レスポンスとヘッダーの最適化](/frameworks/expo/docs/eas/hosting/reference/responses-and-headers)
- [Worker ランタイムの理解](/frameworks/expo/docs/eas/hosting/reference/worker-runtime)
- [APIルートの監視](/frameworks/expo/docs/eas/hosting/api-routes)
