# 使い方

Reactアプリケーションでの Kibo UI コンポーネントの使用方法を説明します。

## 主なポイント

- コンポーネントはプロジェクトのコードベースに直接追加されます
- コンポーネントは標準的なReactコンポーネントのようにインポートして使用できます
- 各コンポーネントは独立しており、オンデマンドで利用できるため、アプリを軽量に保てます
- コンポーネントはshadcnのテーマからデザイントークンを共有します

## 例

Announcementコンポーネントの使用例：

```tsx
'use client';

import {
  Announcement,
  AnnouncementTag,
  AnnouncementTitle,
} from '@/components/kibo-ui/announcement';
import { ArrowUpRightIcon } from 'lucide-react';

const Hero = () => (
  <>
    <Announcement>
      <AnnouncementTag>最新アップデート</AnnouncementTag>
      <AnnouncementTitle>
        新機能を追加しました
        <ArrowUpRightIcon size={16} className="shrink-0 text-muted-foreground" />
      </AnnouncementTitle>
    </Announcement>
    {/* ページの残りの部分... */}
  </>
);

export default Hero;
```

## 拡張性

- コンポーネントはプリミティブな属性を受け取ります
- 例えば、`AnnouncementTag` は `HTMLAttributes<HTMLDivElement>` を拡張します
- これにより、カスタムスタイルや機能を簡単に拡張できます

## カスタマイズ

- インストール後、追加のセットアップは不要です
- コンポーネントのスタイルとスクリプトは事前に統合されています
- アプリケーションですぐに使用できます

このドキュメントは、Kibo UIコンポーネントの柔軟性と使いやすさを強調しています。
