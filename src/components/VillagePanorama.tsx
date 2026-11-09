import type { ReactNode } from 'react';

/** Building ↔ chapter. The cafe always stands; chapter 2 adds its decorations. Unbuilt chapters leave an empty hill. */
const BUILDING_CHAPTERS = {
  library: 3,
  cafeDecor: 2,
  dogShop: 6,
  catShop: 4,
  tigerGym: 7,
  foxStudio: 5,
} as const;

const K = '#141414'; // near outlines
const W = '#FFFFFF';
const G = '#6E6E6E'; // hill line
const A = '#A6A6A6'; // far outlines, dots
const LG = '#BDBDBD'; // farthest
const DOT = 'url(#pv-dot)';
const DOTL = 'url(#pv-dotl)';

const R = (x: number, y: number, w: number, h: number, fill: string) => <rect x={x} y={y} width={w} height={h} fill={fill} />;

/** Outline + fill, 1-unit line. */
const box = (x: number, y: number, w: number, h: number, fill: string = W, line: string = K) => (
  <g>
    {R(x, y, w, h, line)}
    {R(x + 1, y + 1, w - 2, h - 2, fill)}
  </g>
);

/** Polygon on integer coordinates (half-unit offset keeps the 1-unit stroke on the pixel grid). */
const poly = (pts: number[][], fill: string, stroke: string = K) => (
  <polygon points={pts.map(([px, py]) => `${px + 0.5},${py + 0.5}`).join(' ')} fill={fill} stroke={stroke} strokeWidth={1} />
);

const circ = (cx: number, cy: number, r: number, fill: string = W, stroke: string = K) => (
  <circle cx={cx + 0.5} cy={cy + 0.5} r={r} fill={fill} stroke={stroke} strokeWidth={1} />
);

/** Outlined union: shapes drawn 1 unit bigger in the line color, then in white on top, so overlapping
 *  circles read as one soft canopy/puff with a single clean outline. */
const blob = (circles: [number, number, number][], line: string = K) => (
  <g>
    {circles.map(([cx, cy, r], i) => <circle key={`o${i}`} cx={cx + 0.5} cy={cy + 0.5} r={r + 1} fill={line} />)}
    {circles.map(([cx, cy, r], i) => <circle key={`i${i}`} cx={cx + 0.5} cy={cy + 0.5} r={r} fill={W} />)}
  </g>
);

/* ───────── small parts ───────── */

/** Square window with an inner square, 8×8. */
const Win = ({ x, y }: { x: number; y: number }) => (
  <g>
    {box(x, y, 8, 8)}
    {R(x + 2, y + 2, 4, 4, K)}
    {R(x + 3, y + 3, 2, 2, W)}
  </g>
);

const Door = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <g>
    {box(x, y, w, h)}
    {R(x + w - 4, y + Math.floor(h / 2), 1, 2, K)}
    {R(x + 2, y + 2, w - 4, 1, A)}
  </g>
);

/** Striped awning: outline + sparse-dot stripes. */
const Awning = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <g>
    {box(x, y, w, h)}
    {Array.from({ length: Math.floor((w - 2) / 10) + 1 }, (_, i) => (
      <rect key={i} x={x + 1 + i * 10} y={y + 1} width={Math.min(5, w - 2 - i * 10)} height={h - 2} fill={DOT} />
    ))}
  </g>
);

/** Round leafy tree standing at (x, y): lumpy canopy, short trunk with root flare, a few leaf marks. */
const RoundTree = ({ x, y, s = 1, far = false }: { x: number; y: number; s?: number; far?: boolean }) => {
  const line = far ? A : K;
  const mark = far ? LG : A;
  const c = (dx: number, dy: number, r: number): [number, number, number] => [x + Math.round(dx * s), y + Math.round(dy * s), Math.max(2, Math.round(r * s))];
  const trunkH = Math.round(14 * s);
  return (
    <g>
      {R(x - 2, y - trunkH, 5, trunkH, line)}
      {R(x - 1, y - trunkH, 3, trunkH, W)}
      {R(x - 3, y - 1, 1, 1, line)}
      {R(x + 3, y - 1, 1, 1, line)}
      {blob([c(0, -24, 10), c(-8, -18, 7), c(8, -17, 7), c(-4, -30, 7), c(5, -29, 6)], line)}
      {R(x - Math.round(6 * s), y - Math.round(24 * s), 2, 1, mark)}
      {R(x + Math.round(4 * s), y - Math.round(19 * s), 2, 1, mark)}
      {R(x - Math.round(1 * s), y - Math.round(31 * s), 2, 1, mark)}
    </g>
  );
};

