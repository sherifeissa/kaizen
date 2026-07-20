/**
 * Kaizen — Reminders engine (via a free Telegram bot).
 *
 * What this does:
 *   - Every prayer: sends a message at the exact Dubai prayer time (refreshed daily).
 *   - 05:30 every morning: "25 wall pushups" nudge.
 *   - 21:00 every evening: reads your Sheet and pings ONLY what's still un-logged.
 * Messages arrive in Telegram on your phone, and your Garmin mirrors them.
 *
 * Setup (do once, in order):
 *   1. In Telegram, message @BotFather -> /newbot -> follow prompts -> copy the bot TOKEN.
 *   2. Paste the token below, save, open YOUR new bot in Telegram and tap Start / send "hi".
 *   3. Run getMyChatId() -> it logs YOUR CHAT ID -> paste it below, save.
 *   4. Run testNotification() -> you get a Telegram message.
 *   5. Run setupReminders() -> schedules everything.
 *
 * All settings live in Config.gs (copy it from Config.example.gs). This file
 * reads TELEGRAM_TOKEN, TELEGRAM_CHAT_ID, LAT/LNG, PRAYER_* , the reminder
 * hours, and TZ from there — nothing to edit here.
 */

// STEP 3 helper: after messaging your bot once, run this to find your chat id (check the Execution log).
function getMyChatId() {
  if (!TELEGRAM_TOKEN || TELEGRAM_TOKEN.indexOf("PASTE") === 0) { Logger.log("Set TELEGRAM_TOKEN first, then message your bot, then run this."); return; }
  var res = UrlFetchApp.fetch("https://api.telegram.org/bot" + TELEGRAM_TOKEN + "/getUpdates", { muteHttpExceptions:true });
  var d = JSON.parse(res.getContentText());
  if (d.result && d.result.length) {
    var last = d.result[d.result.length - 1];
    var chat = (last.message && last.message.chat) || (last.my_chat_member && last.my_chat_member.chat) || (last.edited_message && last.edited_message.chat);
    if (chat) { Logger.log("YOUR CHAT ID: " + chat.id + "   <-- paste this into TELEGRAM_CHAT_ID above"); return; }
  }
  Logger.log("No messages found yet. Open your bot in Telegram, tap Start (or send any message), then run getMyChatId again.");
}

// STEP 4: confirm it works (sends a message + logs Telegram's reply).
function testNotification() {
  var res = tg_("Kaizen test", "If you see this in Telegram, you're all set.");
  if (res) { Logger.log("HTTP status: " + res.getResponseCode()); Logger.log("Response body: " + res.getContentText()); }
}

// STEP 5: install all schedules. Re-run any time you change a time above.
function setupReminders() {
  removeTriggers_(["rebuildPrayerTriggers","morningPushups","eveningReview","firePrayer"]);
  ScriptApp.newTrigger("rebuildPrayerTriggers").timeBased().atHour(2).nearMinute(0).everyDays(1).inTimezone(TZ).create();
  ScriptApp.newTrigger("morningPushups").timeBased().atHour(PUSHUP_HOUR).nearMinute(PUSHUP_MIN).everyDays(1).inTimezone(TZ).create();
  ScriptApp.newTrigger("eveningReview").timeBased().atHour(EVENING_HOUR).nearMinute(EVENING_MIN).everyDays(1).inTimezone(TZ).create();
  rebuildPrayerTriggers(); // also schedule today's remaining prayers right now
  tg_("Kaizen connected", "Reminders are live: prayers, pushups, and a 9pm review. You'll get them here and on your watch.");
}

