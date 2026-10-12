/**
 * Verdant Poly 3D - High-Detail Low-Poly / Polygon Art Botanical Virtual Office
 * 
 * Hyper-Detailed Low-Poly Characters:
 * 1. Anatomical Hierarchy & Proportions:
 *    - Head (Faceted Icosahedron) with:
 *      - Geometric Eyes (Polygon eye sclera + expressive dark pupils)
 *      - Nose bridge & cute cheek blush facets (female) / defined jawline (male)
 *      - Hair: Multi-layered faceted clumps (fringe bangs, side locks, ponytail / layered crop)
 *      - Headwear: Detailed flower petal pins (female), sports visor / ranger brim cap (male)
 * 2. Torso & Costume Details:
 *    - Female:
 *      - Tailored vest / corset with belt buckle
 *      - Pleated polygonal skirt with hem border
 *      - Shoulder puff pads / sleeves
 *      - Floating holographic data tablet / flower pot accessory
 *    - Male:
 *      - Layered utility jacket with collar lapels & button studs
 *      - Belt with polygon pouch / tool holster
 *      - Rolled-up sleeve cuffs & wrist device (smart smartwatch)
 * 3. Articulated Limbs with Knees & Elbows:
 *    - Thigh (upper leg) -> Knee joint -> Calf (lower leg) -> Ankle -> Faceted boots/shoes
 *    - Upper arm -> Elbow joint -> Forearm -> Low-poly hands with mitten/finger blocks
 *    - Real-time inverse-kinematics feel: Knee bending during walk cycle!
 * 4. Gender Differentiation & Animation:
 *    - Female: Graceful stride with hips sway and bent knee walk
 *    - Male: Broad-shouldered confident stride with heavy boot stomping
 */

// --- Global State & Data ---
const state = {
  selectedAgent: null,
  soundEnabled: false,
  soundVolume: 0.4,
  masterGainNode: null,
  audioCtx: null,
  timeMode: 'day',
  activeTab: 'agents',
  graphicsQuality: 'high'
};

// Subtle Web Audio UI Click Feedback
function playUiClickSound(freq = 600, dur = 0.03) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!state.audioCtx && !state.soundEnabled) {
      state.audioCtx = new AudioCtx();
    }
    if (!state.audioCtx) return;
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
    const osc = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();
    const now = state.audioCtx.currentTime;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + dur);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain);
    gain.connect(state.audioCtx.destination);
    osc.start(now);
    osc.stop(now + dur);
  } catch (e) {}
}

const ZONES = [
  {
    id: 'greenhouse',
    name: '💎 Poly Glasshouse',
    sub: 'Deep Research & Document Synthesis',
    desc: 'Rumah kaca faceted kristal poligonal dengan pencahayaan prismatik untuk AI Agent menganalisis dataset riset.',
    x: -30,
    z: -30,
    w: 30,
    d: 26,
    icon: '🏛️'
  },
  {
    id: 'orchard',
    name: '🍎 Poly Coding Orchard',
    sub: 'Sprint Development & Microservices',
    desc: 'Kebun apel dan sakura poligonal dengan workbench kayu faceted tempat engineer agen mengompilasi kode.',
    x: 30,
    z: -30,
    w: 32,
    d: 26,
    icon: '🏡'
  },
  {
    id: 'pond',
    name: '🪷 Poly Lotus Pond',
    sub: 'Creative Architecture & UX Design',
    desc: 'Kolam air faceted heksagonal jernih dengan daun teratai poligonal dan dermaga kayu angular untuk relaksasi komputasi.',
    x: -30,
    z: 30,
    w: 30,
    d: 26,
    icon: '🏞️'
  },
  {
    id: 'gazebo',
    name: '🛖 Poly Council Gazebo',
    sub: 'Multi-Agent Standup & Sync',
    desc: 'Pendopo kayu piramidal heksagonal dengan meja batu bundar faceted di mana semua agen berkumpul untuk sinkronisasi rapat.',
    x: 30,
    z: 30,
    w: 32,
    d: 26,
    icon: '🛖'
  },
  {
    id: 'flower_garden',
    name: '🌷 Meadow Flower Garden',
    sub: 'Creativity, Respite & Pollination',
    desc: 'Hamparan taman bunga berundak aneka warna (lavender, mawar tanah liat, marigold, dan aster putih) dengan jalan setapak batu, semak berputar, dan kupu-kupu poligonal yang beterbangan.',
    x: 0,
    z: -42,
    w: 34,
    d: 24,
    icon: '🌸'
  }
];

let agents = [
  {
    id: 'agent-1',
    name: 'Flora',
    gender: 'female',
    role: 'Botani Researcher (Data & Riset)',
    zone: 'greenhouse',
    color: 0x5a755e, // Nordic Muted Olive
    secondaryColor: 0x3d5040,
    hairColor: 0xc4bcab, // Light Linen Oat
    x: -28,
    z: -26,
    targetX: -28,
    targetZ: -26,
    speed: 0.12,
    status: 'working',
    statusText: 'Menganalisis dataset biologi molekuler...',
    avatar: '👩‍🌾',
    speechBubble: 'Synthesizing knowledge...',
    bubbleTimer: 180,
    tasks: ['Dokumentasi API', 'Benchmarking Model'],
    mesh: null,
    auraMesh: null,
    limbs: null,
    walkTime: 0
  },
  {
    id: 'agent-2',
    name: 'Bramble',
    gender: 'male',
    role: 'Root Engineer (Backend & Logic)',
    zone: 'orchard',
    color: 0x485868, // Scandinavian Slate Denim
    secondaryColor: 0x2e3843,
    hairColor: 0x3b332d, // Dark Chestnut
    x: 30,
    z: -26,
    targetX: 30,
    targetZ: -26,
    speed: 0.11,
    status: 'working',
    statusText: 'Optimasi query Postgres & Redis cache...',
    avatar: '👨‍💻',
    speechBubble: 'All test pipelines green! 🚀',
    bubbleTimer: 140,
    tasks: ['Optimasi query', 'Websocket server'],
    mesh: null,
    auraMesh: null,
    limbs: null,
    walkTime: 0
  },
  {
    id: 'agent-3',
    name: 'Lotus-7',
    gender: 'female',
    role: 'Forest Architect (Frontend / UI)',
    zone: 'pond',
    color: 0xb58369, // Muted Terracotta Clay
    secondaryColor: 0x8a5e4a,
    hairColor: 0xdfd3c3, // Sand Oat
    x: -28,
    z: 32,
    targetX: -28,
    targetZ: 32,
    speed: 0.13,
    status: 'resting',
    statusText: 'Menikmati riak air & visual balance...',
    avatar: '🧚',
    speechBubble: 'Harmonisasi palet hijau ✨',
    bubbleTimer: 210,
    tasks: ['Micro-interactions', 'Visual balance'],
    mesh: null,
    auraMesh: null,
    limbs: null,
    walkTime: 0
  },
  {
    id: 'agent-4',
    name: 'Cedar',
    gender: 'male',
    role: 'Garden Warden (Security & QA)',
    zone: 'gazebo',
    color: 0x6e6378, // Muted Heather Gray-Plum
    secondaryColor: 0x4d4454,
    hairColor: 0x8c827a, // Ash Gray
    x: 32,
    z: 32,
    targetX: 32,
    targetZ: 32,
    speed: 0.09,
    status: 'meeting',
    statusText: 'Evaluasi guardrails & safety audit...',
    avatar: '🧙‍♂️',
    speechBubble: 'Firewall ekosistem 100% aman 🔒',
    bubbleTimer: 160,
    tasks: ['Penetration testing', 'Log monitoring'],
    mesh: null,
    auraMesh: null,
    limbs: null,
    walkTime: 0
  },
  {
    id: 'agent-5',
    name: 'Sprout',
    gender: 'male',
    role: 'Bloom Copywriter (Content & Docs)',
    zone: 'greenhouse',
    color: 0xa88d67, // Warm Raw Ochre
    secondaryColor: 0x7a6344,
    hairColor: 0xd9cebe, // Warm Sand
    x: -20,
    z: -22,
    targetX: -20,
    targetZ: -22,
    speed: 0.12,
    status: 'working',
    statusText: 'Merangkai release notes ramah pengguna...',
    avatar: '🦊',
    speechBubble: 'Docs v2.0 siap dirilis!',
    bubbleTimer: 100,
    tasks: ['Changelog', 'Newsletter mingguan'],
    mesh: null,
    auraMesh: null,
    limbs: null,
    walkTime: 0
  }
];

let tasks = [
  { id: 1, title: 'Analisis Spektrum Cahaya Fotosintesis', agent: 'Flora', progress: 80, status: 'In Progress' },
  { id: 2, title: 'Auto-scaling Server Cluster Kebun Poly', agent: 'Bramble', progress: 94, status: 'Testing' },
  { id: 3, title: 'Desain Komponen Low-Poly Leaf Style', agent: 'Lotus-7', progress: 70, status: 'Designing' },
  { id: 4, title: 'Audit Keamanan Virtual Fence Poly', agent: 'Cedar', progress: 100, status: 'Completed' },
  { id: 5, title: 'Penyusunan Pedoman Agen Baru', agent: 'Sprout', progress: 50, status: 'Drafting' }
];

const chatHistories = {
  'agent-1': [{ sender: 'agent', text: 'Halo! Saya Flora di Crystal Glasshouse Low-Poly. Data apa yang ingin kita teliti?' }],
  'agent-2': [{ sender: 'agent', text: 'Yo! Bramble di sini. Arsitektur backend kebun poly berjalan prima. Mau deploy modul baru?' }],
  'agent-3': [{ sender: 'agent', text: 'Salam damai dari tepi kolam teratai. UI/UX low-poly siap saya poles!' }],
  'agent-4': [{ sender: 'agent', text: 'Cedar siap siaga di Gazebo Poly. Semua protokol keamanan terenkripsi kuat.' }],
  'agent-5': [{ sender: 'agent', text: 'Hai! Sprout siap menyusun narasi dan dokumentasi kebun yang segar.' }]
};

// --- Three.js Scene Variables ---
let scene, camera, renderer, controls;
let raycaster, mouse;
let waterMesh;
let firefliesGroup;
let butterfliesGroup; // Low-poly fluttering garden butterflies
let nightLightsGroup; // Group containing all nocturnal polygon lanterns and spotlights
let dirLight, hemiLight, ambientLight;
let groundPlane;
let interactiveObjects = [];

// DOM References
const container = document.getElementById('three-container');
const quickTooltip = document.getElementById('quick-tooltip');
const agentsListEl = document.getElementById('agents-list');
const zonesListEl = document.getElementById('zones-list');
const tasksFeedEl = document.getElementById('tasks-feed');
const chatTrayEl = document.getElementById('agent-chat-tray');
const chatAgentAvatar = document.getElementById('chat-agent-avatar');
const chatAgentName = document.getElementById('chat-agent-name');
const chatAgentRole = document.getElementById('chat-agent-role');
const chatMessagesEl = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const clockEl = document.getElementById('garden-clock');

// --- Initialization ---
function init() {
  initThree();
  buildLowPolyWorld();
  buildDetailedLowPolyAgents();
  setupCameraPresets();
  setupRaycaster();
  setupSidebarTabs();
  setupControls();
  setupModal();
  renderSidebar();

  selectAgent(agents[0]);

  window.addEventListener('resize', onWindowResize);
  setInterval(updateClock, 1000);

  animate();
}

