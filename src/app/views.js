/* ============================================================
   views.js — rendering the three tabs (Today / Week / Insights)
   ============================================================ */

let V = "today";
function render(){ if (V==="today") renderToday(); else if (V==="week") renderWeek(); else renderInsights(); renderRail(); }

/* ---------------- DESKTOP INFO RAIL (wide screens only) ---------------- */
function renderRail(){
  const rail = el("rail"); if (!rail) return;
  const st = currentStreak();
  const wk = weekKey(new Date()); const w = S.weeks[wk] || {};
  const days7 = [...Array(7)].map((_,i)=>{ const d=addDays(new Date(),-6+i); const lv=missed(d)?0:dayLevel(day(d)); return `<div class="cd s${lv} ${isToday(d)?'today':''}" title="${fmt(d)}"></div>`; }).join("");
  const art = (typeof ART_TODAY !== "undefined" && ART_TODAY)
    ? `<div class="railcard art"><div class="railart" style="background-image:url('${ART_TODAY.u}')"></div><div class="tiny dim" style="margin-top:8px">${esc(ART_TODAY.s)}</div></div>`
    : "";
  rail.innerHTML =
    art +
    `<div class="railcard"><div class="big" style="color:var(--gold)">${st}</div><div class="tiny dim">day streak alive</div></div>` +
    `<div class="railcard"><div class="sec-title" style="text-align:left">This week</div>` +
      `<div class="chain" style="grid-template-columns:repeat(7,1fr)">${days7}</div>` +
      (w.plan ? `<div class="small muted" style="margin-top:9px;text-align:left;line-height:1.45">${esc(w.plan)}</div>`
              : `<div class="tiny dim" style="margin-top:9px;text-align:left">No weekly move set yet.</div>`) +
    `</div>`;
}

