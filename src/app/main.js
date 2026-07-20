/* ============================================================
   main.js — wiring & boot (must load last)
   ============================================================ */

// bottom tab bar
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{
  V = t.dataset.v;
  document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active", x===t));
  render();
});

// day navigation arrows (rendered inside views)
document.addEventListener("click", e=>{
  if (e.target.id==="prevD"){ cursor = addDays(cursor,-1); renderToday(); }
  if (e.target.id==="nextD" && !isToday(cursor)){ cursor = addDays(cursor,1); renderToday(); }
});

// near-live sync: re-check when the tab regains focus, and on a quiet heartbeat
if (hasGAS){
  document.addEventListener("visibilitychange", ()=>{ if (!document.hidden) pollRemote(); });
  window.addEventListener("focus", pollRemote);
  setInterval(pollRemote, 30000);
}

// boot
render();
setSync(hasGAS ? "syncing" : "local");
pullRemote();
initArt();
