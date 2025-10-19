# Cron Jobsの使用量と料金

## 概要

Cron JobsはすべてのVercelプランで利用可能です。

## アカウントあたりのCron Jobs数

| プラン       | Cron Jobs | スケジュール                     |
|------------|-----------|------------------------------|
| Hobby      | 2         | 1日1回トリガー         |
| Pro        | 40        | 無制限のcron呼び出し   |
| Enterprise | 100       | 無制限のcron呼び出し   |

**重要な注意**: 各プロジェクトには、プロジェクトあたり20のcron jobsのハード制限があります。

## Hobbyのスケジューリング制限

Hobbyプランでは、Vercelはcron job呼び出しの正確なタイミングを保証できません。例えば、`0 1 * * *`(毎日午前1時)として設定されたcron jobは、午前1:00から午前1:59の間のいつかにトリガーされます。

「より具体的なcron jobの実行については、[Pro](/docs/plans/pro)プランにアップグレードしてください。」

## 料金

cron jobsはすべてのプランに含まれています。

使用量は関数の実行に基づきます:

- Vercel Functionsと同じ[使用量](/docs/limits)および[料金](/pricing)制限に従います
- 詳細については、[Functionsの制限と料金](/docs/functions/usage-and-pricing)を参照してください
