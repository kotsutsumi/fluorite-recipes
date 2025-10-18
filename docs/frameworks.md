# フレームワークドキュメント集

このディレクトリには、Fluorite Recipesプロジェクトで使用する主要なフレームワークの日本語ドキュメントが含まれています。

## 📚 収録フレームワーク一覧

### ⚛️ フロントエンド・フルスタック

#### [Next.js](./frameworks/nextjs.md)
**React フルスタックフレームワーク**
- **総ドキュメント数**: 310ファイル
- **カバー範囲**: Learn、公式ドキュメント、技術ブログ
- **主な機能**: App Router、Server Components、Server Actions、Turbopack、SSR/SSG/ISR
- **バージョン**: Next.js 15 (React 19対応)
- **ドキュメント**: [docs/frameworks/nextjs.md](./frameworks/nextjs.md)

**ドキュメント構成**:
- **Learn**: React基礎講座(11章)、Dashboard App構築コース(18章)
- **Docs**: App Router総合ドキュメント、アーキテクチャ・技術基盤、コミュニティ・貢献ガイド
- **Blog**: バージョンリリース、技術解説、開発ツール

#### [React](./frameworks/react.md)
**UI構築のための JavaScript ライブラリ**
- **総ドキュメント数**: 142ファイル
- **カバー範囲**: Learn、Reference、API仕様
- **主な機能**: コンポーネントシステム、フック、Server Components、Suspense
- **バージョン**: React 19
- **ドキュメント**: [docs/frameworks/react.md](./frameworks/react.md)

**ドキュメント構成**:
- **Learn**: はじめに、コンポーネント、インタラクティビティ、State管理、脱出ハッチ
- **Reference**: React パッケージ(18+フック)、React DOM、React Server Components、ルール

#### [Expo](./frameworks/expo.md)
**React Native モバイル開発フレームワーク**
- **総ドキュメント数**: 398ファイル
- **カバー範囲**: Expo Router、EAS Platform、開発ワークフロー
- **主な機能**: Expo Router、EAS Build、EAS Update、OTA更新、クロスプラットフォーム
- **対応プラットフォーム**: iOS、Android、Web
- **ドキュメント**: [docs/frameworks/expo.md](./frameworks/expo.md)

**ドキュメント構成**:
- **Accounts**: アカウント管理、SSO、2FA
- **App Signing**: 署名資格情報、セキュリティ
- **EAS Build**: CI/CD設定、内部配布、GitHub連携
- **EAS Update**: OTA アップデート、ロールバック
- **Expo Router**: ファイルベースルーティング、ネストナビゲーション

### 🖥️ デスクトップアプリケーション

#### [Tauri](./frameworks/tauri/)
**Rust製クロスプラットフォームデスクトップアプリフレームワーク**
- **総ドキュメント数**: 0ファイル（準備中）
- **カバー範囲**: ドキュメント準備中
- **主な機能**: 軽量デスクトップアプリ、Rust + Web技術、セキュリティ重視
- **対応プラットフォーム**: Windows、macOS、Linux
- **ドキュメント**: [docs/frameworks/tauri/](./frameworks/tauri/)

## 🎯 カテゴリ別フレームワーク選択ガイド

### Webアプリケーションを作りたい場合
1. **フルスタックアプリ**: Next.js（SSR、API Routes、フルスタック）
2. **SPAアプリ**: React（クライアントサイドのみ）
3. **基礎理解**: React基礎 → Next.jsへステップアップ

### モバイルアプリを作りたい場合
- **Expo**: React Nativeベース、クロスプラットフォーム（iOS/Android/Web）

### デスクトップアプリを作りたい場合
- **Tauri**: 軽量、Rust + Web技術、セキュリティ重視

### フレームワーク選択フローチャート

```
Webアプリ？
├─ はい → フルスタック必要？
│         ├─ はい → Next.js（SSR、API Routes、DB統合）
│         └─ いいえ → React（SPA、クライアントのみ）
│
├─ モバイルアプリ？
│  └─ はい → Expo（iOS/Android/Web クロスプラットフォーム）
│
└─ デスクトップアプリ？
   └─ はい → Tauri（軽量、ネイティブ性能）
```

## 📊 統計情報

