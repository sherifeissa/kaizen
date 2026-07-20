# Kaizen — sync setup (laptop + phone + iPad)

This puts your tracker at one private web link, synced across every device, with your
data stored in your own Google Sheet. Free, no passwords to manage, ~5 minutes, once.

Everything stays in **your** Google account. Nobody else can open it.

---

## Steps

1. **Make a Sheet.** Go to https://sheets.new — a blank Google Sheet opens. Name it
   "Kaizen" (top-left). You won't touch it again; it's just the storage.

2. **Open the script editor.** In that Sheet: menu **Extensions → Apps Script**.
   A code editor opens in a new tab.

3. **Paste the server code.**
   - Delete whatever is in the `Code.gs` file shown.
   - Open the file **`Code.gs`** from this folder, copy all of it, paste it in.

4. **Add the app page.**
   - In the editor, click the **`+`** next to "Files" → **HTML**.
   - Name it exactly **`Index`** (it becomes `Index.html`).
   - Delete the default contents, then open **`tracker.html`** from this folder,
     copy everything, and paste it in.
   - Click the **save** icon (💾).

5. **Deploy it.**
   - Top-right **Deploy → New deployment**.
   - Click the gear ⚙ next to "Select type" → choose **Web app**.
   - Set **Execute as: Me**, and **Who has access: Only myself**.
   - Click **Deploy**. Approve the permissions when asked (it's your own script).
   - ⚠️ **Don't be alarmed by the warning screen.** Google shows "Google hasn't verified
     this app" because it's your own private script. Click **Advanced → Go to Kaizen
     (unsafe) → Allow**. It's safe — "unsafe" just means Google didn't review it;
     you wrote it.
   - Copy the **Web app URL** it gives you. That link IS your tracker.

6. **Use it everywhere.** Open that URL on your laptop, phone, and iPad.
   On the phone/iPad: tap Share → **Add to Home Screen** so it opens like an app.
   The dot at the top-right shows sync status (green = Synced).

---

## Part 2 — Reminders on your phone + Garmin (via a free Telegram bot)

This adds prayer-time messages (refreshed daily for Dubai), a 5:30 AM pushups nudge,
and a 9 PM review that pings only what you haven't logged. It uses a **free Telegram
bot** — messages arrive in Telegram on your phone, and your Garmin mirrors them.

Why Telegram and not ntfy: the free public ntfy.sh server rate-limits per IP, and all
Google Apps Script traffic shares the same IPs, so it hits the limit (HTTP 429). A
Telegram bot authenticates as you, so there's no shared-IP limit — and it's free.

1. **Create a bot.** In Telegram, open **@BotFather** (blue checkmark) → tap Start →
   send `/newbot` → give it a name and a username ending in `bot`. Copy the **token**
   it gives you (looks like `123456789:AAH...`).

2. **Create your Config file.** In your Apps Script project (from Part 1): click
   **+ → Script**, name it exactly **`Config`**, delete the default code, and paste in
   all of **`Config.example.gs`** from this folder. Set `TELEGRAM_TOKEN` to your token.
   Save (💾). *(This is your private config — it stays in your project and is never
   committed to git.)*

3. **Add the reminders script.** Click **+ → Script** again, name it **`Reminders`**,
   delete the default code, and paste in all of **`Reminders.gs`**. Save (💾). Then
   open your new bot in Telegram and tap **Start** / send it any message.

4. **Find your chat ID.** In the function dropdown pick **`getMyChatId`** → Run →
   open the **Execution log** → copy the number after `YOUR CHAT ID:` → paste it into
   `TELEGRAM_CHAT_ID` in your **`Config`** file. Save (💾).
   (First run asks for permissions — Advanced → Go to … → Allow.)

5. **Test it.** Pick **`testNotification`** → Run → you should get a Telegram message.

6. **Turn it on.** Pick **`setupReminders`** → Run. You get a "Kaizen connected"
   message, and all schedules are installed.

7. **Make Garmin mirror it.** In the Garmin Connect app, enable **Smart Notifications**,
   and make sure phone notifications are allowed for Telegram.

That's it — it refreshes prayer times automatically every night, so you never touch it.
You can tweak the movement/evening times or per-prayer minute offsets in your `Config` file.

---

## Notes

- **Privacy:** "Only myself" means the link only works while you're signed into your
  own Google account. Sharing the link with someone else does nothing for them.
- **Offline:** if you log something with no connection, it saves on that device and
  syncs next time you open it online. You'll never lose an entry.
- **Updating the app later:** if I give you a new `tracker.html`, paste it into the
  `Index` file again, then **Deploy → Manage deployments → edit (✏) → Version: New
  version → Deploy**. Same URL keeps working.
- **You don't need this file to use the app.** Double-clicking `tracker.html` still
  works as a single-device offline version.
- **Reminders run server-side.** The Telegram reminders fire from Google's servers on
  schedule, whether or not your laptop or the app is open. Prayer times refresh nightly.
