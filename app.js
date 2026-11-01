/* =====================================================================
   ✏️  EDIT EVERYTHING HERE — all content for the site lives in CONFIG
   ===================================================================== */
const CONFIG = {
  couple: "Sarthak & Oshin",
  hashtag: "#SOinLove",
  // RSVP replies from the form go to this WhatsApp number (country code, digits only, e.g. "919876543210").
  // Leave "" to let the guest pick a contact in WhatsApp.
  rsvpWhatsApp: "919212148535", // Parveen Kumar
  venue: {
    name: "Calista Resort",
    address: "37/2-4 Old, NH 48, Kapas Hera, New Delhi 110097",
  },
  // Add phone numbers (with country code, digits only) to show a "Call / WhatsApp" button next to each name.
  hosts: [
    { name: "Parveen Kumar", phone: "919212148535" },
    { name: "Pushpa Pal", phone: "919971272873" },
    { name: "Satish Dayal", phone: "919871888989" },
    { name: "Sachin Kumar Pal", phone: "919810161564" },
    { name: "Divyansh Pal", phone: "918826059496" },
    { name: "Sanjana Dayal", phone: "919818922981" },
    { name: "Priyank Dayal", phone: "919999284684" },
    { name: "Prajjwal Pal", phone: "919971230989" },
    { name: "Pariniti Pal", phone: "919868250726" },
  ],
  // Times are India Standard Time. "end" is an estimate used for the live status.
  events: [
    {
      id: "haldi", day: 1, theme: "Floral Fiesta", name: "Haldi & Mehendi",
      start: "2026-12-01T10:30", end: "2026-12-01T15:00", timeLabel: "10:30 am onwards",
      dateLabel: "Tuesday, 1st December 2026", place: "Royal Courtyard",
      desc: "A beautiful morning, a cluster of blooms and yellow hues",
      dress: "Shades of yellow & floral", img: "images/page-3.jpg", style: "",
    },
    {
      id: "ring", day: 1, theme: "Rhythm & Rasmein", name: "Tilak Godh & Ring Ceremony",
      start: "2026-12-01T18:00", end: "2026-12-01T23:30", timeLabel: "6:00 pm onwards",
      dateLabel: "Tuesday, 1st December 2026", place: "Ballroom",
      desc: "An evening of food, music and dance to celebrate the union of families and close friends",
      dress: "Evening glam", img: "images/page-4.jpg", style: "night",
    },
    {
      id: "wedding", day: 2, theme: "Vowed to Forever", name: "Wedding Ceremony",
      start: "2026-12-02T11:30", end: "2026-12-02T23:30", timeLabel: "11:30 am onwards",
      dateLabel: "Wednesday, 2nd December 2026", place: "Lawn",
      desc: "Join us as we take our vows and begin forever",
      dress: "Traditional Indian", img: "images/page-5.jpg", style: "",
      schedule: [
        { name: "Sehrabandi", time: "2026-12-02T11:30", label: "11:30 am" },
        { name: "Jaimala",    time: "2026-12-02T15:30", label: "3:30 pm" },
        { name: "Phere",      time: "2026-12-02T16:30", label: "4:30 pm" },
        { name: "Dinner",     time: "2026-12-02T18:30", label: "6:30 pm" },
      ],
    },
  ],
  cards: ["page-1","page-2","page-3","page-4","page-5","page-6","page-7"].map(p => `images/${p}.jpg`),
};
/* ===================================================================== */

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const IST = t => new Date(t + ":00+05:30");
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const mapsQuery = encodeURIComponent(`${CONFIG.venue.name}, ${CONFIG.venue.address}`);
const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2400);
}

