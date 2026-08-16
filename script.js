/* ============================================================
   PRINCESS BIRTHDAY EXPERIENCE — SCRIPT
   ============================================================ */

/* -------------------------------------------------
   EDITABLE MESSAGE — put her real letter here
------------------------------------------------- */
const birthdayMessage = `TO MY PRINCESS, MY QUEEN, MY EVERYTHING

Tum ho to har pal mein sukoon sa lagta hai,
Tum bin ye dil bhi thoda adhura sa lagta hai.
Na chand chahiye, na sitaron ki khwahish hai,
Bas har janam tum mere saath raho, itni si farmaish hai. 🌙❤️

Tum meri mohabbat hi nahi, meri poori duniya ho.
I love you meri jaan, aaj bhi, kal bhi, hamesha. ❤️♾️`;

/* -------------------------------------------------
   🔶 CHANGE HERE — which photo shows on the landing page
   (top-right of Chapter 01). Pick any number from 1 to 6,
   matching your assets/photoN.jpeg files.
------------------------------------------------- */
const landingPhotoNumber = 4;

/* =====================================================
   🔥 FIREBASE CONFIGURATION (WISHES DASHBOARD) 🔥
===================================================== */
const firebaseConfig = {
  apiKey: "AIzaSyCE0L8W6NGh2CoGqMMuaJ49sZQVOnvRwdU",
  authDomain: "princess-bday.firebaseapp.com",
  databaseURL: "https://princess-bday-default-rtdb.firebaseio.com",
  projectId: "princess-bday",
  storageBucket: "princess-bday.firebasestorage.app",
  messagingSenderId: "508739086718",
  appId: "1:508739086718:web:6dd7ca9a79b605da79ab2f",
  measurementId: "G-DE9TDGCHYD"
};

// Initialize Firebase
let database = null;
try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  database = firebase.database();
  console.log("Firebase Database Connected Successfully!");
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

/* -------------------------------------------------
   GLOBAL STATE
------------------------------------------------- */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
gsap.registerPlugin(ScrollTrigger);

/* =====================================================
   1. LOADING SEQUENCE
===================================================== */
function runLoadingSequence(){
  const line1 = document.getElementById('loadLine1');
  const line2 = document.getElementById('loadLine2');
  const line3 = document.getElementById('loadLine3');
  const bar = document.getElementById('loadingBar');
  const loadingScreen = document.getElementById('loading');
  const main = document.getElementById('mainExperience');

  setTimeout(() => bar.style.width = '100%', 200);

  setTimeout(() => { line2.classList.remove('hidden'); }, 1400);
  setTimeout(() => { line3.classList.remove('hidden'); }, 2600);

  setTimeout(() => {
    gsap.to(loadingScreen, {
      opacity: 0, filter: 'blur(20px)', scale: 1.05, duration: 1,
      onComplete: () => {
        loadingScreen.style.display = 'none';
        main.classList.remove('hidden');
        initExperience();
      }
    });
  }, 3600);
}

/* =====================================================
   2. INIT MAIN EXPERIENCE (called after loading)
===================================================== */
function initExperience(){
  initLandingPhoto();
  initWishesDashboard(); // Dashboard Init
  initScrollReveals();
  initScrollProgress();
  initCursorGlow();
  initStickers();
  initStarCanvas();
  initHeartConstellation();
  initGallery();
  initQuiz();
  initPortal();
  initEnvelope();
  initMusicPlayer();
  initMusicRoom();
  initVault();
  initFinalScene();
  initReplay();
}


