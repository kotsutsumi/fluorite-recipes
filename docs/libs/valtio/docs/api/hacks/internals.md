---
title: 'Internals'
section: 'API'
subSection: 'Hacks'
description: ''
---

Valtioは内部機能の一部を公開しています。
これはアプリ開発者向けではありません。自己責任で使用してください。

# `unstable_getInternalStates`

この関数は内部状態を公開します。このような状態を変更すると、誤った動作が発生する可能性があります。これを使用するには、[ソースコード](https://github.com/pmndrs/valtio/blob/main/src/vanilla.ts)を徹底的に理解する必要があります。

# `unstable_replaceInternalFunction`

この関数は、一部の内部関数を置き換える方法を公開します。簡単に機能を壊す可能性があります。これを使用するには、[ソースコード](https://github.com/pmndrs/valtio/blob/main/src/vanilla.ts)を徹底的に理解する必要があります。