/* ---------- Countdown ---------- */
function startCountdown() {
  const box = $("#countdown");
  const first = IST(CONFIG.events[0].start);
  const last = IST(CONFIG.events[CONFIG.events.length - 1].end);
  const tick = () => {
    const now = new Date(), diff = first - now;
    if (diff <= 0) {
      box.innerHTML = now < last
        ? `<div class="cd-msg">The celebrations have begun! 🎉</div>`
        : `<div class="cd-msg">Happily Married ❤️ Thank you for your blessings</div>`;
      return;
    }
    const d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24,
          m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
    box.innerHTML = [[d,"Days"],[h,"Hours"],[m,"Minutes"],[s,"Seconds"]]
      .map(([v,l]) => `<div class="cd"><b>${String(v).padStart(2,"0")}</b><span>${l}</span></div>`).join("");
  };
  tick(); setInterval(tick, 1000);
}

/* ---------- Events ---------- */
function eventStatus(ev, now = new Date()) {
  if (now >= IST(ev.end)) return { cls: "", text: "Celebrated ✓" };
  if (now >= IST(ev.start)) return { cls: "live", text: "● Happening now" };
  const days = Math.ceil((IST(ev.start) - now) / 864e5);
  return { cls: "", text: days <= 1 ? "Tomorrow" : `In ${days} days` };
}
function renderEvents() {
  const grid = $("#events-grid");
  grid.innerHTML = CONFIG.events.map(ev => {
    const st = eventStatus(ev);
    const sched = ev.schedule ? `<ul class="timeline">${ev.schedule.map((s, i) => {
      const next = ev.schedule[i + 1] ? IST(ev.schedule[i + 1].time) : IST(ev.end);
      const now = new Date(), cls = now >= next ? "done" : now >= IST(s.time) ? "now" : "";
      return `<li class="${cls}"><span>${esc(s.name)}</span><span>${esc(s.label)} onwards</span></li>`;
    }).join("")}</ul>` : `<p class="when">🕥 ${esc(ev.timeLabel)}</p>`;
    return `<article class="ev ${ev.style} reveal" data-day="${ev.day}">
      <div class="ev-art" style="background-image:url('${ev.img}')"><span class="badge ${st.cls}">${st.text}</span></div>
      <div class="ev-body">
        <div class="ev-theme">${esc(ev.theme)}</div>
        <h3>${esc(ev.name)}</h3>
        <p class="when">📅 ${esc(ev.dateLabel)}</p>
        ${sched}
        <p class="desc">${esc(ev.desc)}</p>
        <p class="where">📍 <b>${esc(ev.place)}</b>, ${esc(CONFIG.venue.name)}</p>
        ${ev.dress ? `<p class="where">👗 Suggested attire: ${esc(ev.dress)}</p>` : ""}
        <div class="ev-actions">
          <a class="btn ghost" href="${mapsLink}" target="_blank" rel="noopener">📍 Map</a>
        </div>
      </div></article>`;
  }).join("");

  $$(".day-tab").forEach(tab => tab.addEventListener("click", () => {
    $$(".day-tab").forEach(t => t.classList.toggle("active", t === tab));
    $$(".ev").forEach(c => c.classList.toggle("hidden", tab.dataset.day !== "all" && c.dataset.day !== tab.dataset.day));
  }));
  // subtle 3D tilt on desktop
  if (matchMedia("(hover:hover)").matches) $$(".ev").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => card.style.transform = "");
  });
}

