# Turso - Dartで接続

Dartを使用してTursoに接続する方法を説明します。

## セットアップ手順

### 1. インストール

`pubspec.yaml`にturso_dartパッケージを追加します：

```yaml
dependencies:
  turso_dart: ^0.1.0
```

パッケージをインストール：

```bash
dart pub get
```

または、Flutter プロジェクトの場合：

```bash
flutter pub get
```

### 2. 接続

インメモリまたはローカルファイルデータベースに接続できます。

#### インメモリデータベース

```dart
import 'package:turso_dart/turso_dart.dart';

void main() async {
  final client = TursoClient.inMemory();
}
```

#### ローカルファイルデータベース

```dart
import 'package:turso_dart/turso_dart.dart';

void main() async {
  final client = TursoClient.local('database.db');
}
```

### 3. テーブルの作成

`customers`テーブルを作成します：

```dart
await client.execute(
  '''
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
  '''
);
```

### 4. データの挿入

サンプルレコードをテーブルに挿入します：

```dart
await client.execute("INSERT INTO customers (name) VALUES ('Alice')");
await client.execute("INSERT INTO customers (name) VALUES ('Bob')");
await client.execute("INSERT INTO customers (name) VALUES ('Charlie')");
```

### 5. データのクエリ

すべてのレコードを取得して表示します：

```dart
final result = await client.execute("SELECT * FROM customers");
print(result);
```

## 完全なコード例

```dart
import 'package:turso_dart/turso_dart.dart';

void main() async {
  // データベースに接続
  final client = TursoClient.local('database.db');

  // テーブルを作成
  await client.execute(
    '''
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
    '''
  );

  // データを挿入
  await client.execute("INSERT INTO customers (name) VALUES ('Alice')");
  await client.execute("INSERT INTO customers (name) VALUES ('Bob')");
  await client.execute("INSERT INTO customers (name) VALUES ('Charlie')");

  // データをクエリ
  final result = await client.execute("SELECT * FROM customers");
  print('Customers:');
  print(result);

  // 接続を閉じる
  await client.close();
}
```

## プリペアドステートメント

プリペアドステートメントを使用することで、パフォーマンスとセキュリティが向上します：

```dart
// プリペアドステートメントを作成
final stmt = await client.prepare("SELECT * FROM customers WHERE id = ?");

// パラメータをバインドして実行
final result = await stmt.query([1]);
print(result);

// ステートメントを閉じる
await stmt.close();
```

### プリペアドステートメントの利点

1. **パフォーマンス**: クエリが事前にコンパイルされるため高速
2. **セキュリティ**: SQLインジェクション攻撃を防止
3. **再利用性**: 同じクエリを異なるパラメータで繰り返し実行可能

## Turso Cloudに接続

Turso Cloudでホストされているデータベースに接続する場合：

```dart
import 'package:turso_dart/turso_dart.dart';

void main() async {
  final client = TursoClient.cloud(
    url: 'your-database-url',
    authToken: 'your-auth-token',
  );

  // データベース操作
  final result = await client.execute("SELECT * FROM customers");
  print(result);

  await client.close();
}
```

環境変数を使用する場合：

```dart
import 'dart:io';
import 'package:turso_dart/turso_dart.dart';

void main() async {
  final url = Platform.environment['TURSO_DATABASE_URL']!;
  final token = Platform.environment['TURSO_AUTH_TOKEN']!;

  final client = TursoClient.cloud(
    url: url,
    authToken: token,
  );

  // データベース操作
  final result = await client.execute("SELECT * FROM customers");
  print(result);

  await client.close();
}
```

## トランザクション

複数の操作をアトミックに実行できます：

```dart
await client.transaction((tx) async {
  await tx.execute("INSERT INTO customers (name) VALUES ('Alice')");
  await tx.execute("INSERT INTO customers (name) VALUES ('Bob')");
});
```

エラーが発生した場合、トランザクション全体がロールバックされます：

```dart
try {
  await client.transaction((tx) async {
    await tx.execute("INSERT INTO customers (name) VALUES ('Alice')");
    throw Exception('Something went wrong');
    await tx.execute("INSERT INTO customers (name) VALUES ('Bob')"); // 実行されない
  });
} catch (e) {
  print('Transaction failed: $e');
}
```

## エラーハンドリング

適切なエラーハンドリングを実装することを推奨します：

```dart
try {
  final result = await client.execute("SELECT * FROM customers");
  print(result);
} on TursoException catch (e) {
  print('Database error: ${e.message}');
} catch (e) {
  print('Unexpected error: $e');
}
```

## Flutter での使用

Flutterアプリケーションで使用する場合の例：

```dart
import 'package:flutter/material.dart';
import 'package:turso_dart/turso_dart.dart';

class CustomersPage extends StatefulWidget {
  @override
  _CustomersPageState createState() => _CustomersPageState();
}

class _CustomersPageState extends State<CustomersPage> {
  late TursoClient client;
  List<Map<String, dynamic>> customers = [];

  @override
  void initState() {
    super.initState();
    client = TursoClient.local('database.db');
    loadCustomers();
  }

  Future<void> loadCustomers() async {
    final result = await client.execute("SELECT * FROM customers");
    setState(() {
      customers = result;
    });
  }

  @override
  void dispose() {
    client.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: customers.length,
      itemBuilder: (context, index) {
        final customer = customers[index];
        return ListTile(
          title: Text(customer['name']),
          subtitle: Text('ID: ${customer['id']}'),
        );
      },
    );
  }
}
```

## ベストプラクティス

1. **プリペアドステートメントを使用**: SQLインジェクションを防ぐ
2. **接続を適切に閉じる**: リソースリークを防ぐ
3. **トランザクションを使用**: 関連する操作をグループ化
4. **エラーハンドリング**: すべてのデータベース操作でエラーをキャッチ
5. **非同期処理**: `async/await`を適切に使用

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [Turso GitHub](https://github.com/tursodatabase/turso)
- [Turso Documentation](https://docs.turso.tech/)
- [turso_dart pub.dev](https://pub.dev/packages/turso_dart)
- [Dart Documentation](https://dart.dev/guides)
- [Flutter Documentation](https://flutter.dev/docs)
