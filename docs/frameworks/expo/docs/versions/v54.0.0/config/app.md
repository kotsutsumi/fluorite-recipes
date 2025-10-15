---
title: app.json / app.config.js
description: Expo アプリ構成で使用可能なプロパティのリファレンス。
maxHeadingDepth: 5
---

import { BookOpen02Icon } from '@expo/styleguide-icons/outline/BookOpen02Icon';

import schema from '~/public/static/schemas/v54.0.0/app-config-schema.json';
import AppConfigSchemaTable from '~/ui/components/AppConfigSchemaTable';
import { BoxLink } from '~/ui/components/BoxLink';

以下は、**app.json** または **app.config.json** の `"expo"` キーで使用できるプロパティのリストです。これらのプロパティは、**app.config.js** または **app.config.ts** の最上位オブジェクトに渡すことができます。

<BoxLink
  title="アプリ構成による構成"
  description="アプリの構成、さまざまなアプリ構成ファイルの違い、およびそれらを動的に使用する方法について説明します。"
  href="/workflow/configuration/"
  Icon={BookOpen02Icon}
/>

## プロパティ

<AppConfigSchemaTable schema={schema} />
