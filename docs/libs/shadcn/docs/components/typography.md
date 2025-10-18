# タイポグラフィ

見出し、段落、リストなどのスタイル

## 概要

デフォルトではタイポグラフィスタイルは提供されていません。このページは、ユーティリティクラスを使用してテキストをスタイル設定する方法の例です。

## 例

### H1

```jsx
<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
  笑いに課税：ジョークの税金年代記
</h1>
```

### H2

```jsx
<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
  王の計画
</h2>
```

### H3

```jsx
<h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
  ジョーク税
</h3>
```

### H4

```jsx
<h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
  人々の反応
</h4>
```

### 段落

```jsx
<p className="leading-7 [&:not(:first-child)]:mt-6">
  昔々、遠い国に、一日中玉座で怠けている非常に怠惰な王がいました。ある日、彼の顧問たちは王に問題を持ちかけました：王国のお金が底をついていたのです。
</p>
```

### 引用

```jsx
<blockquote className="mt-6 border-l-2 pl-6 italic">
  「結局のところ」と彼は言いました、「誰もが良いジョークを楽しむのだから、その特権に対して支払うのは当然だ」
</blockquote>
```

### テーブル

```jsx
<div className="my-6 w-full overflow-y-auto">
  <table className="w-full">
    <thead>
      <tr className="m-0 border-t p-0 even:bg-muted">
        <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
          王の命令
        </th>
        <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
          説明
        </th>
      </tr>
    </thead>
    <tbody>
      <tr className="m-0 border-t p-0 even:bg-muted">
        <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
          第1法令
        </td>
        <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
          すべてのジョークに税金が課されます。
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### リスト

```jsx
<ul className="my-6 ml-6 list-disc [&>li]:mt-2">
  <li>1段階のダジャレ：5ゴールドコイン</li>
  <li>2段階のジョーク：10ゴールドコイン</li>
  <li>3段階のワンライナー：20ゴールドコイン</li>
</ul>
```

### インラインコード

```jsx
<code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
  @radix-ui/react-alert-dialog
</code>
```

### リード（導入文）

```jsx
<p className="text-xl text-muted-foreground">
  ダッシュボードアプリケーションのための管理画面コンポーネント。Radix UIとTailwind CSSを使用して構築されています。
</p>
```

### 大きなテキスト

```jsx
<div className="text-lg font-semibold">
  本当に大事なことですか？
</div>
```

### 小さなテキスト

```jsx
<small className="text-sm font-medium leading-none">
  メールアドレス
</small>
```

### ミュート（目立たない）テキスト

```jsx
<p className="text-sm text-muted-foreground">
  メールアドレスを入力してください。
</p>
```

## 完全な例

```jsx
export function TypographyDemo() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          笑いに課税：ジョークの税金年代記
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          昔々、遠い国に、一日中玉座で怠けている非常に怠惰な王がいました。ある日、彼の顧問たちは王に問題を持ちかけました：王国のお金が底をついていたのです。
        </p>
      </div>

      <div>
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          王の計画
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          王は長い間考え、最終的に素晴らしい計画を思いつきました：王国のジョークに課税するというものです。
        </p>
        <blockquote className="mt-6 border-l-2 pl-6 italic">
          「結局のところ」と彼は言いました、「誰もが良いジョークを楽しむのだから、その特権に対して支払うのは当然だ」
        </blockquote>
      </div>

      <div>
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          ジョーク税
        </h3>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          王の臣下たちは面白くありませんでした。彼らは不平を言い、文句を言いましたが、王は断固としていました：
        </p>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>1段階のダジャレ：5ゴールドコイン</li>
          <li>2段階のジョーク：10ゴールドコイン</li>
          <li>3段階のワンライナー：20ゴールドコイン</li>
        </ul>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          その結果、人々はジョークを言うのをやめ、王国は暗鬱になりました。しかし、王の愚かさに屈することを拒んだ一人の道化師がいました。
        </p>
      </div>
    </div>
  )
}
```
