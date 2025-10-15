# Expo LocalAuthentication

## 概要

モバイルデバイスで生体認証（指紋/TouchID/FaceID）を実装するためのライブラリです。

## 主な機能

- 指紋と顔認識による認証をサポート
- AndroidとiOSで動作
- デバイスの認証機能を確認するメソッドを提供

## インストール

```bash
npx expo install expo-local-authentication
```

## 主要なメソッド

1. `authenticateAsync()`: 生体認証によるユーザー認証を試行
2. `hasHardwareAsync()`: デバイスが生体認証ハードウェアを持っているか確認
3. `isEnrolledAsync()`: 生体認証データが登録されているか確認
4. `supportedAuthenticationTypesAsync()`: 利用可能な認証タイプを判定

## 重要な制限事項

- FaceIDはExpo Goではサポートされていない
- iOSでFaceIDの完全なテストを行うには開発ビルドが必要

## 認証タイプ

- 指紋認証
- 顔認証
- 虹彩認証（Androidのみ）

## 設定

`app.json`でカスタムパーミッションメッセージや認証プロンプトなどのオプションを設定できます。

## パーミッション

- Android: `USE_BIOMETRIC`
- iOS: `NSFaceIDUsageDescription`が必要

このライブラリは、モバイルアプリケーションで安全なローカル認証を実装するための柔軟でクロスプラットフォームなアプローチを提供します。