/** Layered pine: three tiers, each wider than the one above, outlined as one silhouette. */
const Pine = ({ x, y, h, far = false }: { x: number; y: number; h: number; far?: boolean }) => {
  const line = far ? A : K;
  const tiers = [0, 1, 2].map(i => {
    const top = y - h + Math.round(i * h * 0.24);
    const bottom = top + Math.round(h * 0.4);
    const half = Math.round(h * (0.14 + i * 0.09));
    return `${x + 0.5},${top} ${x - half},${bottom + 0.5} ${x + half + 1},${bottom + 0.5}`;
  });
  const trunkTop = y - Math.round(h * 0.22);
  return (
    <g>
      {R(x, trunkTop, 2, y - trunkTop, line)}
      {tiers.map(p => <polygon key={`o${p}`} points={p} fill={line} stroke={line} strokeWidth={2} strokeLinejoin="round" />)}
      {tiers.map(p => <polygon key={`i${p}`} points={p} fill={W} />)}
    </g>
  );
};

/** Continuous fence along the street; `gate` leaves an opening with taller posts. */
const Fence = ({ y, gate }: { y: number; gate: [number, number] }) => {
  const [g0, g1] = gate;
  const parts: ReactNode[] = [];
  for (let px = 3; px < 720; px += 10) {
    if (px >= g0 - 2 && px <= g1 + 2) continue;
    parts.push(<g key={`p${px}`}>{R(px, y, 1, 9, K)}</g>);
  }
  parts.push(<g key="rl">{R(0, y + 2, g0 - 1, 1, K)}{R(0, y + 6, g0 - 1, 1, K)}</g>);
  parts.push(<g key="rr">{R(g1 + 2, y + 2, 720 - g1 - 2, 1, K)}{R(g1 + 2, y + 6, 720 - g1 - 2, 1, K)}</g>);
  parts.push(<g key="gl">{box(g0 - 3, y - 3, 3, 12)}{R(g0 - 3, y - 4, 3, 1, K)}</g>);
  parts.push(<g key="gr">{box(g1 + 1, y - 3, 3, 12)}{R(g1 + 1, y - 4, 3, 1, K)}</g>);
  return <g>{parts}</g>;
};

/** Chimney smoke: three puffs drifting up and to the right, fading. */
const Puffs = ({ x, y }: { x: number; y: number }) => (
  <g>
    {blob([[x, y, 2]], A)}
    {blob([[x + 3, y - 6, 3]], A)}
    {blob([[x + 7, y - 13, 3]], LG)}
  </g>
);

/** Bunting string sagging between two points. */
const sagY = (x: number, x1: number, x2: number, y: number, sag: number) => {
  const t = (2 * (x - x1 + 0.5)) / (x2 - x1) - 1;
  return y + Math.round(sag * (1 - t * t));
};

const Bunting = ({ x1, x2, y, sag }: { x1: number; x2: number; y: number; sag: number }) => {
  const flags: ReactNode[] = [];
  for (let x = x1 + 3, i = 0; x + 3 <= x2 - 1; x += 5, i++) {
    const yy = sagY(x + 1, x1, x2, y, sag);
    const fill = i % 2 === 0 ? K : A;
    flags.push(<g key={x}>{R(x, yy + 1, 3, 1, fill)}{R(x, yy + 2, 3, 1, fill)}{R(x + 1, yy + 3, 1, 1, fill)}</g>);
  }
  return (
    <g>
      {Array.from({ length: x2 - x1 }, (_, i) => <rect key={i} x={x1 + i} y={sagY(x1 + i, x1, x2, y, sag)} width={1} height={1} fill={K} />)}
      {flags}
    </g>
  );
};

/* ───────── foreground plants (same sprites as the title-screen ground tile) ───────── */

