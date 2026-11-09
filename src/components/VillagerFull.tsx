import { useId } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { VillagerId } from '../game/types';
import './VillagerFull.css';

const INK = '#141414';
const PAPER = '#FFFFFF';

const origin = (o: string): CSSProperties => ({ transformBox: 'view-box', transformOrigin: o });

const Eye = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <rect className="eye" x={x} y={y} width={w} height={h} fill={INK} stroke="none" />
);

const Dot = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <rect x={x} y={y} width={w} height={h} fill={INK} stroke="none" />
);

const Hand = ({ x, y }: { x: number; y: number }) => <rect x={x} y={y} width="6" height="6" fill={INK} stroke="none" />;

const Nose = () => (
  <>
    <rect x="96" y="116" width="8" height="4" />
    <line x1="100" y1="121" x2="100" y2="125" />
  </>
);

const OpenMouth = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <rect className="mo" x={x} y={y} width={w} height={h} />
);

const Head = () => <rect x="40" y="80" width="120" height="90" />;
const Torso = () => <rect x="75" y="170" width="50" height="42" />;

interface Look {
  /** 머리 뒤: 귀 */
  back: ReactNode;
  /** 머리부터 몸통 앞까지(얼굴, 꼬리, 몸통, 몸 무늬) */
  front: (blush: string) => ReactNode;
  /** 왼팔 제스처 클래스/원점 */
  armL?: { cls: string; o: string };
  armR?: { cls: string; o: string };
}

const catMouth = <polyline className="mc" fill="none" points="92,126 96,130 100,126 104,130 108,126" />;

const LOOKS: Record<VillagerId, Look> = {
  rabbit: {
    back: (
      <>
        <rect x="60" y="12" width="20" height="68" />
        <line x1="70" y1="26" x2="70" y2="66" />
        <g className="ear" style={origin('130px 80px')}>
          <rect x="120" y="22" width="20" height="58" />
          <line x1="130" y1="36" x2="130" y2="66" />
        </g>
      </>
    ),
    front: (b) => (
      <>
        <Head />
        <Eye x={68} y={102} w={10} h={14} />
        <Eye x={122} y={102} w={10} h={14} />
        <rect x="54" y="128" width="16" height="6" fill={b} stroke="none" />
        <rect x="130" y="128" width="16" height="6" fill={b} stroke="none" />
        <Nose />
        <line className="mc" x1="93" y1="126" x2="107" y2="126" />
        <OpenMouth x={95} y={126} w={10} h={7} />
        <Torso />
      </>
    ),
  },
  cat: {
    back: (
      <>
        <polygon points="48,80 60,50 74,80" />
        <polygon points="126,80 140,50 152,80" />
      </>
    ),
    front: (b) => (
      <>
        <Head />
        <Eye x={67} y={104} w={11} h={11} />
        <Eye x={122} y={104} w={11} h={11} />
        <rect x="54" y="126" width="16" height="6" fill={b} stroke="none" />
        <rect x="130" y="126" width="16" height="6" fill={b} stroke="none" />
        <line x1="14" y1="118" x2="37" y2="121" />
        <line x1="12" y1="126" x2="37" y2="126" />
        <line x1="14" y1="134" x2="37" y2="131" />
        <line x1="163" y1="121" x2="186" y2="118" />
        <line x1="163" y1="126" x2="188" y2="126" />
        <line x1="163" y1="131" x2="186" y2="134" />
        <Nose />
        {catMouth}
        <OpenMouth x={95} y={126} w={10} h={7} />
        <g className="tail" style={origin('126px 209px')}>
          <polyline fill="none" points="126,209 154,209 154,192 164,192" />
        </g>
        <Torso />
      </>
    ),
  },
  bear: {
    back: (
      <>
        <rect x="44" y="62" width="22" height="18" />
        <Dot x={51} y={68} w={8} h={8} />
        <rect x="134" y="62" width="22" height="18" />
        <Dot x={141} y={68} w={8} h={8} />
      </>
    ),
    front: (b) => (
      <>
        <Head />
        <Eye x={66} y={100} w={9} h={9} />
        <Eye x={125} y={100} w={9} h={9} />
        <rect x="52" y="124" width="14" height="6" fill={b} stroke="none" />
        <rect x="134" y="124" width="14" height="6" fill={b} stroke="none" />
        <rect x="80" y="110" width="40" height="30" />
        <Dot x={95} y={115} w={10} h={6} />
        <line x1="100" y1="121" x2="100" y2="125" />
        <polyline className="mc" fill="none" points="93,126 100,130 107,126" />
        <OpenMouth x={95} y={126} w={10} h={8} />
        <Torso />
      </>
    ),
    armR: { cls: 'wave', o: '125px 180px' },
  },
  tiger: {
    back: (
      <>
        <rect x="46" y="66" width="18" height="14" />
        <Dot x={52} y={71} w={6} h={5} />
        <rect x="136" y="66" width="18" height="14" />
        <Dot x={142} y={71} w={6} h={5} />
      </>
    ),
    front: (b) => (
      <>
        <Head />
        <line x1="90" y1="82" x2="90" y2="92" />
        <line x1="100" y1="82" x2="100" y2="95" />
        <line x1="110" y1="82" x2="110" y2="92" />
        <line x1="42" y1="108" x2="52" y2="110" />
        <line x1="42" y1="118" x2="50" y2="119" />
        <line x1="148" y1="110" x2="158" y2="108" />
        <line x1="150" y1="119" x2="158" y2="118" />
        <Eye x={64} y={104} w={13} h={8} />
        <Eye x={123} y={104} w={13} h={8} />
        <rect x="56" y="124" width="14" height="6" fill={b} stroke="none" />
        <rect x="130" y="124" width="14" height="6" fill={b} stroke="none" />
        <Nose />
        {catMouth}
        <OpenMouth x={95} y={126} w={10} h={7} />
        <Torso />
        <line x1="77" y1="188" x2="85" y2="188" />
        <line x1="77" y1="198" x2="82" y2="198" />
        <line x1="115" y1="188" x2="123" y2="188" />
        <line x1="118" y1="198" x2="123" y2="198" />
      </>
    ),
    armL: { cls: 'point', o: '75px 180px' },
  },
  fox: {
    back: (
      <>
        <polygon points="42,80 56,40 76,80" />
        <polyline fill="none" points="50,80 56,60 64,80" />
        <polygon points="124,80 144,40 158,80" />
        <polyline fill="none" points="136,80 144,60 150,80" />
      </>
    ),
    front: (b) => (
      <>
        <Head />
        <line x1="40" y1="124" x2="86" y2="152" />
        <line x1="160" y1="124" x2="114" y2="152" />
        <Eye x={66} y={102} w={12} h={7} />
        <Eye x={122} y={102} w={12} h={7} />
        <rect x="58" y="116" width="14" height="5" fill={b} stroke="none" />
        <rect x="128" y="116" width="14" height="5" fill={b} stroke="none" />
        <Nose />
        <polyline className="mc" fill="none" points="95,127 100,130 105,127" />
        <OpenMouth x={95} y={126} w={10} h={7} />
        <g className="tail" style={origin('126px 208px')}>
          <line x1="126" y1="208" x2="146" y2="208" />
          <polygon points="146,208 168,184 186,194 172,218" />
          <line x1="174" y1="188" x2="180" y2="206" />
        </g>
        <Torso />
      </>
    ),
  },
  dog: {
    back: (
      <>
        <g className="fl" style={origin('32px 84px')}>
          <rect x="24" y="84" width="16" height="46" />
        </g>
        <g className="fr" style={origin('168px 84px')}>
          <rect x="160" y="84" width="16" height="46" />
        </g>
      </>
    ),
    front: (b) => (
      <>
        <Head />
        <rect x="116" y="96" width="24" height="24" />
        <Eye x={68} y={102} w={10} h={10} />
        <Eye x={124} y={103} w={10} h={10} />
        <rect x="52" y="128" width="14" height="6" fill={b} stroke="none" />
        <rect x="134" y="128" width="14" height="6" fill={b} stroke="none" />
        <Dot x={93} y={114} w={14} h={8} />
        <line x1="100" y1="122" x2="100" y2="126" />
        {catMouth}
        <OpenMouth x={95} y={127} w={10} h={7} />
        <g className="tail" style={origin('125px 212px')}>
          <polyline fill="none" points="125,212 150,207 156,196" />
        </g>
        <Torso />
      </>
    ),
  },
};

