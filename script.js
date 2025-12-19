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

  // Wait for audio to load, then attempt autoplay
  audio.addEventListener('canplaythrough', () => {
    audio.play().catch(() => {
      console.log("Autoplay blocked - user interaction required");
      playPause.textContent = "▶"; // Show play button if autoplay fails
      // Add one-time click listener to play on first interaction
      const playOnInteraction = () => {
        audio.play().catch(() => {});
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('keydown', playOnInteraction);
      };
      document.addEventListener('click', playOnInteraction);
      document.addEventListener('keydown', playOnInteraction);
    });
  }, { once: true });

  // Set initial button state
  playPause.textContent = "⏸"; // Assume it will play

  // toggle music bar visibility (now hides it since it's visible by default)
  toggle.addEventListener("click", ()=> {
    if (musicBar.style.display === "none" || musicBar.style.display === "") {
      musicBar.style.display = "flex";
    } else {
      musicBar.style.display = "none";
    }
  });
  closeBtn.addEventListener("click", ()=> {
    musicBar.style.display = "none";
  });

  // play/pause (no fade)
  playPause.addEventListener("click", ()=>{
    if(audio.paused){ 
      audio.play().catch(()=>{}); 
      playPause.textContent = "⏸"; 
    }
    else { 
      audio.pause(); 
      playPause.textContent = "▶"; 
    }
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
      swordSound.volume = 0.8; // increased volume
      swordSound.play().catch(() => {});
    }
  }, 600); // slightly earlier timing
  // timing: sword appears at 0.0s, grows at 0.3s, SLASH peak around 0.6s
});
/* Impact sound slightly after the slash */
setTimeout(() => {
  // const impact = new Audio("assets/sounds/impact.mp3");
  // impact.volume = 0.45;
  // impact.play().catch(()=>{});
  // Disabled - impact.mp3 file missing
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

  // Neural section fade-in animation on scroll
  const neuralSection = document.querySelector('.neural-section');
  if (neuralSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    observer.observe(neuralSection);
  }
});


const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", async function (e) {
  e.preventDefault(); // 🚫 stop reload & redirect

  formStatus.textContent = "Sending...";
  formStatus.style.color = "#ffaa00";

  const formData = new FormData(contactForm);

  try {
    const response = await fetch("https://formsubmit.co/ajax/singhsomnath2006@gmail.com", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (result.success === "true" || response.ok) {
      formStatus.textContent = "Message sent successfully ✔";
      formStatus.style.color = "#00ff99";
      contactForm.reset();
    } else {
      throw new Error();
    }
  } catch (err) {
    formStatus.textContent = "Failed to send message ❌";
    formStatus.style.color = "red";
  }
});

// Electric Border Animation Class - Creates animated electric border effect
class ElectricBorder {
  constructor(canvasId, options = {}) {
    // Get canvas element and context
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    // Configuration options with defaults
    this.width = options.width || 354; // Canvas width
    this.height = options.height || 504; // Canvas height
    this.octaves = options.octaves || 10; // Number of noise octaves for detail
    this.lacunarity = options.lacunarity || 1.6; // Frequency multiplier between octaves
    this.gain = options.gain || 0.6; // Amplitude multiplier between octaves
    this.amplitude = options.amplitude || 0.2; // Base noise amplitude
    this.frequency = options.frequency || 5; // Base noise frequency
    this.baseFlatness = options.baseFlatness || 0.2; // Flatness of first octave
    this.displacement = options.displacement || 60; // Maximum displacement distance
    this.speed = options.speed || 1; // Animation speed multiplier
    this.borderOffset = options.borderOffset || 60; // Offset from canvas edges
    this.borderRadius = options.borderRadius || 40; // Corner radius
    this.lineWidth = options.lineWidth || 1; // Stroke width
    this.color = options.color || "#DD8448"; // Border color

    // Animation state
    this.animationId = null;
    this.time = 0;
    this.lastFrameTime = 0;

    // Set canvas size
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Start animation
    this.start();
  }

  // Pseudo-random function using sine wave
  random(x) {
    return (Math.sin(x * 12.9898) * 43758.5453) % 1;
  }

  // 2D Perlin-like noise function
  noise2D(x, y) {
    const i = Math.floor(x);
    const j = Math.floor(y);
    const fx = x - i;
    const fy = y - j;

    // Get values at four grid corners
    const a = this.random(i + j * 57);
    const b = this.random(i + 1 + j * 57);
    const c = this.random(i + (j + 1) * 57);
    const d = this.random(i + 1 + (j + 1) * 57);

    // Smooth interpolation
    const ux = fx * fx * (3.0 - 2.0 * fx);
    const uy = fy * fy * (3.0 - 2.0 * fy);

    // Bilinear interpolation
    return (
      a * (1 - ux) * (1 - uy) +
      b * ux * (1 - uy) +
      c * (1 - ux) * uy +
      d * ux * uy
    );
  }

  // Generate octaved noise for more complex patterns
  octavedNoise(
    x,
    octaves,
    lacunarity,
    gain,
    baseAmplitude,
    baseFrequency,
    time = 0,
    seed = 0,
    baseFlatness = 1.0
  ) {
    let y = 0;
    let amplitude = baseAmplitude;
    let frequency = baseFrequency;

    for (let i = 0; i < octaves; i++) {
      let octaveAmplitude = amplitude;

      if (i === 0) {
        octaveAmplitude *= baseFlatness; // Flatten first octave
      }

      y +=
        octaveAmplitude *
        this.noise2D(frequency * x + seed * 100, time * frequency * 0.3);
      frequency *= lacunarity;
      amplitude *= gain;
    }

    return y;
  }

