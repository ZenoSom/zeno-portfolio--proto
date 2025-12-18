// ======================================================
// SAMURAI BIO PORTFOLIO WEBSITE - MAIN SCRIPT
// ======================================================
// Features: Hero loading, projects carousel, journey with radio buttons,
// skills/tech grids, music player, snow effect, cursor animation,
// preloader, back-to-top, contact form
// Dependencies: GSAP for animations, profile.json for data
// ======================================================

// Samurai Bio - centered hero + full-width projects + snow + music
// expects: assets/profile.json and icons under assets/icons/

// Utility function to get element by ID
const $ = id => document.getElementById(id);

// Normalize URLs for links (add mailto for email)
function normalizeUrl(key, url){
  if(!url) return "#";
  if(key === "email"){
    return url.startsWith("mailto:") ? url : `mailto:${url}`;
  }
  if(url.startsWith("http://") || url.startsWith("https://")) return url;
  // if it looks like "www..." add https
  return `https://${url}`;
}



// Load profile data from JSON and initialize components
async function loadProfile(){
  try{
    const res = await fetch("assets/profile.json", {cache: "no-store"});
    if(!res.ok) throw new Error("profile.json not found");
    const data = await res.json();
    renderHero(data);
    renderIconsGrid("skillsGrid", data.skills || []);
    renderIconsGrid("techGrid", data.technologies || []);
    setupMusic(data.music || {});
  }catch(err){
    console.error("Failed to load profile:", err);
  }
}

/* HERO SECTION RENDERING */
function renderHero(profile){
  // Populate hero card with profile data
  $("name").textContent = profile.name || "";
  $("title").textContent = profile.title || "";
  $("bio").textContent = profile.bio || "";
  $("profilePic").src = profile.profilePic || "assets/icons/profile.png";

  // Render social media icons in specific order
  const socials = $("socials");
  socials.innerHTML = "";
  const map = {
    github: "assets/icons/github.png",
    linkedin: "assets/icons/linkedin.png",
    instagram: "assets/icons/instagram.png",
    email: "assets/icons/mail.png"
  };
  const links = profile.links || {};
  // ensure order: github, linkedin, instagram, email
  ["github","linkedin","instagram","email"].forEach(k=>{
    if(links[k]){
      const a = document.createElement("a");
      a.href = normalizeUrl(k, links[k]);
      a.target = "_blank";
      a.rel = "noopener";
      const img = document.createElement("img");
      img.src = map[k] || "assets/icons/profile.png";
      img.alt = k;
      a.appendChild(img);
      socials.appendChild(a);
    }
  });
}

/* PROJECTS */
function renderProjects(projects){
  const grid = $("projectsGrid");
  grid.innerHTML = "";
  projects.forEach(p=>{
    const card = document.createElement("div");
    card.className = "project-card";
    const img = document.createElement("img");
    img.src = p.image || "assets/icons/project-placeholder.png";
    img.alt = p.title || "project";
    img.onerror = ()=> img.src = "assets/icons/project-placeholder.png";
    const title = document.createElement("h4");
    title.textContent = p.title || "Untitled";
    const a = document.createElement("a");
    a.href = p.link || "#"; a.target = "_blank"; a.rel = "noopener";
    a.textContent = p.link || "Open";
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(a);
    grid.appendChild(card);
  });
}

/* ICON GRID RENDERER FOR SKILLS AND TECHNOLOGIES */
function renderIconsGrid(containerId, items){
  // Render grid of icons with names for skills/tech sections
  const container = $(containerId);
  if(!container) return;
  container.innerHTML = "";
  items.forEach(it=>{
    const box = document.createElement("div");
    box.className = "icon-card";
    const img = document.createElement("img");
    img.src = it.icon || "assets/icons/project-placeholder.png";
    img.alt = it.name || "";
    img.onerror = ()=> img.src = "assets/icons/project-placeholder.png";
    const p = document.createElement("p");
    p.textContent = it.name || "";
    box.appendChild(img);
    box.appendChild(p);
    container.appendChild(box);
  });
}

