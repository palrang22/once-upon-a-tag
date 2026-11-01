export function ChevronIcon({ dir }: { dir: 'left' | 'right' }) {
  return <svg width="8" height="14" viewBox="0 0 4 7" shapeRendering="crispEdges" aria-hidden="true">
    <path fill="currentColor" d={dir === 'left'
      ? 'M3 0h1v1H3zM2 1h1v1H2zM1 2h1v1H1zM0 3h1v1H0zM1 4h1v1H1zM2 5h1v1H2zM3 6h1v1H3z'
      : 'M0 0h1v1H0zM1 1h1v1H1zM2 2h1v1H2zM3 3h1v1H3zM2 4h1v1H2zM1 5h1v1H1zM0 6h1v1H0z'}/>
  </svg>;
}
