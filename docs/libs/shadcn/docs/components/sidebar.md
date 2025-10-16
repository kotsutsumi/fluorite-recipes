# サイドバー

構成可能で、テーマ設定が可能、そしてカスタマイズ可能なサイドバーコンポーネントです。

## 主な特徴

- アイコンに折りたたみ可能なサイドバー
- 複雑なコンポーネント構造
- 高度なカスタマイズ性
- レスポンシブデザイン対応
- キーボードショートカット対応

## インストール

<Tabs defaultValue="cli">

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">手動</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
pnpm dlx shadcn@latest add sidebar
```

</TabsContent>

</Tabs>

## 構造

サイドバーは以下のコンポーネントで構成されています：

- `SidebarProvider` - 折りたたみ可能な状態を管理
- `Sidebar` - サイドバーのコンテナ
- `SidebarHeader` と `SidebarFooter` - 上部と下部に固定
- `SidebarContent` - スクロール可能なコンテンツ
- `SidebarGroup` - コンテンツ内のセクション
- `SidebarTrigger` - サイドバーのトリガー

## 使用方法

### 基本的な実装

```tsx
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>アプリケーション</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
```

### レイアウトへの統合

```tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
```

## 例

詳細な例やバリエーションについては、[公式ドキュメント](https://ui.shadcn.com/docs/components/sidebar)を参照してください。