function initThree() {
  scene = new THREE.Scene();
  // Atmospheric soft sky background and smooth horizon fog
  scene.background = new THREE.Color(0x28363a);
  scene.fog = new THREE.FogExp2(0x28363a, 0.0035);

  const aspect = container.clientWidth / container.clientHeight;
  // Natural narrower FOV (38) and closer default camera distance to eliminate wide-angle distortion
  camera = new THREE.PerspectiveCamera(38, aspect, 1, 1500);
  camera.position.set(0, 52, 68);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2.15;
  controls.minDistance = 15;
  controls.maxDistance = 120;
  controls.target.set(0, 1.5, 0);

  // Soft Natural Daylight with rich warm bounce (sesuai status Daylight)
  ambientLight = new THREE.AmbientLight(0xfff5ea, 0.62);
  scene.add(ambientLight);

  hemiLight = new THREE.HemisphereLight(0xe8f2f7, 0x36483c, 0.55);
  hemiLight.position.set(0, 80, 0);
  scene.add(hemiLight);

  // Warm Directional Sunlight with high-res soft shadow map
  dirLight = new THREE.DirectionalLight(0xffecd2, 1.55);
  dirLight.position.set(45, 80, 35);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 4096;
  dirLight.shadow.mapSize.height = 4096;
  dirLight.shadow.camera.near = 10;
  dirLight.shadow.camera.far = 220;
  dirLight.shadow.camera.left = -65;
  dirLight.shadow.camera.right = 65;
  dirLight.shadow.camera.top = 65;
  dirLight.shadow.camera.bottom = -65;
  dirLight.shadow.radius = 2.4;
  dirLight.shadow.bias = -0.0004;
  scene.add(dirLight);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function updateClock() {
  const d = new Date();
  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (clockEl) clockEl.textContent = timeStr;
}

// Global references for animated ocean & sky
let animatedOceanMesh = null;
let skyDomeMesh = null;

// --- Low-Poly 3D World Construction ---
function buildLowPolyWorld() {
  // 1. Celestial Sky Dome (Keeps beautiful soft horizon gradations day & night, eliminating black void)
  const skyGeo = new THREE.SphereGeometry(600, 24, 16);
  const skyMat = new THREE.MeshBasicMaterial({
    color: 0x243236,
    side: THREE.BackSide
  });
  skyDomeMesh = new THREE.Mesh(skyGeo, skyMat);
  scene.add(skyDomeMesh);

  // 2. Infinite Low-Poly Ocean (Waves undulate in animate())
  const oceanGeo = new THREE.PlaneGeometry(1200, 1200, 48, 48);
  const oceanPos = oceanGeo.attributes.position;
  oceanGeo.userData = { initialZ: new Float32Array(oceanPos.count) };
  for (let i = 0; i < oceanPos.count; i++) {
    const origZ = Math.sin(oceanPos.getX(i) * 0.05) * 0.6 + Math.cos(oceanPos.getY(i) * 0.05) * 0.6;
    oceanGeo.userData.initialZ[i] = origZ;
    oceanPos.setZ(i, origZ);
  }
  oceanGeo.computeVertexNormals();

  const oceanMat = new THREE.MeshStandardMaterial({
    color: 0x1a464c,
    roughness: 0.22,
    metalness: 0.35,
    transparent: true,
    opacity: 0.94,
    flatShading: true
  });
  animatedOceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
  animatedOceanMesh.rotation.x = -Math.PI / 2;
  animatedOceanMesh.position.y = -3.8;
  animatedOceanMesh.receiveShadow = true;
  scene.add(animatedOceanMesh);

  // 3. Main Low-Poly Terraced Island (Rich organic contour variations & coastline cliffs)
  const groundGeo = new THREE.CylinderGeometry(64, 76, 5.5, 24, 4);
  const pos = groundGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const px = pos.getX(i);
    const pz = pos.getZ(i);
    if (y > 0) {
      // Natural rolling hills and sculpted garden elevations
      const hill = Math.sin(px * 0.12) * Math.cos(pz * 0.12) * 1.3
                 + Math.sin(Math.hypot(px, pz) * 0.15) * 0.8;
      pos.setY(i, y + hill);
    }
  }
  groundGeo.computeVertexNormals();

  // Low-poly fertile meadow soil and mossy sage turf
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x41684c,
    roughness: 0.92,
    metalness: 0.02,
    flatShading: true
  });
  groundPlane = new THREE.Mesh(groundGeo, groundMat);
  groundPlane.position.y = -1.8;
  groundPlane.receiveShadow = true;
  scene.add(groundPlane);

  // Sandy Coastline Fringe Bed
  const shoreGeo = new THREE.CylinderGeometry(68, 79, 1.2, 24);
  const shoreMat = new THREE.MeshStandardMaterial({
    color: 0x4f5d52,
    roughness: 0.95,
    flatShading: true
  });
  const shore = new THREE.Mesh(shoreGeo, shoreMat);
  shore.position.y = -3.2;
  shore.receiveShadow = true;
  scene.add(shore);

  // 4. Pathways & Garden Arteries
  createLowPolyPath(0, 0, -30, -30);
  createLowPolyPath(0, 0, 30, -30);
  createLowPolyPath(0, 0, -30, 30);
  createLowPolyPath(0, 0, 30, 30);
  createLowPolyPath(0, 0, 0, -38); // Pathway to north Flower Garden
  createLowPolyRingPath(0, 0, 42);

  // 5. Environment Detail Elements: Low-Poly Rocks, Pebbles, and Tufts of Grass
  createEnvironmentDetails();

  createLowPolyFountain(0, 0);
  createLowPolyGreenhouse(-30, -30);
  createLowPolyOrchard(30, -30);
  createLowPolyPond(-30, 30);
  createLowPolyGazebo(30, 30);
  createLowPolyFlowerGarden(0, -42); // 5th Zone: Botanical Flower Garden
  createSurroundingLowPolyForest();
  createLowPolyFireflies();
  createLowPolyButterflies();
  createLowPolyNightLamps();
}

// Low-Poly rocks, moss boulders, and decorative tufts to enrich open island areas
function createEnvironmentDetails() {
  const rockGroup = new THREE.Group();

  const rockGeo1 = new THREE.DodecahedronGeometry(1.4, 0);
  const rockGeo2 = new THREE.IcosahedronGeometry(0.9, 0);
  const rockMat1 = new THREE.MeshStandardMaterial({ color: 0x616a64, roughness: 0.9, flatShading: true });
  const rockMat2 = new THREE.MeshStandardMaterial({ color: 0x4f5853, roughness: 0.9, flatShading: true });

  const rockCoords = [
    [-14, -8], [-12, -22], [-6, -26], [16, -18], [22, -8],
    [-20, 14], [-12, 18], [12, 14], [22, 18], [16, -38],
    [-18, -38], [8, -48], [-8, -48], [-44, -12], [44, -12],
    [-38, 18], [38, 16], [-5, 26], [6, 26], [0, 38]
  ];

  rockCoords.forEach(([rx, rz], i) => {
    const geo = (i % 2 === 0) ? rockGeo1 : rockGeo2;
    const mat = (i % 3 === 0) ? rockMat2 : rockMat1;
    const rock = new THREE.Mesh(geo, mat);
    rock.position.set(rx, 0.5, rz);
    rock.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    const s = 0.6 + Math.random() * 0.7;
    rock.scale.set(s, s * 0.7, s);
    rock.castShadow = true;
    rock.receiveShadow = true;
    rockGroup.add(rock);

    // Complementary low-poly grass tuft near rocks
    const grassGeo = new THREE.ConeGeometry(0.4, 1.2, 4);
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x5a875a, roughness: 0.85, flatShading: true });
    for (let g = 0; g < 3; g++) {
      const blade = new THREE.Mesh(grassGeo, grassMat);
      blade.position.set(rx + (Math.random() - 0.5) * 2, 0.6, rz + (Math.random() - 0.5) * 2);
      blade.rotation.x = (Math.random() - 0.5) * 0.4;
      blade.rotation.z = (Math.random() - 0.5) * 0.4;
      blade.castShadow = true;
      rockGroup.add(blade);
    }
  });

  scene.add(rockGroup);
}

function createLowPolyPath(x1, z1, x2, z2) {
  const dist = Math.hypot(x2 - x1, z2 - z1);
  const pathGeo = new THREE.BoxGeometry(4.2, 0.25, dist, 2, 1, 6);
  // Soft Sandstone / Slate Gray pathway
  const pathMat = new THREE.MeshStandardMaterial({ color: 0x525c56, roughness: 0.88, flatShading: true });
  const path = new THREE.Mesh(pathGeo, pathMat);
  path.position.set((x1 + x2) / 2, 0.1, (z1 + z2) / 2);
  path.rotation.y = Math.atan2(x2 - x1, z2 - z1);
  path.receiveShadow = true;
  scene.add(path);
}

function createLowPolyRingPath(cx, cz, radius) {
  const ringGeo = new THREE.RingGeometry(radius - 2.5, radius + 2.5, 16);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x47514b, roughness: 0.88, side: THREE.DoubleSide, flatShading: true });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(cx, 0.12, cz);
  ring.receiveShadow = true;
  scene.add(ring);
}

function createLowPolyFountain(x, z) {
  const fountainGroup = new THREE.Group();
  fountainGroup.position.set(x, 0, z);

  const outerRimGeo = new THREE.CylinderGeometry(8.5, 9.2, 1.4, 8);
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8, flatShading: true });
  const outerRim = new THREE.Mesh(outerRimGeo, stoneMat);
  outerRim.position.y = 0.7;
  outerRim.castShadow = true;
  outerRim.receiveShadow = true;
  fountainGroup.add(outerRim);

  const basinWaterGeo = new THREE.CylinderGeometry(7.8, 7.8, 0.2, 8);
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.1, metalness: 0.7, flatShading: true });
  const basinWater = new THREE.Mesh(basinWaterGeo, waterMat);
  basinWater.position.y = 1.1;
  fountainGroup.add(basinWater);

  const pillarGeo = new THREE.CylinderGeometry(1.4, 1.8, 3.8, 6);
  const pillar = new THREE.Mesh(pillarGeo, stoneMat);
  pillar.position.y = 2.2;
  pillar.castShadow = true;
  fountainGroup.add(pillar);

  const topBasinGeo = new THREE.CylinderGeometry(3.8, 2.4, 0.9, 8);
  const topBasin = new THREE.Mesh(topBasinGeo, stoneMat);
  topBasin.position.y = 3.9;
  topBasin.castShadow = true;
  fountainGroup.add(topBasin);

  const crystalGeo = new THREE.OctahedronGeometry(1.2);
  const crystalMat = new THREE.MeshStandardMaterial({ color: 0xbae6fd, roughness: 0.1, metalness: 0.5, flatShading: true });
  const crystal = new THREE.Mesh(crystalGeo, crystalMat);
  crystal.position.y = 5.6;
  fountainGroup.add(crystal);

  scene.add(fountainGroup);
}

function createLowPolyGreenhouse(x, z) {
  const ghGroup = new THREE.Group();
  ghGroup.position.set(x, 0, z);

  const floorGeo = new THREE.BoxGeometry(26, 0.8, 22);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.85, flatShading: true });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = 0.4;
  floor.receiveShadow = true;
  ghGroup.add(floor);

  const pillarGeo = new THREE.CylinderGeometry(0.4, 0.4, 9, 4);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4, flatShading: true });
  [[-12, -10], [12, -10], [-12, 10], [12, 10]].forEach(([px, pz]) => {
    const p = new THREE.Mesh(pillarGeo, frameMat);
    p.position.set(px, 4.5, pz);
    p.castShadow = true;
    ghGroup.add(p);
  });

  const roofGeo = new THREE.ConeGeometry(17, 7.5, 4);
  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x6ee7b7,
    roughness: 0.2,
    metalness: 0.4,
    transparent: true,
    opacity: 0.65,
    flatShading: true
  });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = 11.5;
  roof.rotation.y = Math.PI / 4;
  roof.castShadow = true;
  ghGroup.add(roof);

  const deskGeo = new THREE.BoxGeometry(8, 2.2, 4);
  const deskMat = new THREE.MeshStandardMaterial({ color: 0x0f291e, roughness: 0.6, flatShading: true });
  const desk = new THREE.Mesh(deskGeo, deskMat);
  desk.position.set(0, 1.5, 0);
  desk.castShadow = true;
  ghGroup.add(desk);

  const holoGeo = new THREE.IcosahedronGeometry(1.4, 0);
  const holoMat = new THREE.MeshStandardMaterial({ color: 0x34d399, roughness: 0.1, flatShading: true });
  const holo = new THREE.Mesh(holoGeo, holoMat);
  holo.position.set(0, 3.2, 0);
  ghGroup.add(holo);

  createLowPolyPot(ghGroup, -8, 1.2, -6);
  createLowPolyPot(ghGroup, 8, 1.2, -6);
  createLowPolyPot(ghGroup, -8, 1.2, 6);
  createLowPolyPot(ghGroup, 8, 1.2, 6);

  ghGroup.userData = { id: 'greenhouse', name: '💎 Poly Glasshouse' };
  interactiveObjects.push(floor);
  scene.add(ghGroup);
}

function createLowPolyPot(parent, x, y, z) {
  const potGeo = new THREE.CylinderGeometry(1.6, 1.2, 1.6, 6);
  const potMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8, flatShading: true });
  const pot = new THREE.Mesh(potGeo, potMat);
  pot.position.set(x, y, z);
  pot.castShadow = true;

  const plantGeo = new THREE.DodecahedronGeometry(1.5, 0);
  const plantMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.8, flatShading: true });
  const plant = new THREE.Mesh(plantGeo, plantMat);
  plant.position.set(x, y + 1.4, z);
  plant.castShadow = true;

  parent.add(pot);
  parent.add(plant);
}

function createLowPolyOrchard(x, z) {
  const orchardGroup = new THREE.Group();
  orchardGroup.position.set(x, 0, z);

  const deckGeo = new THREE.BoxGeometry(26, 0.8, 22);
  const deckMat = new THREE.MeshStandardMaterial({ color: 0x3d2514, roughness: 0.85, flatShading: true });
  const deck = new THREE.Mesh(deckGeo, deckMat);
  deck.position.y = 0.4;
  deck.receiveShadow = true;
  orchardGroup.add(deck);

  const benchGeo = new THREE.BoxGeometry(11, 2.2, 4);
  const benchMat = new THREE.MeshStandardMaterial({ color: 0x5c3818, roughness: 0.75, flatShading: true });
  const bench = new THREE.Mesh(benchGeo, benchMat);
  bench.position.set(0, 1.5, 0);
  bench.castShadow = true;
  orchardGroup.add(bench);

  createLowPolyLaptop(orchardGroup, -3, 2.6, 0, 0x38bdf8);
  createLowPolyLaptop(orchardGroup, 3, 2.6, 0, 0xa855f7);

  createLowPolyTree(orchardGroup, -9, 0, -7, 0xf472b6, 0xdb2777);
  createLowPolyTree(orchardGroup, 9, 0, -7, 0xef4444, 0xb91c1c);
  createLowPolyTree(orchardGroup, -9, 0, 7, 0xef4444, 0xb91c1c);
  createLowPolyTree(orchardGroup, 9, 0, 7, 0xf472b6, 0xdb2777);

  orchardGroup.userData = { id: 'orchard', name: '🍎 Poly Coding Orchard' };
  interactiveObjects.push(deck);
  scene.add(orchardGroup);
}

