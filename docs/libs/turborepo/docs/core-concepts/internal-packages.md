# Internal Packages

Internal Packagesは、ワークスペース内にソースコードがあるライブラリです。モノレポ内でコードを共有するために使用され、後でオプションでnpmレジストリに公開できます。

## 主な特徴

- ワークスペースインストール構文を使用して`package.json`にインストールされます
- パッケージマネージャー固有のワークスペース表記を使用して参照できます
- 外部パッケージのようにインポート可能です

## パッケージインストールの例

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*"
  }
}
```

## 使用例

```tsx
import { Button } from '@repo/ui';

export default function Page() {
  return <Button>Submit</Button>;
}
```

## コンパイル戦略

### 1. Just-in-Time Packages

- それを使用するアプリケーションによってコンパイルされます
- 最小限の設定で済みます
- TypeScriptファイルを直接エクスポートします
- Turbopack、webpack、Viteなどのモダンなバンドラーに最適です

### 2. Compiled Packages

- TypeScriptコンパイラなどのビルドツールを使用して独自のコンパイルを処理します
- コンパイルされたJavaScript出力を生成します
- Turborepoによってキャッシュされます
- より多くの設定が必要です

### 3. Publishable Packages

- 最も複雑な戦略です
- npmレジストリへの公開のために準備されます
- 専門的なバージョニングと公開ツールが必要です
- 推奨ツール：`changesets`

このドキュメントは、モノレポ内のパッケージ管理における柔軟性を強調し、開発者がコードを共有および整理するための複数の戦略を提供しています。
