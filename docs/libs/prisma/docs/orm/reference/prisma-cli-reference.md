# Prisma CLIリファレンス

すべてのPrisma CLIコマンドの完全なリファレンスです。

## 主要コマンド

### init
```bash
npx prisma init [options]
```

### generate
```bash
npx prisma generate [options]
```

### migrate
```bash
npx prisma migrate dev [options]
npx prisma migrate deploy [options]
npx prisma migrate status [options]
npx prisma migrate reset [options]
```

### db
```bash
npx prisma db push [options]
npx prisma db pull [options]
npx prisma db seed [options]
```

### studio
```bash
npx prisma studio [options]
```

### format
```bash
npx prisma format [options]
```

### validate
```bash
npx prisma validate [options]
```

## 共通オプション

- `--schema`: スキーマファイルのパス
- `--env-file`: 環境変数ファイル
- `--help`: ヘルプを表示
- `--version`: バージョンを表示

詳細については、[公式ドキュメント](https://www.prisma.io/docs/orm/reference/prisma-cli-reference)を参照してください。
