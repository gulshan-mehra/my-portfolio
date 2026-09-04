
/* ═══════════════════════════════════════════════════════
   GULSHAN MEHRA PORTFOLIO — script.js
═══════════════════════════════════════════════════════ */

// ── CONSTELLATION CANVAS ──────────────────────────────
const canvas = document.getElementById('constellation-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const CYAN = '0, 210, 223';
const N_PARTICLES = 80;
const CONNECTION_DIST = 140;

function initParticles() {
  particles = [];
  for (let i = 0; i < N_PARTICLES; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
    });
  }
}
initParticles();

function drawConstellation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
  }

  // Connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONNECTION_DIST) {
        const alpha = (1 - dist / CONNECTION_DIST) * 0.35;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${CYAN}, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  // Dots
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${CYAN}, 0.6)`;
    ctx.fill();
  }

  animFrame = requestAnimationFrame(drawConstellation);
}
drawConstellation();

// ── SCROLL REVEAL ─────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
reveals.forEach(el => revealObserver.observe(el));

// ── NAVBAR ────────────────────────────────────────────
const navbar  = document.getElementById('navbar');
const toggle  = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 50
    ? 'rgba(8,10,15,0.97)'
    : 'rgba(8,10,15,0.85)';
}, { passive: true });

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  toggle.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile nav on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggle.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === '#' + entry.target.id
            ? 'var(--cyan)' : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);
sections.forEach(s => sectionObserver.observe(s));

// ── ACCORDION ─────────────────────────────────────────
document.querySelectorAll('.accordion-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.accordion-item');
    const body = item.querySelector('.accordion-body');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.accordion-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.accordion-body').style.maxHeight = '0';
      openItem.querySelector('.accordion-toggle').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ── SMOOTH SCROLL (for older browsers) ───────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── HUD BOTTOM CORNER BRACKETS (JS-injected) ─────────
document.querySelectorAll('.hud-card').forEach(card => {
  const bl = document.createElement('span');
  const br = document.createElement('span');
  bl.className = 'hud-corner hud-bl';
  br.className = 'hud-corner hud-br';
  card.appendChild(bl);
  card.appendChild(br);
});

// Inject corner styles if not already there
if (!document.getElementById('hud-corner-style')) {
  const style = document.createElement('style');
  style.id = 'hud-corner-style';
  style.textContent = `
    .hud-corner {
      position: absolute;
      width: 12px; height: 12px;
      border-color: var(--cyan);
      border-style: solid;
      opacity: 0.6;
      transition: opacity 0.3s;
      pointer-events: none;
    }
    .hud-bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; border-radius: 0 0 0 2px; }
    .hud-br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; border-radius: 0 0 2px 0; }
    .hud-card:hover .hud-corner { opacity: 1; }
  `;
  document.head.appendChild(style);
}

console.log('%c GULSHAN MEHRA PORTFOLIO ', 'background:#00d2df;color:#080a0f;font-weight:bold;font-size:14px;padding:4px 8px;');
console.log('%c Unity Game Developer | Mohali, India ', 'color:#00d2df;font-family:monospace;');


// ── COMMERCIAL PROJECTS POPUP MODAL ──────────────────
const projectData = {
  'vr-engine-explorer': {
    title: 'VR Engine Explorer',
    badge: 'COMMERCIAL',
    badgeStyle: 'client',
    stack: ['Unity', 'C#', 'XR Plugin', 'Git'],
    video: './videos/video1.mp4',
    description: 'An interactive Meta Quest 2 VR experience enabling users to inspect a car engine in real-time operation. Users can interact via controllers or hand tracking, toggle open, closed, and running states, and grab individual parts to inspect dynamic details.',
    highlights: [
      'Dual Input Support: Supports both standard Meta Quest 2 motion controllers and direct hand-tracking interactions.',
      'Dynamic Engine States: Seamless switching between operational (running), closed, and disassembled/opened views.',
      'Interactive Part Inspection: Allows users to pick up, rotate, and examine individual mechanical components directly in VR.',
      'Contextual UI: Triggers dynamic information panels providing real-time technical descriptions whenever a part is held.'
    ]
  },
  'uno-five': {
    title: 'UNO Five',
    badge: 'COMMERCIAL',
    badgeStyle: 'client',
    stack: ['Unity', 'C#', 'AWS S3', 'Git'],
    video: './videos/video1.mp4',
    description: 'A multiplayer Android UNO card game built with Photon PUN 2. Features 2v2 team modes, dynamic turn-based gameplay, social systems with in-game chat and gifting, friend lobbies, and competitive daily and weekly tournaments for global players.',
    highlights: [
      'Team-Based Multiplayer: Real-time 2v2 online matches powered by Photon PUN 2 for reliable turn-based state synchronization.',
      'Social Ecosystem: Robust social features including friend lists, private match lobbies, direct chat, and in-game gift sending.',
      'Tournament System: Structured daily and weekly competitive tournaments to drive recurring player engagement.',
      'Optimized Mobile UX: Smooth card animations and intuitive touch controls designed specifically for Android devices.'
    ]
  },
  'modern-closet': {
    title: 'Modern Closet',
    badge: 'COMMERCIAL',
    badgeStyle: 'client',
    stack: ['Unity', 'C#', 'PHP', 'MySQL', 'Git'],
    video: './videos/video1.mp4',
    description: 'A Unity WebGL application enabling users to design custom walk-in, reach-in, and wall-unit closets. Features parametric sizing, modular shelving and drawer layouts, custom finishes, and direct order transmission to clients via backend integration.',
    highlights: [
      'Parametric Space Sizing: Generates real-time 3D closet frames dynamically based on user-entered room dimensions.',
      'Diverse Layout Styles: Supports multiple closet archetypes including walk-in, reach-in, and full wall-unit configurations.',
      'Modular Customization: Interactive tools to adjust shelf counts, drawer units, hanger rods, finishes, and paint colors.',
      'Automated Order Dispatch: Direct backend pipeline that packages finalized design specs and sends order details to the manufacturer/client.',
      'Cross-Browser WebGL: Runs seamlessly in standard desktop web browsers without requiring external plugin installations.'
    ]
  },
  'asap-arcade': {
    title: 'ASAP Arcade',
    badge: 'COMMERCIAL RELEASE',
    badgeStyle: 'client',
    stack: ['Unity', 'C#', 'Git'],
    video: './videos/video1.mp4',
    description: 'An educational children\' game built with Unity, C#, and PHP. Kids learn English alphabets by collecting letters in sequential order across four difficulty modes, earning in-game coins to purchase and store collectible cards in their personal album.',
    highlights: [
      'Sequential Letter Matching: Children learn the alphabet and spelling patterns by collecting letters in the exact order prompted on the top HUD panel.',
      'Tiered Difficulty Pacing: Features four progressive difficulty settings (Slow, Medium, Hard, Very Hard) to accommodate different skill levels and age groups.',
      'Gamified Card Economy: Players earn coins during gameplay to unlock collectible cards saved within an in-game "My Collections" showcase.',
      'Full-Stack Architecture: Combines Unity and C# for responsive gameplay mechanics with a PHP backend for data handling and player progress management.'
    ]
  },
  'grass-shader': {
    title: 'Grass Shader Pack',
    badge: 'UNITY ASSET STORE',
    badgeStyle: 'store',
    stack: ['Unity', 'Shader Graph', 'Custom HLSL', 'Editor Tooling'],
    video: './videos/video1.mp4',
    description: 'Production-ready grass and vegetation shader package published on the Unity Asset Store. Built with Shader Graph and custom HLSL subgraphs for realistic wind response and distance LOD blending. Includes a custom-built Unity Editor tool for mesh combining and terrain-style surface painting.',
    highlights: [
      'Custom HLSL wind displacement with distance-based LOD blending',
      'Custom EditorWindow with mesh combining to drastically reduce draw calls',
      'Terrain-system-like brush tool for interactive object painting directly in the editor',
      'Commercially published and maintained for the Unity developer community'
    ],
    actionLink: {
      url: 'https://assetstore.unity.com',
      label: 'View on Asset Store ↗'
    }
  },
  'water-shader': {
    title: 'Water Shader Pack',
    badge: 'UNITY ASSET STORE',
    badgeStyle: 'store',
    stack: ['Unity', 'Shader Graph', 'Custom HLSL'],
    video: './videos/video1.mp4',
    description: 'Commercial real-time water shader package published on the Unity Asset Store. Features realistic surface wave simulation, depth-based color absorption, edge foam detection, and specular reflection highlights constructed using Shader Graph and custom HLSL subgraphs.',
    highlights: [
      'Depth buffer sampling for shore foam blending and translucent depth gradients',
      'Vertex wave displacement and normal map distortion via custom HLSL functions',
      'Real-time sunlight specular response and simulated caustic projections',
      'Extremely lightweight, optimized for Mobile, Standalone, and WebGL'
    ],
    actionLink: {
      url: 'https://assetstore.unity.com',
      label: 'View on Asset Store ↗'
    }
  }
};

const modal = document.getElementById('project-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalTitle = document.getElementById('modal-project-title');
const modalBadge = document.getElementById('modal-badge');
const modalStack = document.getElementById('modal-stack');
const modalVideo = document.getElementById('modal-video');
const modalVideoSource = document.getElementById('modal-video-source');
const modalVideoFilename = document.getElementById('modal-video-filename');
const modalDescription = document.getElementById('modal-description');
const modalHighlights = document.getElementById('modal-highlights');
const modalActions = document.getElementById('modal-actions');

let lastFocusedElement = null;

function openProjectModal(projectId, triggerCard) {
  const data = projectData[projectId];
  if (!data || !modal) return;

  lastFocusedElement = triggerCard || document.activeElement;

  // Title
  modalTitle.textContent = data.title;

  // Badge
  modalBadge.textContent = data.badge;
  if (data.badgeStyle === 'store') {
    modalBadge.className = 'client-badge store-badge';
  } else {
    modalBadge.className = 'client-badge';
  }

  // Stack pills
  modalStack.innerHTML = '';
  data.stack.forEach(tech => {
    const pill = document.createElement('span');
    pill.className = 'stack-pill sm';
    pill.textContent = tech;
    modalStack.appendChild(pill);
  });

  // Description
  modalDescription.textContent = data.description;

  // Highlights
  modalHighlights.innerHTML = '';
  data.highlights.forEach(h => {
    const li = document.createElement('li');
    li.textContent = h;
    modalHighlights.appendChild(li);
  });

  // Actions / Links
  modalActions.innerHTML = '';
  if (data.actionLink) {
    const a = document.createElement('a');
    a.href = data.actionLink.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'btn-primary';
    a.style.fontSize = '0.75rem';
    a.textContent = data.actionLink.label;
    modalActions.appendChild(a);
  }

  // Video Source (use card data-video if overridden, or default to data.video)
  const videoSrc = (triggerCard && triggerCard.dataset.video) ? triggerCard.dataset.video : data.video;
  modalVideoSource.src = videoSrc;
  modalVideo.load();
  if (modalVideoFilename) {
    const filename = videoSrc.split('/').pop();
    modalVideoFilename.textContent = filename;
  }

  // Show modal
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Focus close button
  setTimeout(() => {
    modalCloseBtn.focus();
  }, 100);
}

function closeProjectModal() {
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  // Pause video
  if (modalVideo) {
    modalVideo.pause();
    modalVideo.currentTime = 0;
  }

  // Restore focus
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

// Attach listeners to the 5 clickable cards
document.querySelectorAll('.project-card-clickable').forEach(card => {
  const projectId = card.dataset.projectId;
  if (!projectId) return;

  card.addEventListener('click', (e) => {
    // If user clicked directly on an external link inside card, don't trigger modal
    if (e.target.closest('a')) return;
    openProjectModal(projectId, card);
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProjectModal(projectId, card);
    }
  });
});

// Close triggers
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeProjectModal);
}
if (modalBackdrop) {
  modalBackdrop.addEventListener('click', closeProjectModal);
}
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
    closeProjectModal();
  }
});
