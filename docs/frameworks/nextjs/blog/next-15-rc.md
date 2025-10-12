# Next.js 15 RC

**公開日**: 2024年5月23日(木曜日)

**著者**:
- Delba de Oliveira (@delba_oliveira)
- Zack Tanner (@zt1072)

## 主なハイライト

### React 19 RCのサポート

- 新しいクライアントおよびサーバー機能を持つReact 19 RCをサポート
- 実験的なReact Compilerを含む
- ハイドレーションエラーメッセージの改善

### キャッシングの更新

- `fetch`リクエスト、`GET` Route Handlers、およびクライアントナビゲーションは、デフォルトでキャッシュされなくなりました
- 開発者は以前のキャッシング動作にオプトインできます

### 実験的機能

- インクリメンタル採用オプションを持つPartial Prerendering(PPR)
- レスポンスストリーミング後にコードを実行するための`next/after` API
- 手動メモ化を削減するReact Compiler

### 開発の改善

- 新しいデザインで`create-next-app`を更新
- ローカル開発でTurbopackを有効にするオプション
- 外部パッケージのバンドルのための新しい設定オプション

## インストール方法

```bash
npm install next@rc react@rc react-dom@rc
```

このリリースはリリース候補(RC)であり、開発者が安定版リリース前に新機能をテストできるようにします。ブログ記事は、一部のサードパーティライブラリがまだReact 19と互換性がない可能性があることを強調しています。
