# Resizable

キーボードサポート付きのアクセシブルなリサイズ可能なパネルグループとレイアウトを提供します。

このコンポーネントは、[react-resizable-panels](https://github.com/bvaughn/react-resizable-panels)ライブラリに基づいて構築されています。

## インストール

CLIを使用してコンポーネントをインストールします：

```bash
pnpm dlx shadcn@latest add resizable
```

## 使用方法

コンポーネントをインポートし、以下のように使用します：

```tsx
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
```

## 基本的な使用例

```tsx
<ResizablePanelGroup direction="horizontal">
  <ResizablePanel>One</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Two</ResizablePanel>
</ResizablePanelGroup>
```

## 例

### 垂直レイアウト

`direction`プロップを使用してパネルの方向を設定できます：

```tsx
<ResizablePanelGroup direction="vertical">
  <ResizablePanel>One</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Two</ResizablePanel>
</ResizablePanelGroup>
```

### ハンドル

`ResizableHandle`コンポーネントの`withHandle`プロップを使用してハンドルを表示または非表示にできます：

```tsx
<ResizablePanelGroup direction="horizontal">
  <ResizablePanel>One</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel>Two</ResizablePanel>
</ResizablePanelGroup>
```

このコンポーネントは、複雑なレイアウトを作成し、ユーザーがパネルのサイズをインタラクティブに調整できるようにします。キーボードナビゲーションもサポートしているため、アクセシビリティが確保されています。
