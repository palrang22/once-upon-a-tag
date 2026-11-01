import type { Commission } from '../../game/types';

const commission: Commission = {
  id: '1-2',
  part: 1,
  villager: 'rabbit',
  scene: 'rabbit-cafe',
  title: '소개 한 줄',
  newConcepts: ['<p>'],
  lines: {
    intro: [
      '이제 간판 아래에 카페를 소개하고 싶어요.',
      '한 줄 글은 <p>로 열고 </p>로 닫아요.',
      '에디터에서 간판 바로 아래 빈자리를 채워주세요.',
    ],
    fail: {
      '<h1> 바로 아래에 <p> 쓰기': '간판 바로 아래에 <p>로 소개 글을 넣어줄래요?',
      '<p> 안에 소개 글 쓰기': '<p> 안이 비어 있어요. 카페 소개를 적어주세요.',
    },
    success: '소개 글도 보이네요! 당근 향이 나는 것 같아요.',
  },
  starter: { html: `<h1>토끼네 카페</h1>
<!-- 여기에 카페 소개 한 줄을 써주세요 -->` },
  locked: ['css', 'js', 'ts'],
  frame: 'phone',
  checks: [
    { kind: 'exists', selector: 'h1 + p', label: '<h1> 바로 아래에 <p> 쓰기' },
    { kind: 'filled', selector: 'h1 + p', label: '<p> 안에 소개 글 쓰기' },
  ],
  hint: {
    title: '힌트: 문단 모양',
    body: ['<h1> 줄 바로 아래 주석 자리에 이 모양으로 써요.'],
    code: '<p>카페 소개 글</p>',
  },
  learn: {
    title: '<p> 문단',
    body: ['<p>는 글 한 덩어리(문단)를 담아요.', '제목 아래 설명 글을 쓸 때 써요.'],
    parts: [
      { code: '<p>', text: '문단 시작' },
      { code: '소개 글', text: '화면에 보이는 글' },
      { code: '</p>', text: '문단 끝' },
    ],
  },
  recap: {
    title: '배운 것: <p>',
    body: ['<p>…</p>는 문단이에요.', '제목은 <h1>, 설명 글은 <p>. 태그마다 하는 일이 달라요.'],
    code: '<h1>토끼네 카페</h1>\n<p>당근 향 가득한 동네 카페예요</p>',
  },
  reward: 30,
};

export default commission;
