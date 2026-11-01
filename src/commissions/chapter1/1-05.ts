import type { Commission } from '../../game/types';

const commission: Commission = {
  id: '1-5',
  part: 1,
  villager: 'rabbit',
  scene: 'rabbit-cafe',
  title: '오늘의 추천 강조',
  newConcepts: ['<strong>'],
  lines: {
    intro: [
      '당근케이크가 오늘의 추천이에요.',
      '눈에 띄게 할 글자를 <strong>과 </strong> 사이에 넣어요.',
      '에디터의 첫 번째 메뉴에서 이름을 감싸줄래요?',
    ],
    fail: {
      '<li> 안에 <strong> 넣기': '당근케이크를 담은 <li> 안에서 <strong>으로 이름을 감싸주세요.',
      '<strong>으로 당근케이크 감싸기': '<strong> 안에는 당근케이크만 넣어주세요.',
    },
    success: '추천 케이크가 한눈에 들어와요!',
  },
  starter: { html: `<h1>토끼네 카페</h1>
<p>당근 향 가득한 동네 카페예요</p>

<h2>메뉴</h2>
<ul>
  <li><!-- 여기에 추천 메뉴 이름을 강조해주세요 -->당근케이크</li>
  <li>딸기우유</li>
  <li>클로버 라떼</li>
</ul>

<h2>오시는 길</h2>
<p>당근밭 사거리 왼쪽 골목</p>` },
  locked: ['css', 'js', 'ts'],
  frame: 'phone',
  checks: [
    { kind: 'exists', selector: 'li > strong', label: '<li> 안에 <strong> 넣기' },
    { kind: 'text', selector: 'li > strong', equals: ['당근케이크'], label: '<strong>으로 당근케이크 감싸기' },
  ],
  hint: {
    title: '힌트: 강조 모양',
    body: ['당근케이크 글자 앞뒤를 감싸요. 주석은 지워도 돼요.'],
    code: '<li><strong>강조할 글자</strong></li>',
  },
  learn: {
    title: '<strong> 강조',
    body: ['<strong>은 중요한 글자를 강조해요. 보통 굵게 보여요.', '문단이나 목록 줄 안에서 강조할 글자만 감싸요.'],
    code: '<li>오늘은 <strong>할인</strong>해요</li>',
  },
  recap: {
    title: '배운 것: <strong>',
    body: ['<strong>은 글자 일부를 감싸는 태그예요.', '<li> 안에 <strong>이 들어가요. 닫을 때는 안쪽 </strong>을 먼저, 그다음 </li>.'],
  },
  reward: 30,
};

export default commission;
