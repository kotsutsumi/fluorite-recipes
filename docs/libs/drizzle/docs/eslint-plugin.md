# ESLintプラグイン

Drizzle ESLintプラグインの包括的なガイドです。

## 概要

Drizzle ESLintプラグインは、開発中に重要なシナリオを処理するための推奨ルールを提供します。特に型チェックが難しいケースに役立ちます。

## インストール

```bash
npm i eslint-plugin-drizzle
npm i @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

## 設定例

### 基本設定

```yaml
root: true
parser: '@typescript-eslint/parser'
parserOptions:
  project: './tsconfig.json'
plugins:
  - drizzle
rules:
  'drizzle/enforce-delete-with-where': "error"
  'drizzle/enforce-update-with-where': "error"
```

### All/推奨設定

```yaml
root: true
extends:
  - "plugin:drizzle/recommended"
parser: '@typescript-eslint/parser'
parserOptions:
  project: './tsconfig.json'
plugins:
  - drizzle
```

## ルール

### 1. `enforce-delete-with-where`

`.where()`句を伴う`.delete()`の使用を強制します。テーブル全体の誤った削除を防止します。

```typescript
// エラー
await db.delete(users);

// OK
await db.delete(users).where(eq(users.id, 1));
```

### 2. `enforce-update-with-where`

`.where()`句を伴う`.update()`の使用を強制します。すべての行への意図しない更新を防止します。

```typescript
// エラー
await db.update(users).set({ name: 'John' });

// OK
await db.update(users).set({ name: 'John' }).where(eq(users.id, 1));
```

## 設定オプション

両ルールは、特定のDrizzleオブジェクトをターゲットにするためのオプションの`drizzleObjectName`パラメータをサポートします：

```yaml
rules:
  'drizzle/enforce-update-with-where':
    - "error"
    - "drizzleObjectName":
      - "db"
```

これにより、コードベース内のDrizzleメソッドと他の類似メソッドを区別できます。

Drizzle ESLintプラグインは、データベース操作における一般的なミスを防ぐのに役立ち、コードの品質と安全性を向上させます。