| フレームワーク | ドキュメント数 | 主な用途 | 学習難易度 | 推奨スキルレベル |
|--------------|--------------|---------|-----------|-----------------|
| React | 142 | UI構築基盤 | ⭐⭐ | 初級〜上級 |
| Next.js | 310 | Webフルスタック | ⭐⭐⭐ | 中級〜上級 |
| Expo | 398 | モバイルアプリ | ⭐⭐⭐ | 中級〜上級 |
| Tauri | 0（準備中） | デスクトップアプリ | ⭐⭐⭐⭐ | 上級 |

**合計**: 850+ページの日本語ドキュメント

## 🚀 クイックスタート推奨パス

### 1. React基礎を固める（2-3週間）
```
React Learn → クイックスタート → コンポーネント → State → Effect
```
**目標**: Reactの基本概念理解、シンプルなReactアプリ構築

### 2. Next.jsでフルスタック開発（3-4週間）
```
Next.js Learn → React基礎講座 → Dashboard App構築
```
**目標**: フルスタックWebアプリケーション構築、Vercelデプロイ

### 3. Expoでモバイル開発（3-4週間）
```
Expo Tutorial → Expo Router → EAS Build
```
**目標**: クロスプラットフォームモバイルアプリ構築、ストア申請

### 4. Tauriでデスクトップ開発（上級者向け）
```
Tauri 導入 → Rustベースプラグイン → ネイティブ機能統合
```
**目標**: 軽量デスクトップアプリケーション構築

## 💡 LLM向けドキュメント参照ガイド

### 初心者向けの学習順序
1. **React**: `react.md` → Learn セクション → useState/useEffect
2. **Next.js**: `nextjs.md` → React基礎講座 → Dashboard App
3. **Expo**: `expo.md` → Tutorial → Expo Router

### 実装時のよくあるタスク

#### Webアプリを構築したい
- **React SPA**: `react.md` → Reference → useState/useEffect
- **Next.js SSR**: `nextjs.md` → Docs → App Router → Server Components
- **Next.js API**: `nextjs.md` → Docs → Route Handlers → Server Actions

#### モバイルアプリを構築したい
- **基本アプリ**: `expo.md` → Tutorial → 最初のアプリ作成
- **ルーティング**: `expo.md` → Expo Router → ファイルベースルーティング
- **ビルド**: `expo.md` → EAS Build → CI/CD設定

#### デスクトップアプリを構築したい
- **Tauri**: `tauri/` → 導入ガイド → Rust統合

## 📖 各フレームワークの詳細ドキュメント

### React - UI構築の基盤

#### 概要
Reactはユーザーインターフェースを構築するためのJavaScriptライブラリです。コンポーネントベースのアーキテクチャにより、再利用可能で保守性の高いUIを作成できます。

#### 主な特徴
- **コンポーネントベース**: UI を独立した再利用可能な部品に分割
- **宣言的**: UI の最終状態を記述し、React が効率的に更新
- **Learn Once, Write Anywhere**: Web、モバイル、デスクトップで動作
- **Virtual DOM**: 差分レンダリングによる高性能

#### 学習リソース
- **[React ドキュメント](./frameworks/react.md)**: 包括的なドキュメントポータル
- **[Learn セクション](./frameworks/react/docs/learn.md)**: 段階的学習リソース
- **[Reference セクション](./frameworks/react/docs/reference.md)**: 詳細なAPIリファレンス

#### 主要API（18+フック）
- `useState`: ローカル状態管理
- `useEffect`: 副作用の実行
- `useContext`: グローバル状態アクセス
- `useRef`: DOM参照、値の保持
- `useMemo`: 計算のメモ化
- `useCallback`: 関数のメモ化
- `useReducer`: 複雑な状態管理
- `useTransition`: 優先度付きレンダリング

### Next.js - Reactフルスタックフレームワーク

#### 概要
Next.jsは、Reactをベースとした本格的なフルスタックWebアプリケーション開発フレームワークです。SSR、SSG、ISRなど柔軟なレンダリング戦略と、App Router、Server Componentsなどの最新機能を提供します。

#### 主な特徴
- **App Router**: ファイルシステムベースルーティング、ネストレイアウト
- **Server Components**: サーバーサイドReactコンポーネント
- **Server Actions**: 型安全なサーバーサイドフォーム処理
- **Turbopack**: Rust製超高速バンドラー（76.7%高速化）
- **自動最適化**: 画像・フォント・バンドル自動最適化

