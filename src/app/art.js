/* ============================================================
   art.js — daily anime motivation: English quote + background/side art
   ============================================================ */

/* --- curated anime motivational quotes (English / subbed) --- */
const QUOTES = [
  { t:"Fall seven times, rise eight.", w:"Japanese proverb", a:"the spirit of Kaizen" },
  { t:"A lesson without pain is meaningless. You cannot gain something without sacrificing something else in return.", w:"Edward Elric", a:"Fullmetal Alchemist" },
  { t:"Hard work is worthless for those that don't believe in themselves.", w:"Naruto Uzumaki", a:"Naruto" },
  { t:"A dropout will beat a genius through hard work.", w:"Rock Lee", a:"Naruto" },
  { t:"If you don't take risks, you can't create a future.", w:"Monkey D. Luffy", a:"One Piece" },
  { t:"Power comes in response to a need, not a desire.", w:"Goku", a:"Dragon Ball" },
  { t:"The moment you think of giving up, think of the reason why you held on so long.", w:"Natsu Dragneel", a:"Fairy Tail" },
  { t:"Fear is not evil. It tells you what your weakness is. Once you know your weakness, you can become stronger.", w:"Gildarts Clive", a:"Fairy Tail" },
  { t:"People's lives don't end when they die. It ends when they lose faith.", w:"Itachi Uchiha", a:"Naruto" },
  { t:"The world isn't perfect. But it's there for us, doing the best it can. That's what makes it so damn beautiful.", w:"Roy Mustang", a:"Fullmetal Alchemist" },
  { t:"Believe in the me that believes in you.", w:"Kamina", a:"Gurren Lagann" },
  { t:"Whatever you lose, you'll find it again. But what you throw away you'll never get back.", w:"Himura Kenshin", a:"Rurouni Kenshin" },
  { t:"If you don't like your destiny, don't accept it. Have the courage to change it the way you want it to be.", w:"Naruto Uzumaki", a:"Naruto" },
  { t:"Don't give up. There's no shame in falling down. The true shame is to not stand up again.", w:"Midorima Shintaro", a:"Kuroko no Basket" },
  { t:"You should enjoy the little detours to the fullest. That's where you'll find things more important than what you want.", w:"Ging Freecss", a:"Hunter x Hunter" },
  { t:"If you only face forward, there is something you will miss seeing.", w:"Vash the Stampede", a:"Trigun" },
  { t:"No matter how deep the night, it always turns to day, eventually.", w:"Brook", a:"One Piece" },
  { t:"A person grows up when he's able to overcome hardships. There are some things a person must learn on his own.", w:"Jiraiya", a:"Naruto" },
  { t:"Being weak is nothing to be ashamed of. Staying weak is.", w:"Fuegoleon Vermillion", a:"Black Clover" },
  { t:"The ones who aren't remembered are the ones who give up.", w:"Izuku Midoriya", a:"My Hero Academia" },
  { t:"Whether you win or lose, looking back and learning from your experiences is part of life.", w:"Takenori Akagi", a:"Slam Dunk" },
  { t:"It's not about whether you can. It's about whether or not you do it.", w:"Kakashi Hatake", a:"Naruto" },
  { t:"Push through the pain — giving up hurts more.", w:"Vegeta", a:"Dragon Ball Z" },
  { t:"Effort makes you. You'll regret someday if you don't do your best now.", w:"Nara Shikamaru", a:"Naruto" }
];

/* deterministic per-day index (same all day, changes at midnight) */
function daySeed(){ const d = new Date(); return d.getFullYear()*1000 + Math.floor((d - new Date(d.getFullYear(),0,0)) / 86400000); }
function dailyPick(arr){ return arr[daySeed() % arr.length]; }

function quoteHTML(){
  const q = dailyPick(QUOTES);
  const who = q.a ? `${esc(q.w)} · <span class="qsrc">${esc(q.a)}</span>` : esc(q.w);
  return `<div class="quote"><div class="qt">&ldquo;${esc(q.t)}&rdquo;</div><div class="qa">— <b>${who}</b></div></div>`;
}

