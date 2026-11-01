import { describe, expect, it } from 'vitest';
import { lintHtml } from './htmlLint';

const finishedCafe = `<h1>토끼네 카페</h1>
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
<button>주문하기</button>
<h2>오시는 길</h2>
<p>당근밭 사거리 왼쪽 골목</p>`;

const messages = (source: string) => lintHtml(source).map(issue => issue.message);

describe('lintHtml', () => {
  it('accepts a correctly nested page', () => {
    expect(lintHtml(finishedCafe)).toEqual([]);
  });

  it('rejects a heading reopened instead of closed', () => {
    expect(lintHtml('<h1>토끼네 카페<h1>')).toEqual([
      { line: 1, column: 1, length: 4, message: '<h1> 태그를 열었는데 닫는 </h1> 태그가 없어요.' },
      { line: 1, column: 11, length: 4, message: '<h1> 태그 안에는 <h1> 태그를 넣을 수 없어요. </h1> 태그로 먼저 닫아 주세요.' },
      { line: 1, column: 11, length: 4, message: '<h1> 태그를 열었는데 닫는 </h1> 태그가 없어요.' },
    ]);
  });

  it('requires list items inside a list', () => {
    expect(lintHtml('<li>라떼</li>')).toEqual([{ line: 1, column: 1, length: 4, message: '<li> 태그는 <ul> 태그 안에 넣어 주세요.' }]);
  });

  it('points at bare text directly inside a list', () => {
    expect(lintHtml('<ul>\n  라떼\n</ul>')).toEqual([{ line: 2, column: 3, length: 2, message: '<ul> 태그 바로 안의 글자는 <li> 태그로 감싸 주세요.' }]);
  });

  it('rejects closing a void element', () => {
    expect(messages('<img src="a.svg"></img>')).toEqual(['<img> 태그는 닫는 태그가 없어요. </img> 태그를 지워 주세요.']);
  });

  it('reports crossed closing order', () => {
    expect(messages('<p><strong>a</p></strong>')).toEqual([
      '<strong> 태그를 </p> 태그보다 먼저 닫아 주세요.',
      '</strong> 태그와 짝이 되는 <strong> 태그가 없어요.',
    ]);
  });

  it('reports an unclosed comment', () => {
    expect(messages('<!-- 메모')).toEqual(['주석 <!-- 을 --> 로 닫아 주세요.']);
  });

  it('reports an unclosed attribute quote', () => {
    expect(messages('<img src="a.svg>')).toEqual(['<img> 태그의 속성 값 따옴표를 닫아 주세요.']);
  });

  it('reports misspelled tag names', () => {
    expect(messages('<hl>제목</hl>')).toEqual(['<hl> 태그는 모르는 태그예요. 철자를 확인해 주세요.']);
  });

  it('orders issues by source position', () => {
    expect(lintHtml('<h1>a</h1>\n<p>b\n<h2>c</h2>').map(({ line, message }) => [line, message])).toEqual([
      [2, '<p> 태그를 열었는데 닫는 </p> 태그가 없어요.'],
      [3, '<p> 태그 안에는 <h2> 태그를 넣을 수 없어요. </p> 태그로 먼저 닫아 주세요.'],
    ]);
  });
});