/** Pixel sprites: 'K' cells become 1×1 squares (2px on screen). */
const DAISY = ['.KKK.', 'K...K', 'K.K.K', 'K...K', '.KKK.', '..K..', '..K.K', '..KK.', '..K..', '.KK..', '..K..'];
const TULIP = ['K.K.K', 'K...K', 'K...K', '.KKK.', '..K..', 'K.K..', '.KK..', '..K..', '..K..'];
const SPROUT = ['KK.KK', '.K.K.', '..K..', '..K..', '..K..'];
const GRASS = ['K.K.K', '.K.K.'];
const sprite = (art: string[], x: number, y: number) =>
  art.flatMap((row, dy) => [...row].map((cell, dx) => (cell === 'K' ? `M${x + dx} ${y + dy}h1v1h-1z` : ''))).join('');

/** Hand-placed, uneven spacing and heights so the foreground doesn't read as a grid. Bottoms rest around y 176. */
const PLANTS: [art: string[], x: number, y: number][] = [
  [DAISY, 12, 165], [GRASS, 26, 174], [SPROUT, 61, 171], [DAISY, 96, 166], [TULIP, 105, 168], [GRASS, 131, 175],
  [TULIP, 170, 167], [GRASS, 199, 172], [SPROUT, 228, 172], [DAISY, 263, 166], [GRASS, 290, 175],
  [TULIP, 343, 167], [DAISY, 352, 166], [SPROUT, 394, 171], [GRASS, 423, 174], [DAISY, 455, 165], [GRASS, 480, 172],
  [TULIP, 511, 168], [SPROUT, 521, 172], [GRASS, 558, 170], [DAISY, 591, 167], [DAISY, 600, 165], [GRASS, 628, 175],
  [SPROUT, 662, 171], [TULIP, 695, 168], [GRASS, 712, 172],
];
const ROAD_TUFTS: [number, number][] = [[36, 149], [148, 155], [205, 143], [402, 152], [538, 145], [613, 156], [688, 149]];

/* ───────── landscape ───────── */

const hillY = (x: number) => Math.round(101 + 5 * Math.sin(x / 45) + 3 * Math.sin(x / 17 + 1) - 13 * Math.exp(-(((x - 668) / 42) ** 2)));
const HILL_LINE = Array.from({ length: 721 }, (_, x) => `${x === 0 ? 'M' : 'L'}${x} ${hillY(x) + 0.5}`).join(' ');
const HILL_FILL = Array.from({ length: 721 }, (_, x) => `${x},${hillY(x) + 1}`).join(' ') + ' 720,137 0,137';

const RIDGE: [number, number][] = [
  [0, 58], [40, 44], [78, 52], [120, 32], [170, 56], [214, 38], [262, 22], [310, 48], [352, 40],
  [400, 60], [452, 34], [500, 17], [548, 44], [596, 30], [640, 56], [688, 38], [720, 46],
];

/** Gray ridge line; each peak's right flank gets a sparse-dot shade down to the hills, like light from the left. */
const Mountains = () => {
  const shades: ReactNode[] = [];
  for (let i = 1; i < RIDGE.length - 1; i++) {
    const [px, py] = RIDGE[i];
    const [nx, ny] = RIDGE[i + 1];
    if (py >= RIDGE[i - 1][1] || py >= ny) continue;
    shades.push(<polygon key={px} points={`${px},${py + 2} ${nx},${ny + 1} ${nx},100 ${px},100`} fill={DOTL} />);
  }
  return (
    <g>
      {shades}
      <polyline points={RIDGE.map(([x, y]) => `${x},${y + 0.5}`).join(' ')} fill="none" stroke={A} strokeWidth={1} />
    </g>
  );
};

/* ───────── buildings (each returns nothing until its chapter opens) ───────── */

const Library = () => (
  <g>
    {box(90, 76, 6, 12)}
    <Puffs x={93} y={70} />
    {circ(60, 76, 4)}
    {circ(80, 76, 4)}
    {box(38, 92, 64, 30)}
    {poly([[34, 94], [70, 72], [106, 94]], W)}
    {poly([[40, 93], [70, 75], [100, 93]], DOT, 'none')}
    {box(64, 82, 12, 7)}
    {R(69, 83, 1, 5, K)}
    {R(70, 83, 1, 5, K)}
    {box(41, 95, 4, 26)}
    {box(95, 95, 4, 26)}
    <Win x={50} y={98} />
    <Win x={82} y={98} />
    <Door x={64} y={104} w={12} h={18} />
  </g>
);

