# アセットの選択と除外

## アセット選択の使用

### SDK 52より前

```json
{
  "extra": {
    "updates": {
      "assetPatternsToBeBundled": [
        "app/images/**/*.png"
      ]
    }
  }
}
```

### SDK 52以降

```json
{
  "updates": {
    "assetPatternsToBeBundled": [
      "app/images/**/*.png"
    ]
  }
}
```

これにより、アップデートに含めるアセットを指定し、アップロードとダウンロードサイズを削減できます。

## アセット含有の検証

コマンド:
```bash
npx expo-updates assets:verify <dir>
```

アップデート公開時に必要なすべてのアセットが含まれることを検証します。

### 主なコマンドオプション

- `<dir>`: プロジェクトディレクトリ
- `-a, --asset-map-path`: assetmap.jsonへのパス
- `-e, --exported-manifest-path`: metadata.jsonへのパス
- `-b, --build-manifest-path`: app.manifestへのパス
- `-p, --platform`: プラットフォームを指定（android/ios）

## 例

[動作例リポジトリ](https://github.com/expo/UpdatesAPIDemo)がアセット選択とEAS Update機能のデモンストレーションで利用可能です。

## 重要な注意

`assetPatternsToBeBundled`が指定されていない場合、バンドラーによって解決されたすべてのアセットがアップデートに含まれます（SDK 49以前の動作）。
