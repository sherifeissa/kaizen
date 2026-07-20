"use strict";
/* ============================================================
   state.js — app state, local storage & Google Apps Script sync
   ============================================================ */

const KEY = "daily-anchor-v1";
const DEFAULT = { settings:{ moveGoal:4, shadowGoal:4 }, days:{}, weeks:{} };
const hasGAS = (typeof google !== "undefined" && google.script && google.script.run); // true when served by Apps Script

function normalize(o){
  o = Object.assign({}, DEFAULT, o || {});
  o.settings = Object.assign({ moveGoal:4, shadowGoal:4 }, o.settings || {});
  o.days  = o.days  || {};
  o.weeks = o.weeks || {};
  return o;
}
function load(){ try{ return normalize(JSON.parse(localStorage.getItem(KEY))); }catch(e){ return normalize(); } }
function saveLocal(){ localStorage.setItem(KEY, JSON.stringify(S)); }

let S = load();
let pushTimer = null;

function save(){
  S._ts = Date.now();
  saveLocal();
  if (hasGAS){ clearTimeout(pushTimer); pushTimer = setTimeout(pushRemote, 800); }
}
function pushRemote(){
  pushTimer = null;               // debounce has fired
  setSync("saving");
  google.script.run.withSuccessHandler(()=>setSync("ok")).withFailureHandler(()=>setSync("err")).saveData(JSON.stringify(S));
}
function pullRemote(){
  if (!hasGAS){ setSync("local"); return; }
  setSync("syncing");
  google.script.run.withSuccessHandler(str=>{ try{
    if (str){ const ro = JSON.parse(str); if (ro && (ro._ts||0) > (S._ts||0)){ S = normalize(ro); saveLocal(); render(); } }
    setSync("ok");
  }catch(e){ setSync("err"); } }).withFailureHandler(()=>setSync("err")).loadData();
}
function setSync(state){
  const e = document.getElementById("syncDot"); if (!e) return;
  const m = { saving:["#f4b740","Saving…"], ok:["#3ecf8e","Synced"], err:["#ff6b6b","Offline — saved here"], syncing:["#6ea8ff","Syncing…"], local:["#6b7a9c","On this device"] };
  const v = m[state] || m.local;
  e.innerHTML = `<i style="background:${v[0]}"></i>${v[1]}`;
}

// Quietly re-check the server for newer data (near-live sync). Called on tab focus
// and on a heartbeat. Skips while the tab is hidden, mid-save, or editing a field
// (so it never clobbers something you're typing).
function pollRemote(){
  if (!hasGAS || document.hidden || pushTimer) return;
  const ae = document.activeElement;
  if (ae && (ae.tagName === "TEXTAREA" || ae.tagName === "INPUT")) return;
  google.script.run.withSuccessHandler(str=>{ try{
    if (str){ const ro = JSON.parse(str); if (ro && (ro._ts||0) > (S._ts||0)){ S = normalize(ro); saveLocal(); render(); } }
    setSync("ok");
  }catch(e){} }).withFailureHandler(()=>{}).loadData();
}
