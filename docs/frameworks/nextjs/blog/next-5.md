# Next.js 5: ユニバーサルWebpack、CSSインポート、プラグイン、ゾーン

**投稿日**: 2018年2月5日（月曜日）

**著者**:
- Arunoda Susiripala ([@arunoda](https://twitter.com/arunoda))
- Tim Neutkens ([@timneutkens](https://twitter.com/timneutkens))

## 主なハイライト

### 1. ユニバーサルWebpackサポート

Next.jsは、サーバーコードとクライアントコードの両方に対して、ユニバーサルなWebpackパイプラインを共有するようになりました。これにより：

- より広範なWebpackローダーのエコシステムが利用可能
- `next.config.js`を通じた設定が容易に

### 2. CSSとスタイリングの改善

- CSSファイルの直接インポートがサポートされました
- CSS、LESS、SASS、SCSS、CSSモジュールをサポート
- 簡単なローダー設定のためのNext.jsプラグインを導入

### 3. TypeScriptサポート

- Webpack設定を通じた完全なTypeScript統合
- 簡単なセットアップのための`next-typescript`プラグインを導入

### 4. ゾーン機能

- 複数のNext.jsアプリケーションを組み合わせる機能
- 独立したアプリを通常の`<Link>`コンポーネントを使用して接続可能
- マイクロサービスと独立したデプロイメントを促進

### 5. パフォーマンスの改善

- 本番ビルド時間が23.6%高速化
- 動的インポートのキャッシングを改善
- より正確なサーバーサイドのエラーレポート

## アップグレードコマンド

```bash
npm i next@latest react@latest react-dom@latest
```

## まとめ

このブログ記事は、強力な新しい拡張機能を導入しながらも、Next.jsが後方互換性へのコミットメントを強調しています。ユニバーサルWebpackサポートにより、開発者はより柔軟にアプリケーションを構築できるようになりました。