/* ---------- Gallery + lightbox ---------- */
function renderGallery() {
  const track = $("#track");
  track.innerHTML = CONFIG.cards.map((src, i) =>
    `<figure data-i="${i}"><img src="${src}" alt="Invitation card ${i + 1}" loading="lazy"></figure>`).join("");
  const step = () => track.querySelector("figure").offsetWidth + 18;
  $(".arrow.prev").onclick = () => track.scrollBy({ left: -step(), behavior: "smooth" });
  $(".arrow.next").onclick = () => track.scrollBy({ left: step(), behavior: "smooth" });

  const lb = $("#lightbox"), img = $("#lb-img"); let cur = 0;
  const show = i => { cur = (i + CONFIG.cards.length) % CONFIG.cards.length; img.src = CONFIG.cards[cur]; $("#lb-count").textContent = `${cur + 1} / ${CONFIG.cards.length}`; };
  const close = () => { lb.classList.remove("show"); document.body.classList.remove("locked"); };
  track.addEventListener("click", e => { const f = e.target.closest("figure"); if (!f) return; show(+f.dataset.i); lb.classList.add("show"); document.body.classList.add("locked"); });
  $("#lb-close").onclick = close;
  $("#lb-prev").onclick = e => { e.stopPropagation(); show(cur - 1); };
  $("#lb-next").onclick = e => { e.stopPropagation(); show(cur + 1); };
  lb.addEventListener("click", e => { if (e.target === lb) close(); });
  document.addEventListener("keydown", e => {
    if (!lb.classList.contains("show")) return;
    if (e.key === "Escape") close(); if (e.key === "ArrowLeft") show(cur - 1); if (e.key === "ArrowRight") show(cur + 1);
  });
  let sx = 0; // swipe on phones
  lb.addEventListener("touchstart", e => sx = e.touches[0].clientX, { passive: true });
  lb.addEventListener("touchend", e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); });
}

/* ---------- Venue ---------- */
function setupVenue() {
  $("#venue-addr").textContent = CONFIG.venue.address;
  $("#dir-btn").href = mapsLink;
  $("#map-frame").src = `https://maps.google.com/maps?q=${mapsQuery}&z=15&output=embed`;
  $("#copy-addr").onclick = () => copy(`${CONFIG.venue.name}, ${CONFIG.venue.address}`, "Address copied 📋");
}

/* ---------- RSVP ---------- */
function setupRSVP() {
  if ($("#rsvp-form")) setupRSVPForm();
  renderHosts();
}
function setupRSVPForm() {
  $("#r-count").innerHTML = Array.from({ length: 10 }, (_, i) => `<option>${i + 1}</option>`).join("") + `<option value="0">Sorry, can't make it 😔</option>`;
  $("#r-events").innerHTML = CONFIG.events.map(ev =>
    `<label><input type="checkbox" value="${esc(ev.name)}" checked> ${esc(ev.name)}</label>`).join("");
  const guest = new URLSearchParams(location.search).get("to");
  if (guest) $("#r-name").value = guest;

  $("#rsvp-form").addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#r-name").value.trim(), count = $("#r-count").value, msg = $("#r-msg").value.trim();
    const evs = $$("#r-events input:checked").map(i => i.value);
    const text = count === "0"
      ? `🙏 RSVP for ${CONFIG.couple}'s wedding ${CONFIG.hashtag}\nName: ${name}\nSorry, we won't be able to attend.${msg ? `\nBlessings: ${msg}` : ""}`
      : `💍 RSVP for ${CONFIG.couple}'s wedding ${CONFIG.hashtag}\nName: ${name}\nGuests: ${count}\nAttending: ${evs.join(", ") || "—"}${msg ? `\nBlessings: ${msg}` : ""}`;
    window.open(`https://wa.me/${CONFIG.rsvpWhatsApp}?text=${encodeURIComponent(text)}`, "_blank");
    burst(); toast("Thank you! Opening WhatsApp… 💌");
  });

}
function renderHosts() {
  $("#hosts").innerHTML = CONFIG.hosts.map(h => `<li><span>${esc(h.name)}${h.phone
    ? `<small class="ph">+${h.phone.slice(0, 2)} ${h.phone.slice(2, 7)} ${h.phone.slice(7)}</small>` : ""}</span>${h.phone
    ? `<span class="acts"><a href="tel:+${h.phone}" aria-label="Call ${esc(h.name)}">📞<span class="lbl">&nbsp;Call</span></a> <a href="https://wa.me/${h.phone}" target="_blank" rel="noopener" aria-label="WhatsApp ${esc(h.name)}">💬</a></span>` : ""}</li>`).join("");
}