/* =====================================================
   WISHES DASHBOARD & MODAL (FIXED)
===================================================== */
function initWishesDashboard() {
  const modal = document.getElementById('wishModal');
  const openBtn = document.getElementById('openWishModalBtn');
  const closeBtn = document.getElementById('closeWishModalBtn');
  const submitBtn = document.getElementById('submitWishBtn');
  const statusEl = document.getElementById('wishStatus');
  const track = document.getElementById('wishesTrack');
  const displayArea = document.getElementById('wishesDisplayArea');

  // Modal handlers
  openBtn.addEventListener('click', () => { modal.classList.remove('hidden'); });
  closeBtn.addEventListener('click', () => { modal.classList.add('hidden'); statusEl.textContent = ""; });
  
  // Close when clicking outside
  modal.addEventListener('click', (e) => {
    if(e.target === modal) { modal.classList.add('hidden'); statusEl.textContent = ""; }
  });

  // Submit wish
  submitBtn.addEventListener('click', () => {
    const name = document.getElementById('wishName').value.trim();
    const message = document.getElementById('wishMessage').value.trim();
    const giftType = document.querySelector('input[name="giftType"]:checked').value;

    if(!name || !message) {
      statusEl.textContent = "Please write your name and a message! 💙";
      statusEl.style.color = "var(--rose)";
      return;
    }

    if(database) {
      statusEl.textContent = "Sending your wish... ✨";
      statusEl.style.color = "var(--gold)";
      
      const wishesRef = database.ref('wishes');
      wishesRef.push({
        name: name,
        message: message,
        gift: giftType,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }).then(() => {
        statusEl.textContent = "Wish sent successfully! 🎉";
        statusEl.style.color = "lightgreen";
        document.getElementById('wishName').value = "";
        document.getElementById('wishMessage').value = "";
        setTimeout(() => modal.classList.add('hidden'), 2000);
      }).catch((error) => {
        statusEl.textContent = "Oops! Something went wrong.";
        statusEl.style.color = "red";
      });
    } else {
      statusEl.textContent = "Database not connected.";
      statusEl.style.color = "red";
    }
  });

  // Real-time listener for wishes
  if(database) {
    const wishesRef = database.ref('wishes');
    wishesRef.on('value', (snapshot) => {
      track.innerHTML = ""; // clear track
      const data = snapshot.val();
      
      if(data) {
        // Convert object to array and sort by oldest first
        const wishesArray = Object.values(data).sort((a,b) => a.timestamp - b.timestamp);
        
        wishesArray.forEach(wish => {
          const item = document.createElement('div');
          item.className = 'wish-item';
          item.innerHTML = `
            <div class="wish-header">
              <span class="wish-name">${wish.name}</span>
              <span class="wish-gift">${wish.gift}</span>
            </div>
            <p class="wish-msg">"${wish.message}"</p>
          `;
          track.appendChild(item);
        });

        // Nayi wish aane par auto scroll down hoga, jisse sabse nayi wish dikhe
        setTimeout(() => {
          displayArea.scrollTo({
            top: displayArea.scrollHeight,
            behavior: 'smooth'
          });
        }, 150);

      } else {
        track.innerHTML = "<p class='loading-wishes'>Be the first to send a wish! ✨</p>";
      }
    });
  } else {
    track.innerHTML = "<p class='loading-wishes' style='color:red;'>Firebase setup required to load wishes.</p>";
  }
}



/* =====================================================
   2b. LANDING PAGE PHOTO (right side of Chapter 01)
===================================================== */
function initLandingPhoto(){
  const wrap = document.getElementById('landingPhotoWrap');
  const img = document.getElementById('landingPhoto');
  const src = `assets/photo${landingPhotoNumber}.jpeg`;
  const probe = new Image();
  probe.onload = () => {
    img.src = src;
    gsap.to(wrap, { opacity: 1, x: 0, duration: 1, delay: .3, ease: 'power3.out' });
  };
  probe.onerror = () => { wrap.classList.add('hidden'); };
  probe.src = src;
}

/* =====================================================
   2c. AMBIENT FLOATING HEARTS (blue theme, whole site)
===================================================== */
function initHeartsBackground(){
  const layer = document.getElementById('heartsBg');
  const count = reducedMotion ? 0 : 22;
  for (let i = 0; i < count; i++){
    const h = document.createElement('div');
    h.className = 'floating-heart';
    h.textContent = '💙';
    const left = Math.random() * 100;
    const size = Math.random() * 14 + 10;
    const duration = Math.random() * 10 + 14;
    const delay = Math.random() * duration;
    const drift = Math.random() * 80 - 40;
    h.style.left = left + '%';
    h.style.fontSize = size + 'px';
    h.style.animationDuration = duration + 's';
    h.style.animationDelay = '-' + delay + 's';
    h.style.setProperty('--drift', drift + 'px');
    layer.appendChild(h);
  }
}

