
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
    stack: ['Unity', 'C#', 'XR Plugin', 'AWS S3', 'Git'],
    video: './videos/VR_EngineExplorer.mp4',
    shortDesc: 'Interactive Meta Quest 2 VR app to inspect, hold, and examine parts of a car engine across running, open, and closed states using controllers or hands.',
    description: 'VR Engine Explorer is an educational simulation created for the Meta Quest 2 that lets users inspect a working car engine in real time. The app supports both motion controllers and hand tracking, giving users the freedom to physically reach out, pick up, and examine individual engine parts in 3D space. When a component is held, an integrated description panel displays detailed technical information about that specific part. Users can also dynamically switch the entire engine assembly between operating, opened, and closed states to observe internal mechanical movements.',
    optimizations: [
      'Standalone VR Framerate: Optimized 3D engine meshes, combined draw calls, and configured texture compression to ensure a steady framerate on the Quest 2 hardware.'
    ],
    role: [
      'Built the core VR interaction system for Meta Quest 2, implementing both controller and hand-tracking inputs.',
      'Programmed the state logic to switch the engine between running, opened, and closed views.',
      'Developed the interactive grab-and-inspect mechanics for individual mechanical parts.',
      'Created the dynamic UI system that detects the held part and presents its description in real time.'
    ]
  },
  'uno-five': {
    title: 'UNO Five',
    badge: 'COMMERCIAL',
    badgeStyle: 'client',
    stack: ['Unity', 'C#', 'Photon PUN 2', 'AWS S3', 'Firebase', 'Git'],
    video: 'https://drive.google.com/file/d/1XZlO3HkTUjaygt4yTtuHcNMDPK4alrnz/view?usp=sharing',
    shortDesc: 'Android multiplayer UNO game powered by Photon PUN 2, featuring 2v2 team matches, in-game chat, gifting, friend systems, and daily/weekly tournaments.',
    description: 'UNO Five is a mobile card game built for Android that brings the classic UNO rules into an online team format. Using Photon PUN 2 for turn-based networking, the game allows players to pair up and compete in real-time 2v2 team matches. It includes social systems where players can add friends, chat directly, invite each other to matches, and send in-game gifts. To keep competitive players engaged, the game features automated daily and weekly tournament modes with dynamic player rankings.',
    optimizations: [
      'Network Payload Efficiency: Serialized turn actions, card plays, and game states into lightweight Photon RPC payloads to minimize mobile data usage and handle latency spikes.Match Results are send through master to make anti-cheating and reduce api calls to custom backend.',
      'UI Batching: Packed cards, avatars, and HUD assets into sprite atlases to reduce draw calls and keep UI navigation smooth on budget Android devices.'
    ],
    role: [
      'Implemented the turn-based online multiplayer architecture and room matchmaking using Photon PUN 2.',
      'Programmed the core 2v2 game rules, turn timers, and victory conditions.',
      'Built the social features, including the friends list, direct player chat, and in-game gifting system.',
      'Developed the tournament management logic for daily and weekly competitive brackets.',
      'Implemented firebase Push notifications for game invites and friend requests with fcm token for Android/IOS.'
    ]
  },
  'modern-closet': {
    title: 'Modern Closet',
    badge: 'COMMERCIAL',
    badgeStyle: 'client',
    stack: ['Unity', 'C#', 'PHP', 'MySQL', 'WebGL', 'Git'],
    video: 'https://drive.google.com/file/d/1iA4f_VwuNrPTsufw4L2ioQu7KmdAIZyU/view?usp=sharing',
    shortDesc: 'Unity WebGL application that lets users customize, resize, and design reach-in, walk-in, and wall-unit closets in 3D, sending finalized orders to the backend.',
    description: 'Modern Closet is a 3D web application developed in Unity WebGL that lets users design custom cabinetry for residential or office spaces. Users start by entering their exact room dimensions, then choose between walk-in, reach-in, or wall-unit styles. The tool allows full customization of the layout—users can adjust the count and placement of shelves, drawers, and hanger sections, as well as apply custom finishes and paint colors. Once the user finalizes their configuration, the order details and layout specifications are packaged and sent directly to the client\'s backend system for processing.',
    optimizations: [
      'WebGL Asset Streaming: Optimized 3D model assets, textures, and compression settings to maintain quick browser loading times and low memory consumption.',
      'Dynamic Mesh Instantiation: Reused modular shelf, drawer, and rod prefabs efficiently to keep runtime draw calls low while resizing closet boundaries.'
    ],
    role: [
      'Programmed the dimensional input system so closet frames scale dynamically to user-defined room measurements.',
      'Implemented customization tools to add, remove, and reposition shelves, drawers, and hanging rods in 3D view.',
      'Built the material and paint customization system for real-time visual adjustments.Optimized memory usage with flyweight pattern to set property blocks for materials',
      'Integrated the frontend WebGL client with backend APIs to transmit finalized closet designs and order data.'
    ],
    actionLink: {
      url: 'https://modernclosetsdirect.com/closetdesign/index.html',
      label: 'Go to Web ↗'
    }
  },
  'asap-arcade': {
    title: 'ASAP Arcade',
    badge: 'COMMERCIAL RELEASE',
    badgeStyle: 'client',
    stack: ['Unity', 'C#', 'PHP', 'Android', 'Git'],
    video: './videos/asap-arcade.mp4',
    shortDesc: 'Educational Unity game with a PHP backend where kids learn the alphabet by collecting letters in order, unlocking cards, and playing across four difficulties.',
    description: 'ASAP Arcade is an educational children\'s game made in Unity with a PHP backend, designed to teach English alphabet sequences through interactive play. Players must collect letters in the exact sequence displayed on the top HUD panel to progress. As children play and complete objectives, they earn coins that can be used to purchase collectible cards, which are stored and viewed in a dedicated "My Collections" section. The game accommodates different learning paces by offering four difficulty tiers: Slow, Medium, Hard, and Very Hard.',
    optimizations: [
      'Efficient Sprite Management: Structured 2D letter assets and UI panels within single texture atlases to prevent unnecessary render passes.',
      'Lightweight Backend Calls: Implemented APIs to communicate coin balances, card purchases, and player progress with the PHP backend without freezing gameplay.task scheduling for parallel images downloading and caching to get better performance and lag free exprience.'
    ],
    role: [
      'Developed the core gameplay loop and HUD tracking to verify that letters are collected in the correct sequence.',
      'Implemented the four difficulty modes (Slow, Medium, Hard, Very Hard) to adjust game speed and challenge.',
      'Built the in-game economy, handling coin collection, card purchasing, and the "My Collections" gallery.',
      'Created the PHP backend endpoints to securely store and retrieve user progress, collected cards, and inventory data.'
    ],
    actionLink: {
      url: 'https://play.google.com/store/apps/details?id=com.ASAPGaming.Label1&hl=en_IN',
      label: 'View on Play Store ↗'
    }
  },
  'revv-racing': {
    title: 'REVV Racing',
    badge: 'COMMERCIAL',
    badgeStyle: 'client',
    stack: ['Unity', 'C#', 'Microsoft Playfab', 'Blockchain', 'Addressables', 'WebGL'],
    video: null,
    shortDesc: 'Browser WebGL racing game for Animoca Brands with track leaderboards, NFT car ownership via Motorverse, and large-scale player data migrations.',
    description: 'REVV Racing is a 3D browser-based WebGL racing title developed for Animoca Brands. The game features multiple racing tracks and competitive trophy events, each supported by its own dedicated leaderboard. It integrates Web3 functionality through Motorverse NFTs, where owning a specific car NFT grants direct access to drive and race that vehicle in the game. Work on this project included executing major data migrations to transition player accounts, game progression, and historical leaderboard records cleanly across system updates.',
    optimizations: [],
    role: [
      'Executed data migrations for user account information, gameplay saves, and multi-track leaderboard records across project updates from Microsoft Playfab.',
      'Maintained and verified individual leaderboard structures across different racing tracks and trophy tiers.',
      'Profiled and resolved WebGL performance issues to ensure consistent framerates and track loading in desktop browsers with Addressable.'
    ]
  },
  'water-shader': {
    title: 'Water Shader Pack',
    badge: 'UNITY ASSET STORE',
    badgeStyle: 'store',
    stack: ['Unity', 'Shader Graph', 'Custom HLSL', 'URP'],
    video: null,
    image: 'images/water-shader.png',
    shortDesc: 'Stylized, high-performance Unity URP water shader pack with depth-based blending, vertex displacement, and dynamic shoreline foam for mobile, desktop, and VR.',
    description: 'The Water Shader Pack is a comprehensive, performance-focused water rendering solution built from the ground up for Unity\'s Universal Render Pipeline (URP). Designed to run smoothly across desktop, mobile, and VR platforms, it features customizable wave motion using an optimized vertex displacement system, complemented by texture-driven wave detailing for mobile efficiency. The package provides both stylized toon and realistic water variants, complete with scene depth detection to calculate water boundaries, depth-based color gradients, and dynamic shoreline foam. It ships with modular Shader Graph files, pre-configured material presets, and complete demo scenes to help developers integrate clean water effects into their projects right out of the box.',
    optimizations: [
      'Mobile-First Vertex & Texture Blend: Used vertex wave displacement and offloaded high-frequency surface wave details to scrolling textures, keeping instruction counts low on mobile and standalone VR GPUs.',
      'Depth-Buffer Foam Detection: Implemented an efficient scene depth texture lookup (CameraDepthTexture) to render shoreline foam and water opacity fades without requiring expensive mesh-based intersection triggers.',
      'URP Shader Graph Modularity: Structured sub-graphs to prune unnecessary lighting passes and texture samples when using the simplified toon-style variant, saving fill-rate overhead on constrained chipsets.',
      'Decal Shader: used decal shader for creating underwater caustic effect.'
    ],
    role: [
      'Designed, authored, and tested the entire water shader asset end-to-end within Unity’s URP Shader Graph.',
      'Developed the vertex displacement math to produce controllable ocean waves and surface chop with minimal computational cost.',
      'Created the depth-testing logic to drive water-depth color gradients, edge detection, and dynamic foam generation around intersecting geometry.',
      'Authored both toon-style and semi-realistic water variants, balancing visual appeal with platform-specific performance targets.',
      'Built interactive demo scenes with 7 varients and 2 types of water, material presets, exposed inspector parameters, and asset documentation for developers.'
    ],
    actionLink: {
      url: 'https://assetstore.unity.com/packages/vfx/shaders/water-shader-pack-326322',
      label: 'View on Asset Store ↗'
    }
  },
  'grass-shader': {
    title: 'Grass Shader Pack',
    badge: 'UNITY ASSET STORE',
    badgeStyle: 'store',
    stack: ['Unity', 'Shader Graph', 'Custom HLSL', 'Editor Tooling', 'URP'],
    video: null,
    image: 'images/grass-shader.png',
    shortDesc: 'Unity editor tool and interactive shader pack to paint wind-animated, responsive vegetation onto any collider with mesh combining and URP renderer feature support.',
    description: 'Grass Painter Package is a complete vegetation painting and shading solution for Unity, designed to bypass the constraints of the standard Terrain system. The package includes a custom editor tool that allows developers to paint grass, bushes, and trees directly onto any GameObject with a collider using customizable brush settings for density, rotation, and random scale. Alongside the painting workflow, the package provides high-performance interactive shaders featuring procedural wind animation and real-time object deflection. To ensure full mobile and cross-platform compatibility, player interaction is powered by a custom Scriptable Renderer Feature, paired with mesh-combining utilities and hierarchy management tools to handle dense environments efficiently.',
    optimizations: [
      'Scriptable Renderer Feature Interaction: Tracked player and object positions using a lightweight URP Scriptable Renderer Feature to pass interaction vectors to the shader without per-instance CPU material property block updates.',
      'Mesh Combining Utility: Built an integrated mesh-combining system into the editor workflow to merge painted vegetation patches into single combined meshes, drastically cutting draw calls.',
      'Lightweight Vertex Animation: Handled wind sways and bending physics entirely within vertex shader calculations, avoiding complex bone rigs or CPU-based transform updates.'
    ],
    role: [
      'Developed the entire package end-to-end, covering the custom Unity Editor painting suite, shader architecture, and documentation.',
      'Built the editor painting workflow using raycasting and brush parameters (size, density, random rotation, and scale variations) to support placement on any mesh collider.',
      'Authored the interactive vegetation shaders in Shader Graph/HLSL, implementing controllable wind displacement and real-time physical bending.',
      'Engineered a custom URP Scriptable Renderer Feature to pass interaction coordinate data into the shader pipeline cleanly and efficiently for mobile hardware.',
      'Created the mesh-combining and "Extract Children" utilities to help users organize hierarchies and optimize rendering budgets for dense scenes.'
    ],
    actionLink: {
      url: 'https://assetstore.unity.com/packages/3d/props/tools/grass-shader-pack-383326',
      label: 'View on Asset Store ↗'
    }
  },
  'avatar-game': {
    title: 'Avatar Game',
    badge: 'GAME PROJECT',
    badgeStyle: 'client',
    stack: ['Unity', 'C#', 'Shader Graph', 'AI / NavMesh', 'Particle System'],
    video: 'https://drive.google.com/file/d/1IcpRXUoxBV5EVJif4ma8Dk6uwDTOmQtI/view?usp=sharing',
    shortDesc: 'Story-based 3D combat game featuring melee and ranged enemy types, a dynamic dual-mode boss, and custom visual effects with interactive grass.',
    description: 'Avatar Game is a story-driven action title centered on combat progression where players fight through waves of varied enemies to reach and defeat a climactic final boss. The game features two core enemy archetypes: close-quarters melee combatants and distance-oriented projectile attackers. The final boss incorporates adaptive combat behavior, dynamically shifting between melee strikes and ranged projectile assaults based on its remaining health pool and attack pacing. The environment is styled with soothing visual effects and interactive grass that reacts physically to character movements, supported by particle systems and custom shaders to establish an atmospheric visual presentation.',
    optimizations: [
      'Hierarchical State Machine Architecture: Built modular Finite State Machines (FSM) for both normal enemies and the final boss, keeping AI evaluation, target tracking, and attack transitions computationally light.',
      'Particle & VFX Budgeting: Tuned particle system emission rates, lifetime values, and texture footprints to deliver lush environmental effects without causing GPU fill-rate drops during intensive combat encounters.',
      'Lightweight Interactive Grass: Integrated responsive vertex displacement shaders to handle grass bending physics efficiently on the GPU, avoiding CPU-side collision calculations.'
    ],
    role: [
      'Developed the entire game end-to-end in Unity and C#, including combat systems, AI design, and visual implementation.',
      'Engineered the state-machine-driven AI behaviors for melee and ranged enemy units, handling pathfinding(Nav Mesh agent), detection cones, and attack intervals.',
      'Designed and programmed the final boss fight mechanics, incorporating dynamic phase switching between melee and projectile attacks driven by health thresholds and timing.',
      'Authored custom interactive grass shaders using Shader Graph to enable real-time foliage displacement beneath moving characters.',
      'Created ambient visual effects and attack visuals utilizing Unity’s Particle System to match the game\'s atmospheric art direction.'
    ]
  },
  'poly-mystery': {
    title: 'Poly Mystery',
    badge: 'PERSONAL PROJECT',
    badgeStyle: 'client',
    stack: ['Unity', 'C#', 'Action RPG', 'Inventory System', 'ScriptableObjects'],
    video: 'https://drive.google.com/file/d/1-0Oh3TBuCiyM-6B0_FC5ZnpgAfmarjlC/view?usp=sharing',
    shortDesc: 'Story-based 3D action RPG featuring combat-driven map progression, consumable health recovery, an inventory system, and stat-altering equipment sets.',
    description: 'Poly Mystery is a story-driven 3D action-adventure game where players progress through distinct areas of the world by clearing each map of hostile enemies to unlock gateways to new zones. The core gameplay loop blends combat and survival, allowing players to scavenge consumable food items like apples from the environment to replenish their health. As players explore, they can find and collect varied equipment—including swords, shields, and modular armor pieces for different body slots. The game features an interactive inventory management system where players store food items, manage loot, and equip or unequip gear to dynamically alter player attributes such as attack damage output and incoming damage reduction.',
    optimizations: [
      'Dynamic Equipment Attachment: Built an efficient bone-socketing setup that parents weapon and armor models directly to player rig transform nodes, eliminating redundant skinned mesh renderer passes.',
      'Efficient Inventory & UI Serialization: Structured the inventory, item data, and stat calculations using lightweight ScriptableObjects and event-driven UI listeners to prevent per-frame polling during combat encounters.',
      'Combat & State Management: Utilized state-machine logic for enemy AI and player actions to keep pathfinding and attack checks performant across dense encounter zones.'
    ],
    role: [
      'Designed and developed the entire project end-to-end as a solo personal project in Unity and C#.',
      'Programmed the combat loop, enemy wave progression, and level-unlock triggers across map zones.',
      'Implemented the full inventory and equipment pipeline, enabling players to store, equip, and unequip weapons and multi-slot armor.',
      'Engineered the dynamic stat system to calculate weapon attack power, defense values, damage reduction, and consumable-based health regeneration.',
      'Built the third-person character controller, environmental item interaction logic, and UI panels for inventory and health management.'
    ]
  },
  'color-folks': {
    title: 'Color Folks',
    badge: 'COMMERCIAL',
    badgeStyle: 'client',
    stack: ['Unity', 'C#', 'Photon Fusion', 'REST APIs', 'OAuth', 'Git'],
    video: 'https://drive.google.com/file/d/1WYr83tBDTWwP4ZHJmkyKONPBP18PSkr7/view?usp=sharing',
    shortDesc: 'Mobile hide-and-seek game with dynamic character painting synced via Photon Fusion, featuring shooter-hunter mechanics and full backend auth.',
    description: 'Color Folks is a mobile hide-and-seek multiplayer game inspired by Mecha Chameleon. The core mechanic revolves around dynamic surface painting, where players can paint over character models in real time, with the applied paint textures continuously synchronized across the network so hunters and fellow hiders can view them instantly. The multiplayer infrastructure is powered by Photon Fusion, handling character position interpolation, weapon firing, hunting interactions, paint synchronization, and match result broadcasts via targeted RPCs. Additionally, the game integrates custom and Google OAuth backend APIs to handle user authentication, match state validation, player preferences, and persistent data storage.',
    optimizations: [
      'Low-Latency RPCs & Tick-Based Prediction: Leveraged Photon Fusion’s networked state system for movement reconciliation while using lightweight Remote Procedure Calls (RPCs) strictly for instantaneous game events (hunting, shooting, paint splatters).',
      'Mobile Rendering & Memory Control: Utilized mesh combining, SRP baching,static baching, gpu instancing to reduce rendering overhead and batches count.used sprite atlas for optimizing ui draw calls for better performance on mobile devices.'
    ],
    role: [
      'Engineered the dynamic runtime character painting system and integrated it with networked materials so paint overlays sync accurately across all clients.',
      'Implemented the full multiplayer gameplay loop using Photon Fusion, including character state replication, shooter/hunter hit detection, and match win/loss resolution.',
      'Programmed network RPC pipelines to handle real-time combat actions, painting events, and end-of-round result broadcasting.',
      'Integrated backend REST APIs for Google Sign-In, custom registration/login flows, and persistent storage of player preferences and profiles.'
    ]
  }
};