/* ---------- Share ---------- */
function copy(text, msg) {
  (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
    .then(() => toast(msg)).catch(() => prompt("Copy this:", text));
}
function setupShare() {
  const url = "https://sartz18.github.io/sarthak-weds-oshin/";
  const text = `💍 You're invited! ${CONFIG.couple} are getting married on 1–2 December 2026 at ${CONFIG.venue.name}, New Delhi. ${CONFIG.hashtag}\n`;
  $("#share-wa").onclick = () => window.open(`https://wa.me/?text=${encodeURIComponent(text + url)}`, "_blank");
  $("#share-copy").onclick = () => copy(url, "Link copied 🔗");
  $("#share-native").onclick = () => navigator.share
    ? navigator.share({ title: `${CONFIG.couple} ${CONFIG.hashtag}`, text, url }).catch(() => {})
    : copy(url, "Link copied 🔗");
  $("#qr").src = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=8&color=7a1f2b&data=${encodeURIComponent(url)}`;
}

/* ---------- Falling petals ---------- */
const Petals = (() => {
  const c = $("#petals"), ctx = c.getContext("2d"); let W, H, list = [];
  const colors = ["#f4a6b8", "#e8577a", "#f7c948", "#fbe3a1", "#f28c38"];
  const resize = () => { W = c.width = innerWidth; H = c.height = innerHeight; };
  const make = (burst) => ({
    x: burst ? W / 2 + (Math.random() - .5) * 200 : Math.random() * W,
    y: burst ? H / 2 : -20 - Math.random() * H,
    r: 5 + Math.random() * 7, vy: burst ? -4 - Math.random() * 6 : .6 + Math.random() * 1.2,
    vx: burst ? (Math.random() - .5) * 10 : (Math.random() - .5) * .6,
    rot: Math.random() * 6, vr: (Math.random() - .5) * .08, sway: Math.random() * 6,
    col: colors[Math.random() * colors.length | 0], burst,
  });
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function frame() {
    ctx.clearRect(0, 0, W, H);
    list.forEach(p => {
      if (p.burst) { p.vy += .15; p.vx *= .99; } else p.x += Math.sin((p.y + p.sway * 100) / 60) * .5;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.col; ctx.globalAlpha = .85;
      ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .55, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      if (!p.burst && p.y > H + 20) Object.assign(p, make(false), { y: -20 });
    });
    list = list.filter(p => !p.burst || p.y < H + 30);
    requestAnimationFrame(frame);
  }
  return {
    start() { if (reduced) return; resize(); addEventListener("resize", resize);
      list = Array.from({ length: innerWidth < 640 ? 22 : 40 }, () => make(false)); frame(); },
    burst() { if (!reduced) for (let i = 0; i < 80; i++) list.push(make(true)); },
  };
})();
const burst = () => Petals.burst();

/* ---------- Music (only shows if music.mp3 exists) ---------- */
function setupMusic() {
  const a = $("#music"), b = $("#music-btn");
  let resumeOnReturn = false;
  fetch("music.mp3", { method: "HEAD" }).then(r => { if (r.ok) b.hidden = false; }).catch(() => {});
  // keep the spinning button in sync with the real player state
  a.addEventListener("play", () => b.classList.add("playing"));
  a.addEventListener("pause", () => b.classList.remove("playing"));
  b.onclick = () => { resumeOnReturn = false; a.paused ? a.play().catch(() => {}) : a.pause(); };
  // Auto-pause when the guest switches tab, minimises the browser, opens another app or locks the phone;
  // resume where it left off when they come back (only if it was playing before).
  const away = () => { if (!a.paused) { resumeOnReturn = true; a.pause(); } };
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) away();
    else if (resumeOnReturn) { resumeOnReturn = false; a.play().catch(() => {}); }
  });
  addEventListener("pagehide", away);
  return () => { if (!b.hidden) a.play().catch(() => {}); };
}

/* ---------- Floating buttons step aside instead of covering links/buttons ---------- */
function setupFabDodge() {
  const fabs = $$(".fab"); let queued = false;
  const check = () => {
    queued = false;
    const targets = $$("a,button,input,select,textarea,iframe").filter(el => !el.classList.contains("fab") && !el.closest("nav,#gate,#lightbox"));
    fabs.forEach(f => {
      const r = f.getBoundingClientRect(); if (!r.width) return;
      const hit = targets.some(t => { const q = t.getBoundingClientRect();
        return q.width && q.bottom > r.top - 6 && q.top < r.bottom + 6 && q.right > r.left - 6 && q.left < r.right + 6; });
      f.classList.toggle("dodge", hit);
    });
  };
  const queue = () => { if (!queued) { queued = true; setTimeout(check, 60); } };
  addEventListener("scroll", queue, { passive: true }); addEventListener("resize", queue); queue();
}

/* ---------- iPhone/iPad: "Download Card" opens the share sheet (has "Save Image") ---------- */
function setupDownloadCard() {
  const link = $("#download-card"); if (!link) return;
  const iOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (!iOS || !navigator.canShare) return;
  let file = null; // pre-load so the share sheet opens instantly on tap (iOS requires that)
  fetch(link.getAttribute("href")).then(r => r.blob()).then(b => {
    const f = new File([b], link.getAttribute("download") || "invite.jpg", { type: b.type || "image/jpeg" });
    if (navigator.canShare({ files: [f] })) file = f;
  }).catch(() => {});
  link.addEventListener("click", e => {
    if (!file) return; // fall back to normal behaviour
    e.preventDefault();
    navigator.share({ files: [file] }).catch(() => {});
  });
}

/* ---------- Scroll effects ---------- */
function setupScroll() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  $$(".reveal").forEach(el => io.observe(el));
  const links = $$("nav a"), secs = links.map(a => $(a.getAttribute("href")));
  let lastActive = -1;
  addEventListener("scroll", () => {
    const y = scrollY;
    $("#nav").classList.toggle("show", y > 200);
    $("#top-btn").classList.toggle("show", y > 600);
    let i = secs.findLastIndex ? secs.findLastIndex(s => s && s.offsetTop - 120 <= y) : 0;
    links.forEach((l, j) => l.classList.toggle("active", j === i));
    if (i !== lastActive && links[i]) { lastActive = i; const nav = $("#nav"), l = links[i];
      if (nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: l.offsetLeft - (nav.clientWidth - l.offsetWidth) / 2, behavior: "smooth" }); }
  }, { passive: true });
  const nav = $("#nav"), edge = () => nav.classList.toggle("at-end", nav.scrollLeft + nav.clientWidth >= nav.scrollWidth - 4);
  nav.addEventListener("scroll", edge, { passive: true }); addEventListener("resize", edge); edge();
  $("#top-btn").onclick = () => scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- "Scroll down for details" cue (shown after opening, hides once guest scrolls) ---------- */
function setupScrollCue() {
  const cue = $("#scroll-cue"); if (!cue) return;
  let done = false;
  const hide = () => { done = true; cue.classList.remove("show"); };
  cue.onclick = () => { hide(); $("#invite").scrollIntoView({ behavior: "smooth" }); };
  addEventListener("scroll", () => { if (!done && scrollY > 120) hide(); }, { passive: true });
  return () => setTimeout(() => { if (!done && scrollY < 120) cue.classList.add("show"); }, 1800);
}

/* ---------- Opening gate ---------- */
function setupGate(playMusic, showCue) {
  const guest = new URLSearchParams(location.search).get("to");
  if (guest) $("#guest-greet").textContent = `Dear ${guest}`;
  $("#open-btn").onclick = () => {
    $("#gate").classList.add("open"); document.body.classList.remove("locked");
    playMusic(); setTimeout(burst, 600); if (showCue) showCue();
  };
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  startCountdown(); renderEvents(); renderGallery(); setupVenue(); setupRSVP(); setupShare(); setupScroll();
  setupGate(setupMusic(), setupScrollCue()); setupFabDodge(); setupDownloadCard(); Petals.start();
});
