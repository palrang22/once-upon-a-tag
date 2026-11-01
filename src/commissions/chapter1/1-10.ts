import type { Commission } from '../../game/types';
import mockup from '../../assets/mockups/rabbit-cafe-mockup.svg?raw';

const commission: Commission = {
  id: '1-10',
  part: 1,
  villager: 'rabbit',
  scene: 'rabbit-cafe',
  title: '손그림 보고 홈페이지 만들기',
  newConcepts: ['지금까지 배운 HTML'],
  lines: {
    intro: [
      '이번에는 제가 그린 홈페이지 그림을 보고 처음부터 만들어주세요!',
      '에디터는 비어 있어요. 그림의 간판은 <h1>, 작은 제목은 <h2>예요.',
      '글, 메뉴 목록, 그림, 링크, 버튼까지 하나씩 적어주세요.',
    ],
    fail: {
      '간판 <h1>에 토끼네 카페': '큰 간판 <h1>에 토끼네 카페라고 적어주세요.',
      '간판 바로 아래 소개 <p>': '<h1> 바로 아래에 카페 소개 글 <p>를 놓아주세요.',
      '작은 제목 <h2> 메뉴, 오시는 길': '메뉴와 오시는 길을 <h2>로 각각 나눠주세요.',
      'menu 상자 안에 목록': 'class="menu" 상자 안에 <ul>을 담아주세요.',
      'menu 목록에 메뉴 세 개': 'menu 상자의 목록에 <li> 메뉴 세 개를 적어주세요.',
      '추천 메뉴 당근케이크 <strong>': '목록의 당근케이크를 <strong>으로 감싸주세요.',
      '케이크 그림 src': '케이크 그림 <img>에 src="images/cake.svg"를 적어주세요.',
      '케이크 그림 alt': '케이크 그림 <img>에 alt로 그림 설명을 적어주세요.',
      '인스타 링크 href': '인스타 링크 <a>에 href 주소를 넣어주세요.',
      '주문 <button>': '주문하기 <button>에 글자를 넣어 놓아주세요.',
    },
    success: '우와, 손그림 그대로 토끼네 카페 첫 홈페이지가 완성됐어요! 정말 고마워요.',
  },
  starter: { html: '' },
  locked: ['css', 'js', 'ts'],
  frame: 'phone',
  mockup,
  checks: [
    { kind: 'text', selector: 'h1', equals: ['토끼네 카페'], label: '간판 <h1>에 토끼네 카페' },
    { kind: 'exists', selector: 'h1 + p', label: '간판 바로 아래 소개 <p>' },
    { kind: 'text', selector: 'h2', equals: ['메뉴', '오시는 길'], label: '작은 제목 <h2> 메뉴, 오시는 길' },
    { kind: 'exists', selector: 'div.menu > ul', label: 'menu 상자 안에 목록' },
    { kind: 'count', selector: 'div.menu > ul > li', min: 3, label: 'menu 목록에 메뉴 세 개' },
    { kind: 'text', selector: 'li > strong', equals: ['당근케이크'], label: '추천 메뉴 당근케이크 <strong>' },
    { kind: 'attr', selector: 'img', attr: 'src', equals: 'images/cake.svg', label: '케이크 그림 src' },
    { kind: 'attr', selector: 'img', attr: 'alt', label: '케이크 그림 alt' },
    { kind: 'attr', selector: 'a', attr: 'href', label: '인스타 링크 href' },
    { kind: 'filled', selector: 'button', label: '주문 <button>' },
  ],
  hint: {
    title: '힌트: 페이지 뼈대',
    body: ['목업 순서대로 뼈대를 먼저 쓰고, … 자리를 채워요.'],
    code: '<h1>…</h1>\n<p>…</p>\n<h2>…</h2>\n<div class="menu">\n  <ul>\n    <li><strong>…</strong></li>\n    <li>…</li>\n    <li>…</li>\n  </ul>\n  <img src="…" alt="…">\n  <a href="…">…</a>\n</div>\n<button>…</button>\n<h2>…</h2>\n<p>…</p>',
  },
  learn: {
    title: '지금까지 배운 태그 모음',
    body: ['손그림 목업을 보고 빈 에디터에 처음부터 써요.', '위에서 아래 순서대로 하나씩 쓰고, 미리보기로 확인해요.'],
    code: '<h1>…</h1>  큰 제목\n<p>…</p>  문단\n<h2>…</h2>  작은 제목\n<ul><li>…</li></ul>  목록\n<strong>…</strong>  강조\n<img src="…" alt="…">  그림\n<a href="…">…</a>  링크\n<div class="…">…</div>  묶음 상자\n<button>…</button>  버튼',
  },
  recap: {
    title: '파트 1 완성!',
    body: ['열고 닫는 태그, 중첩, 속성까지 HTML 기본을 모두 써 봤어요.', '다음 파트에서는 CSS로 카페를 예쁘게 꾸며요.'],
  },
  reward: 100,
};

export default commission;