/* =====================================================
   3. SCROLL REVEALS
===================================================== */
function initScrollReveals(){
  gsap.utils.toArray('.reveal-line').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, filter: 'blur(0px)', duration: 1,
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
    });
  });

  const nameEl = document.getElementById('revealName');
  if (nameEl){
    gsap.to(nameEl, {
      opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.4)',
      scrollTrigger: { trigger: nameEl, start: 'top 85%' }
    });
  }

  const wishTitle = document.querySelector('.wish-title');
  if (wishTitle){
    gsap.to(wishTitle, {
      opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.5)',
      scrollTrigger: { trigger: wishTitle, start: 'top 85%' }
    });
  }
}

/* =====================================================
   4. SCROLL PROGRESS BAR
===================================================== */
function initScrollProgress(){
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = pct + '%';
  });
}

/* =====================================================
   5. CURSOR GLOW
===================================================== */
function initCursorGlow(){
  const glow = document.getElementById('cursorGlow');
  if (reducedMotion) { glow.style.display = 'none'; return; }
  window.addEventListener('mousemove', (e) => {
    gsap.to(glow, { x: e.clientX, y: e.clientY, duration: .6, ease: 'power3.out' });
  });
}

/* =====================================================
   6. STICKERS (easter eggs)
===================================================== */
function initStickers(){
  const layer = document.getElementById('stickerLayer');
  layer.querySelectorAll('.sticker').forEach((s) => {
    s.addEventListener('click', (e) => {
      showTooltip(s.dataset.msg, e.clientX, e.clientY);
      gsap.fromTo(s, { scale: 1 }, { scale: 1.6, duration: .2, yoyo: true, repeat: 1 });
    });
  });
}
function showTooltip(msg, x, y){
  const tip = document.createElement('div');
  tip.className = 'sticker-tooltip';
  tip.textContent = msg;
  tip.style.left = Math.min(x, window.innerWidth - 240) + 'px';
  tip.style.top = Math.max(y - 60, 10) + 'px';
  document.body.appendChild(tip);
  gsap.fromTo(tip, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .3 });
  setTimeout(() => {
    gsap.to(tip, { opacity: 0, y: -10, duration: .3, onComplete: () => tip.remove() });
  }, 2200);
}

