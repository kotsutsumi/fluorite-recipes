# WebSocketの処理

Edge Functionsは、ブラウザクライアントとの双方向通信を促進するWebSocketサーバーのホスティングをサポートしています。

## 機能

これにより、以下のことが可能になります:
- チャットやライブアップデートなどのリアルタイムアプリケーションの構築
- 外部API用のWebSocketリレーサーバーの作成
- 着信および発信WebSocket接続の確立

## WebSocketサーバーの作成

### Denoの例

```typescript
Deno.serve((req) => {
  const upgrade = req.headers.get('upgrade') || ''
  if (upgrade.toLowerCase() != 'websocket') {
    return new Response("request isn't trying to upgrade to WebSocket.", { status: 400 })
  }
  const { socket, response } = Deno.upgradeWebSocket(req)
  socket.onopen = () => console.log('socket opened')
  socket.onmessage = (e) => {
    console.log('socket message:', e.data)
    socket.send(new Date().toString())
  }
  socket.onerror = (e) => console.log('socket errored:', e.message)
  socket.onclose = () => console.log('socket closed')
  return response
})
```

### アウトバウンドWebSocket

Edge Functionから別のサーバーへのアウトバウンドWebSocket接続を確立できます。これにより、OpenAI Realtime APIのリレーサーバーなどのWebSocketプロキシサーバーを作成できます。

```typescript
Deno.serve(async (req) => {
  // クライアントからのWebSocket接続を受け入れ
  const { socket: clientSocket, response } = Deno.upgradeWebSocket(req)

  // 外部サービスへのWebSocket接続を確立
  const externalWs = new WebSocket('wss://external-service.com/ws')

  // クライアントからのメッセージを外部サービスに転送
  clientSocket.onmessage = (e) => {
    externalWs.send(e.data)
  }

  // 外部サービスからのメッセージをクライアントに転送
  externalWs.onmessage = (e) => {
    clientSocket.send(e.data)
  }

  return response
})
```

## 認証

WebSocketブラウザクライアントはカスタムヘッダーを送信できないため、Edge Functionsは通常のJWT認証ヘッダーチェックを実行できません。

オプション:
- サーブ/デプロイ時に`--no-verify-jwt`を指定してJWT検証をスキップ
- URLクエリパラメータ経由でJWTを渡す
- カスタム認証プロトコルを使用

### 認証の例

```typescript
const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
)

Deno.serve((req) => {
  const url = new URL(req.url)
  const jwt = url.searchParams.get('jwt')

  if (!jwt) {
    return new Response('Unauthorized', { status: 401 })
  }

  // JWTを検証
  const { socket, response } = Deno.upgradeWebSocket(req)

  socket.onopen = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(jwt)
      if (error || !user) {
        socket.close(1008, 'Unauthorized')
        return
      }
      console.log('Authenticated user:', user.id)
    } catch (error) {
      socket.close(1011, 'Authentication failed')
    }
  }

  socket.onmessage = (e) => {
    // 認証されたユーザーのメッセージを処理
    console.log('Message from user:', e.data)
  }

  return response
})
```

## クライアント側の例

### JavaScriptクライアント

```javascript
// JWT認証なし
const ws = new WebSocket('wss://your-project.supabase.co/functions/v1/websocket-function')

// JWT認証あり
const jwt = 'your-jwt-token'
const ws = new WebSocket(`wss://your-project.supabase.co/functions/v1/websocket-function?jwt=${jwt}`)

ws.onopen = () => {
  console.log('Connected')
  ws.send('Hello Server!')
}

ws.onmessage = (event) => {
  console.log('Received:', event.data)
}

ws.onerror = (error) => {
  console.error('WebSocket error:', error)
}

ws.onclose = () => {
  console.log('Disconnected')
}
```

## 実用例

### チャットルーム

```typescript
const rooms = new Map<string, Set<WebSocket>>()

Deno.serve((req) => {
  const url = new URL(req.url)
  const room = url.searchParams.get('room') || 'default'

  const { socket, response } = Deno.upgradeWebSocket(req)

  socket.onopen = () => {
    if (!rooms.has(room)) {
      rooms.set(room, new Set())
    }
    rooms.get(room)!.add(socket)
    console.log(`User joined room: ${room}`)
  }

  socket.onmessage = (e) => {
    // ルーム内の全ユーザーにブロードキャスト
    const sockets = rooms.get(room)
    if (sockets) {
      sockets.forEach((s) => {
        if (s !== socket && s.readyState === WebSocket.OPEN) {
          s.send(e.data)
        }
      })
    }
  }

  socket.onclose = () => {
    const sockets = rooms.get(room)
    if (sockets) {
      sockets.delete(socket)
      if (sockets.size === 0) {
        rooms.delete(room)
      }
    }
    console.log(`User left room: ${room}`)
  }

  return response
})
```

## ベストプラクティス

1. **エラー処理**: 常に`onerror`ハンドラーを実装
2. **接続管理**: 接続を適切にクリーンアップ
3. **認証**: 機密データにはJWT検証を実装
4. **ハートビート**: 長時間接続には定期的なpingを実装
5. **スケーリング**: 大規模なリアルタイム機能にはSupabase Realtimeの使用を検討

## 制限事項

- WebSocket接続はEdge Functionの実行時間制限の対象です
- 接続数はプロジェクトのリソース制限に依存します
- カスタムヘッダーによる認証はブラウザクライアントではサポートされていません
