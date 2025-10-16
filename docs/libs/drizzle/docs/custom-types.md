# カスタム型

Drizzle ORMにおけるカスタム型の包括的なガイドです。

## 概要

`customType`関数により、開発者は柔軟な型マッピングと設定でカスタムデータベースカラム型を定義できます。PostgreSQLとMySQLデータベースの両方をサポートします。

## 主要な機能

- 特定の動作を持つカスタムデータ型を定義
- JavaScriptTypeScriptとデータベースドライバータイプ間のマッピング
- データ型の生成と変換を設定

## PostgreSQLのカスタム型

### Serial型

```typescript
const customSerial = customType<{ data: number; notNull: true; default: true }>({
  dataType() {
    return 'serial';
  },
});
```

### JSON型

```typescript
const customJsonb = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() {
      return 'jsonb';
    },
    toDriver(value: TData): string {
      return JSON.stringify(value);
    },
  })(name);
```

## MySQLのカスタム型

```typescript
const customBoolean = customType<{ data: boolean }>({
  dataType() {
    return 'boolean';
  },
  fromDriver(value) {
    return value === 1;
  },
});
```

## 型定義

`CustomTypeValues`インターフェースは型設定を提供：
- `data`: 結果のカラム型
- `driverData`: データベースドライバーの入力型
- `config`: 設定パラメータ
- `notNull`: Null可能制約
- `default`: デフォルト値フラグ

## カスタム型パラメータ

- `dataType()`: データベース型文字列を生成
- `toDriver()`: 入力をドライバー互換形式に変換
- `fromDriver()`: データベース値をアプリケーション型に変換

## 使用例

```typescript
const usersTable = pgTable('users', {
  id: customSerial('id').primaryKey(),
  name: customText('name').notNull(),
  verified: customBoolean('verified').default(false),
  jsonData: customJsonb<string[]>('data'),
});
```

このアプローチは、Drizzle ORMでカスタムデータベース型を定義するための最大限の柔軟性を提供します。
