// ============ CURSOR ============
const cur = document.getElementById('cur'), cur2 = document.getElementById('cur2');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function anim() {
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
  rx += (mx - rx) * .1; ry += (my - ry) * .1;
  cur2.style.left = rx + 'px'; cur2.style.top = ry + 'px';
  requestAnimationFrame(anim);
})();
document.querySelectorAll('a,button').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.style.width = '22px'; cur.style.height = '22px'; cur.style.background = 'var(--c3)'; cur2.style.width = '60px'; cur2.style.height = '60px'; });
  el.addEventListener('mouseleave', () => { cur.style.width = '12px'; cur.style.height = '12px'; cur.style.background = 'var(--c1)'; cur2.style.width = '40px'; cur2.style.height = '40px'; });
});

// ============ PARTICLE CANVAS ============
const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
function resize() { cv.width = window.innerWidth; cv.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize);
const COLS = ['#ff3cac', '#ff9a3c', '#00f5d4', '#a855f7', '#ffd60a', '#4ade80'];
const pts = Array.from({ length: 70 }, () => ({
  x: Math.random() * cv.width, y: Math.random() * cv.height,
  vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5,
  r: Math.random() * 2.5 + .5,
  c: COLS[Math.floor(Math.random() * COLS.length)],
  a: Math.random() * .7 + .2
}));
function drawPts() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = cv.width; if (p.x > cv.width) p.x = 0;
    if (p.y < 0) p.y = cv.height; if (p.y > cv.height) p.y = 0;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.c + Math.floor(p.a * 255).toString(16).padStart(2, '0');
    ctx.fill();
    for (let j = i + 1; j < pts.length; j++) {
      const q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
      if (d < 100) {
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = p.c + Math.floor((1 - d / 100) * .18 * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = .6; ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawPts);
}
drawPts();

// ============ TYPEWRITER ============
const phrases = ['Social Media · Reels · Meta Ads', '200+ Creatives Delivered', 'Growing Brands in Bengaluru', 'One Freelancer. Full-Service.', 'Canva · Flyers · SEO · Ads'];
let pi = 0, ci = 0, del = false;
const tw = document.getElementById('tw2');
function type() {
  const ph = phrases[pi];
  if (!del) { tw.textContent = ph.slice(0, ++ci); if (ci === ph.length) { del = true; setTimeout(type, 2200); return; } }
  else { tw.textContent = ph.slice(0, --ci); if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; } }
  setTimeout(type, del ? 35 : 75);
}
setTimeout(type, 1000);

// ============ COUNTER ANIMATION ============
function animCount(el, target, suffix = '') {
  let cur = 0, step = Math.ceil(target / 60);
  const iv = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur + suffix;
    if (cur >= target) clearInterval(iv);
  }, 30);
}
let counted = false;
const ob = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      if (!counted && (e.target.contains(document.getElementById('s1')) || e.target === document.querySelector('.stat-card'))) {
        counted = true;
        setTimeout(() => {
          animCount(document.getElementById('s1'), 7, '+');
          animCount(document.getElementById('s2'), 200, '+');
          animCount(document.getElementById('s3'), 5, '+');
        }, 400);
      }
    }
  });
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => ob.observe(el));

// ============ PORTFOLIO FILTERS ============
const filterBtns = document.querySelectorAll('.port-filter-btn');
const portItems = document.querySelectorAll('.port-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    portItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hiding');
        item.style.display = '';
      } else {
        item.classList.add('hiding');
        // After transition, hide completely
        setTimeout(() => {
          if (item.classList.contains('hiding')) {
            item.style.display = 'none';
          }
        }, 400);
      }
    });
  });
});

// ============ LIGHTBOX ============
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightbox-content');
const lightboxClose = document.getElementById('lightbox-close');

// Image lightbox
document.querySelectorAll('.port-item:not(.video-item)').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (img) {
      lightboxContent.innerHTML = '<img src="' + img.src + '" alt="' + img.alt + '">';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
});

// Video lightbox
document.querySelectorAll('.port-item.video-item').forEach(item => {
  item.addEventListener('click', () => {
    const video = item.querySelector('video');
    if (video) {
      lightboxContent.innerHTML = '<video src="' + video.querySelector('source').src + '" controls autoplay style="max-width:90vw;max-height:85vh;border-radius:16px;"></video>';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  // Pause any playing video
  const vid = lightboxContent.querySelector('video');
  if (vid) vid.pause();
  setTimeout(() => { lightboxContent.innerHTML = ''; }, 300);
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
});