function el(id){ return document.getElementById(id); }
function esc(s){ return (s||"").replace(/[&<>"]/g, c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c])); }
function stCls(p){ return p===2 ? "full" : p===1 ? "surv" : ""; }
function stTxt(p,full,surv){ return p===2 ? full : p===1 ? surv : "—"; }
function exitComeback(r){ if (r.comeback && dayScore(r)>0) r.comeback = false; }

/* ---------------- TODAY ---------------- */
function renderToday(){
  const r = day(cursor), st = currentStreak();
  el("topDate").textContent  = fmtFull(cursor);                                  // full date, always shown on Today
  el("topTitle").textContent = isToday(cursor) ? "Today" : fmt(cursor).split(",")[0];
  el("streak").textContent   = st>0 ? "🔥 "+st+" day"+(st>1?"s":"")+" alive" : "";

  let banner = "";
  if (isToday(cursor)){
    if (r.comeback){
      banner = `<div class="banner come"><b>Welcome back.</b> Forget the others today — just pray. That's the whole task: one thread, re-tied. Tomorrow we add one more. <span class="dim">(log anything to exit comeback mode)</span></div>`;
    } else if (missed(addDays(cursor,-1)) && missed(addDays(cursor,-2)) && dayScore(r)===0){
      banner = `<div class="banner warn"><b>Two empty days behind you.</b> This is the exact moment it usually dies. Don't let today be the third — do <b>one</b> thing now, even a single prayer. Never miss twice.</div>`;
    }
  }

  const pNames = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];
  const prayerCells = r.prayers.map((s,i)=>{ const cls = s===1?"on":s===2?"late":""; const cap = s===1?"on time":s===2?"late":"—";
    return `<div class="pd ${cls}" data-p="${i}"><b>${pNames[i]}</b><small>${cap}</small></div>`; }).join("");

  const g = moveGoal(), mv = Math.min(r.move||0, g);
  const setCells = [...Array(g)].map((_,i)=>{ const n=i+1; return `<div class="pd ${mv>=n?'on':''}" data-m="${n}"><b>${n}×</b><small>${n*SET_REPS}</small></div>`; }).join("");

  const sg = shadowGoal(), sv = Math.min(r.shadow||0, sg);
  const shadowCells = [...Array(sg)].map((_,i)=>{ const n=i+1; return `<div class="pd ${sv>=n?'on':''}" data-s="${n}"><b>${n}×</b><small>${n*SHADOW_REPS}</small></div>`; }).join("");

  el("view").innerHTML = `
  ${!isToday(cursor)?navDay():""}
  ${banner}
  ${isToday(cursor)?quoteHTML():""}

  <div class="card">
    <div class="hrow"><div class="hicon">🕌</div>
      <div><div class="hname">Prayers</div><div class="hsub">Tap: on time → late/made-up → not prayed</div></div>
      <div class="hstate ${stCls(pPrayer(r))}">${prayed(r)}/5${onTime(r)<prayed(r)?` · ${onTime(r)} on time`:""}</div></div>
    <div class="ctl"><div class="cells">${prayerCells}</div>
      <div class="legend"><span><i style="background:var(--green)"></i>on time</span><span><i style="background:var(--amber)"></i>late / made up</span><span><i style="background:var(--card2);border:1px solid var(--line)"></i>not prayed</span></div>
    </div>
  </div>

  <div class="card">
    <div class="hrow"><div class="hicon">💪</div>
      <div><div class="hname">Wall pushups</div><div class="hsub">Goal: ${g}×${SET_REPS} (${g*SET_REPS}) · Survival: 1 set</div></div>
      <div class="hstate ${stCls(pMove(r))}">${mv}/${g} sets</div></div>
    <div class="ctl"><div class="cells">${setCells}</div>
      <div class="tiny dim" style="margin-top:9px">Tap how many sets of ${SET_REPS} you've done today. Tap the same one again to undo.</div>
    </div>
  </div>

  <div class="card">
    <div class="hrow"><div class="hicon">🤸</div>
      <div><div class="hname">Shadow jumping</div><div class="hsub">Goal: ${sg}×${SHADOW_REPS} (${sg*SHADOW_REPS}) · Survival: 1 set</div></div>
      <div class="hstate ${stCls(pShadow(r))}">${sv}/${sg} sets</div></div>
    <div class="ctl"><div class="cells">${shadowCells}</div>
      <div class="tiny dim" style="margin-top:9px">Tap how many sets of ${SHADOW_REPS} you've done today. Tap the same one again to undo.</div>
    </div>
  </div>

  <div class="card">
    <div class="hrow"><div class="hicon">🥗</div>
      <div><div class="hname">Diet</div><div class="hsub">Planned cheat meal = on plan · binge ≠ on plan</div></div>
      <div class="hstate ${stCls(pDiet(r))}">${stTxt(pDiet(r),"on plan","held")}</div></div>
    <div class="ctl seg" data-h="diet">
      <button data-v="full" class="${r.diet==='full'?'on-f':''}">On plan</button>
      <button data-v="surv" class="${r.diet==='surv'?'on-s':''}">Didn't binge</button>
      <button data-v="none">Off</button></div>
  </div>

  ${isToday(cursor)?`<button class="btn ghost" id="comebackBtn">${r.comeback?"I&rsquo;m okay — exit comeback mode":"I fell off / life blew up — reset my expectations"}</button>`:""}
  ${!isToday(cursor)?`<button class="btn ghost" id="goToday">← Back to today</button>`:""}
  `;

  document.querySelectorAll("[data-p]").forEach(c=>c.onclick=()=>{ const i=+c.dataset.p; r.prayers[i]=(r.prayers[i]+1)%3; exitComeback(r); save(); renderToday(); });
  document.querySelectorAll("[data-m]").forEach(c=>c.onclick=()=>{ const n=+c.dataset.m; r.move=(r.move===n)?n-1:n; exitComeback(r); save(); renderToday(); });
  document.querySelectorAll("[data-s]").forEach(c=>c.onclick=()=>{ const n=+c.dataset.s; r.shadow=(r.shadow===n)?n-1:n; exitComeback(r); save(); renderToday(); });
  document.querySelectorAll("[data-h=diet] button").forEach(b=>b.onclick=()=>{ const v=b.dataset.v; r.diet=v==="none"?null:v; exitComeback(r); save(); renderToday(); });
  if (el("comebackBtn")) el("comebackBtn").onclick=()=>{ r.comeback=!r.comeback; save(); renderToday(); };
  if (el("goToday")) el("goToday").onclick=()=>{ cursor=new Date(); renderToday(); };
}
function navDay(){ return `<div class="navday"><button id="prevD">‹</button><div class="d">${fmt(cursor)}</div><button id="nextD" ${isToday(cursor)?'disabled style="opacity:.3"':''}>›</button></div>`; }

/* ---------------- THIS WEEK ---------------- */
function renderWeek(){
  el("topDate").textContent=""; el("topTitle").textContent="This week"; el("streak").textContent="";
  const wk = weekKey(new Date()); if (!S.weeks[wk]) S.weeks[wk]={ plan:"", moved:false }; const w = S.weeks[wk];
  const days7 = [...Array(7)].map((_,i)=>{ const d=addDays(new Date(),-6+i); const lv=missed(d)?0:dayLevel(day(d)); return `<div class="cd s${lv} ${isToday(d)?'today':''}" title="${fmt(d)}"></div>`; }).join("");
  el("view").innerHTML = `
  <div class="card">
    <div class="sec-title">The weekly question — your steering wheel</div>
    <div class="hrow"><div class="hicon">🎯</div><div><div class="hname">My future plan, this week</div><div class="hsub">Not daily. One real move toward the bigger thing.</div></div></div>
    <div class="ctl"><label class="fld">What's the ONE move this week?</label>
      <textarea id="plan" placeholder="e.g. 1 hour on the side plan, send that message, read 20 pages…">${esc(w.plan)}</textarea>
      <div class="toggle ${w.moved?'on':''}" id="movedTog" style="margin-top:12px"><div class="box">${w.moved?'✓':''}</div><span>I moved it forward this week</span></div></div>
  </div>
  <div class="card"><div class="sec-title">Last 7 days — still on the board?</div>
    <div class="chain" style="grid-template-columns:repeat(7,1fr)">${days7}</div>
    <div class="tiny dim" style="margin-top:10px">Empty = missed · amber = survival · green = full. The goal isn't all-green — it's no two empties in a row.</div></div>
  <div class="card"><div class="sec-title">Remember the rule</div>
    <div class="small muted" style="line-height:1.55"><b style="color:var(--txt)">Never pause — only shrink.</b> A crushing week drops the habits to their survival minimum (~90 seconds), it doesn't stop them. The thread never gets cut, so there's nothing to "come back" from.<br><br><b style="color:var(--txt)">Never miss twice.</b> One zero day is life. Two in a row is how it dies. That's the only hard rule.</div></div>`;
  el("plan").onchange=e=>{ w.plan=e.target.value; save(); };
  el("movedTog").onclick=()=>{ w.moved=!w.moved; save(); renderWeek(); };
}

/* ---------------- INSIGHTS ---------------- */
function renderInsights(){
  el("topDate").textContent="Last 14 days"; el("topTitle").textContent="Insights"; el("streak").textContent="";
  const days = [...Array(14)].map((_,i)=>addDays(new Date(),-13+i));
  const present = days.filter(d=>!missed(d)).length;
  function rate(fn){ const hit = days.filter(d=>{ const r=S.days[key(d)]; return r && fn(day(d))>0; }).length; return Math.round(100*hit/14); }
  const rPray=rate(pPrayer), rMove=rate(pMove), rShadow=rate(pShadow), rDiet=rate(pDiet);
  const onTimeTot = days.reduce((a,d)=>{ const r=S.days[key(d)]; return a+(r?onTime(day(d)):0); }, 0);
  const prayedTot = days.reduce((a,d)=>{ const r=S.days[key(d)]; return a+(r?prayed(day(d)):0); }, 0);
  const onTimePct = prayedTot ? Math.round(100*onTimeTot/prayedTot) : 0;
  const setsTot = days.reduce((a,d)=>{ const r=S.days[key(d)]; return a+(r?Math.min(r.move||0,moveGoal()):0); }, 0);
  const shadowTot = days.reduce((a,d)=>{ const r=S.days[key(d)]; return a+(r?Math.min(r.shadow||0,shadowGoal()):0); }, 0);

  const chainDays = [...Array(15)].map((_,i)=>addDays(new Date(),-14+i));
  const chain = chainDays.map(d=>{ const lv=missed(d)?0:dayLevel(day(d)); return `<div class="cd s${lv} ${isToday(d)?'today':''}" title="${fmt(d)}"></div>`; }).join("");
  const spark = days.map(d=>{ const r=S.days[key(d)]; const p=r?prayed(day(d)):0; const ot=r?onTime(day(d)):0;
    const col = p===0?'var(--line)':(ot===p?'var(--green)':'var(--amber)');
    return `<div style="flex:1;display:flex;align-items:flex-end"><div style="width:100%;height:${(p/5)*100||4}%;min-height:3px;border-radius:3px 3px 0 0;background:${col}"></div></div>`; }).join("");

  el("view").innerHTML = `
  <div class="card full"><div class="sec-title">Were you present, or did the days pass by?</div>
    <div class="hrow" style="gap:18px">
      <div><div class="big">${present}<span class="muted" style="font-size:15px">/14</span></div><div class="tiny dim">days you showed up</div></div>
      <div><div class="big">${currentStreak()}</div><div class="tiny dim">day streak now</div></div>
      <div><div class="big">${onTimePct}<span class="muted" style="font-size:15px">%</span></div><div class="tiny dim">prayers on time</div></div>
    </div>
    <div class="chain" style="margin-top:16px">${chain}</div></div>

  <div class="card"><div class="sec-title">Consistency by habit (14 days)</div>
    ${statRow("🕌 Prayers",rPray)}${statRow("💪 Pushups",rMove)}${statRow("🤸 Shadow jump",rShadow)}${statRow("🥗 Diet",rDiet)}</div>

  <div class="card"><div class="sec-title">Prayers — daily (green = all on time)</div>
    <div style="display:flex;gap:3px;height:54px;align-items:flex-end">${spark}</div>
    <div class="tiny dim" style="margin-top:8px">${(prayedTot/14).toFixed(1)} of 5 prayed/day · ${onTimePct}% on time</div></div>

  <div class="card"><div class="sec-title">Pushups — 2-week volume</div>
    <div class="big">${(setsTot*SET_REPS).toLocaleString()}<span class="muted" style="font-size:15px"> reps</span></div>
    <div class="tiny dim" style="margin-top:6px">${setsTot} sets · ${(setsTot/14).toFixed(1)} sets/day (goal ${moveGoal()}/day)</div></div>

  <div class="card"><div class="sec-title">Shadow jumping — 2-week volume</div>
    <div class="big">${(shadowTot*SHADOW_REPS).toLocaleString()}<span class="muted" style="font-size:15px"> reps</span></div>
    <div class="tiny dim" style="margin-top:6px">${shadowTot} sets · ${(shadowTot/14).toFixed(1)} sets/day (goal ${shadowGoal()}/day)</div></div>

  <button class="btn ghost" id="exportBtn">⬆ Copy my 2 weeks (to share with my coach)</button>
  <button class="btn ghost" id="backupBtn">💾 Backup all data (move to another device)</button>
  <button class="btn ghost" id="restoreBtn">📥 Restore from a backup code</button>
  `;
  el("exportBtn").onclick=exportData;
  el("backupBtn").onclick=backupData;
  el("restoreBtn").onclick=restoreData;
}
function statRow(lab,pct){ return `<div class="stat"><div class="lab">${lab}</div><div class="bar"><i style="width:${pct}%"></i></div><div class="pct">${pct}%</div></div>`; }
