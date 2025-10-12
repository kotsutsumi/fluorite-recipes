# Liveblocks Starter Kit

## 概要

Next.jsとLiveblocksで構築されたリアルタイムコラボレーティブ製品スターターキットです。

**デモ**: https://nextjs-starter-kit.liveblocks.app
**GitHub**: https://github.com/liveblocks/liveblocks/tree/main/starter-kits/nextjs-starter-kit

## 主な機能

- ページネーション、下書き、グループ、自動再検証を備えたドキュメントダッシュボード
- 完全に機能する共有メニューを備えたコラボレーティブホワイトボードアプリ
- GitHub、Google、Auth0などと互換性のある認証
- ドキュメントパーミッションをユーザー、グループ、パブリックにスコープ可能

## 技術スタック

- **フレームワーク**: Next.js
- **リアルタイムコラボレーション**: Liveblocks
- **認証**: NextAuth.js
- **スタイリング**: CSS Modules

## はじめに

### 前提条件

- Liveblocksアカウント
- NextAuth.jsの設定(GitHub、Google、Auth0などのプロバイダー)

### 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください:

```bash
# Liveblocks
LIVEBLOCKS_SECRET_KEY=your_liveblocks_secret_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# OAuth Providers (1つ以上)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
AUTH0_ISSUER=your_auth0_issuer
```

### 依存関係のインストール

```bash
npm install
# または
yarn install
# または
pnpm install
```

### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認してください。

## 機能の詳細

### ドキュメントダッシュボード

リアルタイムコラボレーション機能を備えたドキュメント管理:

- ドキュメントの作成、編集、削除
- ページネーション
- 下書き保存
- グループによる整理
- 自動再検証

### コラボレーティブホワイトボード

リアルタイムで複数ユーザーが同時に作業できるホワイトボード:

- 描画ツール
- 図形ツール
- テキスト挿入
- リアルタイム同期
- カーソル追跡

### 認証システム

NextAuth.jsを使用した柔軟な認証:

- GitHub認証
- Google認証
- Auth0認証
- カスタムプロバイダーのサポート

### パーミッション管理

きめ細かなアクセス制御:

- **ユーザーレベル**: 特定のユーザーにアクセス権を付与
- **グループレベル**: グループのメンバーにアクセス権を付与
- **パブリック**: すべてのユーザーにアクセス可能

```typescript
// パーミッションの設定例
const permissions = {
  read: ['user:123', 'group:team-a'],
  write: ['user:123'],
  admin: ['user:123'],
}
```

### 共有機能

完全に機能する共有メニュー:

- リンク共有
- ユーザー招待
- パーミッション設定
- アクセス制御

## Liveblocks統合

### リアルタイム同期

```typescript
import { useRoom, useMutation } from '@liveblocks/react'

function WhiteboardCanvas() {
  const room = useRoom()

  const updateCanvas = useMutation(({ storage }, updates) => {
    storage.get('canvas').update(updates)
  }, [])

  // キャンバスの更新がリアルタイムで同期される
}
```

### プレゼンス認識

複数のユーザーのカーソル位置や選択を追跡:

```typescript
import { useOthers } from '@liveblocks/react'

function Cursors() {
  const others = useOthers()

  return (
    <>
      {others.map(({ connectionId, presence }) => (
        <Cursor
          key={connectionId}
          x={presence.cursor.x}
          y={presence.cursor.y}
        />
      ))}
    </>
  )
}
```

## デプロイ

### Vercelへのデプロイ

```bash
vercel deploy
```

### 環境変数の設定

本番環境では、すべての環境変数を適切に設定してください。

## 使用例

### SaaS

- コラボレーティブドキュメントエディタ
- プロジェクト管理ツール
- デザインツール

### リアルタイムアプリ

- ホワイトボードアプリ
- マインドマップツール
- ブレインストーミングプラットフォーム

### 認証

- マルチプロバイダー認証が必要なアプリ
- チームコラボレーションツール

## リソース

- [Liveblocks Documentation](https://liveblocks.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Next.js Documentation](https://nextjs.org/docs)

## ライセンス

MITライセンス