/* MUSIC PLAYER SETUP */
function setupMusic(music){
  // Initialize music player with controls, autoplay, volume persistence
  const audio = $("audio");
  const playPause = $("playPause");
  const volumeRange = $("volumeRange");
  const musicBar = $("musicBar");
  const toggle = $("musicToggle");
  const closeBtn = $("closeMusic");
  const cover = $("musicCover");
  const trackName = $("trackName");
  const trackExternal = $("trackExternal");

  audio.src = music.src || "assets/track.mp3";
  audio.volume = 0.30;
  volumeRange.value = audio.volume;
  trackName.textContent = music.title || "";
  trackExternal.href = music.src || "#";
  cover.src = music.cover || "assets/icons/cover.png";

  // attempt autoplay (might be blocked)
  audio.play().catch(()=>{/*ignore*/});

  // toggle music bar visibility
  toggle.addEventListener("click", ()=> {
    musicBar.style.display = "flex";
  });
  closeBtn.addEventListener("click", ()=> {
    musicBar.style.display = "none";
  });

  // play/pause (no fade)
  playPause.addEventListener("click", ()=>{
    if(audio.paused){ audio.play().catch(()=>{}); playPause.textContent = "⏸"; }
    else { audio.pause(); playPause.textContent = "▶"; }
  });

  volumeRange.addEventListener("input", e=>{
    audio.volume = parseFloat(e.target.value);
    try{ localStorage.setItem("samurai_volume", audio.volume.toString()); }catch(e){}
  });

  // restore saved volume
  try {
    const saved = localStorage.getItem("samurai_volume");
    if(saved !== null){ audio.volume = parseFloat(saved); volumeRange.value = audio.volume; }
  } catch(e){}

  audio.addEventListener("play", ()=> playPause.textContent = "⏸");
  audio.addEventListener("pause", ()=> playPause.textContent = "▶");
}

