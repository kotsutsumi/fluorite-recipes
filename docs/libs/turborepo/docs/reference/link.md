# link

リポジトリをRemote Cacheプロバイダーにリンクします。

```bash
turbo link
```

選択されたオーナー(ユーザーまたは組織)は、Remote Cachingを通じてキャッシュアーティファクトを共有できるようになります。

## フラグオプション

### `--api <url>`

Remote CacheプロバイダーのURLを指定します。

```bash
turbo link --api=https://example.com
```

### `--yes`

すべてのプロンプトに対してyesと答えます。

```bash
turbo link --yes
```

### `--scope <scope>`

リンクするスコープを指定します。例えば、Vercelを使用する場合、これはVercelチームのスラッグになります。

```bash
turbo link --scope=your-team
```
