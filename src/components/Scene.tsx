import type { SceneId } from '../game/types';

const style = { position: 'absolute', inset: 0, width: '100%', height: '100%' } as const;

export function Scene({ id }: { id: SceneId }) {
  switch (id) {
    case 'rabbit-cafe':
      return (
        <svg viewBox="0 0 120 90" preserveAspectRatio="xMidYMax slice" shapeRendering="crispEdges" style={style} role="img" aria-label="토끼 카페가 있는 마을 거리와 당근밭">
          <defs>
            <pattern id="s1d" width="2" height="2" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="#8C8C8C"/><rect x="1" y="1" width="1" height="1" fill="#8C8C8C"/></pattern>
            <pattern id="s1l" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="#A6A6A6"/><rect x="2" y="2" width="1" height="1" fill="#A6A6A6"/></pattern>
          </defs>
          <g fill="url(#s1l)">
            <rect x="10" y="10" width="12" height="2"/><rect x="7" y="12" width="18" height="3"/>
            <rect x="44" y="6" width="8" height="2"/><rect x="41" y="8" width="14" height="2"/>
            <rect x="80" y="14" width="10" height="2"/><rect x="77" y="16" width="16" height="3"/>
            <rect x="52" y="55" width="16" height="2"/><rect x="46" y="57" width="28" height="3"/><rect x="40" y="60" width="40" height="10"/>
          </g>
          <g fill="url(#s1d)"><rect x="8" y="31" width="24" height="2"/><rect x="4" y="33" width="32" height="2"/><rect x="0" y="35" width="40" height="5"/></g>
          <rect x="13" y="25" width="14" height="6" fill="#6E6E6E"/><rect x="14" y="26" width="12" height="4" fill="#FFFFFF"/>
          <g fill="#6E6E6E"><rect x="16" y="28" width="5" height="1"/><rect x="17" y="27" width="4" height="1"/><rect x="21" y="27" width="1" height="1"/><rect x="22" y="28" width="1" height="1"/></g>
          <rect x="2" y="40" width="36" height="30" fill="#6E6E6E"/><rect x="3" y="41" width="34" height="29" fill="#FFFFFF"/>
          <g fill="#6E6E6E"><rect x="6" y="45" width="28" height="1"/><rect x="6" y="46" width="4" height="3"/><rect x="14" y="46" width="4" height="3"/><rect x="22" y="46" width="4" height="3"/><rect x="30" y="46" width="4" height="3"/><rect x="7" y="52" width="13" height="10"/></g>
          <rect x="8" y="53" width="11" height="8" fill="#FFFFFF"/>
          <g fill="#6E6E6E"><rect x="13" y="53" width="1" height="8"/><rect x="8" y="57" width="11" height="1"/><rect x="24" y="52" width="9" height="18"/></g>
          <rect x="25" y="53" width="7" height="17" fill="#FFFFFF"/><rect x="30" y="61" width="1" height="2" fill="#6E6E6E"/>
          <g fill="url(#s1d)"><rect x="34" y="65" width="3" height="5"/><rect x="104" y="32" width="12" height="2"/><rect x="102" y="34" width="16" height="10"/><rect x="104" y="44" width="12" height="2"/></g>
          <rect x="109" y="46" width="2" height="24" fill="#6E6E6E"/>
          <rect x="0" y="70" width="120" height="1" fill="#6E6E6E"/><rect x="0" y="71" width="120" height="19" fill="url(#s1l)"/>
          <g fill="url(#s1d)"><rect x="84" y="76" width="32" height="2"/><rect x="84" y="83" width="32" height="2"/></g>
          <g fill="#6E6E6E">
            <rect x="88" y="74" width="1" height="2"/><rect x="87" y="73" width="1" height="1"/><rect x="89" y="73" width="1" height="1"/>
            <rect x="96" y="74" width="1" height="2"/><rect x="95" y="73" width="1" height="1"/><rect x="97" y="73" width="1" height="1"/>
            <rect x="104" y="74" width="1" height="2"/><rect x="103" y="73" width="1" height="1"/><rect x="105" y="73" width="1" height="1"/>
            <rect x="112" y="74" width="1" height="2"/><rect x="111" y="73" width="1" height="1"/><rect x="113" y="73" width="1" height="1"/>
            <rect x="92" y="81" width="1" height="2"/><rect x="91" y="80" width="1" height="1"/><rect x="93" y="80" width="1" height="1"/>
            <rect x="100" y="81" width="1" height="2"/><rect x="99" y="80" width="1" height="1"/><rect x="101" y="80" width="1" height="1"/>
            <rect x="108" y="81" width="1" height="2"/><rect x="107" y="80" width="1" height="1"/><rect x="109" y="80" width="1" height="1"/>
          </g>
        </svg>
      );
    case 'bear-library':
      return (
        <svg viewBox="0 0 120 90" preserveAspectRatio="xMidYMax slice" shapeRendering="crispEdges" style={style} role="img" aria-label="숲속의 곰 도서관">
          <defs>
            <pattern id="s2d" width="2" height="2" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="#8C8C8C"/><rect x="1" y="1" width="1" height="1" fill="#8C8C8C"/></pattern>
            <pattern id="s2l" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="#A6A6A6"/><rect x="2" y="2" width="1" height="1" fill="#A6A6A6"/></pattern>
          </defs>
          <g fill="url(#s2l)">
            <rect x="64" y="8" width="10" height="2"/><rect x="61" y="10" width="16" height="3"/>
            <rect x="79" y="40" width="2" height="2"/><rect x="77" y="42" width="6" height="3"/><rect x="75" y="45" width="10" height="4"/>
            <rect x="55" y="44" width="2" height="2"/><rect x="53" y="46" width="6" height="3"/><rect x="51" y="49" width="10" height="4"/>
          </g>
          <g fill="#A6A6A6"><rect x="79" y="49" width="2" height="21"/><rect x="55" y="53" width="2" height="17"/></g>
          <g fill="url(#s2d)"><rect x="10" y="30" width="26" height="2"/><rect x="4" y="32" width="38" height="2"/></g>
          <rect x="0" y="34" width="46" height="2" fill="#6E6E6E"/>
          <rect x="2" y="36" width="42" height="30" fill="#6E6E6E"/><rect x="3" y="37" width="40" height="29" fill="#FFFFFF"/>
          <g fill="url(#s2d)"><rect x="6" y="39" width="3" height="27"/><rect x="15" y="39" width="3" height="27"/><rect x="28" y="39" width="3" height="27"/><rect x="37" y="39" width="3" height="27"/></g>
          <rect x="20" y="41" width="6" height="5" fill="#6E6E6E"/><rect x="21" y="42" width="2" height="3" fill="#FFFFFF"/><rect x="24" y="42" width="1" height="3" fill="#FFFFFF"/>
          <rect x="20" y="50" width="7" height="16" fill="#6E6E6E"/><rect x="21" y="51" width="5" height="15" fill="#FFFFFF"/>
          <rect x="0" y="66" width="46" height="2" fill="#6E6E6E"/><rect x="0" y="68" width="46" height="2" fill="url(#s2d)"/>
          <g fill="url(#s2d)">
            <rect x="99" y="22" width="2" height="2"/><rect x="97" y="24" width="6" height="3"/><rect x="95" y="27" width="10" height="3"/><rect x="93" y="30" width="14" height="4"/><rect x="91" y="34" width="18" height="4"/><rect x="89" y="38" width="22" height="4"/>
            <rect x="115" y="34" width="2" height="2"/><rect x="113" y="36" width="6" height="3"/><rect x="111" y="39" width="10" height="3"/><rect x="109" y="42" width="14" height="4"/>
          </g>
          <g fill="#6E6E6E"><rect x="99" y="42" width="2" height="28"/><rect x="115" y="46" width="2" height="24"/><rect x="0" y="70" width="120" height="1"/></g>
          <rect x="0" y="71" width="120" height="19" fill="url(#s2l)"/>
          <rect x="84" y="66" width="5" height="2" fill="url(#s2d)"/><rect x="86" y="68" width="1" height="2" fill="#6E6E6E"/>
        </svg>
      );
    case 'cat-shop':
      return (
        <svg viewBox="0 0 120 90" preserveAspectRatio="xMidYMax slice" shapeRendering="crispEdges" style={style} role="img" aria-label="고양이 잡화점이 있는 시장 골목">
          <defs>
            <pattern id="s3d" width="2" height="2" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="#8C8C8C"/><rect x="1" y="1" width="1" height="1" fill="#8C8C8C"/></pattern>
            <pattern id="s3l" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="#A6A6A6"/><rect x="2" y="2" width="1" height="1" fill="#A6A6A6"/></pattern>
          </defs>
          <rect x="0" y="10" width="120" height="1" fill="#BDBDBD"/>
          <g fill="url(#s3d)"><rect x="6" y="11" width="3" height="4"/><rect x="22" y="11" width="3" height="4"/><rect x="38" y="11" width="3" height="4"/><rect x="54" y="11" width="3" height="4"/><rect x="70" y="11" width="3" height="4"/><rect x="86" y="11" width="3" height="4"/><rect x="102" y="11" width="3" height="4"/></g>
          <rect x="0" y="30" width="40" height="2" fill="#6E6E6E"/>
          <g fill="url(#s3d)"><rect x="0" y="32" width="5" height="10"/><rect x="10" y="32" width="5" height="10"/><rect x="20" y="32" width="5" height="10"/><rect x="30" y="32" width="5" height="10"/></g>
          <g fill="#6E6E6E"><rect x="2" y="42" width="2" height="28"/><rect x="36" y="42" width="2" height="28"/><rect x="4" y="50" width="32" height="1"/><rect x="12" y="46" width="5" height="4"/><rect x="25" y="46" width="5" height="4"/></g>
          <g fill="url(#s3d)"><rect x="6" y="45" width="4" height="5"/><rect x="19" y="44" width="4" height="6"/><rect x="31" y="47" width="3" height="3"/></g>
          <rect x="1" y="58" width="38" height="12" fill="#6E6E6E"/><rect x="2" y="59" width="36" height="11" fill="#FFFFFF"/>
          <rect x="6" y="62" width="8" height="4" fill="#6E6E6E"/><rect x="7" y="63" width="6" height="2" fill="#FFFFFF"/>
          <rect x="80" y="30" width="40" height="2" fill="#6E6E6E"/>
          <g fill="url(#s3d)"><rect x="80" y="32" width="5" height="10"/><rect x="90" y="32" width="5" height="10"/><rect x="100" y="32" width="5" height="10"/><rect x="110" y="32" width="5" height="10"/></g>
          <g fill="#6E6E6E"><rect x="82" y="42" width="2" height="28"/><rect x="116" y="42" width="2" height="28"/><rect x="84" y="50" width="32" height="1"/><rect x="92" y="46" width="5" height="4"/><rect x="105" y="46" width="5" height="4"/></g>
          <g fill="url(#s3d)"><rect x="86" y="45" width="4" height="5"/><rect x="99" y="44" width="4" height="6"/><rect x="112" y="47" width="3" height="3"/></g>
          <rect x="81" y="58" width="38" height="12" fill="#6E6E6E"/><rect x="82" y="59" width="36" height="11" fill="#FFFFFF"/>
          <g fill="#6E6E6E"><rect x="90" y="63" width="8" height="3"/><rect x="98" y="62" width="1" height="5"/><rect x="99" y="61" width="1" height="2"/><rect x="99" y="66" width="1" height="2"/></g>
          <rect x="92" y="64" width="1" height="1" fill="#FFFFFF"/>
          <rect x="0" y="70" width="120" height="1" fill="#6E6E6E"/><rect x="0" y="71" width="120" height="19" fill="url(#s3l)"/><rect x="0" y="78" width="120" height="1" fill="#BDBDBD"/>
        </svg>
      );
    case 'fox-studio':
      return (
        <svg viewBox="0 0 120 90" preserveAspectRatio="xMidYMax slice" shapeRendering="crispEdges" style={style} role="img" aria-label="밤하늘 아래 언덕 위의 여우 사진관">
          <defs>
            <pattern id="s4d" width="2" height="2" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="#8C8C8C"/><rect x="1" y="1" width="1" height="1" fill="#8C8C8C"/></pattern>
            <pattern id="s4l" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="1" height="1" fill="#A6A6A6"/><rect x="2" y="2" width="1" height="1" fill="#A6A6A6"/></pattern>
          </defs>
          <rect x="0" y="0" width="120" height="70" fill="url(#s4d)"/>
          <rect x="95" y="6" width="12" height="12" fill="#6E6E6E"/><rect x="96" y="7" width="10" height="10" fill="#FFFFFF"/><rect x="99" y="10" width="2" height="2" fill="url(#s4l)"/><rect x="102" y="13" width="2" height="1" fill="#A6A6A6"/>
          <g fill="#FFFFFF">
            <rect x="11" y="10" width="3" height="1"/><rect x="12" y="9" width="1" height="3"/>
            <rect x="31" y="18" width="3" height="1"/><rect x="32" y="17" width="1" height="3"/>
            <rect x="55" y="8" width="3" height="1"/><rect x="56" y="7" width="1" height="3"/>
            <rect x="73" y="14" width="3" height="1"/><rect x="74" y="13" width="1" height="3"/>
            <rect x="85" y="28" width="3" height="1"/><rect x="86" y="27" width="1" height="3"/>
            <rect x="111" y="26" width="3" height="1"/><rect x="112" y="25" width="1" height="3"/>
            <rect x="19" y="30" width="3" height="1"/><rect x="20" y="29" width="1" height="3"/>
            <rect x="0" y="56" width="52" height="14"/><rect x="6" y="52" width="40" height="4"/><rect x="14" y="49" width="24" height="3"/>
          </g>
          <g fill="#6E6E6E">
            <rect x="14" y="48" width="24" height="1"/><rect x="13" y="48" width="1" height="4"/><rect x="38" y="48" width="1" height="4"/>
            <rect x="6" y="51" width="8" height="1"/><rect x="38" y="51" width="8" height="1"/><rect x="5" y="51" width="1" height="5"/><rect x="46" y="51" width="1" height="5"/>
            <rect x="0" y="55" width="6" height="1"/><rect x="46" y="55" width="6" height="1"/><rect x="52" y="55" width="1" height="7"/>
            <rect x="18" y="29" width="16" height="2"/><rect x="14" y="31" width="24" height="3"/><rect x="16" y="34" width="20" height="14"/>
          </g>
          <rect x="17" y="35" width="18" height="13" fill="#FFFFFF"/>
          <rect x="20" y="38" width="10" height="6" fill="#6E6E6E"/><rect x="21" y="39" width="8" height="4" fill="#FFFFFF"/>
          <g fill="#6E6E6E"><rect x="24" y="40" width="2" height="2"/><rect x="21" y="37" width="3" height="1"/><rect x="31" y="41" width="3" height="7"/></g>
          <rect x="53" y="62" width="67" height="8" fill="#FFFFFF"/>
          <g fill="#6E6E6E"><rect x="53" y="61" width="67" height="1"/><rect x="58" y="59" width="26" height="1"/><rect x="60" y="58" width="1" height="4"/><rect x="70" y="58" width="1" height="4"/><rect x="80" y="58" width="1" height="4"/><rect x="0" y="70" width="120" height="1"/></g>
          <rect x="0" y="71" width="120" height="19" fill="url(#s4l)"/>
        </svg>
      );
  }
}
