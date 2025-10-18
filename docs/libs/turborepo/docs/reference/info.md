# info

Turborepoに関するデバッグ情報を出力します。

```bash
turbo info
```

## 出力例

```txt
CLI:
 Version: 2.3.0
 Path to executable: /path/to/turbo
 Daemon status: Running
 Package manager: pnpm

Platform:
 Architecture: aarch64
 Operating system: macos
 Available memory (MB): 12810
 Available CPU cores: 10

Environment:
 CI: None
 Terminal (TERM): xterm-256color
 Terminal program (TERM_PROGRAM): tmux
 Terminal program version (TERM_PROGRAM_VERSION): 3.4
 Shell (SHELL): /bin/zsh
 stdin: false
```

このコマンドは、3つの主要なセクションにわたって包括的なデバッグ情報を提供します:

1. **CLI詳細**: バージョン、実行可能ファイルのパス、デーモンステータス、パッケージマネージャー
2. **プラットフォーム情報**: アーキテクチャ、OS、メモリ、CPUコア
3. **環境変数とシステム構成**: CI、ターミナル、シェル情報など
