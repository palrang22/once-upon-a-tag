import type { Commission } from '../../game/types';

const commission: Commission = {
  id: '1-3',
  part: 1,
  villager: 'rabbit',
  scene: 'rabbit-cafe',
  title: '메뉴와 오시는 길 나눠줘',
  newConcepts: ['<h2>'],
  lines: {
    intro: [
      '메뉴와 오시는 길을 따로 보여주고 싶어요.',
      '작은 제목은 <h2>로 열고 </h2>로 닫아요.',
      '에디터의 두 빈자리에 작은 제목을 하나씩 적어주세요.',
    ],
    fail: {
      '<h2> 두 개 만들기': '메뉴와 오시는 길 제목을 <h2>로 각각 써줄래요?',
      '<h2>에 메뉴, 오시는 길 쓰기': '작은 제목을 메뉴, 오시는 길로 하나씩 써줄래요?',
    },
    success: '메뉴와 오시는 길이 구분돼서 읽기 좋아요!',
  },
  starter: { html: `<h1>토끼네 카페</h1>
<p>당근 향 가득한 동네 카페예요</p>

<!-- 여기에 메뉴 제목을 써주세요 -->

<!-- 여기에 오시는 길 제목을 써주세요 -->
<p>당근밭 사거리 왼쪽 골목</p>` },
  locked: ['css', 'js', 'ts'],
  frame: 'phone',
  checks: [
    { kind: 'count', selector: 'h2', min: 2, label: '<h2> 두 개 만들기' },
    { kind: 'text', selector: 'h2', equals: ['메뉴', '오시는 길'], label: '<h2>에 메뉴, 오시는 길 쓰기' },
  ],
  hint: {
    title: '힌트: 작은 제목 모양',
    body: ['두 주석 자리를 각각 이 모양으로 바꿔요. 칸 이름은 메뉴, 오시는 길이에요.'],
    code: '<h2>칸 이름</h2>',
  },
  learn: {
    title: '<h2> 작은 제목',
    body: [
      '<h2>는 <h1>보다 한 단계 작은 제목이에요.',
      '페이지를 여러 칸으로 나눌 때 칸마다 제목을 달아요.',
      'h 뒤 숫자가 클수록 작은 제목이에요. <h1>부터 <h6>까지 있어요.',
    ],
    code: '<h1>큰 제목</h1>\n<h2>작은 제목</h2>',
  },
  recap: {
    title: '배운 것: <h2>',
    body: ['<h1>은 페이지 전체 제목, <h2>는 칸 제목이에요.', '제목 단계를 지키면 읽는 사람이 구조를 알기 쉬워요.'],
  },
  reward: 30,
};

export default commission;
