import type { Commission } from '../../game/types';

const commission: Commission = {
  id: '1-9',
  part: 1,
  villager: 'rabbit',
  scene: 'rabbit-cafe',
  title: '주문 버튼 놓아줘',
  newConcepts: ['<button>'],
  lines: {
    intro: [
      '손님이 주문할 버튼도 있으면 좋겠어요.',
      '<button>으로 열고 </button>으로 닫으면 누를 수 있는 버튼이 돼요.',
      '에디터에서 메뉴 상자 아래 빈자리에 놓아주세요.',
    ],
    fail: {
      '<button> 만들기': '메뉴 아래에 <button>주문하기</button>를 넣어줄래요?',
      '<button> 안에 글자 쓰기': '버튼에 글자가 없어요. 주문하기라고 써줄래요?',
    },
    success: '주문 버튼이 생겼어요! 아직 눌러도 아무 일은 없지만요.',
  },
  starter: { html: `<h1>토끼네 카페</h1>
<p>당근 향 가득한 동네 카페예요</p>

<h2>메뉴</h2>
<div class="menu">
  <ul>
    <li><strong>당근케이크</strong></li>
    <li>딸기우유</li>
    <li>클로버 라떼</li>
  </ul>
  <img src="images/cake.svg" alt="당근케이크 한 조각">
  <a href="https://www.instagram.com/">인스타에서 만나요</a>
</div>
<!-- 여기에 주문 버튼을 놓아주세요 -->

<h2>오시는 길</h2>
<p>당근밭 사거리 왼쪽 골목</p>` },
  locked: ['css', 'js', 'ts'],
  frame: 'phone',
  checks: [
    { kind: 'exists', selector: 'button', label: '<button> 만들기' },
    { kind: 'filled', selector: 'button', label: '<button> 안에 글자 쓰기' },
  ],
  hint: {
    title: '힌트: 버튼 모양',
    body: ['메뉴 상자를 닫는 </div> 아래 주석 자리에 써요.'],
    code: '<button>버튼 글자</button>',
  },
  learn: {
    title: '<button> 버튼',
    body: [
      '<button>은 누를 수 있는 버튼이에요.',
      '여는 태그와 닫는 태그 사이에 버튼 글자를 써요.',
      '아직은 눌러도 아무 일도 없어요. 버튼이 일하게 하는 방법은 파트 3에서 배워요.',
    ],
    code: '<button>버튼 글자</button>',
  },
  recap: {
    title: '배운 것: <button>',
    body: ['<button>…</button>으로 버튼을 만들어요.', '지금까지 배운 태그로 카페 페이지가 거의 완성됐어요.'],
  },
  reward: 30,
};

export default commission;
