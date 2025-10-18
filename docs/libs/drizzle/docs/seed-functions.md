# Seed ジェネレーター

Drizzle ORMのSeedジェネレーターは、データベースシーディング用のモックデータを生成する関数です。

## 主要な機能

- さまざまなデータ型用のデータ生成
- ユニークおよび非ユニークな値のサポート
- オプションの配列生成
- 複数のデータ型とジェネレーターが利用可能

## 利用可能なジェネレーター

### 1. 基本ジェネレーター
- `default`: 定数値を生成
- `valuesFromArray`: 事前定義された配列から値を生成
- `intPrimaryKey`: 連続した整数を生成
- `number`: 浮動小数点数を生成
- `int`: 整数を生成
- `boolean`: true/falseを生成
- `string`: ランダムな文字列を生成
- `uuid`: UUID文字列を生成

### 2. 個人情報/場所ジェネレーター
- `firstName`
- `lastName`
- `fullName`
- `email`
- `phoneNumber`
- `country`
- `city`
- `streetAddress`
- `jobTitle`
- `companyName`

### 3. 日付/時刻ジェネレーター
- `date`
- `time`
- `timestamp`
- `datetime`
- `year`
- `interval`

### 4. 特殊ジェネレーター
- `json`: 構造化されたJSONオブジェクトを生成
- `loremIpsum`: テキスト文を生成
- `point`: 2D座標を生成
- `line`: 線のパラメータを生成

## 使用例

```typescript
await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  users: {
    columns: {
      email: funcs.email({
        arraySize: 3  // オプション: 配列を生成
      }),
      age: funcs.int({
        minValue: 18,
        maxValue: 65,
        isUnique: false
      })
    }
  }
}));
```

## 共通パラメータ

ほとんどのジェネレーターは以下のオプションパラメータをサポート：
- `isUnique`: 一意の値を保証
- `arraySize`: 値の配列を生成
- 範囲パラメータ（数値ジェネレーター用）

このドキュメントは、Drizzle ORMでデータベースシーディングに利用可能なさまざまなジェネレーター関数の包括的な概要を提供します。
