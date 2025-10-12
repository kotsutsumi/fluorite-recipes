# Next.js テストガイド

Next.js アプリケーションでのテスト実装をサポートする包括的なガイドです。プロジェクトの要件に応じて、適切なテストフレームワークを選択してください。

## テストフレームワーク一覧

### 1. [Cypress](./testing/01-cypress.md)

**対象**: End-to-End (E2E) テストとコンポーネントテスト

モダンなWebアプリケーション向けのテストフレームワークで、ブラウザ内で実際のユーザーインタラクションをシミュレートします。

**主な特徴**:

- E2Eテストとコンポーネントテストの両方をサポート
- 実際のブラウザ環境でのテスト実行
- リアルタイムでテストの実行状況を確認可能
- 時間旅行デバッグ機能
- 自動スクリーンショット・動画記録

**使用ケース**:

- フルページのナビゲーションテスト
- フォーム送信フロー
- ユーザー認証フロー
- 統合テスト全般

**セットアップ方法**:

```bash
# 新規プロジェクト作成
npx create-next-app@latest --example with-cypress with-cypress-app

# 既存プロジェクトに追加
npm install -D cypress
npm run cypress:open
```

---

### 2. [Jest](./testing/02-jest.md)

**対象**: ユニットテストとコンポーネントテスト

JavaScriptの標準的なテストフレームワークで、React Testing Libraryと組み合わせてコンポーネントテストを実装します。

**主な特徴**:

- シンプルな設定で強力なテスト機能
- モック機能の充実
- スナップショットテスト
- カバレッジレポート
- Next.js との優れた統合

**使用ケース**:

- 関数やクラスのユニットテスト
- Reactコンポーネントの動作テスト
- API エンドポイントのテスト
- ユーティリティ関数のテスト

**セットアップ方法**:

```bash
# 新規プロジェクト作成
npx create-next-app@latest --example with-jest with-jest-app

# 既存プロジェクトに追加
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
npm init jest@latest
```

**Next.js統合**:

- `next/jest` による自動設定
- SWC によるトランスフォーム
- 環境変数の自動ロード
- CSS/画像インポートのモック

---

### 3. [Playwright](./testing/03-playwright.md)

**対象**: End-to-End (E2E) テスト、クロスブラウザテスト

Microsoft製のE2Eテストフレームワークで、Chromium、Firefox、WebKitなど複数のブラウザでのテストを一元的に管理できます。

**主な特徴**:

- 複数ブラウザでの並列テスト実行
- 高速で信頼性の高いテスト
- 自動待機とリトライ機能
- 強力なデバッグツール
- モバイルデバイスのエミュレーション

**使用ケース**:

- クロスブラウザ互換性テスト
- パフォーマンステスト
- アクセシビリティテスト
- 視覚的回帰テスト

**セットアップ方法**:

```bash
# 新規プロジェクト作成
npx create-next-app@latest --example with-playwright with-playwright-app

# 既存プロジェクトに追加
npm init playwright
```

**対応ブラウザ**:

- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)

---

### 4. [Vitest](./testing/04-vitest.md)

**対象**: ユニットテスト（高速実行重視）

Viteをベースにした高速なユニットテストフレームワークで、Jestと互換性のあるAPIを提供しながら、より優れたパフォーマンスを実現します。

**主な特徴**:

- 非常に高速なテスト実行
- ホットリロード対応
- Jest互換API
- TypeScript ネイティブサポート
- ES モジュールサポート

**使用ケース**:

- 大規模プロジェクトでの高速ユニットテスト
- 開発中のライブテスト実行
- モダンJavaScript機能のテスト

**セットアップ方法**:

```bash
# 新規プロジェクト作成
npx create-next-app@latest --example with-vitest with-vitest-app

# 既存プロジェクトに追加
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react
```

## テスト戦略の選択指針

### プロジェクト規模別の推奨事項

#### 小規模プロジェクト

- **Jest** + **React Testing Library**: コンポーネントテスト
- **Cypress**: E2Eテスト（主要フロー）

#### 中規模プロジェクト