const DogShop = () => (
  <g>
    {poly([[143, 86], [144, 74], [156, 86]], W)}
    {poly([[217, 86], [216, 74], [204, 86]], W)}
    {box(148, 94, 64, 30)}
    {box(144, 84, 72, 10)}
    {R(146, 86, 68, 6, DOT)}
    {R(172, 99, 2, 2, K)}
    {R(172, 102, 2, 2, K)}
    {R(174, 100, 12, 3, K)}
    {R(186, 99, 2, 2, K)}
    {R(186, 102, 2, 2, K)}
    <Win x={154} y={104} />
    <Win x={198} y={104} />
    <Door x={174} y={108} w={12} h={16} />
  </g>
);

const RabbitCafe = ({ decorated }: { decorated: boolean }) => (
  <g>
    {box(292, 48, 7, 30)}
    {R(294, 50, 3, 24, DOT)}
    {box(341, 48, 7, 30)}
    {R(343, 50, 3, 24, DOT)}
    <Puffs x={296} y={42} />
    {box(270, 85, 100, 39)}
    {poly([[266, 87], [320, 60], [374, 87]], W)}
    {poly([[274, 86], [320, 64], [366, 86]], DOT, 'none')}
    {circ(320, 76, 8)}
    {poly([[316, 72], [324, 72], [320, 82]], W)}
    {R(319, 68, 1, 4, K)}
    {R(321, 69, 1, 3, K)}
    <Awning x={270} y={90} w={100} h={8} />
    <Win x={280} y={101} />
    <Win x={352} y={101} />
    <Door x={313} y={106} w={14} h={18} />
    {decorated && (
      <g>
        {box(278, 110, 12, 3)}
        {box(350, 110, 12, 3)}
        {[280, 284, 288, 352, 356, 360].map(fx => <g key={fx}>{circ(fx, 108, 1)}</g>)}
        <Bunting x1={299} x2={341} y={52} sag={5} />
      </g>
    )}
  </g>
);

const CatShop = () => (
  <g>
    {box(420, 92, 90, 34)}
    {poly([[416, 81], [416, 66], [431, 81]], W)}
    {poly([[514, 81], [514, 66], [499, 81]], W)}
    {box(416, 80, 98, 12)}
    {R(418, 82, 94, 8, DOT)}
    {box(456, 82, 16, 8)}
    <ellipse cx={463.5} cy={86.5} rx={5} ry={2.5} fill={W} stroke={K} strokeWidth={1} />
    {poly([[468, 86], [472, 82], [472, 90]], W)}
    {R(460, 86, 1, 1, K)}
    <Awning x={420} y={94} w={90} h={6} />
    <Win x={428} y={104} />
    <Door x={452} y={106} w={14} h={20} />
    {box(478, 112, 30, 14)}
    {circ(485, 109, 3)}
    {circ(493, 109, 3)}
    {circ(501, 109, 3)}
    {R(480, 116, 26, 1, A)}
    {R(480, 120, 26, 1, A)}
  </g>
);

const TigerGym = () => (
  <g>
    {circ(548, 84, 4)}
    {circ(600, 84, 4)}
    {box(546, 94, 58, 30)}
    {box(542, 84, 66, 10)}
    {[548, 556, 564, 572, 580, 588, 596, 602].map(sx => <g key={sx}>{R(sx, 85, 2, 8, K)}</g>)}
    {box(560, 98, 4, 10)}
    {box(586, 98, 4, 10)}
    {R(564, 102, 22, 2, K)}
    <Door x={568} y={110} w={14} h={14} />
    <Win x={550} y={106} />
    <Win x={592} y={106} />
  </g>
);

const FoxStudio = () => (
  <g>
    {poly([[629, 75], [633, 60], [645, 75]], W)}
    {poly([[711, 75], [707, 60], [695, 75]], W)}
    {box(633, 86, 74, 30)}
    {box(629, 74, 82, 12)}
    {R(631, 76, 78, 8, DOT)}
    {box(662, 89, 16, 11)}
    {R(665, 87, 6, 2, K)}
    {circ(670, 94, 3)}
    <Win x={640} y={92} />
    <Win x={692} y={92} />
    <Door x={663} y={103} w={14} h={13} />
  </g>
);

const Lamp = ({ x, y }: { x: number; y: number }) => (
  <g>
    {R(x, y - 20, 1, 20, K)}
    {R(x - 2, y, 5, 1, K)}
    {R(x - 3, y - 27, 7, 1, K)}
    {box(x - 2, y - 26, 5, 6)}
    {R(x, y - 24, 1, 2, A)}
  </g>
);

