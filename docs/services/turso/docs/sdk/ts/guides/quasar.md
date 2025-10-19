# Quasar + Turso 統合ガイド

Quasar フレームワークで Turso データベースを使用する方法を説明します。

## セットアップ手順

### 1. libSQL SDK のインストール

```bash
npm install @libsql/client
```

### 2. 環境変数の設定

`.env.local` ファイルを作成：

```env
VITE_TURSO_DATABASE_URL=libsql://[DATABASE-NAME]-[ORG].turso.io
VITE_TURSO_AUTH_TOKEN=your-auth-token-here
```

### 3. Quasar 設定の変更

`quasar.conf.js` を編集：

```javascript
module.exports = function () {
  return {
    build: {
      target: {
        browser: ["es2020", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node16",
      },
      extendViteConf(config) {
        config.optimizeDeps = {
          esbuildOptions: {
            target: "es2020",
          },
        };
      },
    },
  };
};
```

### 4. libSQL クライアントの設定

`src/boot/turso.js` を作成：

```javascript
import { createClient } from "@libsql/client/web";

const turso = createClient({
  url: import.meta.env.VITE_TURSO_DATABASE_URL,
  authToken: import.meta.env.VITE_TURSO_AUTH_TOKEN,
});

export default turso;
export { turso };
```

## 実装例

### Composition API での使用

```vue
<template>
  <q-page class="q-pa-md">
    <h1>Todo リスト</h1>

    <q-list v-if="items">
      <q-item v-for="item in items" :key="item.id">
        <q-item-section>{{ item.title }}</q-item-section>
      </q-item>
    </q-list>

    <q-spinner v-else />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { turso } from "boot/turso";

const items = ref(null);

onMounted(async () => {
  const { rows } = await turso.execute("SELECT * FROM todos");
  items.value = rows;
});
</script>
```

### データの作成

```vue
<template>
  <q-page class="q-pa-md">
    <q-form @submit="onSubmit">
      <q-input v-model="title" label="タイトル" required />
      <q-btn type="submit" label="作成" color="primary" />
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { turso } from "boot/turso";
import { useQuasar } from "quasar";

const $q = useQuasar();
const title = ref("");

const onSubmit = async () => {
  try {
    await turso.execute({
      sql: "INSERT INTO todos (title) VALUES (?)",
      args: [title.value],
    });

    $q.notify({
      type: "positive",
      message: "Todo が作成されました",
    });

    title.value = "";
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "作成に失敗しました",
    });
  }
};
</script>
```

## サンプルプロジェクト

GitHub に Todo アプリの例があります。

## 関連リンク

- [TypeScript SDK リファレンス](../reference.md)
- [Quasar 公式ドキュメント](https://quasar.dev)