- **Vitest** + **React Testing Library**: ユニット・コンポーネントテスト
- **Playwright**: クロスブラウザE2Eテスト

#### 大規模プロジェクト

- **Vitest**: 高速ユニットテスト
- **Jest**: レガシーコードとの互換性
- **Playwright**: 包括的E2Eテスト
- **Cypress**: 開発者向けインタラクティブテスト

### テストタイプ別の使い分け

| テストタイプ         | 推奨フレームワーク        | 目的                           |
| -------------------- | ------------------------- | ------------------------------ |
| ユニットテスト       | Jest / Vitest             | 関数・クラスの個別動作確認     |
| コンポーネントテスト | Jest + RTL / Vitest + RTL | React コンポーネントの動作確認 |
| 統合テスト           | Jest / Vitest             | モジュール間の連携確認         |
| E2Eテスト            | Cypress / Playwright      | ユーザーフロー全体の確認       |
| 視覚的回帰テスト     | Playwright                | UI の見た目の変更検知          |
| パフォーマンステスト | Playwright                | ページ読み込み速度の確認       |

## 共通のベストプラクティス

### テストファイルの配置

```
project-root/
├── __tests__/           # グローバルテスト
├── app/
│   ├── components/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx
│   └── page.test.tsx
├── cypress/e2e/         # Cypress E2E テスト
├── e2e/                 # Playwright E2E テスト
└── tests/               # 共通テストユーティリティ
```

### 環境設定

#### 開発環境での並行実行

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:cypress": "cypress open"
  }
}
```

#### CI/CD環境での設定

```yaml
# GitHub Actions example
- name: Run unit tests
  run: npm run test

- name: Run E2E tests
  run: npm run test:e2e
```

### テストデータの管理

#### モックデータの作成

```typescript
// tests/mocks/api.ts
export const mockUserData = {
  id: 1,
  name: "テストユーザー",
  email: "test@example.com",
};
```

#### フィクスチャの活用

```typescript
// tests/fixtures/users.json
{
  "users": [
    { "id": 1, "name": "太郎", "role": "admin" },
    { "id": 2, "name": "花子", "role": "user" }
  ]
}
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. Next.js の動的インポートエラー

```typescript
// Jest/Vitest での解決方法
jest.mock("next/dynamic", () => () => {
  const DynamicComponent = () => null;
  DynamicComponent.displayName = "LoadableComponent";
  return DynamicComponent;
});
```

#### 2. 環境変数の読み込み問題

```typescript
// テスト環境での環境変数設定
process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001";
```

#### 3. CSS Module のインポートエラー

```javascript
// Jest 設定での CSS モック
moduleNameMapper: {
  '\\.(css|less|scss)$': 'identity-obj-proxy'
}
```

#### 4. Server Components のテスト

```typescript
// Server Components は通常のコンポーネントとしてテスト
import { render } from '@testing-library/react'
import ServerComponent from './ServerComponent'

test('Server Component', () => {
  render(<ServerComponent />)
  // テストロジック
})
```

## パフォーマンス最適化

### テスト実行速度の改善

1. **並列実行の活用**

   ```bash
   # Jest
   jest --maxWorkers=4

   # Vitest
   vitest --threads

   # Playwright
   playwright test --workers=4
   ```

2. **テストファイルの分割**
   - 大きなテストファイルを小さく分割
   - 関連するテストをグループ化

3. **モックの最適化**
   - 重い依存関係のモック化
   - API コールのモック化

## 追加リソース

### 公式ドキュメント

- [Next.js Testing Documentation](https://nextjs.org/docs/app/building-your-application/testing)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

### コミュニティリソース

- [Jest Best Practices](https://jestjs.io/docs/tutorial-react)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

### サンプルプロジェクト

- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [Testing Examples](https://github.com/vercel/next.js/tree/canary/examples/with-jest)

---

各テストフレームワークには詳細な設定方法、実装例、およびベストプラクティスが含まれています。プロジェクトの要件と開発チームの経験に基づいて、最適なテスト戦略を選択してください。
