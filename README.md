# Kaizen

A personal, single-file habit and motivation tracker. It logs the handful of daily
actions that keep you on track — prayers, wall pushups, shadow jumping, and diet —
scores each day, protects a streak, and reviews the last two weeks so the days don't
just pass by.

It runs three ways from **one HTML file**: double-click it offline, or deploy it to
your own free Google Apps Script web app for private cross-device sync (laptop, phone,
iPad) with data stored in your own Google Sheet. An optional Telegram bot sends
prayer-time, movement, and end-of-day reminders that also mirror to a Garmin watch.

Everything stays in **your** Google account. There is no server, no signup, and no
third party — you deploy your own copy.

> **Heads up:** this repo does not include a `Config.gs`. That file holds your private
> Telegram token and chat ID and is intentionally git-ignored. You create it from the
> committed template — see [Configuration](#configuration).

## Features

- **Four daily habits**, each scored 0–2 (missed / survival / full):
  - 🕌 **Prayers** — five tri-state cells (on time → late/made-up → not prayed)
  - 💪 **Wall pushups** — 1 set = 25 reps; log up to 4 sets/day
  - 🤸 **Shadow jumping** — 1 set = 100 reps; log up to 4 sets/day
  - 🥗 **Diet** — on plan / didn't binge / off
- **Streak & anti-relapse logic** — a "never miss twice" warning after two empty days
  and a *comeback mode* that shrinks the day down to a single prayer when life blows up.
- **This week** tab — one weekly "future plan" move and a 7-day board.
- **Insights** tab — 14-day presence, per-habit consistency, prayer punctuality,
  pushup and shadow-jumping volume, plus export / backup / restore.
- **Offline-first sync** — logs save on-device instantly and sync to your Sheet when
  online; near-live refresh on focus and a background heartbeat.
- **Daily anime motivation** — an English shōnen quote (Naruto, One Piece, Fullmetal
  Alchemist, …) and a daily wallpaper, both rotating once per day. On the phone the
  wallpaper is a subtle backdrop; on desktop it's showcased in a framed card on the
  info rail. A curated SFW set (Dragon Ball, Naruto, Demon Slayer, Attack on Titan,
  Bleach, One Piece, Hunter x Hunter, My Hero Academia, Jujutsu Kaisen) with the series
  credited and a night-sky gradient fallback if a wallpaper can't load.
- **Responsive by design** — a "Shinkai Night" glass-panel UI that adapts to context:
  a single focused column as a mobile web app, and a two-panel dashboard (habits on the
  left; a live rail with streak, this-week board, and character art on the right) on
  desktop web.

## Project structure

```
tracker.html          built app (generated — do not edit by hand)
build.js              bundles src/ into tracker.html  →  run: node build.js
src/
  index.html          page shell (markers where css/js get injected)
  styles.css          all styling
  app/
    state.js          state, localStorage, Google Apps Script sync
    model.js          dates, the daily record, habit scoring
    views.js          the three tabs (Today / This week / Insights) + desktop info rail
    data.js           export for coaching + backup / restore
    art.js            daily anime quote + rotating shōnen wallpaper
    main.js           wiring & boot (loads last)
Code.gs               Apps Script: serves the app + stores data in your Sheet
Reminders.gs          Apps Script: prayer / movement / evening reminders via Telegram
Config.example.gs     configuration template → copy to Config.gs (git-ignored)
SETUP.md              one-time deploy + reminders walkthrough
```

## Quick start

**Just try it (offline, one device):** open `tracker.html` in a browser. Data is saved
in that browser's local storage.

**Full setup (private sync + reminders):** follow [`SETUP.md`](SETUP.md). In short:

1. Create a Google Sheet → **Extensions → Apps Script**.
2. Paste in `Code.gs`, add the HTML file `Index` with the contents of `tracker.html`.
3. Create your `Config.gs` from the template (see below), then deploy as a **Web app**
   (*Execute as: Me · Who has access: Only myself*).
4. *(Optional)* Add `Reminders.gs` and run `setupReminders()` for Telegram + Garmin nudges.

## Configuration

All personal and secret settings live in **`Config.gs`**, which is **not committed**
(it's in `.gitignore`). The repo ships `Config.example.gs` as a template.

1. Copy the template:
   ```bash
   cp Config.example.gs Config.gs
   ```
   In the Apps Script editor, create a script file named exactly **`Config`** and paste
   your filled-in copy there.
2. Fill in your values:

   | Setting | What it is |
   | --- | --- |
   | `TELEGRAM_TOKEN` | Bot token from [@BotFather](https://t.me/BotFather) (reminders only) |
   | `TELEGRAM_CHAT_ID` | Your chat ID — run `getMyChatId()` once to find it |
   | `SHEET_ID` | Leave **empty** for a Sheet-bound script; set it only for a standalone script |
   | `LAT`, `LNG` | Your coordinates for prayer times (default: Dubai) |
   | `PRAYER_METHOD`, `ASR_SCHOOL`, `PRAYER_OFFSETS` | Prayer calculation settings |
   | `PUSHUP_HOUR/MIN`, `EVENING_HOUR/MIN`, `TZ` | Reminder schedule and timezone |

Everything else (savings-style goals, currency) has been removed — the four habits and
their targets are the whole app. To change a target, edit `moveGoal` / `shadowGoal`
defaults in `src/app/state.js` and rebuild.

## Developing

The app ships as one file, but the source is split for readability and stitched together
by a tiny build step (no bundler, no dependencies).

```bash
node build.js        # regenerates tracker.html from src/
```

1. Edit the relevant file in `src/`.
2. Run `node build.js`.
3. If you sync via Apps Script, paste the new `tracker.html` into the `Index` file and
   redeploy a new version (see [`SETUP.md`](SETUP.md) → Notes).

## Wallpapers & credits

The daily wallpapers are a small curated list of direct links to SFW anime art hosted on
[wallhaven.cc](https://wallhaven.cc); all artwork belongs to its respective creators and
studios. This repo redistributes **no image files** — only URLs — and the list is fully
configurable: edit the `WALLPAPERS` array in `src/app/art.js` (each entry is a series name
+ image URL) and rebuild. The quotes are characters' English (subbed) lines, credited to
character and series.

## Privacy

- **"Only myself"** access means the web-app link works only while you're signed into
  your own Google account. Sharing the link does nothing for anyone else.
- Reminders run server-side on Google's schedule, whether or not the app is open.
- Your `Config.gs` (token, chat ID) never leaves your Apps Script project and is never
  committed to git.
