# GLView

OpenGL ESグラフィックスをレンダリングするためのViewコンポーネントを提供するライブラリです。React Nativeアプリケーションで2Dおよび3Dグラフィックスを作成するために使用されます。

## 概要

GLViewは以下の機能を提供します：
- OpenGL ESレンダーターゲット
- WebGLレンダリングのサポート
- Android、iOS、Webとの互換性
- three.jsやprocessing.jsなどの高レベルグラフィックスライブラリとの統合

## インストール

```bash
npx expo install expo-gl
```

## 基本的な使用方法

```javascript
import { GLView } from 'expo-gl';
import { StyleSheet, View } from 'react-native';

function onContextCreate(gl) {
  // ビューポートを設定
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  // 背景色をクリア
  gl.clearColor(0, 1, 1, 1); // シアン
  gl.clear(gl.COLOR_BUFFER_BIT);

  // フレームを提示
  gl.endFrameEXP();
}

export default function App() {
  return (
    <View style={styles.container}>
      <GLView
        style={styles.glView}
        onContextCreate={onContextCreate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glView: {
    width: 300,
    height: 300,
  },
});
```

## API

### コンポーネント

#### `GLView`

OpenGL ESコンテキストを作成し、グラフィックスをレンダリングするためのViewコンポーネントです。

**Props:**

```typescript
type GLViewProps = {
  onContextCreate: (gl: WebGLRenderingContext) => void;
  msaaSamples?: number;
  enableExperimentalWorkletSupport?: boolean;
  style?: ViewStyle;
};
```

- `onContextCreate`: GLコンテキストが作成されたときに呼ばれるコールバック
  - `gl`: WebGLRenderingContextオブジェクト

- `msaaSamples`: マルチサンプリングアンチエイリアシングのサンプル数
  - デフォルト: 4
  - 0でMSAAを無効化

- `enableExperimentalWorkletSupport`: Reanimated workletサポートを有効化
  - 実験的機能

- `style`: 標準のReact Native Viewスタイル

### メソッド

#### `gl.endFrameEXP()`

レンダリングされたフレームを提示します。すべてのレンダリング操作の最後に呼び出す必要があります。

```javascript
function onContextCreate(gl) {
  // レンダリング処理
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // フレームを提示
  gl.endFrameEXP();
}
```

## 使用例

### 三角形を描画

