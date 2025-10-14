# Expo Structured Field Values v0 - 技術仕様

## 概要

**バージョン**: 0
**ベース仕様**: IETF RFC 8941 Structured Field Values for HTTP
**ステータス**: Work in Progress（進行中）

Expo Structured Field Values (SFV) は、IETF RFC 8941のカスタム実装であり、HTTPプロトコルにおけるヘッダー構文の形式化とネストされたデータの処理を促進するために設計されています。

## 目的

この実装の主な目的は以下の通りです：

1. **ヘッダー構文の形式化**: HTTPヘッダーに一貫した構造を提供
2. **ネストされたデータの処理**: 複雑なデータ構造をHTTPヘッダーで表現
3. **相互運用性**: 標準化されたデータフォーマットによる互換性の向上

## 実装範囲

現在のバージョン0では、RFC 8941の**サブセット**のみを実装しています。

### サポートされている機能

#### 1. キー値（Dictionary Keys）

すべてのキー値をサポートしています。

**例**:
```
field-name: key1=value1, key2=value2
```

#### 2. アイテム（Items）

以下のアイテムタイプをサポートしています：

- **文字列（String）**: テキストデータ
- **整数（Integer）**: 整数値
- **小数（Decimal）**: 浮動小数点数

**例**:
```
field-name: "string-value", 42, 3.14
```

#### 3. ディクショナリ（Dictionaries）

キーと値のペアを含む構造化されたデータ。

**例**:
```
field-name: key1="value1", key2=123, key3=4.56
```

## RFC 8941 との関係

### 完全実装されている要素

- Dictionary keys
- String items
- Integer items
- Decimal items
- Dictionaries

### 未実装の要素

RFC 8941には他にも多くの機能がありますが、バージョン0では以下が未実装です：

- Boolean items
- Binary content
- Lists
- Inner lists
- Parameters
- Token values

## 使用例

### 基本的なディクショナリ

```http
expo-updates-manifest: runtimeVersion="1.0.0", launchAsset="bundle.js"
```

### 文字列、整数、小数の組み合わせ

```http
expo-config: name="MyApp", version=1, timeout=30.5
```

### 複雑なヘッダー構造

```http
expo-platform-config: ios=(version="16.0", build=123), android=(version="13.0", build=456)
```

## 技術的な制限事項

### 現在の制限

1. **限定的なデータ型**: 文字列、整数、小数のみサポート
2. **ネストの深さ**: 深いネスト構造は未サポート
3. **パラメータ**: アイテムパラメータは未実装

### パフォーマンス考慮事項

- ヘッダーサイズの制限に注意
- 複雑すぎる構造は避ける
- パース処理のオーバーヘッドを考慮

## Expoエコシステムでの使用

### Expo Updates

Expo Updatesプロトコルでは、マニフェストメタデータの構造化に使用されます。

```http
expo-updates-metadata: channel="production", environment="live"
```

### EAS Build

ビルド設定の伝達に使用されます。

```http
eas-build-config: profile="production", platform="all"
```

## 実装ガイドライン

### パースの推奨事項

```typescript
// 疑似コード
interface ParsedDictionary {
  [key: string]: string | number;
}

function parseExpoSFV(headerValue: string): ParsedDictionary {
  // キー=値のペアを分割
  // データ型を識別（文字列、整数、小数）
  // ディクショナリオブジェクトを返す
}
```

### エラーハンドリング

- 無効な構文は適切にエラーを返す
- 未知のキーは無視する
- デフォルト値を提供する

## セキュリティ考慮事項

### インジェクション攻撃

- ヘッダー値の適切なサニタイズ
- 特殊文字のエスケープ処理

### サイズ制限

- ヘッダーサイズの制限を設定
- 巨大なヘッダーによるDoS攻撃を防止

## 将来の拡張

### 計画されている機能（将来のバージョン）

1. **Boolean サポート**: true/false値のサポート
2. **List サポート**: 配列データのサポート
3. **バイナリコンテンツ**: Base64エンコードされたバイナリデータ
4. **パラメータ**: アイテムレベルのメタデータ

### RFC 8941 完全準拠への道

将来のバージョンでは、RFC 8941の完全実装を目指します。

## 開発者向けリソース

### 参考文献

- [RFC 8941 - Structured Field Values for HTTP](https://www.rfc-editor.org/rfc/rfc8941.html)
- [Expo Updates プロトコル仕様](https://docs.expo.dev/technical-specs/expo-updates-1/)

### ツールとライブラリ

現在、Expo SFV v0のパースと生成をサポートする公式ライブラリは開発中です。

## まとめ

Expo Structured Field Values v0 は、HTTPヘッダーにおける構造化データの表現を標準化するための最初のステップです。現在はRFC 8941のサブセット実装ですが、将来的にはより包括的なサポートを目指しています。

この仕様は**進行中**（Work in Progress）であり、フィードバックと改善提案を歓迎します。

## 変更履歴

- **v0**: 初回リリース - 基本的なディクショナリとアイテムのサポート

## 貢献

Expo Structured Field Valuesの改善に貢献したい場合は、GitHubリポジトリで問題を報告するか、プルリクエストを送信してください。
