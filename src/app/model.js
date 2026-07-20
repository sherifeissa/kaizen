/* ============================================================
   model.js — dates, the day record, and habit scoring
   ============================================================ */

let cursor = new Date(); // which day the Today tab is showing

function key(d){ const x = new Date(d.getTime() - d.getTimezoneOffset()*60000); return x.toISOString().slice(0,10); } // local calendar date
function fmt(d){ return d.toLocaleDateString(undefined, { weekday:"long", day:"numeric", month:"long" }); }
function fmtFull(d){ return d.toLocaleDateString(undefined, { weekday:"long", day:"numeric", month:"long", year:"numeric" }); }
function shortDate(d){ return d.toLocaleDateString(undefined, { weekday:"short", day:"numeric", month:"short" }); }
function isToday(d){ return key(d) === key(new Date()); }
function addDays(d,n){ const x = new Date(d); x.setDate(x.getDate()+n); return x; }
function weekKey(d){ const x = new Date(d); const day = (x.getDay()+6)%7; x.setDate(x.getDate()-day); return key(x); } // Monday-anchored

function moveGoal(){ return S.settings.moveGoal || 4; }       // pushup sets target (each set = 25)
function shadowGoal(){ return S.settings.shadowGoal || 4; }   // shadow-jumping sets target (each set = 100)
const SET_REPS = 25;
const SHADOW_REPS = 100;

function blankDay(){ return { prayers:[0,0,0,0,0], move:0, shadow:0, diet:null, comeback:false }; }
function day(d){
  const k = key(d); let r = S.days[k];
  if (!r){ r = blankDay(); S.days[k] = r; }
  if (!Array.isArray(r.prayers)){ const n = +r.prayer||0; r.prayers = [0,0,0,0,0].map((_,i)=> i<n ? 1 : 0); } // migrate old prayer count
  // strip retired habits (money / learning / reflection) from any older records
  delete r.learn; delete r.learnNote; delete r.saveAmt; delete r.saveSurv; delete r.reflection; delete r.prayer;
  if (r.move === undefined)   r.move = 0;
  if (r.shadow === undefined) r.shadow = 0;
  r.move   = Math.max(0, Math.min(r.move,   moveGoal()));     // clamp sets to current goal
  r.shadow = Math.max(0, Math.min(r.shadow, shadowGoal()));
  return r;
}

// prayer cell states: 0 none, 1 on time, 2 late/made-up
function prayed(r){ return r.prayers.filter(x=>x>0).length; }
function onTime(r){ return r.prayers.filter(x=>x===1).length; }

function pPrayer(r){ const p = prayed(r); return p===5 ? 2 : p>=1 ? 1 : 0; }
function pMove(r){ const g = moveGoal(), m = Math.min(r.move||0, g); return m>=g ? 2 : m>=1 ? 1 : 0; }
function pShadow(r){ const g = shadowGoal(), m = Math.min(r.shadow||0, g); return m>=g ? 2 : m>=1 ? 1 : 0; }
function pDiet(r){ return r.diet==="full" ? 2 : r.diet==="surv" ? 1 : 0; }

function dayScore(r){ return pPrayer(r)+pMove(r)+pShadow(r)+pDiet(r); } // 0..8
function dayLevel(r){ const s = dayScore(r); if (s===0) return 0; if (s>=7) return 3; if (s>=4) return 2; return 1; }
function missed(d){ const k = key(d); const r = S.days[k]; return !r || dayScore(day(d))===0; }
function currentStreak(){ let n=0, d=new Date(); if (missed(d)) d=addDays(d,-1); while(!missed(d)){ n++; d=addDays(d,-1); } return n; }
