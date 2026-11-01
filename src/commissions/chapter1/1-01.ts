import type { Commission } from '../../game/types';

const commission: Commission = {
  id: '1-1',
  part: 1,
  villager: 'rabbit',
  scene: 'rabbit-cafe',
  title: '간판 달아줘',
  newConcepts: ['<h1>'],
  lines: {
    intro: [
      '카페 문 위에 이름 간판을 달고 싶어요!',
      '큰 제목은 <h1>로 열고 </h1>로 닫아요.',
      '에디터의 빈자리에 카페 이름을 넣어줄래요?',
    ],
    fail: { '<h1>에 토끼네 카페 쓰기': '간판 <h1> 안에 토끼네 카페라고 딱 맞게 써줄래요?' },
    success: '카페 간판이 생겼어요! 이제 멀리서도 찾을 수 있겠어요.',
  },
  starter: { html: '<!-- 여기에 카페 이름 간판을 달아주세요 -->' },
  locked: ['css', 'js', 'ts'],
  frame: 'phone',
  checks: [{ kind: 'text', selector: 'h1', equals: ['토끼네 카페'], label: '<h1>에 토끼네 카페 쓰기' }],
  hint: {
    title: '힌트: 큰 제목 모양',
    body: ['주석 줄을 지우고 이 모양으로 써요. 가운데에 카페 이름을 넣어요.'],
    code: '<h1>카페 이름</h1>',
  },
  learn: {
    title: '<h1> 큰 제목',
    body: ['<h1>은 페이지에서 가장 큰 제목이에요. 보통 한 페이지에 하나만 써요.', '<h1>로 열고 </h1>로 닫아요.'],
    parts: [
      { code: '<h1>', text: '큰 제목 시작' },
      { code: '제목 글자', text: '화면에 크게 보여요' },
      { code: '</h1>', text: '큰 제목 끝 (/ 잊지 않기!)' },
    ],
  },
  recap: {
    title: '배운 것: <h1>',
    body: ['<h1>…</h1>은 가장 큰 제목이에요.', '태그는 열었으면 꼭 같은 이름으로 닫아요.'],
    code: '<h1>토끼네 카페</h1>',
  },
  reward: 30,
};

export default commission;
