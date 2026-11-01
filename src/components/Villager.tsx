import type { ReactNode } from 'react';
import type { VillagerId } from '../game/types';
import './Villager.css';


const INK = '#141414';
const PAPER = '#FFFFFF';
const DITHER = 'url(#vg-d)';

const origin = (o: string) => ({ transformBox: 'view-box', transformOrigin: o }) as const;

/** 눈: 깜빡임 클래스 `eye` */
const Eye = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <rect className="eye" x={x} y={y} width={w} height={h} fill={INK} stroke="none" />
);

const Blush = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <rect x={x} y={y} width={w} height={h} fill={DITHER} stroke="none" />
);

/** 어깨에서 계산대 위 손까지의 팔(정적). */
const ArmL = () => <line x1="75" y1="180" x2="62" y2="194" />;
const ArmR = () => <line x1="125" y1="180" x2="138" y2="194" />;

const OpenMouth = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <rect className="mo" x={x} y={y} width={w} height={h} />
);

const Head = () => <rect x="40" y="80" width="120" height="90" />;
const Body = () => <rect x="75" y="170" width="50" height="42" />;

interface Parts {
  character: ReactNode;
  /** 정적 손(계산대 위)을 그리지 않을 쪽: 제스처 그룹이 손을 가지고 있다 */
  skipLeftHand?: boolean;
  skipRightHand?: boolean;
}

const PARTS: Record<VillagerId, Parts> = {
  rabbit: {
    character: (
      <>
        <rect x="60" y="12" width="20" height="68" />
        <line x1="70" y1="26" x2="70" y2="66" />
        <g className="ear" style={origin('130px 80px')}>
          <rect x="120" y="22" width="20" height="58" />
          <line x1="130" y1="36" x2="130" y2="66" />
        </g>
        <Head />
        <Eye x={68} y={102} w={10} h={14} />
        <Eye x={122} y={102} w={10} h={14} />
        <Blush x={54} y={128} w={16} h={6} />
        <Blush x={130} y={128} w={16} h={6} />
        <rect x="96" y="116" width="8" height="4" />
        <line x1="100" y1="121" x2="100" y2="125" />
        <line className="mc" x1="93" y1="126" x2="107" y2="126" />
        <OpenMouth x={95} y={126} w={10} h={7} />
        <Body />
        <ArmL />
        <ArmR />
      </>
    ),
  },
  cat: {
    character: (
      <>
        <polygon points="48,80 60,50 74,80" />
        <polygon points="126,80 140,50 152,80" />
        <Head />
        <Eye x={67} y={104} w={11} h={11} />
        <Eye x={122} y={104} w={11} h={11} />
        <Blush x={54} y={126} w={16} h={6} />
        <Blush x={130} y={126} w={16} h={6} />
        <line x1="14" y1="118" x2="37" y2="121" />
        <line x1="12" y1="126" x2="37" y2="126" />
        <line x1="14" y1="134" x2="37" y2="131" />
        <line x1="163" y1="121" x2="186" y2="118" />
        <line x1="163" y1="126" x2="188" y2="126" />
        <line x1="163" y1="131" x2="186" y2="134" />
        <rect x="96" y="116" width="8" height="4" />
        <line x1="100" y1="121" x2="100" y2="125" />
        <polyline className="mc" fill="none" points="92,126 96,130 100,126 104,130 108,126" />
        <OpenMouth x={95} y={126} w={10} h={7} />
        <g className="tail" style={origin('126px 209px')}>
          <polyline fill="none" points="126,209 154,209 154,192 164,192" />
        </g>
        <Body />
        <ArmL />
        <ArmR />
      </>
    ),
  },
  bear: {
    skipRightHand: true,
    character: (
      <>
        <rect x="44" y="62" width="22" height="18" />
        <rect x="51" y="68" width="8" height="8" fill={INK} stroke="none" />
        <rect x="134" y="62" width="22" height="18" />
        <rect x="141" y="68" width="8" height="8" fill={INK} stroke="none" />
        <Head />
        <Eye x={66} y={100} w={9} h={9} />
        <Eye x={125} y={100} w={9} h={9} />
        <Blush x={52} y={124} w={14} h={6} />
        <Blush x={134} y={124} w={14} h={6} />
        <rect x="80" y="110" width="40" height="30" />
        <rect x="95" y="115" width="10" height="6" fill={INK} stroke="none" />
        <line x1="100" y1="121" x2="100" y2="125" />
        <polyline className="mc" fill="none" points="93,126 100,130 107,126" />
        <OpenMouth x={95} y={126} w={10} h={8} />
        <Body />
        <ArmL />
        <g className="wave" style={origin('125px 180px')}>
          <ArmR />
          <rect x="135" y="190" width="6" height="6" fill={INK} stroke="none" />
        </g>
      </>
    ),
  },
  tiger: {
    skipLeftHand: true,
    character: (
      <>
        <rect x="46" y="66" width="18" height="14" />
        <rect x="52" y="71" width="6" height="5" fill={INK} stroke="none" />
        <rect x="136" y="66" width="18" height="14" />
        <rect x="142" y="71" width="6" height="5" fill={INK} stroke="none" />
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
        <Blush x={56} y={124} w={14} h={6} />
        <Blush x={130} y={124} w={14} h={6} />
        <rect x="96" y="116" width="8" height="4" />
        <line x1="100" y1="121" x2="100" y2="125" />
        <polyline className="mc" fill="none" points="92,126 96,130 100,126 104,130 108,126" />
        <OpenMouth x={95} y={126} w={10} h={7} />
        <Body />
        <line x1="77" y1="188" x2="85" y2="188" />
        <line x1="77" y1="198" x2="82" y2="198" />
        <line x1="115" y1="188" x2="123" y2="188" />
        <line x1="118" y1="198" x2="123" y2="198" />
        <g className="point" style={origin('75px 180px')}>
          <ArmL />
          <rect x="58" y="190" width="7" height="6" fill={INK} stroke="none" />
        </g>
        <ArmR />
      </>
    ),
  },
  fox: {
    character: (
      <>
        <polygon points="42,80 56,40 76,80" />
        <polyline fill="none" points="50,80 56,60 64,80" />
        <polygon points="124,80 144,40 158,80" />
        <polyline fill="none" points="136,80 144,60 150,80" />
        <Head />
        <line x1="40" y1="124" x2="86" y2="152" />
        <line x1="160" y1="124" x2="114" y2="152" />
        <Eye x={66} y={102} w={12} h={7} />
        <Eye x={122} y={102} w={12} h={7} />
        <Blush x={58} y={116} w={14} h={5} />
        <Blush x={128} y={116} w={14} h={5} />
        <rect x="96" y="116" width="8" height="4" />
        <line x1="100" y1="121" x2="100" y2="125" />
        <polyline className="mc" fill="none" points="95,127 100,130 105,127" />
        <OpenMouth x={95} y={126} w={10} h={7} />
        <g className="tail" style={origin('126px 208px')}>
          <line x1="126" y1="208" x2="146" y2="208" />
          <polygon points="146,208 168,184 186,194 172,218" />
          <line x1="174" y1="188" x2="180" y2="206" />
        </g>
        <Body />
        <ArmL />
        <ArmR />
      </>
    ),
  },
  dog: {
    character: (
      <>
        <g className="fl" style={origin('32px 84px')}>
          <rect x="24" y="84" width="16" height="46" />
        </g>
        <g className="fr" style={origin('168px 84px')}>
          <rect x="160" y="84" width="16" height="46" />
        </g>
        <Head />
        <rect x="116" y="96" width="24" height="24" />
        <Eye x={68} y={102} w={10} h={10} />
        <Eye x={124} y={103} w={10} h={10} />
        <Blush x={52} y={128} w={14} h={6} />
        <Blush x={134} y={128} w={14} h={6} />
        <rect x="93" y="114" width="14" height="8" fill={INK} stroke="none" />
        <line x1="100" y1="122" x2="100" y2="126" />
        <polyline className="mc" fill="none" points="92,126 96,130 100,126 104,130 108,126" />
        <OpenMouth x={95} y={127} w={10} h={7} />
        <g className="tail" style={origin('125px 212px')}>
          <polyline fill="none" points="125,212 150,207 156,196" />
        </g>
        <Body />
        <ArmL />
        <ArmR />
      </>
    ),
  },
};