/* --- daily shonen wallpaper (curated SFW list, rotates one per day) ---
   These are direct image URLs, so they load everywhere (local + Apps Script)
   with no API call / CORS / CSP involved. To add more, just append lines —
   grab a wallpaper on https://wallhaven.cc (anime + SFW), open the full image,
   and paste its URL here with the series name. */
const WALLPAPERS = [
  // Dragon Ball Z
  { s:"Dragon Ball Z",     u:"https://w.wallhaven.cc/full/3q/wallhaven-3q6yqv.jpg" },
  { s:"Dragon Ball Z",     u:"https://w.wallhaven.cc/full/d8/wallhaven-d8w81o.png" },
  { s:"Dragon Ball Z",     u:"https://w.wallhaven.cc/full/9o/wallhaven-9o8yw1.png" },
  { s:"Dragon Ball Z",     u:"https://w.wallhaven.cc/full/zp/wallhaven-zpodrw.png" },
  { s:"Dragon Ball Z",     u:"https://w.wallhaven.cc/full/w5/wallhaven-w5ly36.png" },
  { s:"Dragon Ball Z",     u:"https://w.wallhaven.cc/full/1q/wallhaven-1qq2ow.png" },
  // Naruto
  { s:"Naruto",            u:"https://w.wallhaven.cc/full/ly/wallhaven-lyjvlr.png" },
  { s:"Naruto",            u:"https://w.wallhaven.cc/full/e8/wallhaven-e8eg6o.png" },
  { s:"Naruto",            u:"https://w.wallhaven.cc/full/5y/wallhaven-5yygj5.jpg" },
  { s:"Naruto",            u:"https://w.wallhaven.cc/full/5y/wallhaven-5ygmd3.png" },
  { s:"Naruto",            u:"https://w.wallhaven.cc/full/yq/wallhaven-yqx2jk.png" },
  { s:"Naruto",            u:"https://w.wallhaven.cc/full/yq/wallhaven-yqe81l.png" },
  // Hunter x Hunter
  { s:"Hunter x Hunter",   u:"https://w.wallhaven.cc/full/6d/wallhaven-6dpwll.jpg" },
  { s:"Hunter x Hunter",   u:"https://w.wallhaven.cc/full/m3/wallhaven-m3g2l1.jpg" },
  { s:"Hunter x Hunter",   u:"https://w.wallhaven.cc/full/o3/wallhaven-o3dg39.png" },
  { s:"Hunter x Hunter",   u:"https://w.wallhaven.cc/full/j3/wallhaven-j38e5p.jpg" },
  { s:"Hunter x Hunter",   u:"https://w.wallhaven.cc/full/k9/wallhaven-k965g7.png" },
  { s:"Hunter x Hunter",   u:"https://w.wallhaven.cc/full/q6/wallhaven-q6z2m7.png" },
  // Attack on Titan
  { s:"Attack on Titan",   u:"https://w.wallhaven.cc/full/xe/wallhaven-xejeld.jpg" },
  { s:"Attack on Titan",   u:"https://w.wallhaven.cc/full/9d/wallhaven-9dkwy1.png" },
  { s:"Attack on Titan",   u:"https://w.wallhaven.cc/full/gp/wallhaven-gp8rdl.jpg" },
  { s:"Attack on Titan",   u:"https://w.wallhaven.cc/full/jx/wallhaven-jx52dq.jpg" },
  { s:"Attack on Titan",   u:"https://w.wallhaven.cc/full/3l/wallhaven-3l911v.jpg" },
  { s:"Attack on Titan",   u:"https://w.wallhaven.cc/full/we/wallhaven-wey77r.jpg" },
  // Demon Slayer
  { s:"Demon Slayer",      u:"https://w.wallhaven.cc/full/qr/wallhaven-qr67er.png" },
  { s:"Demon Slayer",      u:"https://w.wallhaven.cc/full/m3/wallhaven-m3m9lk.png" },
  { s:"Demon Slayer",      u:"https://w.wallhaven.cc/full/ex/wallhaven-exr1rr.jpg" },
  { s:"Demon Slayer",      u:"https://w.wallhaven.cc/full/x6/wallhaven-x6dped.jpg" },
  { s:"Demon Slayer",      u:"https://w.wallhaven.cc/full/p9/wallhaven-p972d9.png" },
  { s:"Demon Slayer",      u:"https://w.wallhaven.cc/full/7p/wallhaven-7p75yy.png" },
  // My Hero Academia
  { s:"My Hero Academia",  u:"https://w.wallhaven.cc/full/k8/wallhaven-k8kvld.jpg" },
  { s:"My Hero Academia",  u:"https://w.wallhaven.cc/full/d8/wallhaven-d88lyo.jpg" },
  { s:"My Hero Academia",  u:"https://w.wallhaven.cc/full/rq/wallhaven-rqry7j.png" },
  { s:"My Hero Academia",  u:"https://w.wallhaven.cc/full/2y/wallhaven-2yo9px.png" },
  { s:"My Hero Academia",  u:"https://w.wallhaven.cc/full/jx/wallhaven-jx15zm.jpg" },
  { s:"My Hero Academia",  u:"https://w.wallhaven.cc/full/zp/wallhaven-zpyj2o.jpg" },
  // Bleach
  { s:"Bleach",            u:"https://w.wallhaven.cc/full/p9/wallhaven-p9zr5j.png" },
  { s:"Bleach",            u:"https://w.wallhaven.cc/full/m3/wallhaven-m3e8r1.png" },
  { s:"Bleach",            u:"https://w.wallhaven.cc/full/6d/wallhaven-6d1rwl.png" },
  { s:"Bleach",            u:"https://w.wallhaven.cc/full/rr/wallhaven-rrxrl1.png" },
  { s:"Bleach",            u:"https://w.wallhaven.cc/full/x6/wallhaven-x6x1pd.jpg" },
  { s:"Bleach",            u:"https://w.wallhaven.cc/full/6d/wallhaven-6dxvoq.jpg" },
  // One Piece
  { s:"One Piece",         u:"https://w.wallhaven.cc/full/og/wallhaven-og2k7p.png" },
  { s:"One Piece",         u:"https://w.wallhaven.cc/full/je/wallhaven-jev6lp.png" },
  { s:"One Piece",         u:"https://w.wallhaven.cc/full/ly/wallhaven-ly2egp.png" },
  { s:"One Piece",         u:"https://w.wallhaven.cc/full/gw/wallhaven-gw231e.png" },
  { s:"One Piece",         u:"https://w.wallhaven.cc/full/7j/wallhaven-7j15m3.png" },
  { s:"One Piece",         u:"https://w.wallhaven.cc/full/21/wallhaven-211qd9.png" },
  // Jujutsu Kaisen
  { s:"Jujutsu Kaisen",    u:"https://w.wallhaven.cc/full/rq/wallhaven-rqp2pq.png" },
  { s:"Jujutsu Kaisen",    u:"https://w.wallhaven.cc/full/8g/wallhaven-8g9oo1.png" },
  { s:"Jujutsu Kaisen",    u:"https://w.wallhaven.cc/full/zp/wallhaven-zpd88j.png" },
  { s:"Jujutsu Kaisen",    u:"https://w.wallhaven.cc/full/21/wallhaven-21ox16.png" },
];

let ART_TODAY = null;   // the day's chosen wallpaper — read by the desktop rail

function initArt(){
  if (!WALLPAPERS.length) return;
  const w = dailyPick(WALLPAPERS);
  ART_TODAY = w;
  if (typeof renderRail === "function") renderRail();   // fill the rail's art card
  // preload first; only swap in the art once it actually loads (else keep the gradient)
  const img = new Image();
  img.onload = () => {
    const bg = el("bgArt");     if (bg){ bg.style.backgroundImage = `url("${w.u}")`; bg.classList.add("on"); }
    const av = el("artAvatar"); if (av){ av.style.backgroundImage = `url("${w.u}")`; av.classList.add("on"); }
    const cr = el("artCredit"); if (cr){ cr.textContent = w.s; }
  };
  img.onerror = () => { /* dead URL or offline — night-sky gradient stays */ };
  img.src = w.u;
}