function createLowPolyLaptop(parent, x, y, z, glowColor) {
  const baseGeo = new THREE.BoxGeometry(1.6, 0.1, 1.2);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, flatShading: true });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.set(x, y, z);

  const screenGeo = new THREE.BoxGeometry(1.6, 1.1, 0.08);
  const screenMat = new THREE.MeshStandardMaterial({ color: glowColor, roughness: 0.2, flatShading: true });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(x, y + 0.6, z - 0.55);
  screen.rotation.x = -0.25;

  parent.add(base);
  parent.add(screen);
}

function createLowPolyPond(x, z) {
  const pondGroup = new THREE.Group();
  pondGroup.position.set(x, 0, z);

  const rimGeo = new THREE.CylinderGeometry(12.5, 13.2, 1.2, 12);
  const rimMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8, flatShading: true });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.position.y = 0.6;
  rim.receiveShadow = true;
  pondGroup.add(rim);

  const waterGeo = new THREE.CylinderGeometry(11.8, 11.8, 0.4, 12);
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.6, flatShading: true });
  waterMesh = new THREE.Mesh(waterGeo, waterMat);
  waterMesh.position.y = 0.9;
  pondGroup.add(waterMesh);

  createLowPolyLilypad(pondGroup, -4, 1.05, -3);
  createLowPolyLilypad(pondGroup, 4, 1.05, 2);
  createLowPolyLilypad(pondGroup, -1, 1.05, 4);

  const pierGeo = new THREE.BoxGeometry(4, 0.45, 10);
  const pierMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85, flatShading: true });
  const pier = new THREE.Mesh(pierGeo, pierMat);
  pier.position.set(0, 1.2, -6);
  pier.castShadow = true;
  pondGroup.add(pier);

  pondGroup.userData = { id: 'pond', name: '🪷 Poly Lotus Pond' };
  interactiveObjects.push(rim);
  scene.add(pondGroup);
}

function createLowPolyLilypad(parent, x, y, z) {
  const padGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.08, 6);
  const padMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.7, flatShading: true });
  const pad = new THREE.Mesh(padGeo, padMat);
  pad.position.set(x, y, z);

  const flowerGeo = new THREE.OctahedronGeometry(0.6);
  const flowerMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.3, flatShading: true });
  const flower = new THREE.Mesh(flowerGeo, flowerMat);
  flower.position.set(x, y + 0.4, z);

  parent.add(pad);
  parent.add(flower);
}

function createLowPolyGazebo(x, z) {
  const gazeboGroup = new THREE.Group();
  gazeboGroup.position.set(x, 0, z);

  const deckGeo = new THREE.CylinderGeometry(12, 12.5, 0.8, 6);
  const deckMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.85, flatShading: true });
  const deck = new THREE.Mesh(deckGeo, deckMat);
  deck.position.y = 0.4;
  deck.receiveShadow = true;
  gazeboGroup.add(deck);

  const pillarGeo = new THREE.CylinderGeometry(0.4, 0.4, 9, 4);
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.75, flatShading: true });
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const px = Math.cos(angle) * 10;
    const pz = Math.sin(angle) * 10;
    const p = new THREE.Mesh(pillarGeo, pillarMat);
    p.position.set(px, 4.9, pz);
    p.castShadow = true;
    gazeboGroup.add(p);
  }

  const roofGeo = new THREE.ConeGeometry(13.5, 5.5, 6);
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x582a12, roughness: 0.8, flatShading: true });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = 11.6;
  roof.castShadow = true;
  gazeboGroup.add(roof);

  const tableGeo = new THREE.CylinderGeometry(4.2, 4.2, 2.2, 8);
  const tableMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.6, flatShading: true });
  const table = new THREE.Mesh(tableGeo, tableMat);
  table.position.y = 1.5;
  table.castShadow = true;
  gazeboGroup.add(table);

  const chairGeo = new THREE.CylinderGeometry(1.0, 1.0, 1.2, 6);
  const chairMat = new THREE.MeshStandardMaterial({ color: 0x52525b, roughness: 0.7, flatShading: true });
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const cx = Math.cos(angle) * 6.5;
    const cz = Math.sin(angle) * 6.5;
    const ch = new THREE.Mesh(chairGeo, chairMat);
    ch.position.set(cx, 1.0, cz);
    ch.castShadow = true;
    gazeboGroup.add(ch);
  }

  const orbGeo = new THREE.IcosahedronGeometry(0.9, 0);
  const orbMat = new THREE.MeshStandardMaterial({ color: 0xc084fc, roughness: 0.2, flatShading: true });
  const orb = new THREE.Mesh(orbGeo, orbMat);
  orb.position.set(0, 3.5, 0);
  gazeboGroup.add(orb);

  gazeboGroup.userData = { id: 'gazebo', name: '🛖 Poly Council Gazebo' };
  interactiveObjects.push(deck);
  scene.add(gazeboGroup);
}

// -------------------------------------------------------------
// ZONE 5: BOTANICAL MEADOW FLOWER GARDEN (TAMAN BUNGA POLIGONAL)
// -------------------------------------------------------------
function createLowPolyFlowerGarden(x, z) {
  const gardenGroup = new THREE.Group();
  gardenGroup.position.set(x, 0, z);

  // 1. Terraced Stone Planter Bed (Raised Garden Tier)
  const bedGeo = new THREE.CylinderGeometry(15, 16.5, 1.2, 10);
  const bedMat = new THREE.MeshStandardMaterial({ color: 0x47514b, roughness: 0.88, flatShading: true });
  const bed = new THREE.Mesh(bedGeo, bedMat);
  bed.position.y = 0.6;
  bed.receiveShadow = true;
  gardenGroup.add(bed);

  // Fertile dark humus soil bed
  const soilGeo = new THREE.CylinderGeometry(14.2, 14.2, 0.4, 10);
  const soilMat = new THREE.MeshStandardMaterial({ color: 0x27201a, roughness: 0.95, flatShading: true });
  const soil = new THREE.Mesh(soilGeo, soilMat);
  soil.position.y = 1.15;
  gardenGroup.add(soil);

  // 2. Central Stone Sun-Dial / Birdbath Pedestal
  const dialPillarGeo = new THREE.CylinderGeometry(0.7, 0.9, 2.2, 6);
  const dialPillar = new THREE.Mesh(dialPillarGeo, bedMat);
  dialPillar.position.y = 2.0;
  dialPillar.castShadow = true;
  gardenGroup.add(dialPillar);

  const dialBowlGeo = new THREE.CylinderGeometry(2.0, 1.2, 0.6, 8);
  const dialBowl = new THREE.Mesh(dialBowlGeo, bedMat);
  dialBowl.position.y = 3.2;
  dialBowl.castShadow = true;
  gardenGroup.add(dialBowl);

  const waterDiscGeo = new THREE.CylinderGeometry(1.7, 1.7, 0.1, 8);
  const waterDiscMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, flatShading: true });
  const waterDisc = new THREE.Mesh(waterDiscGeo, waterDiscMat);
  waterDisc.position.y = 3.4;
  gardenGroup.add(waterDisc);

  // 3. Flower Beds: Varieties of Low-Poly Botanical Flowers
  // Flower Types:
  // - Lavender Stems (Elongated faceted spires)
  // - Terracotta Clay Roses (Layered pentagonal petals)
  // - Marigold / Sunbursts (Golden yellow dodecahedrons)
  // - White Chamomile / Asters (Oat-white petals with yellow cone center)
  // - Blue Hydrangeas / Bluebells (Soft slate blue clusters)

  const flowerPalette = [
    { stem: 0x4d6652, petal: 0xc4a3d4, type: 'lavender' },   // Muted Lavender
    { stem: 0x4d6652, petal: 0xcc8972, type: 'rose' },       // Terracotta Rose
    { stem: 0x4d6652, petal: 0xdeb86a, type: 'marigold' },   // Warm Marigold
    { stem: 0x4d6652, petal: 0xf5f2eb, type: 'chamomile' },  // White Chamomile
    { stem: 0x4d6652, petal: 0x7fa2b8, type: 'bluebell' }    // Soft Bluebell
  ];

  // Planting rings around the garden
  const plantCount = 42;
  for (let i = 0; i < plantCount; i++) {
    const angle = (i / plantCount) * Math.PI * 2 + (Math.sin(i) * 0.2);
    const radius = 3.8 + ((i % 4) * 2.6); // Concentric scatter
    const fx = Math.cos(angle) * radius;
    const fz = Math.sin(angle) * radius;

    const flowerData = flowerPalette[i % flowerPalette.length];
    createSingleLowPolyFlower(gardenGroup, fx, 1.2, fz, flowerData);
  }

  // 4. Low-Poly Topiary Shrubs & Decorative Hedges at borders
  const topiaryAngles = [ 0.3, 1.8, 3.4, 4.9 ];
  topiaryAngles.forEach(ang => {
    const tx = Math.cos(ang) * 12.8;
    const tz = Math.sin(ang) * 12.8;

    const potGeo = new THREE.CylinderGeometry(1.2, 0.9, 1.4, 6);
    const pot = new THREE.Mesh(potGeo, bedMat);
    pot.position.set(tx, 1.5, tz);
    pot.castShadow = true;
    gardenGroup.add(pot);

    const bushGeo = new THREE.IcosahedronGeometry(1.4, 0);
    const bushMat = new THREE.MeshStandardMaterial({ color: 0x42614b, roughness: 0.85, flatShading: true });
    const bush = new THREE.Mesh(bushGeo, bushMat);
    bush.position.set(tx, 2.9, tz);
    bush.castShadow = true;
    gardenGroup.add(bush);
  });

  gardenGroup.userData = { id: 'flower_garden', name: '🌷 Meadow Flower Garden' };
  interactiveObjects.push(bed);
  scene.add(gardenGroup);
}

function createSingleLowPolyFlower(parent, x, y, z, data) {
  const flowerGroup = new THREE.Group();
  flowerGroup.position.set(x, y, z);

  // Faceted Stem
  const stemHeight = 0.8 + Math.random() * 0.6;
  const stemGeo = new THREE.CylinderGeometry(0.06, 0.08, stemHeight, 4);
  const stemMat = new THREE.MeshStandardMaterial({ color: data.stem, roughness: 0.8, flatShading: true });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.y = stemHeight / 2;
  stem.castShadow = true;
  flowerGroup.add(stem);

  // Tiny Faceted Leaf on stem
  const leafGeo = new THREE.ConeGeometry(0.14, 0.35, 3);
  const leaf = new THREE.Mesh(leafGeo, stemMat);
  leaf.position.set(0.08, stemHeight * 0.45, 0);
  leaf.rotation.z = -0.6;
  flowerGroup.add(leaf);

  // Blossom Bloom Mesh according to type
  const petalMat = new THREE.MeshStandardMaterial({ color: data.petal, roughness: 0.55, flatShading: true });

  if (data.type === 'lavender') {
    // Spires of 3 stacked octahedrons
    for (let s = 0; s < 3; s++) {
      const spGeo = new THREE.OctahedronGeometry(0.24 - s * 0.05);
      const sp = new THREE.Mesh(spGeo, petalMat);
      sp.position.y = stemHeight + s * 0.28;
      sp.castShadow = true;
      flowerGroup.add(sp);
    }
  } else if (data.type === 'rose') {
    // Layered Dodecahedron bloom
    const roseGeo = new THREE.DodecahedronGeometry(0.38, 0);
    const rose = new THREE.Mesh(roseGeo, petalMat);
    rose.position.y = stemHeight + 0.15;
    rose.castShadow = true;
    flowerGroup.add(rose);
  } else if (data.type === 'marigold') {
    // Dense Icosahedron bloom
    const marigoldGeo = new THREE.IcosahedronGeometry(0.42, 0);
    const marigold = new THREE.Mesh(marigoldGeo, petalMat);
    marigold.position.y = stemHeight + 0.16;
    marigold.castShadow = true;
    flowerGroup.add(marigold);
  } else {
    // Aster / Chamomile: Center cone with petal ring
    const centerGeo = new THREE.ConeGeometry(0.18, 0.15, 6);
    const centerMat = new THREE.MeshStandardMaterial({ color: 0xd9a74a, roughness: 0.5, flatShading: true });
    const center = new THREE.Mesh(centerGeo, centerMat);
    center.position.y = stemHeight + 0.2;
    flowerGroup.add(center);

    const petalsGeo = new THREE.CylinderGeometry(0.42, 0.38, 0.08, 7);
    const petals = new THREE.Mesh(petalsGeo, petalMat);
    petals.position.y = stemHeight + 0.12;
    petals.castShadow = true;
    flowerGroup.add(petals);
  }

  parent.add(flowerGroup);
}

