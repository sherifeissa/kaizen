/* ============================================================
   data.js — export for coaching, and backup / restore
   ============================================================ */

function exportData(){
  const days = [...Array(14)].map((_,i)=>addDays(new Date(),-13+i));
  let out = "MY LAST 2 WEEKS — Kaizen\n\n";
  days.forEach(d=>{ const raw = S.days[key(d)]; if (!raw || dayScore(day(d))===0) return; const r = day(d);
    out += `${shortDate(d)}: prayers ${prayed(r)}/5 (${onTime(r)} on time)`;
    out += r.move ? `, pushups ${r.move}/${moveGoal()} sets (${r.move*SET_REPS})` : "";
    out += r.shadow ? `, shadow jumping ${r.shadow}/${shadowGoal()} sets (${r.shadow*SHADOW_REPS})` : "";
    out += r.diet ? `, diet ${r.diet==='full'?'on plan':"didn't binge"}` : "";
    out += "\n"; });
  const wk = S.weeks[weekKey(new Date())]; if (wk && wk.plan) out += `\nThis week's plan: ${wk.plan}${wk.moved?' (moved ✓)':''}\n`;
  copyOrShow(out, "exportBtn", "✓ Copied — paste it to your coach");
}

function backupData(){ copyOrShow("DAILYANCHOR"+JSON.stringify(S), "backupBtn", "✓ Backup copied — paste it on your other device"); }

function restoreData(){
  const t = prompt("Paste your backup code here:"); if (!t) return;
  try{
    const j = JSON.parse(t.replace(/^DAILYANCHOR/, "")); if (!j.days) throw 0;
    S = normalize(j); save(); renderInsights(); alert("Restored ✓");
  }catch(e){ alert("That code didn't look right. Copy the whole thing from Backup and try again."); }
}

function copyOrShow(text, btnId, msg){
  const done = ()=>{ const b = el(btnId); const o = b.textContent; b.textContent = msg; setTimeout(()=>{ b.textContent = o; }, 1900); };
  try{
    if (navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(done).catch(()=>prompt("Copy this:", text)); }
    else { prompt("Copy this:", text); }
  }catch(e){ prompt("Copy this:", text); }
}