#### 学習リソース
- **[Next.js ドキュメント](./frameworks/nextjs.md)**: 包括的なドキュメントポータル
- **[Learn Platform](./frameworks/nextjs/learn.md)**: React基礎 + Dashboard App構築コース
- **[Docs](./frameworks/nextjs/docs.md)**: App Router総合ドキュメント、API リファレンス
- **[Blog](./frameworks/nextjs/blog.md)**: バージョンリリース、技術解説

#### 技術アーキテクチャ
- **レンダリング**: SSG（静的生成）、SSR（サーバーサイド）、ISR（増分再生成）
- **ルーティング**: ファイルシステムベース、並列ルート、インターセプトルート
- **データ取得**: Server Actions、Streaming SSR、静的生成
- **最適化**: 画像最適化、フォント最適化、バンドル分析

#### バージョン進化
- **Next.js 13**: App Router革命、Turbopack（アルファ）
- **Next.js 14**: Server Actions安定版、Partial Prerendering
- **Next.js 15**: React 19対応、Turbopack安定化

### Expo - React Native モバイルフレームワーク

#### 概要
Expoは、React Nativeベースのモバイル開発フレームワークです。iOS、Android、Webに対応したクロスプラットフォーム開発を提供し、EAS（Expo Application Services）により、ビルド、更新、申請を一元管理できます。

#### 主な特徴
- **Expo Router**: ファイルベースルーティング、ネストナビゲーション
- **EAS Build**: クラウドビルド、CI/CD統合、内部配布
- **EAS Update**: OTA（Over-The-Air）アップデート、ロールバック
- **EAS Submit**: App Store/Play Store 自動申請
- **クロスプラットフォーム**: iOS、Android、Web対応

#### 学習リソース
- **[Expo ドキュメント](./frameworks/expo.md)**: ドキュメントインデックス
- **[Tutorial](./frameworks/expo/docs/tutorial/)**: ハンズオンチュートリアル
- **[Expo Router](./frameworks/expo/docs/router/)**: ルーティングガイド
- **[EAS Build](./frameworks/expo/docs/build/)**: ビルド設定ガイド
- **[EAS Update](./frameworks/expo/docs/eas-update/)**: OTA更新ガイド

#### ワークフロー
- **Managed Workflow**: Expo統合開発環境（初心者向け）
- **Bare Workflow**: ネイティブコード直接編集（上級者向け）
- **Brownfield**: 既存ネイティブアプリへの段階的導入

#### EAS Platform
- **Build**: クラウドビルド、キャッシング、モノレポ対応
- **Update**: 即座アップデート、バージョン管理、ロールバック
- **Submit**: ストア申請自動化、メタデータ管理
- **Insights**: メトリクス可視化、パフォーマンス分析

### Tauri - デスクトップアプリフレームワーク

#### 概要
Tauriは、Rust + Web技術でクロスプラットフォームデスクトップアプリケーションを構築するフレームワークです。軽量で高速、セキュリティ重視の設計が特徴です。

#### 主な特徴
- **軽量**: バイナリサイズが小さい（Electronの数分の1）
- **高速**: Rust製コアによる高性能
- **セキュリティ**: デフォルトでセキュア
- **Web技術**: HTML/CSS/JavaScriptでUI構築
- **クロスプラットフォーム**: Windows、macOS、Linux対応

#### ステータス
**ドキュメント準備中** - Fluorite Recipesプロジェクトでは現在Tauriドキュメントを準備中です。

## 🔗 外部リソース

