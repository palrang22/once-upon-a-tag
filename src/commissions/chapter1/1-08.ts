import type { Commission } from '../../game/types';

const commission: Commission = {
  id: '1-8',
  part: 1,
  villager: 'rabbit',
  scene: 'rabbit-cafe',
  title: '메뉴 부분 묶기',
  newConcepts: ['<div>', 'class'],
  lines: {
    intro: [
      '메뉴 부분을 하나로 묶고 싶어요.',
      '<div>는 여러 내용을 담는 상자이고 </div>로 닫아요.',
      'class="menu"는 이 상자에 붙이는 이름이에요.',
      '에디터의 두 빈자리 사이에 목록이 오게 해주세요.',
    ],
    fail: { 'class="menu"인 <div> 안에 <ul> 넣기': '목록 <ul>을 class="menu"인 <div> 안에 넣어주세요.' },
    success: '메뉴를 묶어줘서 고마워요! 이 부분만 나중에 예쁘게 하고 싶어서요.',
  },
  starter: { html: `<h1>토끼네 카페</h1>
<p>당근 향 가득한 동네 카페예요</p>

<h2>메뉴</h2>
<!-- 여기에 menu 상자를 열어주세요 -->
<ul>
  <li><strong>당근케이크</strong></li>
  <li>딸기우유</li>
  <li>클로버 라떼</li>
</ul>
<img src="images/cake.svg" alt="당근케이크 한 조각">
<a href="https://www.instagram.com/">인스타에서 만나요</a>
<!-- 여기에 menu 상자를 닫아주세요 -->

<h2>오시는 길</h2>
<p>당근밭 사거리 왼쪽 골목</p>` },
  locked: ['css', 'js', 'ts'],
  frame: 'phone',
  checks: [{ kind: 'exists', selector: 'div.menu > ul', label: 'class="menu"인 <div> 안에 <ul> 넣기' }],
  hint: {
    title: '힌트: 상자 모양',
    body: ['첫 번째 주석 자리에서 상자를 열고, 두 번째 주석 자리에서 닫아요. 목록, 그림, 링크가 상자 안에 들어가요.'],
    code: '<div class="menu">\n  ...묶을 내용...\n</div>',
  },
  learn: {
    title: '<div> 상자와 class 이름표',
    body: [
      '<div>는 여러 태그를 하나로 묶는 상자예요. 화면에는 따로 보이지 않아요.',
      'class 속성은 상자에 붙이는 이름표예요. 나중에 이 이름으로 이 부분만 꾸밀 수 있어요.',
    ],
    code: '<div class="이름">\n  <p>묶을 내용</p>\n</div>',
  },
  recap: {
    title: '배운 것: <div>, class',
    body: ['<div>는 묶음 상자, class는 그 상자의 이름표예요.', '상자 안쪽 줄을 두 칸 들여 쓰면 어디까지 묶였는지 잘 보여요.'],
  },
  reward: 30,
};

export default commission;
