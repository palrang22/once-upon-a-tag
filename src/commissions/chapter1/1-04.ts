import type { Commission } from '../../game/types';

const commission: Commission = {
  id: '1-4',
  part: 1,
  villager: 'rabbit',
  scene: 'rabbit-cafe',
  title: '메뉴 목록 보여줘',
  newConcepts: ['<ul>', '<li>'],
  lines: {
    intro: [
      '메뉴를 하나씩 목록에 적고 싶어요.',
      '<ul>은 목록 전체를 감싸고, 안의 <li>는 메뉴 한 개예요.',
      '<li>로 열고 </li>로 닫아서 에디터 8번째 줄을 채워줄래요?',
    ],
    fail: {
      '<ul> 안에 <li> 3개': '메뉴가 세 개인데 두 개만 보여요! 클로버 라떼도 목록에 넣어줄래요?',
      '당근케이크, 딸기우유, 클로버 라떼': '목록에 당근케이크, 딸기우유, 클로버 라떼를 한 줄씩 써주세요.',
    },
    success: '메뉴 세 가지가 모두 보이네요! 손님이 고르기 쉽겠어요.',
  },
  starter: { html: `<h1>토끼네 카페</h1>
<p>당근 향 가득한 동네 카페예요</p>

<h2>메뉴</h2>
<ul>
  <li>당근케이크</li>
  <li>딸기우유</li>
  <!-- 여기에 세 번째 메뉴를 써주세요 -->
</ul>

<h2>오시는 길</h2>
<p>당근밭 사거리 왼쪽 골목</p>` },
  locked: ['css', 'js', 'ts'],
  frame: 'phone',
  checks: [
    { kind: 'count', selector: 'ul > li', min: 3, label: '<ul> 안에 <li> 3개' },
    { kind: 'text', selector: 'ul > li', equals: ['당근케이크', '딸기우유', '클로버 라떼'], label: '당근케이크, 딸기우유, 클로버 라떼' },
  ],
  hint: {
    title: '힌트: 목록 한 줄 모양',
    body: ['</ul> 바로 위 주석 자리에 한 줄을 더 써요.'],
    code: '  <li>메뉴 이름</li>',
  },
  learn: {
    title: '<ul>과 <li> 목록',
    body: [
      '<ul>은 점이 찍힌 목록 전체를 감싸는 상자예요.',
      '<li>는 목록 한 줄이에요. <li>는 반드시 <ul> 안에 넣어요.',
      '<ul> 바로 안에는 <li>만 들어갈 수 있어요. 안쪽 줄은 두 칸 들여 쓰면 보기 좋아요.',
    ],
    code: '<ul>\n  <li>첫 번째</li>\n  <li>두 번째</li>\n</ul>',
  },
  recap: {
    title: '배운 것: <ul>, <li>',
    body: ['<ul>은 목록 상자, <li>는 목록 한 줄이에요.', '태그 안에 태그를 넣는 것을 중첩이라고 해요. 안쪽 태그를 먼저 닫아요.'],
  },
  reward: 30,
};

export default commission;