  // Calculate point on rounded rectangle perimeter
  getRoundedRectPoint(t, left, top, width, height, radius) {
    // Calculate lengths of straight and curved sections
    const straightWidth = width - 2 * radius;
    const straightHeight = height - 2 * radius;
    const cornerArc = (Math.PI * radius) / 2;
    const totalPerimeter =
      2 * straightWidth + 2 * straightHeight + 4 * cornerArc;

    const distance = t * totalPerimeter;
    let accumulated = 0;

    // Top edge
    if (distance <= accumulated + straightWidth) {
      const progress = (distance - accumulated) / straightWidth;
      return { x: left + radius + progress * straightWidth, y: top };
    }
    accumulated += straightWidth;

    // Top-right corner
    if (distance <= accumulated + cornerArc) {
      const progress = (distance - accumulated) / cornerArc;
      return this.getCornerPoint(
        left + width - radius,
        top + radius,
        radius,
        -Math.PI / 2,
        Math.PI / 2,
        progress
      );
    }
    accumulated += cornerArc;

    // Right edge
    if (distance <= accumulated + straightHeight) {
      const progress = (distance - accumulated) / straightHeight;
      return { x: left + width, y: top + radius + progress * straightHeight };
    }
    accumulated += straightHeight;

    // Bottom-right corner
    if (distance <= accumulated + cornerArc) {
      const progress = (distance - accumulated) / cornerArc;
      return this.getCornerPoint(
        left + width - radius,
        top + height - radius,
        radius,
        0,
        Math.PI / 2,
        progress
      );
    }
    accumulated += cornerArc;

    // Bottom edge
    if (distance <= accumulated + straightWidth) {
      const progress = (distance - accumulated) / straightWidth;
      return {
        x: left + width - radius - progress * straightWidth,
        y: top + height
      };
    }
    accumulated += straightWidth;

    // Bottom-left corner
    if (distance <= accumulated + cornerArc) {
      const progress = (distance - accumulated) / cornerArc;
      return this.getCornerPoint(
        left + radius,
        top + height - radius,
        radius,
        Math.PI / 2,
        Math.PI / 2,
        progress
      );
    }
    accumulated += cornerArc;

    // Left edge
    if (distance <= accumulated + straightHeight) {
      const progress = (distance - accumulated) / straightHeight;
      return { x: left, y: top + height - radius - progress * straightHeight };
    }
    accumulated += straightHeight;

    // Top-left corner
    const progress = (distance - accumulated) / cornerArc;
    return this.getCornerPoint(
      left + radius,
      top + radius,
      radius,
      Math.PI,
      Math.PI / 2,
      progress
    );
  }

  // Calculate point on circular arc
  getCornerPoint(centerX, centerY, radius, startAngle, arcLength, progress) {
    const angle = startAngle + progress * arcLength;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  }

  // Main drawing function
  drawElectricBorder(currentTime = 0) {
    if (!this.canvas || !this.ctx) return;

    // Update animation time
    const deltaTime = (currentTime - this.lastFrameTime) / 1000;
    this.time += deltaTime * this.speed;
    this.lastFrameTime = currentTime;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Set drawing style
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    const scale = this.displacement;
    const left = this.borderOffset;
    const top = this.borderOffset;
    const borderWidth = this.canvas.width - 2 * this.borderOffset;
    const borderHeight = this.canvas.height - 2 * this.borderOffset;
    const maxRadius = Math.min(borderWidth, borderHeight) / 2;
    const radius = Math.min(this.borderRadius, maxRadius);

    // Calculate number of samples based on perimeter
    const approximatePerimeter =
      2 * (borderWidth + borderHeight) + 2 * Math.PI * radius;
    const sampleCount = Math.floor(approximatePerimeter / 2);

    this.ctx.beginPath();

    // Draw the border path with noise displacement
    for (let i = 0; i <= sampleCount; i++) {
      const progress = i / sampleCount;

      const point = this.getRoundedRectPoint(
        progress,
        left,
        top,
        borderWidth,
        borderHeight,
        radius
      );

      // Generate noise for x and y displacement
      const xNoise = this.octavedNoise(
        progress * 8,
        this.octaves,
        this.lacunarity,
        this.gain,
        this.amplitude,
        this.frequency,
        this.time,
        0,
        this.baseFlatness
      );

      const yNoise = this.octavedNoise(
        progress * 8,
        this.octaves,
        this.lacunarity,
        this.gain,
        this.amplitude,
        this.frequency,
        this.time,
        1,
        this.baseFlatness
      );

      // Apply displacement
      const displacedX = point.x + xNoise * scale;
      const displacedY = point.y + yNoise * scale;

      if (i === 0) {
        this.ctx.moveTo(displacedX, displacedY);
      } else {
        this.ctx.lineTo(displacedX, displacedY);
      }
    }

    // Close and stroke the path
    this.ctx.closePath();
    this.ctx.stroke();

    // Continue animation
    this.animationId = requestAnimationFrame((time) =>
      this.drawElectricBorder(time)
    );
  }

  // Start animation
  start() {
    this.animationId = requestAnimationFrame((time) =>
      this.drawElectricBorder(time)
    );
  }

  // Stop animation
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

// Initialize electric border when page loads
document.addEventListener("DOMContentLoaded", function () {
  new ElectricBorder("electric-border-canvas", {
    width: 600, // Much larger for dramatic effect
    height: 800, // Much larger for dramatic effect
    octaves: 10,
    lacunarity: 1.6,
    gain: 0.7,
    amplitude: 0.075,
    frequency: 10,
    baseFlatness: 0,
    displacement: 60,
    speed: 1.5,
    borderOffset: 6,
    borderRadius: 24,
    lineWidth: 1,
    color: "#00ff88" // Green color for electric effect
  });
});


// Here’s a clean, professional copyright + license setup you can directly use on your website.
document.getElementById("year").textContent = new Date().getFullYear();
