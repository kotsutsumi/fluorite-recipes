# React Compiler

React Compiler は、コンポーネントのレンダリングを自動的に最適化する実験的機能です。

## 主な詳細

- 現在実験的機能
- コンポーネントのレンダリングを自動的に最適化するように設計
- `useMemo` と `useCallback` による手動メモ化の必要性を削減

## インストール

```bash
npm install babel-plugin-react-compiler
```

## `next.config.js` での設定

### 基本的な有効化

```javascript
const nextConfig = {
  experimental: {
    reactCompiler: true
  }
}
```

### オプトインモード

```javascript
const nextConfig = {
  experimental: {
    reactCompiler: {
      compilationMode: 'annotation'
    }
  }
}
```

## アノテーション

コード内でディレクティブを使用できます:

- **`"use memo"`**: コンパイラ最適化にオプトイン
- **`"use no memo"`**: コンパイラ最適化からオプトアウト

### 例

```typescript
export default function Page() {
  'use memo'
  // コンポーネントの実装
}
```

## パフォーマンスの考慮事項

- Next.js はカスタム SWC 最適化を使用
- 関連ファイルにのみコンパイラを適用
- パフォーマンスへの影響は最小限
- デフォルトの Rust ベースコンパイラと比較してビルドがわずかに遅くなります

## 重要な注意事項

- 本番環境での使用は推奨されません
- 変更される可能性があります
- 実験的機能

開発者は試してみて、GitHub でフィードバックを提供することが推奨されています。
