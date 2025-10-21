# 結合とネストされたテーブルのクエリ

## 概要

Data APIは、Postgresテーブル間の関係を自動的に検出します。Postgresはリレーショナルデータベースであるため、これは非常に一般的なシナリオです。

## 一対多結合

### データベーススキーマの例

テーブル:
1. **オーケストラセクション**
   - 列: id, name
2. **楽器**
   - 列: id, name, section_id

### クエリの例

```javascript
const { data, error } = await supabase
  .from('orchestral_sections')
  .select(`
    id,
    name,
    instruments ( id, name )
  `)
```

### 結合のTypeScript型

- `supabase-js`は`data`と`error`オブジェクトを返します
- ヘルパー型はデータベース結合の結果型を提供します

## 多対多結合

### シナリオの例

ユーザーとチームのデータベースで、ユーザーは複数のチームに所属できます。

### クエリの例

```javascript
const { data, error } = await supabase
  .from('teams')
  .select(`
    id,
    team_name,
    users ( id, name )
  `)
```

## 複数の外部キーを持つ結合句の指定

### 例: 従業員のシフト追跡

テーブル: users, scans, shifts

### 複雑な結合クエリ

```javascript
const { data, error } = await supabase
  .from('shifts')
  .select(`
    *,
    start_scan:scans!scan_id_start ( id, user_id, badge_scan_time ),
    end_scan:scans!scan_id_end ( id, user_id, badge_scan_time )
  `)
```

このドキュメントは、SupabaseのData APIがさまざまなテーブル構造にわたってデータベースの関係と結合を処理する方法を説明します。