/* =====================================================
   7. STAR CANVAS (Chapter 04 — Our Universe)
===================================================== */
function initStarCanvas(){
  const canvas = document.getElementById('starCanvas');
  const ctx = canvas.getContext('2d');
  const section = document.getElementById('chapter04');
  let stars = [];
  let mouse = { x: 0, y: 0 };

  function resize(){
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
    stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      baseAlpha: Math.random() * 0.6 + 0.3
    }));
  }
  resize();
  window.addEventListener('resize', resize);

  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left - canvas.width / 2) / canvas.width;
    mouse.y = (e.clientY - rect.top - canvas.height / 2) / canvas.height;
  });

  function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const offsetX = reducedMotion ? 0 : mouse.x * 20;
    const offsetY = reducedMotion ? 0 : mouse.y * 20;
    stars.forEach((s) => {
      ctx.beginPath();
      ctx.arc(s.x + offsetX, s.y + offsetY, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(251,243,231,${s.baseAlpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* =====================================================
   8. HEART CONSTELLATION (signature moment)
===================================================== */
function initHeartConstellation(){
  const svg = document.getElementById('heartConstellation');
  const points = [
    [150, 60], [110, 20], [60, 20], [20, 60], [20, 100],
    [60, 150], [150, 230], [240, 150], [280, 100], [280, 60],
    [240, 20], [190, 20], [150, 60]
  ];
  const d = points.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]).join(' ');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  svg.appendChild(path);

  points.forEach((p) => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', p[0]); c.setAttribute('cy', p[1]); c.setAttribute('r', 3);
    svg.appendChild(c);
  });

  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;

  ScrollTrigger.create({
    trigger: '#chapter04',
    start: 'top 60%',
    onEnter: () => {
      gsap.to(path, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' });
      gsap.fromTo(svg.querySelectorAll('circle'), { opacity: 0 }, { opacity: 1, duration: .6, stagger: .1, delay: .4 });
    }
  });
}

/* =====================================================
   9. LINE-CONNECT MATCH GAME (Chapter 05)
===================================================== */
let galleryPhotos = [];
function initGallery(){
  const game = document.getElementById('matchGame');
  const instruction = document.getElementById('gameInstruction');
  const total = 6;

  const probes = [];
  for (let i = 1; i <= total; i++){
    probes.push(new Promise((resolve) => {
      const src = `assets/photo${i}.jpeg`;
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => resolve(null);
      img.src = src;
    }));
  }

  Promise.all(probes).then((results) => {
    galleryPhotos = results.filter(Boolean);
    if (!galleryPhotos.length){
      instruction.classList.add('hidden');
      game.innerHTML = '<p class="gallery-empty">assets में photo1.jpeg – photo6.jpeg डालो, यहाँ हमारी यादों वाला गेम बन जाएगा।</p>';
      return;
    }
    buildMatchGame(galleryPhotos);
  });
}

function shuffledArray(arr){
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildMatchGame(photos){
  const leftCol = document.getElementById('matchLeft');
  const rightCol = document.getElementById('matchRight');
  const linesSvg = document.getElementById('matchLines');
  const gameWrap = document.getElementById('matchGame');
  const meterWrap = document.getElementById('loveMeterWrap');
  const meterFill = document.getElementById('loveMeterFill');
  const meterPercent = document.getElementById('loveMeterPercent');
  const completeBlock = document.getElementById('loveComplete');

  meterWrap.classList.remove('hidden');
  leftCol.className = 'match-col match-col-left';
  rightCol.className = 'match-col match-col-right';
  leftCol.innerHTML = ''; rightCol.innerHTML = '';

  const leftOrder = photos.map((src, id) => ({ id, src }));
  const rightOrder = shuffledArray(leftOrder);
  const totalPairs = photos.length;
  let matchedPairs = 0;
  let selected = null;
  const matchedLines = [];

  leftOrder.forEach((item) => leftCol.appendChild(buildNode(item, 'left')));
  rightOrder.forEach((item) => rightCol.appendChild(buildNode(item, 'right')));

  gsap.to('.match-node', { opacity: 1, y: 0, scale: 1, duration: .5, stagger: .06, ease: 'back.out(1.5)' });

  function buildNode(item, side){
    const node = document.createElement('div');
    node.className = 'match-node';
    node.dataset.id = item.id;
    node.dataset.side = side;
    node.innerHTML = `<img src="${item.src}" alt="Memory">`;
    node.addEventListener('click', () => handleClick(node));
    return node;
  }

  function handleClick(node){
    if (node.classList.contains('matched')){ openViewer(parseInt(node.dataset.id, 10)); return; }

    if (!selected){
      selected = node;
      node.classList.add('selected');
      return;
    }
    if (selected === node) return;

    if (selected.dataset.side === node.dataset.side){
      selected.classList.remove('selected');
      selected = node;
      node.classList.add('selected');
      return;
    }

    if (selected.dataset.id === node.dataset.id){
      drawLine(selected, node);
      selected.classList.remove('selected');
      selected.classList.add('matched');
      node.classList.add('matched');
      matchedPairs++;
      updateMeter();
      selected = null;
      if (matchedPairs === totalPairs) completeGame();
    } else {
      node.classList.add('wrong');
      selected.classList.add('wrong');
      const prevSelected = selected;
      setTimeout(() => {
        node.classList.remove('wrong');
        prevSelected.classList.remove('wrong', 'selected');
      }, 400);
      selected = null;
    }
  }

  function drawLine(a, b){
    const wrapRect = gameWrap.getBoundingClientRect();
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    const x1 = ar.right - wrapRect.left;
    const y1 = ar.top + ar.height / 2 - wrapRect.top;
    const x2 = br.left - wrapRect.left;
    const y2 = br.top + br.height / 2 - wrapRect.top;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1); line.setAttribute('y1', y1);
    line.setAttribute('x2', x1); line.setAttribute('y2', y1);
    linesSvg.appendChild(line);
    gsap.to(line, { attr: { x2, y2 }, duration: .5, ease: 'power2.out' });
    matchedLines.push({ a, b, line });
  }

  function redrawLines(){
    const wrapRect = gameWrap.getBoundingClientRect();
    matchedLines.forEach(({ a, b, line }) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      line.setAttribute('x1', ar.right - wrapRect.left);
      line.setAttribute('y1', ar.top + ar.height / 2 - wrapRect.top);
      line.setAttribute('x2', br.left - wrapRect.left);
      line.setAttribute('y2', br.top + br.height / 2 - wrapRect.top);
    });
  }
  window.addEventListener('resize', redrawLines);

  function updateMeter(){
    const pct = matchedPairs === totalPairs ? 100 : Math.round((matchedPairs / totalPairs) * 100);
    meterFill.style.width = pct + '%';
    meterPercent.textContent = pct + '%';
  }

  function completeGame(){
    meterFill.style.width = '100%';
    meterPercent.textContent = '100%';

    // Grand Celebration Animation
    if (typeof confetti === 'function'){
      confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 }, colors: ['#4FA3F7', '#9AD0FF', '#D4AF7A', '#E8A0BF'] });
      setTimeout(() => confetti({ particleCount: 150, spread: 100, origin: { x: 0.2, y: 0.6 } }), 400);
      setTimeout(() => confetti({ particleCount: 150, spread: 100, origin: { x: 0.8, y: 0.6 } }), 800);
    }

    setTimeout(() => {
      completeBlock.classList.remove('hidden');
      gsap.fromTo(completeBlock, { opacity: 0, y: 20, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .8, ease: 'back.out(1.4)' });

      if (window.__musicControls) {
        const m2Index = availableTracks.findIndex(t => t.name.includes('music2'));
        if (m2Index !== -1) window.__musicControls.loadTrack(m2Index);
        window.__musicControls.play();
      }
    }, 500);
  }
}

