# Auth UI

## 重要なお知らせ
2024年2月7日より、Auth UIリポジトリはSupabaseチームによってメンテナンスされなくなりました。代替として[Supabase UIライブラリ](/ui)の使用を推奨します。

## 概要
「Auth UIは、ユーザーを認証するための事前構築されたReactコンポーネントです。カスタムテーマと拡張可能なスタイルをサポートしており、ブランドと美学に合わせることができます。」

## Auth UIのセットアップ

### インストール
supabase-jsとAuth UIの最新バージョンをインストール:
```bash
npm install @supabase/supabase-js @supabase/auth-ui-react @supabase/auth-ui-shared
```

### Authコンポーネントのインポート
```javascript
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
const supabase = createClient('<INSERT PROJECT URL>', '<INSERT PROJECT ANON API KEY>')
const App = () => <Auth supabaseClient={supabase} />
```

### テーマの追加
```javascript
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const App = () => (
  <Auth
    supabaseClient={supabase}
    appearance={{ theme: ThemeSupa }}
  />
)
```

### ソーシャルプロバイダー
```javascript
const App = () => (
  <Auth
    supabaseClient={supabase}
    appearance={{ theme: ThemeSupa }}
    providers={['google', 'facebook', 'twitter']}
  />
)
```

## サポートされているビュー
- メールログイン
- マジックリンクログイン
- ソーシャルログイン
- パスワード更新
- パスワードを忘れた場合

## カスタマイズオプション

### 事前定義テーマ
Auth UIには「default」や「dark」などのテーマバリエーションが付属しています。

### カスタムスタイリング
以下をカスタマイズできます:
- CSSクラス
- インラインスタイル
- ラベル
- テーマバリエーション

### カスタムラベルの例
```javascript
const App = () => (
  <Auth
    supabaseClient={supabase}
```