// -------------------------------------------------------------
// FLUTTERING LOW-POLY BUTTERFLIES (ANIMASI KUPU-KUPU POLIGONAL)
// -------------------------------------------------------------
function createLowPolyButterflies() {
  butterfliesGroup = new THREE.Group();
  const butterflyColors = [ 0xdeb86a, 0x7fa2b8, 0xcc8972, 0xc4a3d4 ];

  for (let b = 0; b < 6; b++) {
    const bGroup = new THREE.Group();

    // Butterfly Body
    const bodyGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.5, 4);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2d2a26, roughness: 0.7, flatShading: true });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.x = Math.PI / 2;
    bGroup.add(body);

    // Left Wing (Triangular faceted wing)
    const wingGeo = new THREE.ConeGeometry(0.35, 0.6, 3);
    const wingMat = new THREE.MeshStandardMaterial({
      color: butterflyColors[b % butterflyColors.length],
      side: THREE.DoubleSide,
      roughness: 0.4,
      flatShading: true
    });

    const leftWingGroup = new THREE.Group();
    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.x = -0.3;
    leftWing.rotation.z = Math.PI / 2;
    leftWingGroup.add(leftWing);
    bGroup.add(leftWingGroup);

    // Right Wing
    const rightWingGroup = new THREE.Group();
    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.x = 0.3;
    rightWing.rotation.z = -Math.PI / 2;
    rightWingGroup.add(rightWing);
    bGroup.add(rightWingGroup);

    bGroup.userData = {
      baseAngle: (b / 6) * Math.PI * 2,
      heightOffset: 2.2 + (b * 0.4),
      leftWing: leftWingGroup,
      rightWing: rightWingGroup,
      speed: 0.015 + (b * 0.004)
    };

    butterfliesGroup.add(bGroup);
  }

  scene.add(butterfliesGroup);
}

function createLowPolyTree(parent, x, y, z, topColor, bottomColor) {
  const treeGroup = new THREE.Group();
  treeGroup.position.set(x, y, z);

  const trunkGeo = new THREE.CylinderGeometry(0.5, 0.9, 5, 5);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9, flatShading: true });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 2.5;
  trunk.castShadow = true;
  treeGroup.add(trunk);

  const f1Geo = new THREE.IcosahedronGeometry(3.6, 0);
  const f1Mat = new THREE.MeshStandardMaterial({ color: bottomColor, roughness: 0.85, flatShading: true });
  const f1 = new THREE.Mesh(f1Geo, f1Mat);
  f1.position.y = 5.2;
  f1.castShadow = true;
  treeGroup.add(f1);

  const f2Geo = new THREE.DodecahedronGeometry(2.7, 0);
  const f2Mat = new THREE.MeshStandardMaterial({ color: topColor, roughness: 0.8, flatShading: true });
  const f2 = new THREE.Mesh(f2Geo, f2Mat);
  f2.position.y = 7.2;
  f2.castShadow = true;
  treeGroup.add(f2);

  parent.add(treeGroup);
}

function createSurroundingLowPolyForest() {
  const positions = [
    [-52, -50], [-40, -55], [0, -58], [40, -55], [52, -50],
    [-58, 0], [58, 0],
    [-52, 50], [-40, 55], [0, 58], [40, 55], [52, 50]
  ];
  positions.forEach(([x, z], idx) => {
    const isSakura = idx % 3 === 0;
    createLowPolyTree(scene, x, 0, z, isSakura ? 0xf472b6 : 0x16a34a, isSakura ? 0xdb2777 : 0x14532d);
  });

  const rocks = [
    [-18, -4], [18, -6], [-15, 20], [16, 18], [0, -32], [0, 32]
  ];
  rocks.forEach(([rx, rz]) => {
    const rockGeo = new THREE.DodecahedronGeometry(1.6, 0);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9, flatShading: true });
    const rock = new THREE.Mesh(rockGeo, rockMat);
    rock.position.set(rx, 0.8, rz);
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    rock.castShadow = true;
    scene.add(rock);
  });
}

function createLowPolyFireflies() {
  firefliesGroup = new THREE.Group();
  const count = 35;

  for (let i = 0; i < count; i++) {
    const geo = new THREE.OctahedronGeometry(0.4);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.1,
      metalness: 0.8,
      flatShading: true
    });
    const ff = new THREE.Mesh(geo, mat);
    ff.position.set(
      (Math.random() - 0.5) * 110,
      1.5 + Math.random() * 10,
      (Math.random() - 0.5) * 110
    );
    firefliesGroup.add(ff);
  }
  scene.add(firefliesGroup);
}

// Low-Poly Garden Lanterns & Pathway Torches (Active during Night Mode)
function createLowPolyNightLamps() {
  nightLightsGroup = new THREE.Group();
  nightLightsGroup.visible = false; // Hidden during day, revealed during night!

  // Lamp Post Positions: along pathways, around central fountain plaza, and at each zone entrance
  const lampPositions = [
    // Central Plaza Lamps (Ring around fountain)
    [ -12, -12 ], [ 12, -12 ], [ -12, 12 ], [ 12, 12 ],
    [ -15, 0 ], [ 15, 0 ], [ 0, -15 ], [ 0, 15 ],
    // Pathway to Greenhouse
    [ -22, -18 ], [ -18, -22 ],
    // Pathway to Orchard
    [ 22, -18 ], [ 18, -22 ],
    // Pathway to Pond
    [ -22, 18 ], [ -18, 22 ],
    // Pathway to Gazebo
    [ 22, 18 ], [ 18, 22 ],
    // Zone entrances
    [ -30, -15 ], [ -15, -30 ], // Glasshouse
    [ 30, -15 ], [ 15, -30 ],   // Orchard
    [ -30, 15 ], [ -15, 30 ],   // Pond
    [ 30, 15 ], [ 15, 30 ]      // Gazebo
  ];

  lampPositions.forEach(([lx, lz], idx) => {
    const lampPost = new THREE.Group();
    lampPost.position.set(lx, 0, lz);

    // 1. Stone Octagonal Base
    const baseGeo = new THREE.CylinderGeometry(0.7, 0.9, 0.6, 6);
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8, flatShading: true });
    const baseMesh = new THREE.Mesh(baseGeo, stoneMat);
    baseMesh.position.y = 0.3;
    baseMesh.castShadow = true;
    lampPost.add(baseMesh);

    // 2. Faceted Iron Post Pole
    const postGeo = new THREE.CylinderGeometry(0.18, 0.22, 4.2, 5);
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.6, flatShading: true });
    const postMesh = new THREE.Mesh(postGeo, ironMat);
    postMesh.position.y = 2.4;
    postMesh.castShadow = true;
    lampPost.add(postMesh);

    // 3. Faceted Lantern Housing (Octahedron / Hexagonal lantern cage)
    const cageGeo = new THREE.CylinderGeometry(0.65, 0.5, 0.9, 6);
    const cageMesh = new THREE.Mesh(cageGeo, ironMat);
    cageMesh.position.y = 4.6;
    cageMesh.castShadow = true;
    lampPost.add(cageMesh);

    // 4. Glowing Polygonal Crystal Light Bulb (Icosahedron / Diamond)
    const bulbGeo = new THREE.IcosahedronGeometry(0.42, 0);
    const bulbColor = (idx % 4 === 0) ? 0x38bdf8 : 0xfde047; // Warm Amber with soft Cyan highlights
    const bulbMat = new THREE.MeshBasicMaterial({ color: bulbColor });
    const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
    bulbMesh.position.y = 4.6;
    lampPost.add(bulbMesh);

    // 5. Dynamic Three.js PointLight attached to every lamp
    const light = new THREE.PointLight(bulbColor, 1.8, 22, 1.8);
    light.position.y = 4.7;
    lampPost.add(light);

    nightLightsGroup.add(lampPost);
  });

  // Additional Accent Spotlights on each zone centerpiece
  // Glasshouse Center Spotlight
  const ghSpot = new THREE.PointLight(0x34d399, 2.5, 30, 1.5);
  ghSpot.position.set(-30, 8, -30);
  nightLightsGroup.add(ghSpot);

  // Orchard Center Spotlight (Warm Firelight)
  const orchardSpot = new THREE.PointLight(0xf59e0b, 2.5, 30, 1.5);
  orchardSpot.position.set(30, 8, -30);
  nightLightsGroup.add(orchardSpot);

  // Pond Water Glowing Under-light (Turquoise bioluminescence)
  const pondSpot = new THREE.PointLight(0x06b6d4, 3.0, 28, 1.4);
  pondSpot.position.set(-30, 2, 30);
  nightLightsGroup.add(pondSpot);

  // Gazebo Center Chandelier Light (Purple/Violet mystical glow)
  const gazeboSpot = new THREE.PointLight(0xa855f7, 2.8, 30, 1.5);
  gazeboSpot.position.set(30, 7, 30);
  nightLightsGroup.add(gazeboSpot);

  scene.add(nightLightsGroup);
}

// =========================================================================
// HYPER-DETAILED LOW-POLY CHARACTERS (ANATOMY, COSTUMES & ARTICULATION)
// =========================================================================