const Mailbox = ({ x, y }: { x: number; y: number }) => (
  <g>
    {R(x, y - 9, 1, 9, K)}
    {box(x - 4, y - 15, 9, 6)}
    {R(x + 3, y - 18, 1, 3, K)}
    {R(x + 3, y - 18, 3, 1, K)}
  </g>
);

/** Stepping stones from the cafe door down to the road. */
const Path = () => (
  <g fill={A}>
    {[[316, 127], [322, 130], [315, 133]].map(([x, y]) => <rect key={`${x}${y}`} x={x} y={y} width={4} height={1} />)}
  </g>
);

export function VillagePanorama({ openChapters }: { openChapters: number[] }) {
  const open = (chapter: number) => openChapters.includes(chapter);
  return (
    <svg
      className="village-panorama"
      role="img"
      aria-label="동물 마을 거리"
      viewBox="0 0 720 180"
      preserveAspectRatio="xMidYMax slice"
      shapeRendering="crispEdges"
      style={{ display: 'block', width: '100%', height: '100%' }}
    >
      <defs>
        <pattern id="pv-dot" width="8" height="4" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="1" height="1" fill={A} />
          <rect x="4" y="2" width="1" height="1" fill={A} />
        </pattern>
        <pattern id="pv-dotl" width="8" height="4" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="1" height="1" fill={LG} />
          <rect x="4" y="2" width="1" height="1" fill={LG} />
        </pattern>
        <pattern id="pv-dash" width="8" height="1" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="4" height="1" fill={A} />
        </pattern>
      </defs>

      <Mountains />

      {/* Far woods on the hill crests, in loose clusters (later buildings simply stand in front of them). */}
      <Pine x={14} y={hillY(14) + 2} h={30} far />
      <Pine x={27} y={hillY(27) + 3} h={22} far />
      <RoundTree x={124} y={hillY(124) + 2} s={0.6} far />
      <Pine x={236} y={hillY(236) + 2} h={24} far />
      <RoundTree x={250} y={hillY(250) + 3} s={0.55} far />
      <Pine x={398} y={hillY(398) + 2} h={26} far />
      <Pine x={409} y={hillY(409) + 3} h={18} far />
      <RoundTree x={530} y={hillY(530) + 2} s={0.6} far />
      <Pine x={618} y={hillY(618) + 2} h={22} far />

      {/* Hill: white fill hides the mountain shading, then sparse dots and the crest line. */}
      <polygon points={HILL_FILL} fill={W} />
      <polygon points={HILL_FILL} fill={DOT} />
      <path d={HILL_LINE} fill="none" stroke={G} strokeWidth={1} />

      {open(BUILDING_CHAPTERS.library) && <Library />}
      {open(BUILDING_CHAPTERS.dogShop) && <DogShop />}
      <RabbitCafe decorated={open(BUILDING_CHAPTERS.cafeDecor)} />
      {open(BUILDING_CHAPTERS.catShop) && <CatShop />}
      {open(BUILDING_CHAPTERS.tigerGym) && <TigerGym />}
      {open(BUILDING_CHAPTERS.foxStudio) && <FoxStudio />}

      {/* Cafe garden: a tree to its right, the lamp and mailbox by the gate. */}
      <RoundTree x={392} y={126} s={0.85} />
      <Lamp x={300} y={127} />
      <Mailbox x={340} y={127} />
      <Path />
      {/* Big framing trees at both ends of the street. */}
      <RoundTree x={6} y={128} s={1.15} />
      <Pine x={712} y={128} h={44} />

      <Fence y={127} gate={[311, 329]} />

      {R(0, 136, 720, 1, K)}
      <path fill={A} d={ROAD_TUFTS.map(([x, y]) => sprite(GRASS, x, y)).join('')} />
      <rect x="0" y="162" width="720" height="1" fill="url(#pv-dash)" />

      <path fill={K} d={PLANTS.filter(([art]) => art !== GRASS).map(([art, x, y]) => sprite(art, x, y)).join('')} />
      <path fill={A} d={PLANTS.filter(([art]) => art === GRASS).map(([art, x, y]) => sprite(art, x, y)).join('')} />
    </svg>
  );
}
