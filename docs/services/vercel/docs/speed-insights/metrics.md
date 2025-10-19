# Speed Insightsメトリクス

## Real Experience Score（RES）

### リアルユーザーモニタリング

VercelのReal Experience Score（RES）は、Lighthouseのようなシミュレートされたパフォーマンスツールとは異なり、ユーザーのデバイスから収集された実際のデータポイントを使用します。このアプローチにより、リアルタイムのインサイトが提供され、開発者は以下が可能になります：

- 実際のユーザー体験を理解
- デプロイメント後のパフォーマンス変更を追跡
- 全体的なユーザー体験を改善

## Core Web Vitalsの説明

GoogleとWeb Performance Working Groupによって定義された主要なパフォーマンスメトリクス：

| メトリクス | 説明 | 目標値 |
|--------|-------------|--------------|
| **Largest Contentful Paint (LCP)** | ページ開始から最大コンテンツ要素が表示されるまでの時間 | 2.5秒以下 |
| **Cumulative Layout Shift (CLS)** | ユーザーが経験したレイアウトシフトを定量化 | 0.1以下 |
| **Interaction to Next Paint (INP)** | ユーザーの操作から次のフレームのレンダリングまでの時間 | 200ミリ秒以下 |
| **First Contentful Paint (FCP)** | ページ開始から最初のDOMコンテンツのレンダリングまでの時間 | 1.8秒以下 |
| **First Input Delay (FID)** | 最初のユーザー操作からブラウザの応答までの時間 | 100ミリ秒以下 |
| **Total Blocking Time (TBT)** | メインスレッドがブロックされていた合計時間 | 800ミリ秒未満 |
| **Time to First Byte (TTFB)** | リソースリクエストから最初のレスポンスバイトまでの時間 | 800ミリ秒未満 |

## スコアの解釈

パフォーマンススコアは色分けされています：

- **0-49（赤）**: 悪い（Poor）
- **50-89（オレンジ）**: 改善が必要（Needs Improvement）
- **90-100（緑）**: 良好（Good）

### パーセンタイル計算

- **P75**: 最も速い75%のユーザー
- **P90**: 最も速い90%のユーザー
- **P95**: 最も速い95%のユーザー
- **P99**: 最も速い99%のユーザー

## スコアの決定

Vercelは、HTTP Archiveの実世界データを使用してパフォーマンススコアを計算し、実際のWebサイトパフォーマンスデータに基づいてメトリクス値を0〜100のスケールにマッピングします。

## データポイント

訪問ごとに最大6つのデータポイントを追跡できます：

### ページロード時のデータポイント

- **TTFB** (Time to First Byte)
- **FCP** (First Contentful Paint)
- **LCP** (Largest Contentful Paint)
- **CLS** (Cumulative Layout Shift)

### インタラクション時のデータポイント

- **INP** (Interaction to Next Paint)
- **FID** (First Input Delay) - レガシー

## メトリクスの詳細説明

### Largest Contentful Paint (LCP)

**測定対象**: 最大のコンテンツ要素のレンダリング時間

**良好なLCPを達成するには**:
- 画像を最適化
- サーバーレスポンス時間を短縮
- クリティカルなリソースをプリロード
- クライアントサイドのレンダリングを削減

### Cumulative Layout Shift (CLS)

**測定対象**: 予期しないレイアウトシフト

**良好なCLSを達成するには**:
- 画像と埋め込みに明示的なサイズを設定
- 動的コンテンツ用のスペースを確保
- Webフォントの読み込みを最適化
- アニメーションにはtransformを使用

### Interaction to Next Paint (INP)

**測定対象**: ユーザー操作の応答性

**良好なINPを達成するには**:
- JavaScriptの実行を最適化
- メインスレッドの作業を削減
- 入力ハンドラを最適化
- レンダリングブロックを最小化

### First Contentful Paint (FCP)

**測定対象**: 最初のコンテンツのレンダリング時間

**良好なFCPを達成するには**:
- レンダリングブロックリソースを削減
- CSSを最適化
- Webフォントの読み込みを最適化
- サーバーレスポンス時間を短縮

### Time to First Byte (TTFB)

**測定対象**: サーバーの応答時間

**良好なTTFBを達成するには**:
- サーバーパフォーマンスを最適化
- CDNを使用
- リソースをキャッシュ
- DNSルックアップを削減

## メトリクスの重み付け

Vercelは各メトリクスに異なる重みを適用してRESを計算します：

| メトリクス | 重み |
|---------|------|
| LCP | 30% |
| INP | 30% |
| CLS | 25% |
| FCP | 15% |

## データ収集の仕組み

### 測定方法

- ネイティブブラウザAPIを使用
- 各ページロードでメトリクスを報告
- ファーストパーティのデータ取り込み方法を利用

### サンプリング

- デフォルトではすべてのデータポイントが使用される
- サンプルレートを設定してコストを削減可能
- データの精度とコストのバランスを取る

## ベストプラクティス

### メトリクスの監視

- 複数のメトリクスを追跡
- 時間経過に伴う傾向を監視
- パーセンタイルに注目

### 最適化の優先順位付け

- スコアの低いメトリクスに焦点を当てる
- 影響の大きい問題から開始
- 継続的に測定

### パフォーマンスバジェット

- 各メトリクスの目標を設定
- 定期的に確認
- 退行を防ぐ

## 次のステップ

- [Speed Insightsの使用](/docs/speed-insights/using-speed-insights)
- [最適化手法を学ぶ](https://web.dev/vitals/)
- [パッケージ設定](/docs/speed-insights/package)

## 関連リソース

- [Core Web Vitals](https://web.dev/vitals/)
- [Web Performance Working Group](https://www.w3.org/webperf/)
- [Speed Insights概要](/docs/speed-insights)