function buildDetailedLowPolyAgents() {
  agents.forEach(agent => {
    const charRoot = new THREE.Group();
    charRoot.position.set(agent.x, 0, agent.z);

    const isFemale = (agent.gender === 'female');
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.7, flatShading: true });
    const primaryMat = new THREE.MeshStandardMaterial({ color: agent.color, roughness: 0.55, flatShading: true });
    const secMat = new THREE.MeshStandardMaterial({ color: agent.secondaryColor || 0x1f2937, roughness: 0.6, flatShading: true });
    const hairMat = new THREE.MeshStandardMaterial({ color: agent.hairColor, roughness: 0.45, flatShading: true });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5, flatShading: true });
    const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, flatShading: true });

    // -------------------------------------------------------------
    // 1. HEAD & HIGH-DETAIL FACIAL FEATURES
    // -------------------------------------------------------------
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 3.45, 0);

    // Head base (Faceted Icosahedron - 20 facets)
    const headGeo = new THREE.IcosahedronGeometry(0.85, 0);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Faceted Nose Bridge with Chiseled Tip
    const noseGeo = new THREE.TetrahedronGeometry(0.18);
    const nose = new THREE.Mesh(noseGeo, skinMat);
    nose.position.set(0, -0.04, 0.88);
    nose.rotation.x = 0.25;
    headGroup.add(nose);

    // Low-poly Mouth / Smile (Soft rose-terracotta line)
    const mouthGeo = new THREE.BoxGeometry(0.24, 0.05, 0.06);
    const mouthMat = new THREE.MeshStandardMaterial({
      color: isFemale ? 0xc47b74 : 0xaa7268,
      roughness: 0.6,
      flatShading: true
    });
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, -0.28, 0.82);
    mouth.rotation.x = -0.15;
    headGroup.add(mouth);

    // Faceted Low-poly Ears (left & right)
    [ -0.84, 0.84 ].forEach(earX => {
      const earGeo = new THREE.TetrahedronGeometry(0.2);
      const ear = new THREE.Mesh(earGeo, skinMat);
      ear.position.set(earX, -0.05, 0.05);
      ear.rotation.y = earX > 0 ? 0.3 : -0.3;
      ear.scale.set(0.6, 1.2, 0.9);
      headGroup.add(ear);

      // Cute ear stud earring for female
      if (isFemale) {
        const earringGeo = new THREE.OctahedronGeometry(0.08);
        const earringMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.2, flatShading: true });
        const earring = new THREE.Mesh(earringGeo, earringMat);
        earring.position.set(earX * 1.05, -0.22, 0.05);
        headGroup.add(earring);
      }
    });

    // High-Detail Geometric Eyes (Sclera, Iris, Pupil, Catchlight, and Eyelids/Eyebrows)
    [ -0.28, 0.28 ].forEach(eyeX => {
      // White sclera
      const eyeGeo = new THREE.BoxGeometry(0.2, 0.16, 0.08);
      const eyeWhite = new THREE.Mesh(eyeGeo, eyeWhiteMat);
      eyeWhite.position.set(eyeX, 0.08, 0.82);
      eyeWhite.rotation.y = eyeX > 0 ? -0.14 : 0.14;
      headGroup.add(eyeWhite);

      // Colored Iris (Warm hazel/teal/amber according to agent theme)
      const irisGeo = new THREE.BoxGeometry(0.12, 0.14, 0.05);
      const irisMat = new THREE.MeshStandardMaterial({
        color: isFemale ? 0x2e6550 : 0x3b5368,
        roughness: 0.4,
        flatShading: true
      });
      const iris = new THREE.Mesh(irisGeo, irisMat);
      iris.position.set(eyeX, 0.08, 0.85);
      iris.rotation.y = eyeX > 0 ? -0.14 : 0.14;
      headGroup.add(iris);

      // Deep dark pupil
      const pupilGeo = new THREE.BoxGeometry(0.06, 0.08, 0.04);
      const pupil = new THREE.Mesh(pupilGeo, darkMat);
      pupil.position.set(eyeX, 0.08, 0.87);
      pupil.rotation.y = eyeX > 0 ? -0.14 : 0.14;
      headGroup.add(pupil);

      // Eye catchlight spark (white specular facet)
      const sparkGeo = new THREE.BoxGeometry(0.035, 0.035, 0.03);
      const spark = new THREE.Mesh(sparkGeo, eyeWhiteMat);
      spark.position.set(eyeX + (eyeX > 0 ? -0.025 : 0.025), 0.11, 0.89);
      headGroup.add(spark);

      // Upper Eyelash / Brow ridge frame
      const lashGeo = new THREE.BoxGeometry(0.24, 0.05, 0.08);
      const lash = new THREE.Mesh(lashGeo, darkMat);
      lash.position.set(eyeX, 0.18, 0.84);
      lash.rotation.y = eyeX > 0 ? -0.14 : 0.14;
      lash.rotation.z = eyeX > 0 ? -0.06 : 0.06;
      headGroup.add(lash);

      // Faceted Eyebrows
      const browGeo = new THREE.BoxGeometry(0.24, 0.06, 0.06);
      const brow = new THREE.Mesh(browGeo, hairMat);
      brow.position.set(eyeX, 0.28, 0.84);
      brow.rotation.y = eyeX > 0 ? -0.14 : 0.14;
      brow.rotation.z = eyeX > 0 ? 0.1 : -0.1;
      headGroup.add(brow);
    });

    if (isFemale) {
      // Soft Rosy Cheek Blush Facets
      [ -0.42, 0.42 ].forEach(blushX => {
        const blushGeo = new THREE.BoxGeometry(0.18, 0.09, 0.05);
        const blushMat = new THREE.MeshStandardMaterial({ color: 0xd98c8c, roughness: 0.6, flatShading: true });
        const blush = new THREE.Mesh(blushGeo, blushMat);
        blush.position.set(blushX, -0.12, 0.74);
        blush.rotation.y = blushX > 0 ? -0.3 : 0.3;
        headGroup.add(blush);
      });
    }

    // -------------------------------------------------------------
    // 2. HYPER-DETAILED VOLUMETRIC LOW-POLY HAIR
    // -------------------------------------------------------------
    const hairGroup = new THREE.Group();

    if (isFemale) {
      // Female: Volumetric Bob with layered bangs, swept locks & braided ponytail
      // Crown base
      const hairCrownGeo = new THREE.DodecahedronGeometry(0.92, 0);
      const hairCrown = new THREE.Mesh(hairCrownGeo, hairMat);
      hairCrown.position.set(0, 0.24, -0.12);
      hairCrown.scale.set(1.06, 1.12, 1.18);
      hairCrown.castShadow = true;
      hairGroup.add(hairCrown);

      // Layered Front Bangs / Fringe (3 faceted geometric wedges)
      [ -0.35, 0, 0.35 ].forEach((fx, idx) => {
        const fringeGeo = new THREE.TetrahedronGeometry(0.32);
        const fringe = new THREE.Mesh(fringeGeo, hairMat);
        fringe.position.set(fx, 0.46 - (Math.abs(fx) * 0.1), 0.76);
        fringe.rotation.set(0.35, (idx - 1) * 0.2, 0.1 * (idx - 1));
        hairGroup.add(fringe);
      });

      // Side swept tendrils / framing locks (left & right)
      [ -0.65, 0.65 ].forEach(sideX => {
        // Upper lock
        const lock1Geo = new THREE.ConeGeometry(0.24, 0.85, 4);
        const lock1 = new THREE.Mesh(lock1Geo, hairMat);
        lock1.position.set(sideX, -0.18, 0.36);
        lock1.rotation.set(0.15, sideX > 0 ? 0.3 : -0.3, sideX > 0 ? 0.25 : -0.25);
        hairGroup.add(lock1);

        // Lower curled tip
        const lock2Geo = new THREE.TetrahedronGeometry(0.22);
        const lock2 = new THREE.Mesh(lock2Geo, hairMat);
        lock2.position.set(sideX * 1.05, -0.65, 0.32);
        lock2.rotation.z = sideX > 0 ? 0.4 : -0.4;
        hairGroup.add(lock2);
      });

      // Back ponytail braid (3 linked faceted segments)
      for (let p = 0; p < 3; p++) {
        const braidGeo = new THREE.DodecahedronGeometry(0.35 - p * 0.06, 0);
        const braid = new THREE.Mesh(braidGeo, hairMat);
        braid.position.set(0, 0.1 - p * 0.42, -0.9 - p * 0.22);
        braid.rotation.x = -0.3;
        braid.castShadow = true;
        hairGroup.add(braid);
      }

      // Hair ribbon tie (Octahedron crystal tie)
      const tieGeo = new THREE.OctahedronGeometry(0.24);
      const tieMat = new THREE.MeshStandardMaterial({ color: 0xcc8972, roughness: 0.4, flatShading: true });
      const tie = new THREE.Mesh(tieGeo, tieMat);
      tie.position.set(0, 0.25, -0.85);
      hairGroup.add(tie);

      // Floral hairpin ornament (Nordic petal cluster)
      const flowerCluster = new THREE.Group();
      flowerCluster.position.set(0.72, 0.38, 0.32);
      for (let f = 0; f < 3; f++) {
        const petalGeo = new THREE.TetrahedronGeometry(0.16);
        const petalMat = new THREE.MeshStandardMaterial({ color: 0xdeb86a, roughness: 0.4, flatShading: true });
        const petal = new THREE.Mesh(petalGeo, petalMat);
        const ang = (f / 3) * Math.PI * 2;
        petal.position.set(Math.cos(ang) * 0.12, Math.sin(ang) * 0.12, 0);
        flowerCluster.add(petal);
      }
      hairGroup.add(flowerCluster);
    } else {
      // Male: Textured layered crop with layered quiff, sideburns & architectural visor
      // Main crown
      const hairCrownGeo = new THREE.DodecahedronGeometry(0.9, 0);
      const hairCrown = new THREE.Mesh(hairCrownGeo, hairMat);
      hairCrown.position.set(0, 0.26, 0.02);
      hairCrown.scale.set(1.05, 0.8, 1.08);
      hairCrown.castShadow = true;
      hairGroup.add(hairCrown);

      // Layered Front Textured Quiff (3 dynamic geometric tufts)
      const quiffOffsets = [
        { x: -0.22, y: 0.52, z: 0.72, rot: 0.35 },
        { x: 0,     y: 0.60, z: 0.75, rot: 0.45 },
        { x: 0.22,  y: 0.52, z: 0.72, rot: 0.35 }
      ];
      quiffOffsets.forEach(q => {
        const quiffGeo = new THREE.TetrahedronGeometry(0.34);
        const quiff = new THREE.Mesh(quiffGeo, hairMat);
        quiff.position.set(q.x, q.y, q.z);
        quiff.rotation.set(q.rot, 0, (q.x > 0 ? 0.2 : -0.2));
        hairGroup.add(quiff);
      });

      // Defined Low-poly Sideburns (left & right)
      [ -0.72, 0.72 ].forEach(sbX => {
        const sbGeo = new THREE.BoxGeometry(0.18, 0.42, 0.32);
        const sb = new THREE.Mesh(sbGeo, hairMat);
        sb.position.set(sbX, 0.05, 0.4);
        sb.rotation.y = sbX > 0 ? 0.2 : -0.2;
        hairGroup.add(sb);
      });

      // Tapered Neckline hair at back
      const neckHairGeo = new THREE.BoxGeometry(0.72, 0.35, 0.28);
      const neckHair = new THREE.Mesh(neckHairGeo, hairMat);
      neckHair.position.set(0, -0.2, -0.72);
      hairGroup.add(neckHair);

      // Male Headwear: Architectural Ranger Brim Visor / Sport Cap
      const capBrimGeo = new THREE.BoxGeometry(0.92, 0.08, 0.58);
      const capBrim = new THREE.Mesh(capBrimGeo, darkMat);
      capBrim.position.set(0, 0.46, 0.82);
      capBrim.rotation.x = -0.12;
      hairGroup.add(capBrim);

      // Visor crown band
      const capBandGeo = new THREE.CylinderGeometry(0.88, 0.9, 0.18, 8);
      const capBand = new THREE.Mesh(capBandGeo, darkMat);
      capBand.position.set(0, 0.44, 0.05);
      hairGroup.add(capBand);
    }

    headGroup.add(hairGroup);
    charRoot.add(headGroup);

    // -------------------------------------------------------------
    // 3. DETAILED TORSO, JACKETS & COSTUMES
    // -------------------------------------------------------------
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 2.1, 0);

    let mainTorso;
    if (isFemale) {
      // Female: Fitted Vest / Corset + Pleated Skirt
      // Upper Vest (Tapered hexagonal prism)
      const upperGeo = new THREE.CylinderGeometry(0.65, 0.75, 1.0, 6);
      mainTorso = new THREE.Mesh(upperGeo, primaryMat);
      mainTorso.position.y = 0.5;
      mainTorso.castShadow = true;
      torsoGroup.add(mainTorso);

      // Inner blouse collar
      const blouseGeo = new THREE.CylinderGeometry(0.4, 0.6, 0.4, 6);
      const blouseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, flatShading: true });
      const blouse = new THREE.Mesh(blouseGeo, blouseMat);
      blouse.position.y = 0.95;
      torsoGroup.add(blouse);

      // Belt with gold polygon buckle
      const beltGeo = new THREE.CylinderGeometry(0.76, 0.78, 0.18, 6);
      const belt = new THREE.Mesh(beltGeo, darkMat);
      belt.position.y = 0.05;
      torsoGroup.add(belt);

      const buckleGeo = new THREE.BoxGeometry(0.24, 0.22, 0.15);
      const buckleMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.2, flatShading: true });
      const buckle = new THREE.Mesh(buckleGeo, buckleMat);
      buckle.position.set(0, 0.05, 0.76);
      torsoGroup.add(buckle);

      // Pleated Low-Poly Skirt (Flared hexagonal prism with secondary accent)
      const skirtGeo = new THREE.CylinderGeometry(0.78, 1.25, 0.9, 6);
      const skirt = new THREE.Mesh(skirtGeo, secMat);
      skirt.position.y = -0.45;
      skirt.castShadow = true;
      torsoGroup.add(skirt);

      // Skirt Hem Trim
      const trimGeo = new THREE.CylinderGeometry(1.23, 1.28, 0.12, 6);
      const trim = new THREE.Mesh(trimGeo, primaryMat);
      trim.position.y = -0.88;
      torsoGroup.add(trim);
    } else {
      // Male: Layered Utility Field Jacket with Collars & Pouches
      const coatGeo = new THREE.CylinderGeometry(0.88, 0.95, 1.4, 6);
      mainTorso = new THREE.Mesh(coatGeo, primaryMat);
      mainTorso.position.y = 0.4;
      mainTorso.castShadow = true;
      torsoGroup.add(mainTorso);

      // Jacket Collar Lapels (Triangular wedges)
      const lapelGeo = new THREE.ConeGeometry(0.4, 0.6, 4);
      const lapelMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, flatShading: true });
      
      const leftLapel = new THREE.Mesh(lapelGeo, lapelMat);
      leftLapel.position.set(-0.35, 0.95, 0.55);
      leftLapel.rotation.set(-0.3, 0, -0.4);
      torsoGroup.add(leftLapel);

      const rightLapel = new THREE.Mesh(lapelGeo, lapelMat);
      rightLapel.position.set(0.35, 0.95, 0.55);
      rightLapel.rotation.set(-0.3, 0, 0.4);
      torsoGroup.add(rightLapel);

      // Utility Leather Belt
      const beltGeo = new THREE.CylinderGeometry(0.96, 0.97, 0.22, 6);
      const belt = new THREE.Mesh(beltGeo, darkMat);
      belt.position.y = -0.25;
      torsoGroup.add(belt);

      // Utility Equipment Pouch on hip
      const pouchGeo = new THREE.BoxGeometry(0.38, 0.4, 0.32);
      const pouchMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7, flatShading: true });
      const pouch = new THREE.Mesh(pouchGeo, pouchMat);
      pouch.position.set(0.92, -0.25, 0.2);
      pouch.rotation.y = 0.3;
      torsoGroup.add(pouch);
    }

    charRoot.add(torsoGroup);

    // -------------------------------------------------------------
    // 4. ARTICULATED LEGS & FEET (THIGH, KNEE, CALF, BOOTS)
    // -------------------------------------------------------------
    const createArticulatedLeg = (isLeft) => {
      const hipGroup = new THREE.Group();
      const xOffset = isLeft ? (isFemale ? -0.38 : -0.46) : (isFemale ? 0.38 : 0.46);
      hipGroup.position.set(xOffset, 1.25, 0);

      // Upper Leg / Thigh
      const thighLength = 0.65;
      const thighGeo = new THREE.CylinderGeometry(
        isFemale ? 0.2 : 0.26,
        isFemale ? 0.16 : 0.22,
        thighLength, 5
      );
      const thighMat = isFemale
        ? new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.7, flatShading: true }) // stockings/skin
        : new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8, flatShading: true }); // pants
      
      const thigh = new THREE.Mesh(thighGeo, thighMat);
      thigh.position.y = -thighLength / 2;
      thigh.castShadow = true;
      hipGroup.add(thigh);

      // Knee Joint Group (for forward knee-bend animation)
      const kneeGroup = new THREE.Group();
      kneeGroup.position.set(0, -thighLength, 0);

      // Knee cap facet
      const kneeCapGeo = new THREE.OctahedronGeometry(0.14);
      const kneeCap = new THREE.Mesh(kneeCapGeo, isFemale ? thighMat : darkMat);
      kneeCap.position.set(0, 0, 0.15);
      kneeGroup.add(kneeCap);

      // Lower Leg / Calf
      const calfLength = 0.6;
      const calfGeo = new THREE.CylinderGeometry(
        isFemale ? 0.16 : 0.22,
        isFemale ? 0.14 : 0.20,
        calfLength, 5
      );
      const calf = new THREE.Mesh(calfGeo, thighMat);
      calf.position.y = -calfLength / 2;
      calf.castShadow = true;
      kneeGroup.add(calf);

      // Footwear / Boots
      if (isFemale) {
        // High-detail Ankle Boots
        const bootGeo = new THREE.BoxGeometry(0.32, 0.35, 0.58);
        const bootMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.4, flatShading: true });
        const boot = new THREE.Mesh(bootGeo, bootMat);
        boot.position.set(0, -calfLength - 0.15, 0.1);
        boot.castShadow = true;
        kneeGroup.add(boot);

        // Gold shoe buckle
        const shoeBuckleGeo = new THREE.BoxGeometry(0.12, 0.1, 0.08);
        const shoeBuckle = new THREE.Mesh(shoeBuckleGeo, new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, flatShading: true }));
        shoeBuckle.position.set(0, -calfLength - 0.05, 0.38);
        kneeGroup.add(shoeBuckle);
      } else {
        // Heavy Armored Field Boots
        const bootGeo = new THREE.BoxGeometry(0.44, 0.42, 0.72);
        const bootMat = new THREE.MeshStandardMaterial({ color: 0x573719, roughness: 0.8, flatShading: true });
        const boot = new THREE.Mesh(bootGeo, bootMat);
        boot.position.set(0, -calfLength - 0.18, 0.14);
        boot.castShadow = true;
        kneeGroup.add(boot);

        // Toe-cap plate
        const toePlateGeo = new THREE.BoxGeometry(0.42, 0.18, 0.28);
        const toePlate = new THREE.Mesh(toePlateGeo, darkMat);
        toePlate.position.set(0, -calfLength - 0.24, 0.44);
        kneeGroup.add(toePlate);
      }

      hipGroup.add(kneeGroup);
      charRoot.add(hipGroup);

      return { hip: hipGroup, knee: kneeGroup };
    };

    const leftLeg = createArticulatedLeg(true);
    const rightLeg = createArticulatedLeg(false);

    // -------------------------------------------------------------
    // 5. ARTICULATED ARMS, HANDS & WRIST ACCESSORIES
    // -------------------------------------------------------------
    const createArticulatedArm = (isLeft) => {
      const shoulderGroup = new THREE.Group();
      const xOffset = isLeft ? (isFemale ? -0.85 : -1.05) : (isFemale ? 0.85 : 1.05);
      shoulderGroup.position.set(xOffset, 2.8, 0);

      // Shoulder pad / epaulette
      const padGeo = new THREE.DodecahedronGeometry(0.24, 0);
      const pad = new THREE.Mesh(padGeo, secMat);
      shoulderGroup.add(pad);

      // Upper arm
      const upperLength = 0.55;
      const upperGeo = new THREE.CylinderGeometry(0.18, 0.16, upperLength, 5);
      const upperArm = new THREE.Mesh(upperGeo, primaryMat);
      upperArm.position.y = -upperLength / 2;
      upperArm.castShadow = true;
      shoulderGroup.add(upperArm);

      // Elbow joint group
      const elbowGroup = new THREE.Group();
      elbowGroup.position.set(0, -upperLength, 0);

      // Forearm
      const foreLength = 0.55;
      const foreGeo = new THREE.CylinderGeometry(0.16, 0.14, foreLength, 5);
      const forearm = new THREE.Mesh(foreGeo, isFemale ? primaryMat : skinMat);
      forearm.position.y = -foreLength / 2;
      forearm.castShadow = true;
      elbowGroup.add(forearm);

      // Hand (Low-Poly faceted palm & mitten thumb)
      const handGeo = new THREE.BoxGeometry(0.22, 0.24, 0.18);
      const hand = new THREE.Mesh(handGeo, skinMat);
      hand.position.set(0, -foreLength - 0.1, 0);
      hand.castShadow = true;
      elbowGroup.add(hand);

      if (!isFemale && isLeft) {
        // Holographic Smart Watch / Wrist device for male engineers
        const watchGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.12, 6);
        const watchMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, flatShading: true });
        const watch = new THREE.Mesh(watchGeo, watchMat);
        watch.position.y = -0.42;
        elbowGroup.add(watch);
      }

      shoulderGroup.add(elbowGroup);
      charRoot.add(shoulderGroup);

      return { shoulder: shoulderGroup, elbow: elbowGroup };
    };

    const leftArm = createArticulatedArm(true);
    const rightArm = createArticulatedArm(false);

    // -------------------------------------------------------------
    // 6. FLOATING SELECTION RING AURA (OCTAGONAL RING)
    // -------------------------------------------------------------
    const auraGeo = new THREE.RingGeometry(1.4, 1.9, 8);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });
    const aura = new THREE.Mesh(auraGeo, auraMat);
    aura.rotation.x = -Math.PI / 2;
    aura.position.y = 0.1;
    aura.visible = false;
    charRoot.add(aura);

    charRoot.userData = { isAgent: true, agentData: agent };
    agent.mesh = charRoot;
    agent.auraMesh = aura;
    agent.limbs = {
      leftLeg: leftLeg,
      rightLeg: rightLeg,
      leftArm: leftArm,
      rightArm: rightArm,
      head: headGroup,
      torso: torsoGroup
    };

    interactiveObjects.push(mainTorso);
    interactiveObjects.push(headMesh);
    scene.add(charRoot);
  });
}

