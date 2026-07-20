/**
 * Config.example.gs — configuration template.
 *
 * ▸ THIS file is the safe-to-commit template (no secrets).
 * ▸ Copy it to a file named `Config.gs`, fill in your real values, and keep
 *   THAT one out of git (it's already listed in .gitignore).
 *
 * In the Apps Script editor: create a script file named exactly `Config`
 * and paste your filled-in copy there. All .gs files share one global scope,
 * so Code.gs and Reminders.gs read these constants directly.
 */

// ─────────────── Telegram reminders (Reminders.gs) ───────────────
// From @BotFather, e.g. "123456789:AAH-xxxxxxxxxxxxxxxxxxxx"
const TELEGRAM_TOKEN   = "PASTE-YOUR-BOT-TOKEN-HERE";
// Run getMyChatId() once to find this number.
const TELEGRAM_CHAT_ID = "PASTE-YOUR-CHAT-ID-HERE";

// ─────────────── Storage (Code.gs) ───────────────
// Leave EMPTY when the script is bound to its Sheet (Extensions → Apps Script
// from inside the Sheet) — it uses the active spreadsheet automatically.
// Set it to a Sheet ID (the long string in the Sheet URL between /d/ and /edit)
// only if you run this as a STANDALONE script not attached to a Sheet.
const SHEET_ID = "";

// ─────────────── Prayer times & location (Reminders.gs) ───────────────
const LAT = 25.2048, LNG = 55.2708;   // Dubai — change to your city
const PRAYER_METHOD = 8;              // 8 = Gulf Region (matches UAE)
const ASR_SCHOOL = 0;                 // 0 = Standard (Shafi, UAE default), 1 = Hanafi
const PRAYER_OFFSETS = { Fajr:0, Dhuhr:0, Asr:0, Maghrib:0, Isha:0 }; // minutes, to match your local timetable exactly

// ─────────────── Reminder schedule (Reminders.gs) ───────────────
const PUSHUP_HOUR = 5,  PUSHUP_MIN = 30;   // morning movement nudge
const EVENING_HOUR = 21, EVENING_MIN = 0;  // evening "what's still open" review
const TZ = "Asia/Dubai";                   // your timezone (UAE is always UTC+4)