/** 계산대 뒤에 서 있는 주민. 위치는 `.villager`(CSS)가 잡는다. */
export function Villager({
  id,
  talking,
  mouthOpen,
}: {
  id: VillagerId;
  talking: boolean;
  mouthOpen: boolean;
}) {
  const { character, skipLeftHand, skipRightHand } = PARTS[id];
  return (
    <svg
      className={'villager' + (talking ? ' talk' : '') + (mouthOpen ? ' open' : '')}
      viewBox="0 0 200 275"
      width={200}
      height={275}
      aria-hidden="true"
    >
      <defs>
        <pattern id="vg-d" width="2" height="2" patternUnits="userSpaceOnUse">
          <rect width="1" height="1" fill={INK} />
          <rect x="1" y="1" width="1" height="1" fill={INK} />
        </pattern>
      </defs>
      <g className="bob">
        <g fill={PAPER} stroke={INK} strokeWidth={2} strokeLinecap="square">
          {character}
        </g>
      </g>
      <rect x="18" y="206" width="164" height="70" fill={PAPER} stroke={INK} strokeWidth={2} />
      <line x1="59" y1="206" x2="59" y2="276" stroke={INK} strokeWidth={2} />
      <line x1="100" y1="206" x2="100" y2="276" stroke={INK} strokeWidth={2} />
      <line x1="141" y1="206" x2="141" y2="276" stroke={INK} strokeWidth={2} />
      <rect x="8" y="196" width="184" height="10" fill={DITHER} stroke={INK} strokeWidth={2} />
      {!skipLeftHand && <rect x="58" y="190" width="7" height="6" fill={INK} />}
      {!skipRightHand && <rect x="135" y="190" width="7" height="6" fill={INK} />}
    </svg>
  );
}