### 公式サイト
- [React](https://react.dev/)
- [Next.js](https://nextjs.org/)
- [Expo](https://expo.dev/)
- [Tauri](https://tauri.app/)

### コミュニティ
各フレームワークのDiscord、GitHub Discussions、Stack Overflowコミュニティが利用可能です。詳細は各フレームワークのドキュメントを参照してください。

## 📝 ドキュメントの使い方

### 各フレームワークのドキュメント構成

#### Next.js（310ファイル）
1. **Learn**: React基礎講座、Dashboard App構築コース
2. **Docs**: App Router総合ドキュメント、API リファレンス
3. **Blog**: 技術解説、バージョンリリース

#### React（142ファイル）
1. **Learn**: 段階的学習リソース（はじめに → 応用）
2. **Reference**: 詳細なAPIリファレンス（フック、コンポーネント、API）

#### Expo（398ファイル）
1. **Tutorial**: ハンズオン学習
2. **Guides**: 機能別ガイド
3. **EAS Platform**: Build、Update、Submit
4. **Router**: Expo Router詳細

### LLMによる効率的な参照方法
1. **タスク特定**: 何を実装したいか明確にする
2. **フレームワーク選択**: 上記のカテゴリ別ガイドを参照
3. **ドキュメント参照**: 該当フレームワークの目次から必要なページへ
4. **コード例確認**: 実装パターンを理解
5. **カスタマイズ**: プロジェクト要件に合わせて調整

## 🔄 ドキュメントの更新状況

- **最終更新日**: 2025-10-18
- **React**: v19対応
- **Next.js**: v15対応（React 19、Turbopack安定化）
- **Expo**: 最新安定版に基づく
- **Tauri**: ドキュメント準備中

## 📦 推奨される技術スタック組み合わせ

### Webアプリケーション
- **フレームワーク**: Next.js 15（SSR/SSG/ISR + Server Components）
- **UI基盤**: React 19
- **スタイリング**: Tailwind CSS（[ライブラリドキュメント](../libs.md)参照）
- **状態管理**: Zustand/Jotai（[ライブラリドキュメント](../libs.md)参照）
- **データベース**: Drizzle ORM/Prisma（[ライブラリドキュメント](../libs.md)参照）

### モバイルアプリケーション
- **フレームワーク**: Expo（クロスプラットフォーム + EAS）
- **UI基盤**: React Native + React 19概念
- **ルーティング**: Expo Router
- **状態管理**: Zustand/Jotai

### デスクトップアプリケーション
- **フレームワーク**: Tauri
- **UI層**: React + Tailwind CSS
- **バックエンド**: Rust

## 🎓 学習リソース

### 初心者向け
1. **React基礎**（2-3週間）
   - React Learn → クイックスタート → useState/useEffect
2. **Next.js入門**（3-4週間）
   - React基礎講座 → Dashboard App構築
3. **Expo入門**（3-4週間）
   - Tutorial → Expo Router → EAS Build

### 中級者向け
1. **Next.js App Router詳細**
   - Server Components、Server Actions、並列ルート
2. **Expo EAS Platform**
   - CI/CD統合、カスタムビルド、OTA更新戦略
3. **React パフォーマンス最適化**
   - useMemo、useCallback、React Compiler

### 上級者向け
1. **Next.js アーキテクチャ深掘り**
   - Turbopack、Partial Prerendering、ミドルウェア
2. **Expo Bare Workflow**
   - ネイティブモジュール統合、カスタムネイティブコード
3. **React Server Components**
   - RSCアーキテクチャ、サーバ関数、ストリーミング
4. **Tauri開発**
   - Rust統合、ネイティブAPI、セキュリティ

## 🎯 実践的なユースケース

### Next.jsでブログサイト構築
1. `nextjs.md` → Docs → App Router → ルーティング
2. `nextjs.md` → Docs → データ取得 → 静的生成
3. `nextjs.md` → Docs → メタデータ → SEO最適化

### Expoでモバイルアプリ開発
1. `expo.md` → Tutorial → 最初のアプリ作成
2. `expo.md` → Expo Router → タブナビゲーション
3. `expo.md` → EAS Build → ストア申請

### Reactでコンポーネントライブラリ構築
1. `react.md` → Learn → コンポーネント設計
2. `react.md` → Reference → カスタムフック
3. `react.md` → Reference → パフォーマンス最適化

## 📈 学習進捗の目安

### 完全初心者（0-3ヶ月）
- **目標**: React基礎習得、シンプルなWebアプリ構築
- **学習パス**: React Learn → Next.js React基礎講座
- **成果物**: Todoアプリ、個人ポートフォリオ

### 中級者（3-6ヶ月）
- **目標**: フルスタックWebアプリ、モバイルアプリ構築
- **学習パス**: Next.js Dashboard App → Expo Tutorial
- **成果物**: ダッシュボードアプリ、クロスプラットフォームモバイルアプリ

### 上級者（6ヶ月以上）
- **目標**: 本番品質アプリケーション、パフォーマンス最適化
- **学習パス**: Next.js アーキテクチャ → Expo EAS → React最適化
- **成果物**: 企業級Webアプリ、ストア公開モバイルアプリ

---

**このドキュメントについて**: Fluorite Recipesプロジェクトで使用する全フレームワークの日本語ドキュメントへの包括的なインデックスです。LLMが効率的に参照できるよう構造化されています。
