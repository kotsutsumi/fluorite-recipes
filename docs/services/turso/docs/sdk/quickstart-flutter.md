# Flutter クイックスタート

TursoをFlutterで使用する方法を説明します。iOSとAndroidの両方でTursoデータベースに接続できます。

## インストール

### pubspec.yaml

```yaml
dependencies:
  flutter:
    sdk: flutter
  libsql: ^0.1.0  # 最新バージョンを確認
```

### インストール

```bash
flutter pub get
```

## データベースの作成

```bash
# Tursoデータベースを作成
turso db create flutter-app

# 接続情報を取得
turso db show flutter-app --url
turso db tokens create flutter-app
```

## 基本的な使用方法

### 接続の作成

```dart
import 'package:libsql/libsql.dart';

Future<LibsqlClient> createClient() async {
  final client = LibsqlClient(
    url: 'libsql://your-database.turso.io',
    authToken: 'your-auth-token',
  );

  return client;
}
```

### テーブルの作成

```dart
Future<void> createTable(LibsqlClient client) async {
  await client.execute('''
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  ''');
}
```

### データの挿入

```dart
Future<void> insertUser(LibsqlClient client, String name, String email) async {
  await client.execute(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email],
  );
}

// 使用例
await insertUser(client, 'Alice', 'alice@example.com');
```

### データの取得

```dart
class User {
  final int id;
  final String name;
  final String email;

  User({required this.id, required this.name, required this.email});

  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      id: map['id'] as int,
      name: map['name'] as String,
      email: map['email'] as String,
    );
  }
}

Future<List<User>> getUsers(LibsqlClient client) async {
  final result = await client.execute('SELECT * FROM users');

  return result.rows.map((row) => User.fromMap(row)).toList();
}
```

## Provider での状態管理

### database_provider.dart

```dart
import 'package:flutter/foundation.dart';
import 'package:libsql/libsql.dart';

class DatabaseProvider extends ChangeNotifier {
  LibsqlClient? _client;
  List<User> _users = [];

  List<User> get users => _users;

  Future<void> initialize() async {
    _client = LibsqlClient(
      url: 'libsql://your-database.turso.io',
      authToken: 'your-auth-token',
    );

    await createTable();
    await loadUsers();
  }

  Future<void> createTable() async {
    await _client!.execute('''
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      )
    ''');
  }

  Future<void> loadUsers() async {
    final result = await _client!.execute('SELECT * FROM users');
    _users = result.rows.map((row) => User.fromMap(row)).toList();
    notifyListeners();
  }

  Future<void> addUser(String name, String email) async {
    await _client!.execute(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email],
    );
    await loadUsers();
  }

  Future<void> deleteUser(int id) async {
    await _client!.execute(
      'DELETE FROM users WHERE id = ?',
      [id],
    );
    await loadUsers();
  }

  @override
  void dispose() {
    _client?.close();
    super.dispose();
  }
}
```

### main.dart

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'database_provider.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => DatabaseProvider()..initialize(),
      child: MyApp(),
    ),
  );
}

class MyApp extends MaterialApp {
  MyApp({Key? key}) : super(
    key: key,
    home: UserListScreen(),
  );
}
```

### user_list_screen.dart

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'database_provider.dart';

class UserListScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Users'),
      ),
      body: Consumer<DatabaseProvider>(
        builder: (context, db, child) {
          if (db.users.isEmpty) {
            return Center(child: Text('No users found'));
          }

          return ListView.builder(
            itemCount: db.users.length,
            itemBuilder: (context, index) {
              final user = db.users[index];
              return ListTile(
                title: Text(user.name),
                subtitle: Text(user.email),
                trailing: IconButton(
                  icon: Icon(Icons.delete),
                  onPressed: () => db.deleteUser(user.id),
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddUserDialog(context),
        child: Icon(Icons.add),
      ),
    );
  }

  void _showAddUserDialog(BuildContext context) {
    final nameController = TextEditingController();
    final emailController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Add User'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameController,
              decoration: InputDecoration(labelText: 'Name'),
            ),
            TextField(
              controller: emailController,
              decoration: InputDecoration(labelText: 'Email'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              context.read<DatabaseProvider>().addUser(
                nameController.text,
                emailController.text,
              );
              Navigator.pop(context);
            },
            child: Text('Add'),
          ),
        ],
      ),
    );
  }
}
```

## Riverpod での状態管理

### database_provider.dart（Riverpod版）

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:libsql/libsql.dart';

final databaseProvider = Provider<LibsqlClient>((ref) {
  final client = LibsqlClient(
    url: 'libsql://your-database.turso.io',
    authToken: 'your-auth-token',
  );

  ref.onDispose(() => client.close());
  return client;
});

final usersProvider = FutureProvider<List<User>>((ref) async {
  final db = ref.watch(databaseProvider);
  final result = await db.execute('SELECT * FROM users');
  return result.rows.map((row) => User.fromMap(row)).toList();
});
```

## 環境変数の使用

### .env

```
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

### flutter_dotenv の使用

```yaml
# pubspec.yaml
dependencies:
  flutter_dotenv: ^5.0.0

flutter:
  assets:
    - .env
```

```dart
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<void> main() async {
  await dotenv.load();

  final client = LibsqlClient(
    url: dotenv.env['TURSO_DATABASE_URL']!,
    authToken: dotenv.env['TURSO_AUTH_TOKEN']!,
  );

  runApp(MyApp());
}
```

## エラーハンドリング

```dart
Future<void> safeExecute(LibsqlClient client, String sql) async {
  try {
    await client.execute(sql);
    print('Query executed successfully');
  } catch (e) {
    print('Error executing query: $e');
    // エラー処理
  }
}
```

## ベストプラクティス

### シングルトンパターン

```dart
class DatabaseManager {
  static final DatabaseManager _instance = DatabaseManager._internal();
  factory DatabaseManager() => _instance;

  DatabaseManager._internal();

  LibsqlClient? _client;

  Future<LibsqlClient> getClient() async {
    if (_client == null) {
      _client = LibsqlClient(
        url: dotenv.env['TURSO_DATABASE_URL']!,
        authToken: dotenv.env['TURSO_AUTH_TOKEN']!,
      );
    }
    return _client!;
  }
}
```

### オフライン対応

```dart
import 'package:connectivity_plus/connectivity_plus.dart';

class OfflineManager {
  final Connectivity _connectivity = Connectivity();

  Future<bool> isOnline() async {
    final result = await _connectivity.checkConnectivity();
    return result != ConnectivityResult.none;
  }

  Future<void> syncWhenOnline() async {
    if (await isOnline()) {
      // 同期処理
    }
  }
}
```

## Android設定

### android/app/src/main/AndroidManifest.xml

```xml
<manifest>
    <uses-permission android:name="android.permission.INTERNET" />
    <application>
        <!-- ... -->
    </application>
</manifest>
```

## iOS設定

### ios/Runner/Info.plist

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <false/>
</dict>
```

## 参考リンク

- [Flutter SDK リファレンス](./flutter-reference.md)
- [Providerパターン](https://pub.dev/packages/provider)
- [Riverpodパターン](https://pub.dev/packages/flutter_riverpod)
- [Turso CLI](../cli/README.md)
- [SDK一覧](./README.md)

## サンプルプロジェクト

完全なサンプルプロジェクトは、Turso公式GitHubリポジトリを参照してください：
https://github.com/tursodatabase/examples