function openViewer(index){
  if (!galleryPhotos.length) return;
  window.__viewerIndex = index;
  const viewer = document.getElementById('photoViewer');
  const img = document.getElementById('viewerImg');
  img.src = galleryPhotos[index];
  viewer.classList.remove('hidden');
  gsap.fromTo(viewer, { opacity: 0 }, { opacity: 1, duration: .3 });
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('viewerClose').addEventListener('click', closeViewer);
  document.getElementById('viewerPrev').addEventListener('click', () => stepViewer(-1));
  document.getElementById('viewerNext').addEventListener('click', () => stepViewer(1));
  document.getElementById('photoViewer').addEventListener('click', (e) => {
    if (e.target.id === 'photoViewer') closeViewer();
  });
});
function closeViewer(){
  const viewer = document.getElementById('photoViewer');
  gsap.to(viewer, { opacity: 0, duration: .25, onComplete: () => viewer.classList.add('hidden') });
}
function stepViewer(dir){
  const idx = (window.__viewerIndex + dir + galleryPhotos.length) % galleryPhotos.length;
  window.__viewerIndex = idx;
  document.getElementById('viewerImg').src = galleryPhotos[idx];
}

/* =====================================================
   10. POOKIE TEST QUIZ (Chapter 03)
===================================================== */
function initQuiz(){
  const cards = document.querySelectorAll('.quiz-card');
  const continueBtn = document.getElementById('quizContinue');

  cards.forEach((card, idx) => {
    const btns = card.querySelectorAll('.quiz-btn');
    const response = card.querySelector('.quiz-response');
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (card.dataset.answered) return;
        card.dataset.answered = 'true';
        btns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        response.textContent = btn.dataset.resp;
        response.classList.add('show');

        setTimeout(() => {
          const next = cards[idx + 1];
          if (next) {
            next.classList.remove('hidden');
            gsap.fromTo(next, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6 });
          } else {
            continueBtn.classList.remove('hidden');
            gsap.fromTo(continueBtn, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: .6 });
          }
        }, 900);
      });
    });
  });

  continueBtn.addEventListener('click', () => {
    document.getElementById('chapter04').scrollIntoView({ behavior: 'smooth' });
  });
}

/* =====================================================
   11. PORTAL (Chapter 02)
===================================================== */
function initPortal(){
  const btn = document.getElementById('enterBtn');
  btn.addEventListener('click', () => {
    burst(btn);
    gsap.to(btn, { scale: 1.1, duration: .15, yoyo: true, repeat: 1 });
    setTimeout(() => {
      document.getElementById('chapter03').scrollIntoView({ behavior: 'smooth' });
    }, 400);
  });
}
function burst(el){
  if (typeof confetti !== 'function') return;
  const rect = el.getBoundingClientRect();
  confetti({
    particleCount: reducedMotion ? 30 : 90,
    spread: 70,
    startVelocity: 35,
    origin: {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight
    },
    colors: ['#D4AF7A', '#E8A0BF', '#F4C9D8', '#C8B6E2']
  });
}