/* SNOW EFFECT ANIMATION */
function startSnow(){
  // Create animated snowflakes falling across the screen
  const canvas = $("snow-canvas");
  if(!canvas) return;
  const ctx = canvas.getContext("2d");
  let W = canvas.width = innerWidth;
  let H = canvas.height = innerHeight;

  window.addEventListener("resize", ()=> { W = canvas.width = innerWidth; H = canvas.height = innerHeight; });

  const flakes = [];
  const density = Math.max(60, Math.round((W*H) / 90000)); // adapt density to screen size
  for(let i=0;i<density;i++){
    flakes.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: Math.random()*3 + 1,
      dx: (Math.random()*1 - 0.5),
      dy: Math.random()*0.8 + 0.4,
      alpha: Math.random()*0.6 + 0.2
    });
  }

  function frame(){
    ctx.clearRect(0,0,W,H);
    for(const f of flakes){
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${f.alpha})`;
      ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
      ctx.fill();
      f.x += f.dx + Math.sin(f.y * 0.01) * 0.5;
      f.y += f.dy;
      if(f.y > H + 10){ f.y = -10; f.x = Math.random()*W; }
      if(f.x > W + 20) f.x = -20;
      if(f.x < -20) f.x = W + 20;
    }
    requestAnimationFrame(frame);
  }
  frame();
}

/* INIT */
document.addEventListener("DOMContentLoaded", ()=>{
  loadProfile();
  startSnow();
});
// ============================
// SAKURA PETAL FOOTER EFFECT
// ============================

function sakuraFooter() {
  const canvas = document.getElementById("sakura-canvas");
  const ctx = canvas.getContext("2d");

  let W = canvas.width = window.innerWidth;
  let H = canvas.height = 160;

  const petals = [];
  const count = 25;

  for (let i = 0; i < count; i++) {
    petals.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 6 + 3,
      vx: Math.random() * 0.6 - 0.3,
      vy: Math.random() * 0.7 + 0.4,
      rot: Math.random() * 360
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let p of petals) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);

      // sakura petal shape
      ctx.fillStyle = "rgba(255,150,220,0.8)";
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 1.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;
      p.rot += 1;

      if (p.y > H + 20) {
        p.y = -10;
        p.x = Math.random() * W;
      }
    }

    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener("resize", () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = 160;
  });
}

document.addEventListener("DOMContentLoaded", sakuraFooter);
// ======================================================
// ULTRA SAMURAI FOOTER ++
// Sakura Petals + Back to Top Button
// ======================================================

function sakuraFooter() {
  const canvas = document.getElementById("sakura-canvas");
  const ctx = canvas.getContext("2d");

  let W = canvas.width = window.innerWidth;
  let H = canvas.height = 180;

  // Create sakura petals
  const petals = [];
  const COUNT = 30;

  for (let i = 0; i < COUNT; i++) {
    petals.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 7 + 3,   // size
      vx: Math.random() * 0.6 - 0.3,  // left/right drift
      vy: Math.random() * 0.8 + 0.4,  // fall speed
      rot: Math.random() * 360
    });
  }

  // Sakura petal animation loop
  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let p of petals) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);

      // Sakura petal shape
      ctx.fillStyle = "rgba(255,150,220,0.85)";
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 1.4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Movement
      p.x += p.vx;
      p.y += p.vy;
      p.rot += 1;

      // Reset when out of view
      if (p.y > H + 20) {
        p.y = -10;
        p.x = Math.random() * W;
      }
    }

    requestAnimationFrame(draw);
  }

  draw();

  // Resize canvas on window scale
  window.addEventListener("resize", () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = 180;
  });
}

// Back to Top button scroll behavior
function backToTopButton() {
  const btn = document.getElementById("backToTop");

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// Init footer effects
document.addEventListener("DOMContentLoaded", () => {
  sakuraFooter();
  backToTopButton();
});
// ===============================
// Back to Top Scroll Behavior
// ===============================

function backToTopScroll() {
  const btn = document.getElementById("backToTop");

  // Show/hide button while scrolling
  window.addEventListener("scroll", () => {
    if (window.scrollY > 150) {
      btn.classList.add("visible");
      btn.classList.remove("hidden");
    } else {
      btn.classList.add("hidden");
      btn.classList.remove("visible");
    }
  });

  // Smooth scroll to top when clicked
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", backToTopScroll);
/* ===========================================================
   REMOVE PRELOADER AFTER PAGE LOAD
   Delete this if you disable the preloader later
=========================================================== */

window.addEventListener("load", () => {
  const pre = document.getElementById("preloader");
  if (pre) {
    setTimeout(() => {
      pre.style.display = "none";
    }, 2600); // Matches total animation duration
  }
});
/* ===========================================================
   SAMURAI SWORD SLASH SOUND SYNC
   Plays exactly when the katana blade animation peaks
=========================================================== */

window.addEventListener("DOMContentLoaded", () => {
  const swordSound = document.getElementById("swordSound");

  // delay must match katana animation timing
  setTimeout(() => {
    if (swordSound) {
      swordSound.volume = 0.65; // adjust volume
      swordSound.play().catch(() => {});
    }
  }, 650); 
  // timing: sword appears at 0.0s, grows at 0.3s, SLASH peak around 0.6s
});
/* Impact sound slightly after the slash */
setTimeout(() => {
  const impact = new Audio("assets/sounds/impact.mp3");
  impact.volume = 0.45;
  impact.play().catch(()=>{});
}, 950);
// -------------------------

/* ===============================
   LOAD PROJECT SLIDER (JSON)
=============================== */


const slider = document.getElementById("projectsSlider");
let allProjects = [];
let currentFilter = "All";

/* LOAD PROJECTS */
function renderProjects(filter="All"){
  slider.innerHTML = "";

  allProjects
    .filter(p => filter==="All" || p.category===filter)
    .forEach(p=>{
      const card = document.createElement("div");
      card.className = `project-card ${p.category}`;

      card.innerHTML = `
        <img src="${p.image}">
        <h4>${p.title}</h4>
        <p>${p.description}</p>
        ${p.link ? `<button>Open</button>` : ``}
      `;

      if(p.link){
        card.querySelector("button").onclick = ()=>window.open(p.link,"_blank");
      }

      slider.appendChild(card);
    });
}

/* FILTER BUTTONS */
document.querySelectorAll(".filter-btn").forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderProjects(btn.dataset.filter);
  }
});

/* DRAG TO SCROLL */
let isDown=false,startX,scrollLeft;
slider.addEventListener("mousedown",e=>{
  isDown=true;
  startX=e.pageX-slider.offsetLeft;
  scrollLeft=slider.scrollLeft;
});
window.addEventListener("mouseup",()=>isDown=false);
slider.addEventListener("mousemove",e=>{
  if(!isDown) return;
  e.preventDefault();
  slider.scrollLeft = scrollLeft - (e.pageX - startX);
});

/* LOAD FROM JSON */
fetch("assets/profile.json")
  .then(r=>r.json())
  .then(d=>{
    allProjects = d.projects || [];
    renderProjects("All"); // 🔥 DEFAULT FIX
  });
const journeyCards = document.getElementById("journeyCards");
const journeyModal = document.getElementById("journeyModal");

let journeyData = {};

/* LOAD FROM profile.json */
async function loadJourney() {
  const res = await fetch("assets/profile.json", { cache: "no-store" });
  const data = await res.json();
  journeyData = data.journey || {};
  renderJourney("achievements"); // ✅ default
}

function renderJourney(type) {
  journeyCards.innerHTML = "";

  const items = journeyData[type] || [];

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = `journey-card ${type}`;

    card.innerHTML = `
      <h4>${item.title}</h4>
      <span>${item.year}</span>
      <p>Click to view</p>
    `;

    card.onclick = () => openJourney(item);
    journeyCards.appendChild(card);
  });
}

/* MODAL */
function openJourney(item) {
  document.getElementById("jTitle").textContent = item.title;
  document.getElementById("jYear").textContent = item.year;
  document.getElementById("jDesc").textContent = item.description;
  journeyModal.classList.remove("hidden");
}

function closeJourney() {
  journeyModal.classList.add("hidden");
}

/* TAB SWITCH */
document.querySelectorAll(".journey-tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".journey-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    renderJourney(tab.dataset.type);
  };
});

document.addEventListener("DOMContentLoaded", loadJourney);

/* Radio Button Effect */
class RadioButtonEffect {
  constructor(radioBtnGroups) {
    this.previousRadioBtn = null;

    radioBtnGroups.forEach((group) => {
      const radioBtn = gsap.utils.selector(group)("input[type='radio']")[0];
      const nodes = this.getNodes(radioBtn);

      radioBtn.addEventListener("change", () => {
        if (this.previousRadioBtn && this.previousRadioBtn !== radioBtn) {
          this.changeEffect(this.getNodes(this.previousRadioBtn), false);
        }

        this.changeEffect(nodes, true);
        this.previousRadioBtn = radioBtn;

        // Switch journey content based on radio value
        const value = radioBtn.value;
        let type;
        if (value === "1") type = "achievements";
        else if (value === "2") type = "certifications";
        else if (value === "3") type = "experience";
        if (type) renderJourney(type);
      });
    });
  }

  getNodes(radioBtn) {
    const container = radioBtn.closest(".radio-btn-group");
    return gsap.utils.shuffle(gsap.utils.selector(container)("rect"));
  }

  changeEffect(nodes, isChecked) {
    gsap.to(nodes, {
      duration: 0.8,
      ease: "elastic.out(1, 0.3)",
      x: isChecked ? "100%" : "-100%",
      stagger: 0.01,
      overwrite: true
    });

    gsap.fromTo(
      nodes,
      {
        fill: "#0c79f7"
      },
      {
        fill: "#76b3fa",
        duration: 0.1,
        ease: "elastic.out(1, 0.3)",
        repeat: -1
      }
    );

    if (isChecked) {
      const randomNodes = nodes.slice(0, 5);
      gsap.to(randomNodes, {
        duration: 0.7,
        ease: "elastic.out(1, 0.1)",
        x: "100%",
        stagger: 0.1,
        repeatDelay: 1.5,
        repeat: -1
      });
    }
  }
}

// INIT: Initialize the application when the DOM is fully loaded
// This section sets up the radio button effects for journey navigation and sets the default selected radio button.
// Changes made: Integrated GSAP animations for radio button interactions to enable smooth journey switching.
// Important: Ensures the first journey item is selected by default for better user experience.
document.addEventListener("DOMContentLoaded", () => {
  const radioBtnGroups = document.querySelectorAll(".radio-btn-group");
  new RadioButtonEffect(radioBtnGroups);

  // Set default radio checked
  const defaultRadio = document.getElementById("input-one");
  if (defaultRadio) {
    defaultRadio.checked = true;
  }
});


