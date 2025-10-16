# ライブラリ

Valtioはプロキシ状態管理のための必要最低限の機能を提供しており、ほとんどのプロジェクトに適していますが、一部のユーザーはライブラリの機能セットを拡張したいと考えています。これは、コミュニティによって作成されたサードパーティライブラリを使用して実現できます。

---

> ⚠️ 警告
>
> 免責事項: これらのライブラリにはバグ、限定的なメンテナンス、またはその他の制限がある可能性があり、pmndrsやvaltioのメンテナーによって公式に推奨されているわけではありません。このリストは、valtioの機能セットを拡張しようとしている人にとって良い出発点を提供するためのものです。

---

- [electron-valtio](https://github.com/water-a/electron-valtio) - valtioを介してElectronのメインプロセスとさまざまなレンダラーウィンドウ間で状態を共有
- [eslint-plugin-valtio](https://github.com/pmndrs/eslint-plugin-valtio) - valtio用のEslintプラグイン
- [storybook-valtio-auto-bind](https://github.com/CosPie/storybook-valtio-auto-bind) - StorybookのargsをValtioストアと双方向に自動同期
- [sveltio](https://github.com/wobsoriano/sveltio) - プロキシを使用したSvelte用の状態管理ソリューション。valtioを使用
- [swc-plugin-valtio](https://github.com/sosukesuzuki/swc-plugin-valtio) - SWC用のValtio useProxyトランスフォーマー
- [tauri-plugin-valtio](https://github.com/ferreira-tb/tauri-store/tree/main/packages/plugin-valtio) - JavaScriptとRustの両方からアクセス可能なTauri用の永続的なvaltio状態
- [use-valtio](https://github.com/dai-shi/use-valtio) - Valtioプロキシ状態を使用するための別のカスタムフック
- [valtio-element](https://github.com/lxsmnsyc/valtio-element) - valtioでリアクティブで宣言的なカスタム要素を作成
- [valtio-factory](https://github.com/mfellner/valtio-factory) - ファクトリーパターンを使用してvaltio状態を作成
- [valtio-fsm](https://github.com/valtiojs/valtio-fsm) - Valtioのリアクティビティシステムを使用したシンプルでチェーン可能なTypeScriptファーストの有限状態マシンライブラリ
- [valtio-persist](https://github.com/valtiojs/valtio-persist) - ディスクへの状態の柔軟でパフォーマンスの高い保存
  - [valtio-auto-persist](https://github.com/valtiojs/valtio-auto-persist) - 状態オブジェクトを識別するためのキーを付与する必要なく保存できるvaltio-persistの実験的なフォーク。内部で[structure-id](https://github.com/overthemike/structure-id)を使用
- [valtio-plugin](https://github.com/valtiojs/valtio-plugin) - valtioの使用方法をカスタマイズしやすくする真新しいライフサイクルプラグインシステム
- [valtio-reactive](https://github.com/valtiojs/valtio-reactive) - valtio-reactiveはvaltioをリアクティブライブラリにする
- [valtio-signal](https://github.com/dai-shi/valtio-signal) - Valtioプロキシ状態用の別のReactバインディング
- [valtio-yjs](https://github.com/dai-shi/valtio-yjs) - valtio-yjsはyjs状態を簡単にする
- [valtio-zod](https://github.com/valtiojs/valtio-zod) - [Zod](https://zod.dev)でvaltio状態の更新を検証