/* =====================================================
   12. THE LETTER (Chapter 07)
===================================================== */
function initEnvelope(){
  const envelope = document.getElementById('envelope');
  const hint = document.getElementById('envelopeHint');
  const paper = document.getElementById('letterPaper');
  const textEl = document.getElementById('letterText');
  let opened = false;

  envelope.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    envelope.classList.add('open');
    hint.style.opacity = '0';

    setTimeout(() => {
      paper.classList.remove('hidden');
      gsap.fromTo(paper, { opacity: 0, y: 30, scale: .96 }, { opacity: 1, y: 0, scale: 1, duration: .8 });
      typewrite(textEl, birthdayMessage);
    }, 700);
  });
}
function typewrite(el, text){
  let i = 0;
  const speed = reducedMotion ? 0 : 22;
  if (reducedMotion) { el.textContent = text; return; }
  function tick(){
    if (i <= text.length){
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(tick, speed);
    }
  }
  tick();
}

/* =====================================================
   13. MUSIC PLAYER (floating widget)
===================================================== */
const playlist = [
  { src: 'assets/music1.mp3', fallback: 'assets/music/music1.mp3', name: 'music1.mp3' },
  { src: 'assets/music2.mp3', fallback: 'assets/music/music2.mp3', name: 'music2.mp3' }
];
let availableTracks = [];
let currentTrack = 0;
let audioUnlocked = false;

function initMusicPlayer(){
  const audio = document.getElementById('audio');
  audio.loop = true; 
  
  const toggle = document.getElementById('musicToggle');
  const panel = document.getElementById('musicPanel');
  const playPause = document.getElementById('playPause');
  const prevBtn = document.getElementById('prevTrack');
  const nextBtn = document.getElementById('nextTrack');
  const trackName = document.getElementById('trackName');
  const progressFill = document.getElementById('musicProgressFill');
  const progressWrap = document.getElementById('musicProgressWrap');
  const vinyl = document.getElementById('vinyl');
  const eqMini = document.getElementById('eqMini');
  const musicEq = document.getElementById('musicEq');

  let checked = 0;
  playlist.forEach((t) => {
    let probe = document.createElement('audio');
    probe.onloadedmetadata = () => {
      t.activeSrc = t.src;
      availableTracks.push(t);
      checked++;
      if (checked === playlist.length) finalizeTracks();
    };
    probe.onerror = () => {
      let probe2 = document.createElement('audio');
      probe2.onloadedmetadata = () => {
        t.activeSrc = t.fallback;
        availableTracks.push(t);
        checked++;
        if (checked === playlist.length) finalizeTracks();
      };
      probe2.onerror = () => {
        checked++;
        if (checked === playlist.length) finalizeTracks();
      };
      probe2.src = t.fallback;
    };
    probe.src = t.src;
  });

  function finalizeTracks(){
    availableTracks.sort((a, b) => a.name.localeCompare(b.name));
    if (availableTracks.length){
      loadTrack(0); 
    } else {
      trackName.textContent = 'Music files not found';
    }
  }

  function loadTrack(idx){
    if (!availableTracks.length) return;
    currentTrack = (idx + availableTracks.length) % availableTracks.length;
    audio.src = availableTracks[currentTrack].activeSrc;
    trackName.textContent = availableTracks[currentTrack].name.replace('.mp3', '');
    document.getElementById('musicRoomTrack').textContent = 'Now playing: ' + availableTracks[currentTrack].name;
  }

  function play(){
    if (!availableTracks.length) return;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        playPause.innerHTML = '<i class="fa-solid fa-pause"></i>';
        vinyl.classList.add('spinning');
        eqMini.classList.add('playing');
        musicEq.classList.add('playing');
        document.getElementById('bigVinyl').classList.add('spinning');
      }).catch(err => {
        console.log("Autoplay waiting for click...");
      });
    }
  }
  function pause(){
    audio.pause();
    playPause.innerHTML = '<i class="fa-solid fa-play"></i>';
    vinyl.classList.remove('spinning');
    eqMini.classList.remove('playing');
    musicEq.classList.remove('playing');
    document.getElementById('bigVinyl').classList.remove('spinning');
  }

  toggle.addEventListener('click', () => panel.classList.toggle('open'));
  playPause.addEventListener('click', () => audio.paused ? play() : pause());
  nextBtn.addEventListener('click', () => { loadTrack(currentTrack + 1); play(); });
  prevBtn.addEventListener('click', () => { loadTrack(currentTrack - 1); play(); });
  
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) progressFill.style.width = (audio.currentTime / audio.duration * 100) + '%';
  });
  progressWrap.addEventListener('click', (e) => {
    const rect = progressWrap.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (audio.duration) audio.currentTime = pct * audio.duration;
  });

  window.__musicControls = { play, pause, audio, loadTrack };

  function tryUnlockAudio() {
    if (audioUnlocked) return;
    if (availableTracks.length && window.__musicControls) {
      const promise = window.__musicControls.audio.play();
      if (promise !== undefined) {
        promise.then(() => {
          audioUnlocked = true;
          window.__musicControls.play();
          document.removeEventListener('click', tryUnlockAudio);
          document.removeEventListener('touchstart', tryUnlockAudio);
        }).catch(() => {});
      }
    }
  }
  document.addEventListener('click', tryUnlockAudio);
  document.addEventListener('touchstart', tryUnlockAudio);
}