```javascript
import { GLView } from 'expo-gl';

function onContextCreate(gl) {
  // シェーダーソース
  const vertexShaderSource = `
    attribute vec4 position;
    void main() {
      gl_Position = position;
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `;

  // シェーダーをコンパイル
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);

  // プログラムを作成
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  // 頂点データ
  const vertices = new Float32Array([
    0.0, 0.5,
    -0.5, -0.5,
    0.5, -0.5,
  ]);

  // バッファを作成
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // 属性を設定
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  // 描画
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  gl.endFrameEXP();
}

export default function App() {
  return (
    <GLView
      style={{ width: 300, height: 300 }}
      onContextCreate={onContextCreate}
    />
  );
}
```

### アニメーション

```javascript
import { GLView } from 'expo-gl';
import { useRef } from 'react';

export default function AnimatedGL() {
  const glRef = useRef();
  const colorRef = useRef(0);

  function onContextCreate(gl) {
    glRef.current = gl;

    const animate = () => {
      // 色を変更
      colorRef.current += 0.01;
      const color = Math.sin(colorRef.current);

      gl.clearColor(color, 0.5, 1 - color, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.endFrameEXP();

      requestAnimationFrame(animate);
    };

    animate();
  }

  return (
    <GLView
      style={{ width: 300, height: 300 }}
      onContextCreate={onContextCreate}
    />
  );
}
```

### スナップショットの取得

```javascript
import { GLView } from 'expo-gl';
import * as FileSystem from 'expo-file-system';

function onContextCreate(gl) {
  // レンダリング
  gl.clearColor(1, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.endFrameEXP();

  // スナップショットを取得
  const snapshot = await gl.takeSnapshotAsync({
    format: 'png',
    compress: 1,
  });

  console.log('スナップショット:', snapshot.uri);
}
```

### three.jsとの統合

```javascript
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

export default function ThreeJSExample() {
  let renderer, scene, camera;

  function onContextCreate(gl) {
    // レンダラーを作成
    renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    // シーンとカメラを作成
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // キューブを作成
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // アニメーションループ
    const animate = () => {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    animate();
  }

  return (
    <GLView
      style={{ width: 300, height: 300 }}
      onContextCreate={onContextCreate}
    />
  );
}
```

## 高度な機能

### ヘッドレスレンダリング

```javascript
import { GLView } from 'expo-gl';

async function renderOffscreen() {
  const gl = await GLView.createContextAsync();

  gl.viewport(0, 0, 512, 512);
  gl.clearColor(1, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const snapshot = await gl.takeSnapshotAsync();

  gl.destroy();

  return snapshot.uri;
}
```

### Reanimated Workletのサポート

```javascript
import { GLView } from 'expo-gl';
import { useSharedValue } from 'react-native-reanimated';

export default function WorkletExample() {
  const rotation = useSharedValue(0);

  function onContextCreate(gl) {
    'worklet';

    // Workletコンテキストでレンダリング
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.endFrameEXP();
  }

  return (
    <GLView
      style={{ width: 300, height: 300 }}
      onContextCreate={onContextCreate}
      enableExperimentalWorkletSupport
    />
  );
}
```

### テクスチャの読み込み

```javascript
import { GLView } from 'expo-gl';
import { Asset } from 'expo-asset';

async function onContextCreate(gl) {
  // アセットを読み込み
  const asset = Asset.fromModule(require('./texture.png'));
  await asset.downloadAsync();

  // テクスチャを作成
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // テクスチャデータを読み込み
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    asset
  );

  // テクスチャパラメータを設定
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // レンダリング...
  gl.endFrameEXP();
}
```

## サポートされているWebGL機能

GLViewは標準のWebGL APIをサポートしています：

- バッファ操作（VBO、IBO）
- シェーダー（頂点シェーダー、フラグメントシェーダー）
- テクスチャ（2D、キューブマップ）
- フレームバッファオブジェクト
- レンダーバッファオブジェクト
- ブレンディングとデプステスト
- ステンシルバッファ

## 制限事項

### リモートデバッグ

GLViewは、リモートJavaScriptデバッグと完全には互換性がありません。デバッグが必要な場合は、Flipperまたはネイティブデバッグツールを使用してください。

### 未実装のWebGL2メソッド

一部のWebGL2RenderingContextメソッドは実装されていません。WebGL 1.0機能の使用を推奨します。

### Workletの制約

Workletランタイムには特定のコード制約があります：
- 非同期操作は制限されます
- 一部のJavaScript機能が利用できません
- パフォーマンス特性が異なります

## プラットフォーム互換性

| プラットフォーム | サポート | OpenGL/WebGL |
|----------------|---------|--------------|
| Android        | ✅      | OpenGL ES 3.0 |
| iOS            | ✅      | OpenGL ES 3.0 |
| Web            | ✅      | WebGL 1.0/2.0 |

## パフォーマンスのヒント

1. **バッチ描画**: 複数のオブジェクトを一度の描画呼び出しで処理
2. **テクスチャアトラス**: 複数のテクスチャを1つにまとめる
3. **LOD**: 距離に応じて詳細度を調整
4. **カリング**: 表示されないオブジェクトを描画しない
5. **シェーダー最適化**: 複雑な計算を頂点シェーダーで実行

## ベストプラクティス

1. **`endFrameEXP()`を呼び出す**: すべてのレンダリング操作の最後に必須
2. **エラーチェック**: `gl.getError()`でエラーを確認
3. **リソース管理**: 使用しないバッファやテクスチャを削除
4. **アスペクト比**: ビューポートのアスペクト比を正しく設定
5. **高レベルライブラリ**: three.jsなどの使用を検討

## トラブルシューティング

### 何も表示されない

```javascript
// 問題: endFrameEXP()を呼び忘れ
gl.clear(gl.COLOR_BUFFER_BIT);
// gl.endFrameEXP(); ← 必須

// 解決:
gl.clear(gl.COLOR_BUFFER_BIT);
gl.endFrameEXP(); // フレームを提示
```

### パフォーマンスの問題

```javascript
// 問題: 毎フレーム新しいバッファを作成
function render() {
  const buffer = gl.createBuffer(); // 遅い
  // ...
}

// 解決: バッファを再利用
const buffer = gl.createBuffer(); // 一度だけ
function render() {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // ...
}
```

## 高レベルライブラリ

GLViewで直接作業する代わりに、高レベルライブラリの使用を推奨します：

### expo-three

```bash
npx expo install expo-three three
```

three.jsを簡単に統合できます。

### expo-processing

```bash
npx expo install expo-processing
```

processing.jsスタイルの描画APIを提供します。

## 関連リソース

- [WebGL Specification](https://www.khronos.org/webgl/)
- [three.js Documentation](https://threejs.org/docs/)
- [OpenGL ES Reference](https://www.khronos.org/opengles/)