// --- Camera Presets for Low-Poly Views & Minimizable Controls Dock ---
function setupCameraPresets() {
  const mapControlsEl = document.getElementById('map-controls');
  const btnToggleMap = document.getElementById('btn-toggle-map-controls');

  if (btnToggleMap && mapControlsEl) {
    btnToggleMap.addEventListener('click', (e) => {
      e.stopPropagation();
      playUiClickSound(640, 0.04);
      const isMinimized = mapControlsEl.classList.toggle('minimized');
      const icon = btnToggleMap.querySelector('.toggle-icon');
      if (icon) {
        icon.textContent = isMinimized ? '+' : '−';
      }
      btnToggleMap.title = isMinimized ? 'Buka Navigasi Kamera' : 'Minimize Navigasi Kamera';
    });
  }

  document.getElementById('btn-cam-greenhouse').addEventListener('click', () => {
    moveCameraTo(-30, 24, -10, -30, 2, -30);
  });
  document.getElementById('btn-cam-orchard').addEventListener('click', () => {
    moveCameraTo(30, 24, -10, 30, 2, -30);
  });
  document.getElementById('btn-cam-pond').addEventListener('click', () => {
    moveCameraTo(-30, 24, 50, -30, 2, 30);
  });
  document.getElementById('btn-cam-gazebo').addEventListener('click', () => {
    moveCameraTo(30, 24, 50, 30, 2, 30);
  });
  const flowerCamBtn = document.getElementById('btn-cam-flowers');
  if (flowerCamBtn) {
    flowerCamBtn.addEventListener('click', () => {
      moveCameraTo(0, 20, -22, 0, 2, -42);
    });
  }
  document.getElementById('btn-reset-view').addEventListener('click', () => {
    moveCameraTo(0, 52, 68, 0, 1.5, 0);
  });
}

// Cinematic Camera Transition with Smooth SmoothStep / Ease-In-Out
function moveCameraTo(px, py, pz, tx, ty, tz) {
  playUiClickSound(520, 0.04);
  const startPos = camera.position.clone();
  const endPos = new THREE.Vector3(px, py, pz);
  const startTarget = controls.target.clone();
  const endTarget = new THREE.Vector3(tx, ty, tz);
  let progress = 0;

  function step() {
    progress += 0.024;
    // Ease-in-out smoothstep curve for professional cinematic feel
    const t = Math.min(progress, 1);
    const ease = t * t * (3 - 2 * t);

    camera.position.lerpVectors(startPos, endPos, ease);
    controls.target.lerpVectors(startTarget, endTarget, ease);
    controls.update();

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  step();
}

// --- Raycaster Mouse Clicks & Agent Selection ---
function setupRaycaster() {
  const dom = renderer.domElement;

  dom.addEventListener('mousemove', (e) => {
    const rect = dom.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
      let hit = intersects[0].object;
      while (hit.parent && !hit.userData.isAgent && !hit.userData.id) {
        hit = hit.parent;
      }

      if (hit.userData.isAgent) {
        const ag = hit.userData.agentData;
        const genderText = ag.gender === 'female' ? 'Wanita 👩‍🌾' : 'Pria 👨‍💻';
        quickTooltip.classList.remove('hidden');
        quickTooltip.style.left = `${e.clientX}px`;
        quickTooltip.style.top = `${e.clientY}px`;
        quickTooltip.innerHTML = `<strong>${ag.name}</strong> [${genderText}] (${ag.role})<br><span style="color:#6ee7b7">Status: ${ag.statusText}</span>`;
        return;
      }
    }
    quickTooltip.classList.add('hidden');
  });

  dom.addEventListener('click', (e) => {
    const rect = dom.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    
    // Check if clicked an Agent
    const agentIntersects = raycaster.intersectObjects(interactiveObjects, true);
    for (let hit of agentIntersects) {
      let obj = hit.object;
      while (obj.parent && !obj.userData.isAgent) {
        obj = obj.parent;
      }
      if (obj.userData.isAgent) {
        const ag = obj.userData.agentData;
        selectAgent(ag);
        openAgentDetailModal(ag);
        return;
      }
    }

    // Check if clicked the ground plane -> Move current selected agent there!
    const groundIntersects = raycaster.intersectObject(groundPlane);
    if (groundIntersects.length > 0 && state.selectedAgent) {
      const pt = groundIntersects[0].point;
      state.selectedAgent.targetX = pt.x;
      state.selectedAgent.targetZ = pt.z;
      state.selectedAgent.speechBubble = 'Melangkah di tanah poly... 🚶';
      state.selectedAgent.bubbleTimer = 160;
      renderSidebar();
    }
  });
}

function selectAgent(agent) {
  state.selectedAgent = agent;
  
  agents.forEach(a => {
    if (a.auraMesh) a.auraMesh.visible = (a.id === agent.id);
  });

  chatTrayEl.style.display = 'flex';
  chatAgentAvatar.textContent = agent.avatar;
  chatAgentName.textContent = agent.name;
  chatAgentRole.textContent = `${agent.gender === 'female' ? '♀️ Wanita' : '♂️ Pria'} • ${agent.role}`;

  renderChatMessages(agent.id);
  renderSidebar();
}