const modal = document.getElementById('project-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalTitle = document.getElementById('modal-project-title');
const modalBadge = document.getElementById('modal-badge');
const modalStack = document.getElementById('modal-stack');
const modalImage = document.getElementById('modal-image');
const modalVideo = document.getElementById('modal-video');
const modalVideoSource = document.getElementById('modal-video-source');
const modalVideoFilename = document.getElementById('modal-video-filename');
const modalIframe = document.getElementById('modal-iframe');
const modalVideoLabel = document.getElementById('modal-video-label');
const modalVideoExternalLink = document.getElementById('modal-video-external-link');
const modalDescription = document.getElementById('modal-description');
const modalRoleList = document.getElementById('modal-role-list');
const modalOptimizationContainer = document.getElementById('modal-optimization-container');
const modalOptimizationList = document.getElementById('modal-optimization-list');
const modalActions = document.getElementById('modal-actions');
const modalDialog = modal ? modal.querySelector('.modal-dialog') : null;
const modalBodyGrid = modal ? modal.querySelector('.modal-body-grid') : null;
const modalVideoCol = modal ? modal.querySelector('.modal-video-col') : null;

function isEmbedUrl(url) {
  if (!url) return false;
  return url.includes('drive.google.com') || url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') || url.includes('/preview');
}

function getEmbedUrl(url) {
  if (!url) return '';
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  return url;
}

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

  // Description
  modalDescription.textContent = data.description;

  // My Role (replaces Key Highlights)
  if (modalRoleList) {
    modalRoleList.innerHTML = '';
    if (data.role && data.role.length > 0) {
      data.role.forEach(r => {
        const li = document.createElement('li');
        li.textContent = r;
        modalRoleList.appendChild(li);
      });
    }
  }

  // Optimization & Performance
  if (modalOptimizationContainer && modalOptimizationList) {
    modalOptimizationList.innerHTML = '';
    if (data.optimizations && data.optimizations.length > 0) {
      modalOptimizationContainer.style.display = 'block';
      data.optimizations.forEach(opt => {
        const li = document.createElement('li');
        const colonIdx = opt.indexOf(':');
        if (colonIdx !== -1) {
          const heading = opt.substring(0, colonIdx);
          const body = opt.substring(colonIdx + 1);
          const strong = document.createElement('strong');
          strong.textContent = heading + ':';
          li.appendChild(strong);
          li.appendChild(document.createTextNode(body));
        } else {
          li.textContent = opt;
        }
        modalOptimizationList.appendChild(li);
      });
    } else {
      modalOptimizationContainer.style.display = 'none';
    }
  }

  // Media Source (supports Images, Google Drive iframe preview, YouTube, or local MP4 files)
  const rawImageSrc = (triggerCard && triggerCard.dataset.image) ? triggerCard.dataset.image : data.image;
  const rawVideoSrc = (triggerCard && triggerCard.dataset.video) ? triggerCard.dataset.video : data.video;

  if (rawImageSrc) {
    if (modalVideoCol) {
      modalVideoCol.style.display = '';
    }
    if (modalBodyGrid) {
      modalBodyGrid.classList.remove('no-video');
    }
    if (modalDialog) {
      modalDialog.classList.remove('no-video');
    }

    if (modalVideo) {
      modalVideo.pause();
      modalVideo.style.display = 'none';
    }
    if (modalVideoSource) {
      modalVideoSource.src = '';
    }
    if (modalIframe) {
      modalIframe.src = '';
      modalIframe.style.display = 'none';
    }
    if (modalImage) {
      modalImage.src = rawImageSrc;
      modalImage.alt = `${data.title} Preview Photo`;
      modalImage.style.display = 'block';
    }
    if (modalVideoFilename) {
      const filename = rawImageSrc.split('/').pop();
      modalVideoFilename.textContent = filename;
    }
    if (modalVideoLabel) {
      modalVideoLabel.textContent = 'Preview Photo';
    }
    if (modalVideoExternalLink) {
      modalVideoExternalLink.href = rawImageSrc;
      modalVideoExternalLink.textContent = 'View Full Photo ↗';
      modalVideoExternalLink.style.display = 'inline-block';
    }
  } else if (!rawVideoSrc) {
    if (modalImage) {
      modalImage.src = '';
      modalImage.style.display = 'none';
    }
    if (modalVideoCol) {
      modalVideoCol.style.display = 'none';
    }
    if (modalBodyGrid) {
      modalBodyGrid.classList.add('no-video');
    }
    if (modalDialog) {
      modalDialog.classList.add('no-video');
    }
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.style.display = 'none';
    }
    if (modalVideoSource) {
      modalVideoSource.src = '';
    }
    if (modalIframe) {
      modalIframe.src = '';
      modalIframe.style.display = 'none';
    }
    if (modalVideoExternalLink) {
      modalVideoExternalLink.style.display = 'none';
    }
  } else {
    if (modalImage) {
      modalImage.src = '';
      modalImage.style.display = 'none';
    }
    if (modalVideoCol) {
      modalVideoCol.style.display = '';
    }
    if (modalBodyGrid) {
      modalBodyGrid.classList.remove('no-video');
    }
    if (modalDialog) {
      modalDialog.classList.remove('no-video');
    }

    if (isEmbedUrl(rawVideoSrc)) {
      const embedUrl = getEmbedUrl(rawVideoSrc);
      if (modalVideo) {
        modalVideo.pause();
        modalVideo.style.display = 'none';
      }
      if (modalIframe) {
        modalIframe.src = embedUrl;
        modalIframe.style.display = 'block';
      }
      if (modalVideoFilename) {
        modalVideoFilename.textContent = 'Google Drive Stream';
      }
      if (modalVideoLabel) {
        modalVideoLabel.textContent = 'Cloud Preview';
      }
      if (modalVideoExternalLink) {
        const driveIdMatch = rawVideoSrc.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (driveIdMatch) {
          modalVideoExternalLink.href = `https://drive.google.com/file/d/${driveIdMatch[1]}/view?usp=sharing`;
          modalVideoExternalLink.textContent = 'Open in Drive ↗';
          modalVideoExternalLink.style.display = 'inline-block';
        } else {
          modalVideoExternalLink.style.display = 'none';
        }
      }
    } else {
      if (modalIframe) {
        modalIframe.src = '';
        modalIframe.style.display = 'none';
      }
      if (modalVideo && modalVideoSource) {
        modalVideo.style.display = 'block';
        modalVideoSource.src = rawVideoSrc;
        modalVideo.load();
      }
      if (modalVideoFilename) {
        const filename = rawVideoSrc.split('/').pop();
        modalVideoFilename.textContent = filename;
      }
      if (modalVideoLabel) {
        modalVideoLabel.textContent = 'Preview Video';
      }
      if (modalVideoExternalLink) {
        modalVideoExternalLink.style.display = 'none';
      }
    }
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

  // Reset modal image
  if (modalImage) {
    modalImage.src = '';
    modalImage.style.display = 'none';
  }

  // Pause HTML5 video
  if (modalVideo) {
    modalVideo.pause();
    modalVideo.currentTime = 0;
  }

  // Clear iframe src to stop stream playback and audio immediately
  if (modalIframe) {
    modalIframe.src = '';
  }

  // Restore focus
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

// Attach listeners to clickable cards
document.querySelectorAll('.project-card-clickable').forEach(card => {
  const projectId = card.dataset.projectId;
  if (!projectId) return;

  card.addEventListener('click', (e) => {
    // If user clicked directly on an external link inside card, don't trigger modal
    if (e.target.closest('a')) return;
    openProjectModal(projectId, card);
  });

  card.addEventListener('keydown', (e) => {
    if (e.target.closest('a')) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProjectModal(projectId, card);
    }
  });
});

// Also attach listener to featured REVV Racing card
const featuredRevv = document.getElementById('project-revv-racing');
if (featuredRevv) {
  featuredRevv.addEventListener('click', (e) => {
    if (e.target.closest('a')) return;
    openProjectModal('revv-racing', featuredRevv);
  });
  featuredRevv.addEventListener('keydown', (e) => {
    if (e.target.closest('a')) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProjectModal('revv-racing', featuredRevv);
    }
  });
}

// Close triggers
if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeProjectModal);
}
if (modalBackdrop) {
  modalBackdrop.addEventListener('click', closeProjectModal);
}
if (modalImage) {
  modalImage.addEventListener('click', () => {
    if (modalImage.src) {
      window.open(modalImage.src, '_blank');
    }
  });
}
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
    closeProjectModal();
  }
});
