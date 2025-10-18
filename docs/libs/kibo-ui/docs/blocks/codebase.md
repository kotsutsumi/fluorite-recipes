# Codebase

## 説明
Codebaseブロックは、ソースコードを閲覧および表示するためのファイルエクスプローラーツリーとコードビューアーを組み合わせたものです。

## インストール
```bash
npx kibo-ui add codebase
```

## コード例
このページには、Reactボタンコンポーネントの実装を含む`button.tsx`ファイルのコードプレビューが含まれています:

```typescript
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
        // 追加のバリアントスタイル...
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        // 追加のサイズオプション...
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
export { Button, buttonVariants };
```

## ファイル構造例
このページにはサンプルのファイルエクスプローラーツリーが表示されています:
```
src
├── components
```
