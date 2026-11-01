import type { Commission } from '../../game/types';

const commission: Commission = {
  id: '1-6',
  part: 1,
  villager: 'rabbit',
  scene: 'rabbit-cafe',
  title: '케이크 사진 보여줘',
  newConcepts: ['<img>', 'src', 'alt'],
  lines: {
    intro: [
      '메뉴 아래에 케이크 그림을 보여주고 싶어요.',
      '<img>는 그림을 놓는 태그라 닫는 태그가 없어요.',
      'src에는 images/cake.svg를, alt에는 그림 설명을 적어요.',
      '에디터의 메뉴 아래 빈자리에 넣어주세요.',
    ],
    fail: {
      '<img>의 src에 images/cake.svg': '그림 주소를 src="images/cake.svg"로 적어줄래요?',
      '<img>에 alt 설명 쓰기': '그림을 못 보는 손님을 위해 alt에 케이크 설명을 적어주세요.',
    },
    success: '케이크 그림까지 보이니 카페 메뉴가 더 맛있어 보여요!',
  },
  starter: { html: `<h1>토끼네 카페</h1>
<p>당근 향 가득한 동네 카페예요</p>

<h2>메뉴</h2>
<ul>
  <li><strong>당근케이크</strong></li>
  <li>딸기우유</li>
  <li>클로버 라떼</li>
</ul>
<!-- 여기에 케이크 그림을 넣어주세요 -->

<h2>오시는 길</h2>
<p>당근밭 사거리 왼쪽 골목</p>` },
  locked: ['css', 'js', 'ts'],
  frame: 'phone',
  checks: [
    { kind: 'attr', selector: 'img', attr: 'src', equals: 'images/cake.svg', label: '<img>의 src에 images/cake.svg' },
    { kind: 'attr', selector: 'img', attr: 'alt', label: '<img>에 alt 설명 쓰기' },
  ],
  hint: {
    title: '힌트: 그림 모양',
    body: ['주석 자리에 이 모양으로 써요. 속성 값은 큰따옴표 " " 안에 넣어요.'],
    code: '<img src="그림 주소" alt="그림 설명">',
  },
  learn: {
    title: '<img> 그림과 속성',
    body: [
      '<img>는 그림을 놓는 태그예요. 감쌀 내용이 없어서 닫는 태그가 없어요.',
      '태그 안에 이름="값" 모양으로 붙이는 정보를 속성이라고 해요.',
    ],
    parts: [
      { code: '<img', text: '그림 태그 시작' },
      { code: 'src="images/cake.svg"', text: 'src 속성: 그림 파일 주소' },
      { code: 'alt="그림 설명"', text: 'alt 속성: 그림이 안 보일 때 대신 읽어 주는 설명' },
      { code: '>', text: '태그 끝. </img>는 쓰지 않아요' },
    ],
  },
  recap: {
    title: '배운 것: 속성과 <img>',
    body: ['속성은 태그에 붙이는 추가 정보예요: 이름="값".', '<img>처럼 닫는 태그가 없는 태그도 있어요.'],
    code: '<img src="images/cake.svg" alt="당근케이크 한 조각">',
  },
  reward: 30,
};

export default commission;
