# Contribution Graph（コントリビューショングラフ）

## 概要
時間経過に伴うアクティビティレベルを表示する、GitHubスタイルのコントリビューショングラフコンポーネントです。

## インストール
```bash
npx kibo-ui add contribution-graph
```

## 機能
- GitHubスタイルのアクティビティカレンダー視覚化
- レンダープロップを使用した完全に組み合わせ可能なアーキテクチャ
- データ属性を使用したCSSベースのテーマ
- 設定可能なブロックサイズ、マージン、半径
- ツールチップサポート
- 月と週のラベル
- アクティビティ数と凡例
- レスポンシブデザイン
- サーバーサイドデータフェッチングサポート
- TypeScriptサポート

## データフェッチング
コンポーネントは視覚化専用です。ドキュメントでは、データフェッチングにGitHub Contributions APIの使用を推奨しています。

データフェッチングのコード例：
```javascript
const username = 'haydenbleasel';

const getCachedContributions = unstable_cache(
  async () => {
    const url = new URL(`/v4/${username}`, 'https://github-contributions-api.jogruber.de');
    const response = await fetch(url);
    const data = (await response.json()) as Response;
    const total = data.total[new Date().getFullYear()];

    return { contributions: data.contributions, total };
  },
  ['github-contributions'],
  { revalidate: 60 * 60 * 24 },
);
```

## 例のバリエーション
- カスタムGitHubテーマ
- ミニマルビュー
- ツールチップ
- カスタムブロックサイズ
- カスタムブロックスタイル
- カスタムフッター

## 使用上のヒント
- 欠落している日付はアクティビティなしと見なされる
- カレンダーは自動的にギャップを埋める
- ダークモードとシステムカラースキームをサポート
