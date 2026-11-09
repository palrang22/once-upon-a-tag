import { useId } from 'react';

/** Stall awning: dithered/white 48px stripes with a stepped scalloped edge. */
export function Awning({ className = 'awning' }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  return <div className={className} aria-hidden="true">
    <div className="awning-stripes"/>
    <svg width="100%" height="12" shapeRendering="crispEdges">
      <defs>
        <pattern id={`aw-d-${uid}`} width="4" height="4" patternUnits="userSpaceOnUse"><rect width="2" height="2" fill="#141414"/><rect x="2" y="2" width="2" height="2" fill="#141414"/></pattern>
        <pattern id={`aw-${uid}`} width="96" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 0 H48 V4 H44 V8 H38 V10 H10 V8 H4 V4 H0 Z" fill={`url(#aw-d-${uid})`}/>
          <path d="M0 0 V4 H4 V8 H10 V10 H38 V8 H44 V4 H48 V0" fill="none" stroke="#141414" strokeWidth="2"/>
          <path d="M48 4 H52 V8 H58 V10 H86 V8 H92 V4 H96" fill="none" stroke="#141414" strokeWidth="2"/>
        </pattern>
      </defs>
      <rect width="100%" height="12" fill={`url(#aw-${uid})`}/>
    </svg>
  </div>;
}
