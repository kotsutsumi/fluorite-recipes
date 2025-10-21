# Tauri + Turso 統合ガイド

Tauri アプリケーションで Turso データベースを使用する方法を説明します。

## セットアップ

### Cargo.toml の設定

```toml
[dependencies]
libsql = "0.3"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
reqwest = { version = "0.11", features = ["json"] }
dotenvy = "0.15"
tauri = { version = "1.5", features = [] }
```

### 環境変数の設定

`src-tauri/.env` を作成：

```env
TURSO_DATABASE_URL=libsql://[DATABASE-NAME]-[ORG].turso.io
TURSO_AUTH_TOKEN=your-auth-token-here
```

### Rust コマンドの実装

```rust
use libsql::Database;
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
struct Item {
    id: i64,
    name: String,
}

#[tauri::command]
async fn get_items() -> Result<Vec<Item>, String> {
    dotenvy::dotenv().ok();

    let url = env::var("TURSO_DATABASE_URL")
        .map_err(|_| "TURSO_DATABASE_URL not set".to_string())?;
    let token = env::var("TURSO_AUTH_TOKEN")
        .map_err(|_| "TURSO_AUTH_TOKEN not set".to_string())?;

    let db = Database::open_remote_with_connector(url, token)
        .await
        .map_err(|e| e.to_string())?;

    let conn = db.connect().map_err(|e| e.to_string())?;

    let mut rows = conn
        .query("SELECT id, name FROM items", ())
        .await
        .map_err(|e| e.to_string())?;

    let mut items = Vec::new();

    while let Some(row) = rows.next().await.map_err(|e| e.to_string())? {
        items.push(Item {
            id: row.get(0).map_err(|e| e.to_string())?,
            name: row.get(1).map_err(|e| e.to_string())?,
        });
    }

    Ok(items)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_items])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### フロントエンドでの使用

```typescript
import { invoke } from "@tauri-apps/api/tauri";

interface Item {
  id: number;
  name: string;
}

async function fetchItems() {
  try {
    const items: Item[] = await invoke("get_items");
    console.log("Items:", items);
    return items;
  } catch (error) {
    console.error("Failed to fetch items:", error);
  }
}
```

## 関連リンク

- [Rust SDK リファレンス](../reference.md)
- [Tauri 公式ドキュメント](https://tauri.app)