export function VillagerFull({
  id,
  height,
  facing,
  walking,
  talking,
  mouthOpen,
}: {
  id: VillagerId;
  height: number;
  facing: 'left' | 'right';
  walking: boolean;
  talking: boolean;
  mouthOpen: boolean;
}) {
  const uid = useId().replace(/:/g, '');
  const dither = `vf-d-${uid}`;
  const look = LOOKS[id];
  const className =
    'villager-full' +
    (facing === 'left' ? ' face-left' : '') +
    (walking ? ' walking' : '') +
    (talking ? ' talk' : '') +
    (mouthOpen ? ' open' : '');

  const armL = (
    <g className="vf-al" style={origin('75px 180px')}>
      {look.armL ? (
        <g className={look.armL.cls} style={origin(look.armL.o)}>
          <line x1="75" y1="180" x2="61" y2="200" />
          <Hand x={58} y={199} />
        </g>
      ) : (
        <>
          <line x1="75" y1="180" x2="61" y2="200" />
          <Hand x={58} y={199} />
        </>
      )}
    </g>
  );
  const armR = (
    <g className="vf-ar" style={origin('125px 180px')}>
      {look.armR ? (
        <g className={look.armR.cls} style={origin(look.armR.o)}>
          <line x1="125" y1="180" x2="139" y2="200" />
          <Hand x={136} y={199} />
        </g>
      ) : (
        <>
          <line x1="125" y1="180" x2="139" y2="200" />
          <Hand x={136} y={199} />
        </>
      )}
    </g>
  );

  return (
    <svg
      className={className}
      viewBox="0 0 200 250"
      width={height * 0.8}
      height={height}
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <defs>
        <pattern id={dither} width="2" height="2" patternUnits="userSpaceOnUse">
          <rect width="1" height="1" fill={INK} />
          <rect x="1" y="1" width="1" height="1" fill={INK} />
        </pattern>
      </defs>
      <g className="vf-body" fill={PAPER} stroke={INK} strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter">
        {look.back}
        {look.front(`url(#${dither})`)}
        {armL}
        {armR}
        <g className="vf-legs-a">
          <line x1="88" y1="213" x2="88" y2="236" />
          <line x1="112" y1="213" x2="112" y2="236" />
          <line x1="81" y1="238" x2="90" y2="238" />
          <line x1="110" y1="238" x2="119" y2="238" />
        </g>
        <g className="vf-legs-b">
          <line x1="88" y1="213" x2="80" y2="236" />
          <line x1="112" y1="213" x2="118" y2="236" />
          <line x1="73" y1="238" x2="82" y2="238" />
          <line x1="116" y1="238" x2="125" y2="238" />
        </g>
      </g>
    </svg>
  );
}
