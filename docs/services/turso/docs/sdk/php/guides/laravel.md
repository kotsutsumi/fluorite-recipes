# Laravel + Turso 統合ガイド

Laravel アプリケーションで Turso データベースを使用する方法を説明します。

## セットアップ

### パッケージのインストール

```bash
composer require turso/libsql-laravel
```

### FFI の有効化

`php.ini` で FFI を有効にします：

```ini
ffi.enable=true
```

## データベース設定

### config/database.php

接続タイプに応じて設定を選択します：

#### ローカルのみ

```php
"connections" => [
    "libsql" => [
        "driver" => "libsql",
        "database" => database_path("database.db"),
    ]
]
```

#### リモートのみ

```php
"connections" => [
    "libsql" => [
        "driver" => "libsql",
        "url" => env("TURSO_DATABASE_URL"),
        "password" => env("TURSO_AUTH_TOKEN"),
    ]
]
```

#### 組み込みレプリカ

```php
"connections" => [
    "libsql" => [
        "driver" => "libsql",
        "database" => database_path("database.db"),
        "url" => env("TURSO_DATABASE_URL"),
        "password" => env("TURSO_AUTH_TOKEN"),
        "sync_interval" => env("TURSO_SYNC_INTERVAL", 300),
    ]
]
```

### 環境変数

`.env` ファイルに追加：

```env
DB_CONNECTION=libsql
TURSO_DATABASE_URL=libsql://[DATABASE-NAME]-[ORG].turso.io
TURSO_AUTH_TOKEN=your-auth-token-here
TURSO_SYNC_INTERVAL=300
```

## モデルとマイグレーション

### モデルの作成

```bash
php artisan make:model User -m
```

### マイグレーション

```php
// database/migrations/xxxx_create_users_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
```

マイグレーションを実行：

```bash
php artisan migrate
```

## CRUD 操作

### Create（作成）

```php
use App\Models\User;

// 単一レコード
$user = User::create([
    'name' => 'John Doe',
    'email' => 'john@example.com'
]);

// 複数レコード
User::insert([
    ['name' => 'Alice', 'email' => 'alice@example.com'],
    ['name' => 'Bob', 'email' => 'bob@example.com'],
]);
```

### Read（読み取り）

```php
// すべてのユーザー
$users = User::all();

// 条件付き取得
$users = User::where('name', 'John Doe')->get();

// 単一ユーザー
$user = User::find(1);
$user = User::where('email', 'john@example.com')->first();
```

### Update（更新）

```php
$user = User::find(1);
$user->name = 'Jane Doe';
$user->save();

// または
User::where('id', 1)->update(['name' => 'Jane Doe']);
```

### Delete（削除）

```php
$user = User::find(1);
$user->delete();

// または
User::where('name', 'Jane Doe')->delete();
```

## クエリビルダー

```php
use Illuminate\Support\Facades\DB;

// SELECT
$users = DB::table('users')->get();

// WHERE
$users = DB::table('users')
    ->where('name', 'John Doe')
    ->get();

// INSERT
DB::table('users')->insert([
    'name' => 'Alice',
    'email' => 'alice@example.com'
]);

// UPDATE
DB::table('users')
    ->where('id', 1)
    ->update(['name' => 'Alice Updated']);

// DELETE
DB::table('users')->where('id', 1)->delete();
```

## リレーション

### モデルの定義

```php
// app/Models/User.php
class User extends Model
{
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}

// app/Models/Post.php
class Post extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

### リレーションの使用

```php
// ユーザーの投稿を取得
$user = User::find(1);
$posts = $user->posts;

// 投稿のユーザーを取得
$post = Post::find(1);
$author = $post->user;

// Eager Loading
$users = User::with('posts')->get();
```

## トランザクション

```php
use Illuminate\Support\Facades\DB;

DB::transaction(function () {
    $user = User::create([
        'name' => 'Charlie',
        'email' => 'charlie@example.com'
    ]);

    Post::create([
        'user_id' => $user->id,
        'title' => 'First Post',
        'content' => 'Hello World'
    ]);
});
```

## コントローラー例

```php
// app/Http/Controllers/UserController.php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return view('users.index', compact('users'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
        ]);

        $user = User::create($validated);

        return redirect()
            ->route('users.index')
            ->with('success', 'User created successfully');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return redirect()
            ->route('users.index')
            ->with('success', 'User updated successfully');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()
            ->route('users.index')
            ->with('success', 'User deleted successfully');
    }
}
```

## 関連リンク

- [PHP SDK リファレンス](../reference.md)
- [Doctrine DBAL との統合](../orm/doctrine-dbal.md)
- [Laravel 公式ドキュメント](https://laravel.com/docs)
