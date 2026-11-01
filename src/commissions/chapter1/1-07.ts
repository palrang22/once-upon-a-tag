import type { Commission } from '../../game/types';

const commission: Commission = {
  id: '1-7',
  part: 1,
  villager: 'rabbit',
  scene: 'rabbit-cafe',
  title: '인스타 링크 달아줘',
  newConcepts: ['<a>', 'href'],
  lines: {
    intro: [
      '손님이 카페 소식을 찾아볼 수 있게 링크를 달고 싶어요.',
      '<a>와 </a> 사이에는 누를 글자를 적어요.',
      'href에는 갈 주소를 넣어요. 에디터의 그림 아래를 채워주세요.',
    ],
    fail: {
      '<a>에 href 주소 넣기': '인스타 링크를 <a>로 만들고 href에 주소를 넣어주세요.',
      '<a> 안에 링크 글자 쓰기': '링크 글자가 없으면 손님이 누를 수 없어요. <a>와 </a> 사이에 글자를 써주세요.',
    },
    success: '손님이 링크를 눌러 카페 소식도 볼 수 있겠어요!',
  },
  starter: { html: `<h1>토끼네 카페</h1>
<p>당근 향 가득한 동네 카페예요</p>

<h2>메뉴</h2>
<ul>
  <li><strong>당근케이크</strong></li>
  <li>딸기우유</li>
  <li>클로버 라떼</li>
</ul>
<img src="images/cake.svg" alt="당근케이크 한 조각">
<!-- 여기에 인스타 링크를 달아주세요 -->

<h2>오시는 길</h2>
<p>당근밭 사거리 왼쪽 골목</p>` },
  locked: ['css', 'js', 'ts'],
  frame: 'phone',
  checks: [
    { kind: 'attr', selector: 'a', attr: 'href', label: '<a>에 href 주소 넣기' },
    { kind: 'filled', selector: 'a', label: '<a> 안에 링크 글자 쓰기' },
  ],
  hint: {
    title: '힌트: 링크 모양',
    body: ['그림 아래 주석 자리에 써요. 주소는 https://www.instagram.com/ 을 써도 돼요.'],
    code: '<a href="갈 주소">누를 글자</a>',
  },
  learn: {
    title: '<a> 링크',
    body: ['<a>는 누르면 다른 곳으로 가는 링크예요.', 'href 속성에 갈 주소를, 여는 태그와 닫는 태그 사이에 누를 글자를 써요.'],
    parts: [
      { code: '<a href="https://…">', text: '링크 시작 + 갈 주소' },
      { code: '누를 글자', text: '화면에 보이는 링크 글자' },
      { code: '</a>', text: '링크 끝' },
    ],
  },
  recap: {
    title: '배운 것: <a>',
    body: ['<a href="주소">글자</a>로 링크를 만들어요.', '<img>의 src처럼 href도 태그에 붙이는 속성이에요.'],
  },
  reward: 30,
};

export default commission;