/* =====================================================
   14. MUSIC ROOM (Chapter 08)
===================================================== */
function initMusicRoom(){
  const btn = document.getElementById('musicRoomPlay');
  btn.addEventListener('click', () => {
    if (window.__musicControls){
      window.__musicControls.audio.paused ? window.__musicControls.play() : window.__musicControls.pause();
      btn.innerHTML = window.__musicControls.audio.paused
        ? '<span>Play</span> <i class="fa-solid fa-play"></i>'
        : '<span>Pause</span> <i class="fa-solid fa-pause"></i>';
    }
  });
}

/* =====================================================
   15. SECRET VAULT (Chapter 09)
===================================================== */
function initVault(){
  const vault = document.getElementById('vault');
  const vaultIcon = document.getElementById('vaultIcon');
  const unlockBtn = document.getElementById('unlockBtn');
  const surprise = document.getElementById('vaultSurprise');

  unlockBtn.addEventListener('click', () => {
    vault.classList.add('unlocked');
    vaultIcon.classList.remove('fa-lock');
    vaultIcon.classList.add('fa-lock-open');
    burst(vault);
    unlockBtn.classList.add('hidden');
    surprise.classList.remove('hidden');
    gsap.fromTo(surprise, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .8 });
  });
}

/* =====================================================
   16. FINAL SCENE (Chapter 11) + FIREWORKS + IDLE ENDING
===================================================== */
function initFinalScene(){
  const canvas = document.getElementById('fireworksCanvas');
  const ctx = canvas.getContext('2d');
  const section = document.getElementById('chapter11');
  let particles = [];
  let running = false;

  function resize(){ canvas.width = section.offsetWidth; canvas.height = section.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  function spawnFirework(){
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.6 + 40;
    const colors = ['#D4AF7A', '#E8A0BF', '#F4C9D8', '#C8B6E2'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 26; i++){
      const angle = (Math.PI * 2 * i) / 26;
      particles.push({
        x, y, vx: Math.cos(angle) * (Math.random() * 2 + 1), vy: Math.sin(angle) * (Math.random() * 2 + 1),
        alpha: 1, color
      });
    }
  }

  function loop(){
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.02; p.alpha -= 0.014;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(')', '').replace('rgb', 'rgba');
      ctx.globalAlpha = Math.max(p.alpha, 0);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    particles = particles.filter(p => p.alpha > 0);
    requestAnimationFrame(loop);
  }

  let fireworkInterval;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting){
        if (!running){ running = true; loop(); }
        if (!fireworkInterval){
          confetti({ particleCount: 140, spread: 100, origin: { y: 0.6 }, colors: ['#D4AF7A','#E8A0BF','#F4C9D8'] });
          fireworkInterval = setInterval(spawnFirework, reducedMotion ? 999999 : 1400);
        }
        startIdleTimer();
      } else {
        running = false;
      }
    });
  }, { threshold: 0.4 });
  observer.observe(section);
}

function startIdleTimer(){
  if (window.__idleTimerStarted) return;
  window.__idleTimerStarted = true;
  setTimeout(() => {
    const msg = document.getElementById('idleMessage');
    msg.classList.remove('hidden');
    gsap.fromTo(msg, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2 });
  }, 6500);
}

/* =====================================================
   17. REPLAY
===================================================== */
function initReplay(){
  document.getElementById('replayBtn').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =====================================================
   START
===================================================== */
window.addEventListener('load', () => {
  initHeartsBackground();
  runLoadingSequence();
});