// --- Animation & Render Loop with Detailed Knee & Arm Kinematics ---
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  // Subtle pond water rotation
  if (waterMesh) {
    waterMesh.rotation.y += 0.002;
  }

  // Infinite Ocean Low-Poly Wave Undulation
  if (animatedOceanMesh && animatedOceanMesh.geometry) {
    const time = Date.now() * 0.0015;
    const pos = animatedOceanMesh.geometry.attributes.position;
    const initZ = animatedOceanMesh.geometry.userData.initialZ;
    if (initZ) {
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const wave = Math.sin(x * 0.04 + time) * 0.6 + Math.cos(y * 0.04 + time * 1.2) * 0.5;
        pos.setZ(i, initZ[i] + wave);
      }
      pos.needsUpdate = true;
    }
  }

  if (firefliesGroup) {
    firefliesGroup.rotation.y += 0.001;
    firefliesGroup.children.forEach((ff, idx) => {
      ff.position.y += Math.sin(Date.now() / 600 + idx) * 0.01;
    });
  }

  // -------------------------------------------------------------
  // ANIMATED FLUTTERING BUTTERFLIES IN FLOWER GARDEN
  // -------------------------------------------------------------
  if (butterfliesGroup) {
    const time = Date.now() * 0.002;
    butterfliesGroup.children.forEach(b => {
      const u = b.userData;
      u.baseAngle += u.speed;

      // Flight circle over flower garden (centered around x: 0, z: -42)
      const flyRadius = 4.5 + Math.sin(time + u.heightOffset) * 2.2;
      b.position.x = Math.cos(u.baseAngle) * flyRadius;
      b.position.z = -42 + Math.sin(u.baseAngle) * flyRadius;
      b.position.y = u.heightOffset + Math.sin(time * 2 + u.baseAngle) * 0.6;
      b.rotation.y = -u.baseAngle + Math.PI / 2;

      // Fast wing flap
      const flap = Math.sin(Date.now() * 0.018 + u.heightOffset) * 0.85;
      if (u.leftWing) u.leftWing.rotation.y = flap;
      if (u.rightWing) u.rightWing.rotation.y = -flap;
    });
  }

  // -------------------------------------------------------------
  // REALISTIC ARTICULATED KINEMATICS (KNEE BENDING & ARM SWINGS)
  // -------------------------------------------------------------
  agents.forEach(ag => {
    if (!ag.mesh || !ag.limbs) return;

    const dx = ag.targetX - ag.mesh.position.x;
    const dz = ag.targetZ - ag.mesh.position.z;
    const dist = Math.hypot(dx, dz);

    const { leftLeg, rightLeg, leftArm, rightArm, head, torso } = ag.limbs;

    if (dist > 0.4) {
      ag.mesh.position.x += dx * 0.04 * ag.speed;
      ag.mesh.position.z += dz * 0.04 * ag.speed;
      ag.mesh.rotation.y = Math.atan2(dx, dz);

      ag.walkTime += 0.16;

      // Hip Swing & Leg Forward-Backward rotation
      const legCycle = Math.sin(ag.walkTime);
      const isFemale = (ag.gender === 'female');

      // Female has slight hip-sway (rotation z)
      if (isFemale) {
        torso.rotation.z = Math.sin(ag.walkTime) * 0.08;
      } else {
        torso.rotation.z = 0;
      }

      leftLeg.hip.rotation.x = legCycle * 0.6;
      rightLeg.hip.rotation.x = -legCycle * 0.6;

      // Realistic Knee-Bends (Knees bend backwards as leg kicks back!)
      leftLeg.knee.rotation.x = Math.max(0, -legCycle * 0.85);
      rightLeg.knee.rotation.x = Math.max(0, legCycle * 0.85);

      // Arm & Shoulder Swings (opposite to legs)
      leftArm.shoulder.rotation.x = -legCycle * 0.5;
      rightArm.shoulder.rotation.x = legCycle * 0.5;

      // Elbows slight natural bend
      leftArm.elbow.rotation.x = -Math.abs(legCycle) * 0.25;
      rightArm.elbow.rotation.x = -Math.abs(legCycle) * 0.25;

      // Natural Head Bob & Tilting
      head.rotation.y = Math.sin(ag.walkTime) * 0.06;

      // Vertical step bounce
      ag.mesh.position.y = Math.abs(Math.sin(ag.walkTime)) * 0.22;
    } else {
      // Idle Pose: Smooth damping to natural upright position
      leftLeg.hip.rotation.x *= 0.85;
      rightLeg.hip.rotation.x *= 0.85;
      leftLeg.knee.rotation.x *= 0.85;
      rightLeg.knee.rotation.x *= 0.85;

      leftArm.shoulder.rotation.x *= 0.85;
      rightArm.shoulder.rotation.x *= 0.85;
      leftArm.elbow.rotation.x *= 0.85;
      rightArm.elbow.rotation.x *= 0.85;

      torso.rotation.z *= 0.85;
      head.rotation.y *= 0.85;

      // Idle breathing gentle bob
      ag.mesh.position.y = Math.sin(Date.now() / 400 + ag.x) * 0.04;

      if (Math.random() < 0.008) {
        const zone = ZONES.find(z => z.id === ag.zone) || ZONES[0];
        ag.targetX = zone.x + (Math.random() - 0.5) * (zone.w - 8);
        ag.targetZ = zone.z + (Math.random() - 0.5) * (zone.d - 8);
      }
    }

    ag.bubbleTimer--;
    if (ag.bubbleTimer <= 0) {
      ag.bubbleTimer = 180 + Math.random() * 220;
      const thoughts = [
        'Memeriksa ekosistem poly 3D...',
        'Geometri agen bekerja prima 🔷',
        'Efisiensi token berkecepatan tinggi!',
        'Sinkronisasi task tim...',
        'Menyerap energi matahari ☀️'
      ];
      ag.speechBubble = thoughts[Math.floor(Math.random() * thoughts.length)];
    }
  });

  // Real-time 2D radar blips synchronization
  updateMinimapAgentBlips();

  renderer.render(scene, camera);
}

// --- Natural Sound Synthesizer (Web Audio API) with Volume Control ---
function toggleAmbienceSound() {
  playUiClickSound(640, 0.04);
  const volumeBox = document.getElementById('volume-slider-box');

  if (!state.soundEnabled) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      state.audioCtx = new AudioCtx();
      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }
      
      const bufferSize = state.audioCtx.sampleRate * 2;
      const noiseBuffer = state.audioCtx.createBuffer(1, bufferSize, state.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 2.5;
      }
      
      const whiteNoise = state.audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;
      
      const filter = state.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(360, state.audioCtx.currentTime);
      
      // Master Gain Node connected to slider
      state.masterGainNode = state.audioCtx.createGain();
      state.masterGainNode.gain.setValueAtTime(state.soundVolume * 0.15, state.audioCtx.currentTime);
      
      whiteNoise.connect(filter);
      filter.connect(state.masterGainNode);
      state.masterGainNode.connect(state.audioCtx.destination);
      whiteNoise.start();

      playBirdChirp();

      state.soundEnabled = true;
      const soundBtn = document.getElementById('btn-sound');
      if (soundBtn) {
        soundBtn.innerHTML = `<span class="nav-btn-symbol">🍃</span><span class="nav-btn-label">Suara: ON</span>`;
        soundBtn.classList.add('active');
      }
      if (volumeBox) volumeBox.classList.remove('hidden');
    } catch (e) {
      console.warn('Audio blocked', e);
    }
  } else {
    if (state.audioCtx) {
      state.audioCtx.close();
      state.audioCtx = null;
      state.masterGainNode = null;
    }
    state.soundEnabled = false;
    const soundBtn = document.getElementById('btn-sound');
    if (soundBtn) {
      soundBtn.innerHTML = `<span class="nav-btn-symbol">🍃</span><span class="nav-btn-label">Suara Alam</span>`;
      soundBtn.classList.remove('active');
    }
    if (volumeBox) volumeBox.classList.add('hidden');
  }
}

function playBirdChirp() {
  if (!state.soundEnabled || !state.audioCtx) return;
  try {
    const osc = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();
    const now = state.audioCtx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2600 + Math.random() * 500, now);
    osc.frequency.exponentialRampToValueAtTime(3300 + Math.random() * 400, now + 0.12);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.025, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(state.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  } catch(e) {}

  setTimeout(playBirdChirp, 4500 + Math.random() * 6500);
}

// --- Sidebar Tabs & Chat Dialog ---
function setupSidebarTabs() {
  // Sidebar Minimize & Expand Handlers
  const sidebarPanel = document.getElementById('sidebar-panel');
  const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
  const btnExpandSidebar = document.getElementById('btn-expand-sidebar');

  function toggleSidebar(minimize) {
    if (!sidebarPanel) return;
    const isMin = minimize !== undefined ? minimize : !sidebarPanel.classList.contains('minimized');
    if (isMin) {
      sidebarPanel.classList.add('minimized');
      if (btnExpandSidebar) btnExpandSidebar.classList.remove('hidden');
    } else {
      sidebarPanel.classList.remove('minimized');
      if (btnExpandSidebar) btnExpandSidebar.classList.add('hidden');
    }
    // Smoothly re-evaluate Three.js aspect ratio and canvas viewport size
    let frames = 0;
    const resizeLoop = () => {
      onWindowResize();
      frames++;
      if (frames < 20) {
        requestAnimationFrame(resizeLoop);
      }
    };
    requestAnimationFrame(resizeLoop);
  }

  if (btnToggleSidebar) {
    btnToggleSidebar.addEventListener('click', () => toggleSidebar(true));
  }

  if (btnExpandSidebar) {
    btnExpandSidebar.addEventListener('click', () => toggleSidebar(false));
  }

  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = `tab-${tab.dataset.tab}`;
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  document.getElementById('btn-close-chat').addEventListener('click', () => {
    chatTrayEl.style.display = 'none';
  });

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const promptText = chatInput.value.trim();
    if (!promptText || !state.selectedAgent) return;

    if (!chatHistories[state.selectedAgent.id]) {
      chatHistories[state.selectedAgent.id] = [];
    }
    chatHistories[state.selectedAgent.id].push({ sender: 'user', text: promptText });
    chatInput.value = '';
    renderChatMessages(state.selectedAgent.id);

    state.selectedAgent.speechBubble = 'Menganalisis prompt... 💭';
    state.selectedAgent.bubbleTimer = 180;

    setTimeout(() => {
      let agentReply = generateAgentResponse(state.selectedAgent, promptText);
      chatHistories[state.selectedAgent.id].push({ sender: 'agent', text: agentReply });
      state.selectedAgent.speechBubble = agentReply.slice(0, 24) + '...';
      state.selectedAgent.bubbleTimer = 150;
      renderChatMessages(state.selectedAgent.id);
    }, 600);
  });
}

function generateAgentResponse(agent, userPrompt) {
  const p = userPrompt.toLowerCase();
  if (p.includes('halo') || p.includes('hai')) {
    return `Halo! Saya ${agent.name}. Pemandangan low-poly di kebun ${agent.zone} sangat estetik. Ada yang bisa saya bantu?`;
  }
  if (p.includes('tugas') || p.includes('task') || p.includes('kerja')) {
    return `Saya saat ini fokus pada: "${agent.tasks[0] || 'Optimasi rutin'}". Seluruh facet geometris aman terkendali.`;
  }
  if (p.includes('istirahat') || p.includes('santai')) {
    agent.status = 'resting';
    agent.targetX = -28;
    agent.targetZ = 32;
    return `Baik, saya akan melangkah ke Lotus Pond Low-Poly untuk meditasi sejenak. 🪷`;
  }
  if (p.includes('rapat') || p.includes('meeting') || p.includes('standup')) {
    agent.status = 'meeting';
    agent.zone = 'gazebo';
    agent.targetX = 30;
    agent.targetZ = 30;
    return `Segera melangkah ke Timber Gazebo Faceted untuk sync prioritas tim!`;
  }
  return `Instruksi diterima: "${userPrompt}". Saya aplikasikan ke pipeline low-poly virtual 3D! 🔷✨`;
}

