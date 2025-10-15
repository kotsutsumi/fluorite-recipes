# `<Activity>` (実験的)

`<Activity>` は、UI の一部の表示状態を管理し、アプリケーションの異なるセクションをプリレンダリングして state を保持できるようにする実験的な React コンポーネントです。

## 注意

この機能は実験的であり、安定版の React ではまだ利用できません。最新の実験版 React パッケージでのみ試用可能です。

## リファレンス

```jsx
import {unstable_Activity as Activity} from 'react';

<Activity mode={tab === "posts" ? "visible" : "hidden"}>
  <PostsTab />
</Activity>
```

### Props

- **`mode`**: `"visible"` または `"hidden"` - UI の表示状態を制御

## 使用法

### UI パーツのプリレンダリング

非アクティブなタブをバックグラウンドで低優先度でレンダーし、読み込み時間を短縮します。

```jsx
function App() {
  const [tab, setTab] = useState('about');

  return (
    <>
      <TabButtons tab={tab} setTab={setTab} />
      <hr />
      <Activity mode={tab === 'posts' ? 'visible' : 'hidden'}>
        <PostsTab />
      </Activity>
      <Activity mode={tab === 'contact' ? 'visible' : 'hidden'}>
        <ContactTab />
      </Activity>
      <Activity mode={tab === 'about' ? 'visible' : 'hidden'}>
        <AboutTab />
      </Activity>
    </>
  );
}
```

### UI の State 保持

タブを切り替える際に、コンポーネントの state と DOM を維持し、ユーザー入力の損失を防ぎます。

```jsx
<Activity mode={tab === "contact" ? "visible" : "hidden"}>
  <ContactTab />
</Activity>
```

## トラブルシューティング

### Activity が hidden の時、Effect がマウントされない

hidden な Activity 内では、Effect は実行されません。コンポーネントは概念的に「アンマウント」されていますが、state は保持されます。

### サーバーサイドレンダリングで hidden な Activity がレンダーされない

サーバーサイドレンダリング(SSR)では、hidden な Activity はレンダーされません。

## 重要な注意事項

- 実験的な React パッケージが必要
- 本番環境での使用は推奨されない
- コンポーネントは概念的に「アンマウント」と「再マウント」を繰り返す
- `<StrictMode>` と併用して予期しない副作用を検出することを推奨

## 主な利点

- パフォーマンスの向上(プリレンダリング)
- ユーザー体験の改善(state の保持)
- より高速なタブ切り替え