// Fetches today's Dubai prayer times and creates an exact trigger for each upcoming prayer.
function rebuildPrayerTriggers() {
  removeTriggers_(["firePrayer"]);
  var dd = Utilities.formatDate(new Date(), TZ, "dd-MM-yyyy");
  var url = "https://api.aladhan.com/v1/timings/" + dd + "?latitude=" + LAT + "&longitude=" + LNG + "&method=" + PRAYER_METHOD + "&school=" + ASR_SCHOOL;
  var res = UrlFetchApp.fetch(url, { muteHttpExceptions:true });
  var timings = JSON.parse(res.getContentText()).data.timings;
  var prayers = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];
  var map = {};
  var ymd = Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd");
  prayers.forEach(function(p){
    var hm = timings[p].split(":");                 // "HH:MM"
    var when = new Date(ymd + "T" + pad_(+hm[0]) + ":" + pad_(+hm[1]) + ":00+04:00");
    if (PRAYER_OFFSETS[p]) when = new Date(when.getTime() + PRAYER_OFFSETS[p]*60000);
    if (when.getTime() > Date.now() + 30000) {      // only future prayers today
      var trig = ScriptApp.newTrigger("firePrayer").timeBased().at(when).create();
      map[trig.getUniqueId()] = p + "|" + timings[p];
    }
  });
  PropertiesService.getScriptProperties().setProperty("prayerMap", JSON.stringify(map));
}

// Fires at each prayer time.
function firePrayer(e) {
  var map = JSON.parse(PropertiesService.getScriptProperties().getProperty("prayerMap") || "{}");
  var name = "Prayer", time = "";
  if (e && e.triggerUid && map[e.triggerUid]) { var parts = map[e.triggerUid].split("|"); name = parts[0]; time = parts[1]; }
  tg_("It's time for " + name, name + (time ? (" — " + time) : "") + ". Pray it on time, then tap it green in Kaizen.");
}

function morningPushups() {
  tg_("Move first", "You're up — a set of 25 wall pushups and a round of shadow jumping before anything else. Then log it. A few still counts.");
}

// Reads the Sheet, pings only what's still open today (gentle, not a guilt nag).
function eveningReview() {
  var open = openItemsToday_();
  if (open.length === 0) {
    tg_("Day closed", "Everything's logged. That's a full vote for who you're becoming.");
  } else {
    tg_("Before you sleep", "Still open today: " + open.join(", ") + ". Two minutes to close the day — even the survival version counts. Never miss twice.");
  }
}

function openItemsToday_() {
  var S = {};
  try { S = JSON.parse(loadData() || "{}"); } catch (err) {}
  var key = Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd");
  var r = (S.days || {})[key] || null;
  var open = [];
  var prayed = (r && r.prayers) ? r.prayers.filter(function(x){ return x > 0; }).length : 0;
  if (prayed < 5)          open.push("prayers (" + prayed + "/5)");
  if (!r || !r.move)       open.push("pushups");
  if (!r || !r.shadow)     open.push("shadow jumping");
  if (!r || !r.diet)       open.push("diet");
  return open;
}

// ─────────────── helpers ───────────────
function tg_(title, message) {
  if (!TELEGRAM_TOKEN || TELEGRAM_TOKEN.indexOf("PASTE") === 0 || !TELEGRAM_CHAT_ID || String(TELEGRAM_CHAT_ID).indexOf("PASTE") === 0) {
    Logger.log("Set TELEGRAM_TOKEN and TELEGRAM_CHAT_ID first."); return null;
  }
  var opts = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({ chat_id: String(TELEGRAM_CHAT_ID), text: title + "\n" + message, disable_web_page_preview: true }),
    muteHttpExceptions: true
  };
  for (var i = 0; i < 4; i++) {
    try { return UrlFetchApp.fetch("https://api.telegram.org/bot" + TELEGRAM_TOKEN + "/sendMessage", opts); }
    catch (e) { if (i === 3) throw e; Utilities.sleep(1500); }
  }
}
function removeTriggers_(names) {
  ScriptApp.getProjectTriggers().forEach(function(t){
    if (names.indexOf(t.getHandlerFunction()) >= 0) ScriptApp.deleteTrigger(t);
  });
}
function pad_(n) { return (n < 10 ? "0" : "") + n; }