function renderChatMessages(agentId) {
  const history = chatHistories[agentId] || [];
  chatMessagesEl.innerHTML = '';
  history.forEach(item => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${item.sender}`;
    msgDiv.textContent = item.text;
    chatMessagesEl.appendChild(msgDiv);
  });
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

function renderSidebar() {
  agentsListEl.innerHTML = '';
  document.getElementById('active-agents-count').textContent = agents.length;
  document.getElementById('squad-badge').textContent = `${agents.length} Siaga`;

  agents.forEach(agent => {
    const card = document.createElement('div');
    card.className = `agent-card ${state.selectedAgent && state.selectedAgent.id === agent.id ? 'selected' : ''}`;
    
    let statusClass = 'status-working';
    if (agent.status === 'resting') statusClass = 'status-resting';
    if (agent.status === 'meeting') statusClass = 'status-meeting';

    const genderBadge = agent.gender === 'female' ? '♀️ Wanita' : '♂️ Pria';

    card.innerHTML = `
      <div class="agent-card-top">
        <div class="agent-avatar-box" style="background:#${agent.color.toString(16)}22; border-color:#${agent.color.toString(16)};">
          ${agent.avatar}
        </div>
        <div class="agent-details">
          <div class="agent-name-row">
            <span class="agent-name">${agent.name} <small style="font-size:0.7rem; color:#a7f3d0;">(${genderBadge})</small></span>
            <span class="agent-status-tag ${statusClass}">${agent.status}</span>
          </div>
          <span class="agent-role">${agent.role}</span>
        </div>
      </div>
      <div class="agent-current-thought">
        <span>🔷</span> ${agent.statusText}
      </div>
    `;

    card.addEventListener('click', () => {
      selectAgent(agent);
      if (agent.mesh) {
        moveCameraTo(agent.mesh.position.x, 24, agent.mesh.position.z + 28, agent.mesh.position.x, 2, agent.mesh.position.z);
      }
    });

    agentsListEl.appendChild(card);
  });

  zonesListEl.innerHTML = '';
  ZONES.forEach(zone => {
    const zoneCard = document.createElement('div');
    zoneCard.className = 'zone-card';
    const agentsInZone = agents.filter(a => a.zone === zone.id);

    zoneCard.innerHTML = `
      <div class="zone-card-head">
        <div class="zone-title">${zone.icon} ${zone.name}</div>
        <span class="badge">${agentsInZone.length} Agen</span>
      </div>
      <p class="zone-desc">${zone.desc}</p>
    `;

    zoneCard.addEventListener('click', () => {
      moveCameraTo(zone.x, 24, zone.z + 28, zone.x, 2, zone.z);
    });

    zonesListEl.appendChild(zoneCard);
  });

  tasksFeedEl.innerHTML = '';
  tasks.forEach(task => {
    const item = document.createElement('div');
    item.className = 'task-item';
    item.innerHTML = `
      <div class="task-header">
        <strong>${task.title}</strong>
        <span class="badge">${task.status}</span>
      </div>
      <div class="task-assigned">Ditugaskan ke: <strong>${task.agent}</strong></div>
      <div class="task-progress">
        <div class="task-progress-bar" style="width: ${task.progress}%"></div>
      </div>
    `;
    tasksFeedEl.appendChild(item);
  });
}

// --- Top Toolbar Actions & Modal ---
function setupControls() {
  document.getElementById('btn-sound').addEventListener('click', toggleAmbienceSound);

  document.getElementById('btn-weather').addEventListener('click', () => {
    const weatherBtn = document.getElementById('btn-weather');
    if (state.timeMode === 'day') {
      state.timeMode = 'sunset';
      if (weatherBtn) weatherBtn.innerHTML = `<span class="nav-btn-symbol">🌇</span><span class="nav-btn-label">Senja</span>`;
      document.getElementById('weather-icon').textContent = '🌇';
      document.getElementById('weather-text').textContent = 'Senja Keemasan';

      scene.background.setHex(0x352822);
      scene.fog.color.setHex(0x352822);
      if (skyDomeMesh) skyDomeMesh.material.color.setHex(0x3a241b);
      if (animatedOceanMesh) animatedOceanMesh.material.color.setHex(0x283b38);

      ambientLight.color.setHex(0xe5cca8);
      ambientLight.intensity = 0.55;
      dirLight.color.setHex(0xd97736);
      dirLight.intensity = 1.1;

      // Soft ambient lamp warm-up during sunset
      if (nightLightsGroup) {
        nightLightsGroup.visible = true;
        nightLightsGroup.children.forEach(child => {
          child.traverse(obj => {
            if (obj.isPointLight) obj.intensity = 0.85;
          });
        });
      }
    } else if (state.timeMode === 'sunset') {
      state.timeMode = 'night';
      if (weatherBtn) weatherBtn.innerHTML = `<span class="nav-btn-symbol">🌙</span><span class="nav-btn-label">Malam</span>`;
      document.getElementById('weather-icon').textContent = '🌙';
      document.getElementById('weather-text').textContent = 'Malam Berbintang';

      // Warm charcoal midnight with blue undertone
      scene.background.setHex(0x131a1b);
      scene.fog.color.setHex(0x131a1b);
      if (skyDomeMesh) skyDomeMesh.material.color.setHex(0x0e1517);
      if (animatedOceanMesh) animatedOceanMesh.material.color.setHex(0x0a1c1e);

      ambientLight.color.setHex(0x2b3836);
      ambientLight.intensity = 0.4;
      dirLight.color.setHex(0x7fa2a8);
      dirLight.intensity = 0.35;

      // Full Illumination: Natural amber incandescent lanterns
      if (nightLightsGroup) {
        nightLightsGroup.visible = true;
        nightLightsGroup.children.forEach(child => {
          child.traverse(obj => {
            if (obj.isPointLight) obj.intensity = 2.0;
          });
        });
      }
    } else {
      state.timeMode = 'day';
      if (weatherBtn) weatherBtn.innerHTML = `<span class="nav-btn-symbol">☀️</span><span class="nav-btn-label">Siang</span>`;
      document.getElementById('weather-icon').textContent = '☀️';
      document.getElementById('weather-text').textContent = 'Siang Cerah';

      scene.background.setHex(0x28363a);
      scene.fog.color.setHex(0x28363a);
      if (skyDomeMesh) skyDomeMesh.material.color.setHex(0x243236);
      if (animatedOceanMesh) animatedOceanMesh.material.color.setHex(0x1a464c);

      ambientLight.color.setHex(0xfff5ea);
      ambientLight.intensity = 0.62;
      dirLight.color.setHex(0xffecd2);
      dirLight.intensity = 1.55;

      // Turn OFF streetlamps during bright day
      if (nightLightsGroup) {
        nightLightsGroup.visible = false;
      }
    }
  });

  document.getElementById('btn-broadcast').addEventListener('click', () => {
    const gazebo = ZONES.find(z => z.id === 'gazebo');
    agents.forEach((ag, idx) => {
      ag.zone = 'gazebo';
      ag.status = 'meeting';
      const angle = (idx / agents.length) * Math.PI * 2;
      ag.targetX = gazebo.x + Math.cos(angle) * 7;
      ag.targetZ = gazebo.z + Math.sin(angle) * 7;
      ag.speechBubble = 'Rapat sinkronisasi! Menuju Gazebo 🔔';
      ag.bubbleTimer = 220;
    });
    renderSidebar();

    moveCameraTo(gazebo.x, 26, gazebo.z + 32, gazebo.x, 2, gazebo.z);
  });

  // Graphics Quality Switcher (Low / Medium / High)
  const graphicsSelect = document.getElementById('select-graphics');
  if (graphicsSelect) {
    graphicsSelect.addEventListener('change', (e) => {
      playUiClickSound(700, 0.04);
      const quality = e.target.value;
      state.graphicsQuality = quality;

      if (quality === 'low') {
        renderer.shadowMap.enabled = false;
        renderer.setPixelRatio(1);
        if (dirLight) dirLight.castShadow = false;
        if (firefliesGroup) firefliesGroup.visible = false;
      } else if (quality === 'medium') {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.BasicShadowMap;
        renderer.setPixelRatio(1);
        if (dirLight) {
          dirLight.castShadow = true;
          dirLight.shadow.mapSize.width = 1024;
          dirLight.shadow.mapSize.height = 1024;
        }
        if (firefliesGroup) firefliesGroup.visible = true;
      } else { // High
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        if (dirLight) {
          dirLight.castShadow = true;
          dirLight.shadow.mapSize.width = 4096;
          dirLight.shadow.mapSize.height = 4096;
        }
        if (firefliesGroup) firefliesGroup.visible = true;
      }
      scene.traverse((obj) => {
        if (obj.material) obj.material.needsUpdate = true;
      });
    });
  }

  // Volume Slider Event
  const volumeSlider = document.getElementById('volume-slider');
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value) / 100;
      state.soundVolume = vol;
      if (state.masterGainNode && state.audioCtx) {
        state.masterGainNode.gain.setValueAtTime(vol * 0.15, state.audioCtx.currentTime);
      }
    });
  }

  // Interactive 2D Minimap Zone Click Navigation
  const minimapDots = document.querySelectorAll('.minimap-zone-dot');
  minimapDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      playUiClickSound(620, 0.04);
      const zoneId = dot.dataset.zone;
      if (zoneId === 'center') {
        moveCameraTo(0, 52, 68, 0, 1.5, 0);
      } else {
        const targetZone = ZONES.find(z => z.id === zoneId);
        if (targetZone) {
          moveCameraTo(targetZone.x, 24, targetZone.z + 28, targetZone.x, 2, targetZone.z);
        }
      }
    });
  });

  document.getElementById('btn-add-task').addEventListener('click', () => {
    playUiClickSound(600, 0.03);
    const taskName = prompt('Masukkan nama task AI baru di kantor Low-Poly:');
    if (taskName) {
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      tasks.unshift({
        id: Date.now(),
        title: taskName,
        agent: randomAgent.name,
        progress: 10,
        status: 'In Progress'
      });
      randomAgent.tasks.unshift(taskName);
      randomAgent.speechBubble = `Menerima task: ${taskName.slice(0, 16)}!`;
      randomAgent.bubbleTimer = 180;
      renderSidebar();
    }
  });
}

function setupModal() {
  const addAgentBtn = document.getElementById('btn-add-agent');
  const modalCloseBtn = document.getElementById('btn-modal-close');
  const cancelAgentBtn = document.getElementById('btn-cancel-agent');
  const formNewAgent = document.getElementById('form-new-agent');
  let selectedColor = 0x10b981;

  addAgentBtn.addEventListener('click', () => modalAgent.classList.remove('hidden'));
  modalCloseBtn.addEventListener('click', () => modalAgent.classList.add('hidden'));
  cancelAgentBtn.addEventListener('click', () => modalAgent.classList.add('hidden'));

  const dots = document.querySelectorAll('#color-picker-options .color-dot');
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      selectedColor = parseInt(dot.dataset.color.replace('#', '0x'), 16);
    });
  });

  formNewAgent.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('new-agent-name').value.trim();
    const role = document.getElementById('new-agent-role').value;
    const gender = document.getElementById('new-agent-gender').value;
    const zoneId = document.getElementById('new-agent-zone').value;
    const targetZone = ZONES.find(z => z.id === zoneId) || ZONES[0];

    const isFemale = (gender === 'female');
    const avatar = isFemale ? '👩‍🌾' : '👨‍💻';

    const newAgent = {
      id: `agent-${Date.now()}`,
      name: name,
      gender: gender,
      role: role,
      zone: zoneId,
      color: selectedColor,
      secondaryColor: 0x1f2937,
      hairColor: isFemale ? 0xf472b6 : 0x38bdf8,
      x: targetZone.x,
      z: targetZone.z,
      targetX: targetZone.x,
      targetZ: targetZone.z,
      speed: 0.11,
      status: 'working',
      statusText: 'Baru dideploy ke dunia low-poly...',
      avatar: avatar,
      speechBubble: `Salam! Saya ${name} siap bekerja di dunia poly! 🔷`,
      bubbleTimer: 240,
      tasks: ['Inisialisasi modul low-poly'],
      mesh: null,
      auraMesh: null,
      limbs: null,
      walkTime: 0
    };

    agents.push(newAgent);
    chatHistories[newAgent.id] = [
      { sender: 'agent', text: `Halo! Saya ${newAgent.name}, spesialis ${newAgent.role}. Siap bekerja di ${targetZone.name}!` }
    ];

    // Rebuild agents to include newly deployed high-detail agent
    agents.forEach(a => { if (a.mesh) scene.remove(a.mesh); });
    interactiveObjects = interactiveObjects.filter(o => !o.parent || !o.parent.userData.isAgent);
    buildDetailedLowPolyAgents();

    modalAgent.classList.add('hidden');
    formNewAgent.reset();
    selectAgent(newAgent);
    renderSidebar();
  });

  // Agent Detail Profile Modal Handlers
  const modalDetail = document.getElementById('modal-agent-detail');
  const btnCloseDetail = document.getElementById('btn-close-detail');
  const btnFocusAgent = document.getElementById('btn-focus-camera-agent');
  const btnOpenChat = document.getElementById('btn-open-agent-chat');

  if (btnCloseDetail && modalDetail) {
    btnCloseDetail.addEventListener('click', () => {
      playUiClickSound(500, 0.03);
      modalDetail.classList.add('hidden');
    });
  }

  if (btnFocusAgent) {
    btnFocusAgent.addEventListener('click', () => {
      if (state.selectedAgent && state.selectedAgent.mesh) {
        modalDetail.classList.add('hidden');
        const pos = state.selectedAgent.mesh.position;
        moveCameraTo(pos.x, pos.y + 12, pos.z + 18, pos.x, pos.y + 2, pos.z);
      }
    });
  }

  if (btnOpenChat) {
    btnOpenChat.addEventListener('click', () => {
      modalDetail.classList.add('hidden');
      if (chatTrayEl) chatTrayEl.style.display = 'flex';
      const input = document.getElementById('chat-input');
      if (input) input.focus();
    });
  }
}

// Open Detailed Agent Profile Modal
function openAgentDetailModal(agent) {
  playUiClickSound(720, 0.04);
  const modalDetail = document.getElementById('modal-agent-detail');
  if (!modalDetail) return;

  document.getElementById('detail-agent-avatar').textContent = agent.avatar;
  document.getElementById('detail-agent-name').textContent = agent.name;
  const genderText = agent.gender === 'female' ? 'Wanita 👩‍🌾' : 'Pria 👨‍💻';
  document.getElementById('detail-agent-gender-role').textContent = `${genderText} • ${agent.role}`;
  
  const zone = ZONES.find(z => z.id === agent.zone) || ZONES[0];
  document.getElementById('detail-agent-zone').textContent = `${zone.icon} ${zone.name}`;
  document.getElementById('detail-agent-status').textContent = agent.statusText || 'Siaga Produktif';
  document.getElementById('detail-agent-speed').textContent = `${agent.speed * 10} m/s`;

  const taskListEl = document.getElementById('detail-agent-task-list');
  if (taskListEl) {
    taskListEl.innerHTML = '';
    const currentTasks = agent.tasks && agent.tasks.length > 0 ? agent.tasks : ['Riset & Optimasi Sistem Poligonal'];
    currentTasks.forEach(taskText => {
      const item = document.createElement('div');
      item.className = 'profile-task-item';
      item.innerHTML = `<span>🔹</span> <span>${taskText}</span>`;
      taskListEl.appendChild(item);
    });
  }

  modalDetail.classList.remove('hidden');
}

// Update 2D Minimap Agent Blips
function updateMinimapAgentBlips() {
  const g = document.getElementById('minimap-agent-blips');
  if (!g) return;
  g.innerHTML = '';

  agents.forEach(ag => {
    if (!ag.mesh) return;
    // World coordinates (-65 to 65) mapped to SVG Minimap (20 to 120, centered at 70)
    const svgX = 70 + (ag.mesh.position.x / 65) * 45;
    const svgY = 70 + (ag.mesh.position.z / 65) * 45;

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', svgX);
    circle.setAttribute('cy', svgY);
    circle.setAttribute('r', (state.selectedAgent && state.selectedAgent.id === ag.id) ? '3.8' : '2.6');
    circle.setAttribute('class', 'minimap-agent-blip');
    circle.setAttribute('fill', ag.gender === 'female' ? '#f472b6' : '#38bdf8');
    g.appendChild(circle);
  });
}

// Intuitive Loading Screen Progress Simulation
function setupLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const barFill = document.getElementById('loading-bar-fill');
  const statusText = document.getElementById('loading-status-text');
  if (!loadingScreen || !barFill) return;

  const steps = [
    { pct: 35, text: 'Membangun kubah langit & samudra...' },
    { pct: 65, text: 'Memuat karakter poly & sendi kinematika...' },
    { pct: 90, text: 'Mengalibrasi bayangan PCF & audio botani...' },
    { pct: 100, text: 'Kantor Virtual Siap!' }
  ];

  let current = 0;
  const interval = setInterval(() => {
    if (current < steps.length) {
      barFill.style.width = `${steps[current].pct}%`;
      if (statusText) statusText.textContent = steps[current].text;
      current++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => loadingScreen.remove(), 600);
      }, 350);
    }
  }, 220);
}

// Start application
window.addEventListener('DOMContentLoaded', () => {
  setupLoadingScreen();
  init();
});
