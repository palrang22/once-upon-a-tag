export interface LintIssue { line: number; column: number; length: number; message: string }
export const SYNTAX_LABEL = '태그를 모두 바르게 열고 닫기';

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const KNOWN = new Set(['html', 'head', 'body', 'title', 'meta', 'link', 'style', 'script', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'u', 'small', 'span', 'div', 'a', 'img', 'button', 'section', 'header', 'footer', 'main', 'nav', 'article', 'aside', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'form', 'input', 'label', 'textarea', 'select', 'option', 'blockquote', 'code', 'pre']);
const LIST = new Set(['ul', 'ol']);
const INLINE_ONLY = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'b', 'i', 'span', 'button', 'a']);
const BLOCK = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'div']);
const LETTER = /[A-Za-z]/;
const NAME = /[A-Za-z][A-Za-z0-9-]*/y;

interface Open { name: string; at: number; length: number }

/** Checks the player's source, which the browser would otherwise silently repair before DOM grading. */
export function lintHtml(source: string): LintIssue[] {
  const found: { at: number; length: number; message: string }[] = [];
  const add = (at: number, length: number, message: string) => found.push({ at, length: Math.max(1, length), message });
  const stack: Open[] = [];
  const readName = (from: number) => {
    NAME.lastIndex = from;
    return NAME.exec(source)?.[0] ?? '';
  };
  const text = (from: number, to: number) => {
    const parent = stack.at(-1)?.name;
    if (!parent || !LIST.has(parent)) return;
    const segment = source.slice(from, to);
    const trimmed = segment.trim();
    if (trimmed) add(from + segment.search(/\S/), trimmed.length, `<${parent}> 태그 바로 안의 글자는 <li> 태그로 감싸 주세요.`);
  };

  let i = 0;
  scan: while (i < source.length) {
    if (source[i] !== '<') {
      const next = source.indexOf('<', i);
      const end = next === -1 ? source.length : next;
      text(i, end);
      i = end;
      continue;
    }
    if (source.startsWith('<!--', i)) {
      const close = source.indexOf('-->', i + 4);
      if (close === -1) { add(i, 4, '주석 <!-- 을 --> 로 닫아 주세요.'); break; }
      i = close + 3;
      continue;
    }
    if (source[i + 1] === '!') {
      const close = source.indexOf('>', i);
      i = close === -1 ? source.length : close + 1;
      continue;
    }
    if (source[i + 1] === '/' && LETTER.test(source[i + 2] ?? '')) {
      const raw = readName(i + 2);
      const name = raw.toLowerCase();
      let k = i + 2 + raw.length;
      while (k < source.length && source[k] !== '>' && source[k] !== '<') k++;
      const terminated = source[k] === '>';
      const end = terminated ? k + 1 : k;
      if (!terminated) add(i, end - i, `<${name} 태그 끝에 > 를 써 주세요.`);
      if (VOID.has(name)) add(i, end - i, `<${name}> 태그는 닫는 태그가 없어요. </${name}> 태그를 지워 주세요.`);
      else {
        const match = stack.findLastIndex(open => open.name === name);
        if (match === -1) add(i, end - i, `</${name}> 태그와 짝이 되는 <${name}> 태그가 없어요.`);
        else {
          for (let s = stack.length - 1; s > match; s--) add(stack[s].at, stack[s].length, `<${stack[s].name}> 태그를 </${name}> 태그보다 먼저 닫아 주세요.`);
          stack.length = match;
        }
      }
      i = end;
      continue;
    }
    if (LETTER.test(source[i + 1] ?? '')) {
      const raw = readName(i + 1);
      const name = raw.toLowerCase();
      let k = i + 1 + raw.length;
      let quote = '';
      let lastNonSpace = '';
      while (k < source.length) {
        const c = source[k];
        if (quote) { if (c === quote) quote = ''; k++; continue; }
        if (c === '"' || c === "'") { quote = c; k++; continue; }
        if (c === '>' || c === '<') break;
        if (!/\s/.test(c)) lastNonSpace = c;
        k++;
      }
      if (quote) { add(i, k - i, `<${name}> 태그의 속성 값 따옴표를 닫아 주세요.`); break; }
      const terminated = source[k] === '>';
      const end = terminated ? k + 1 : k;
      const selfClosing = terminated && lastNonSpace === '/';
      if (!terminated) add(i, end - i, `<${name} 태그 끝에 > 를 써 주세요.`);
      if (!KNOWN.has(name)) add(i, end - i, `<${name}> 태그는 모르는 태그예요. 철자를 확인해 주세요.`);
      const parent = stack.at(-1)?.name;
      if (name === 'li' && (!parent || !LIST.has(parent))) add(i, end - i, '<li> 태그는 <ul> 태그 안에 넣어 주세요.');
      else if (parent && LIST.has(parent) && name !== 'li') add(i, end - i, `<${parent}> 태그 바로 안에는 <li> 태그만 넣을 수 있어요.`);
      else if (parent && INLINE_ONLY.has(parent) && BLOCK.has(name)) add(i, end - i, `<${parent}> 태그 안에는 <${name}> 태그를 넣을 수 없어요. </${parent}> 태그로 먼저 닫아 주세요.`);
      if (VOID.has(name)) { i = end; continue; }
      if (selfClosing) { add(i, end - i, `<${name}/> 처럼 닫을 수 없어요. 닫는 </${name}> 태그를 따로 써 주세요.`); i = end; continue; }
      if (name === 'script' || name === 'style') {
        const closer = new RegExp(`</${name}`, 'gi');
        closer.lastIndex = end;
        const match = closer.exec(source);
        if (!match) { add(i, end - i, `<${name}> 태그를 열었는데 닫는 </${name}> 태그가 없어요.`); break scan; }
        const close = source.indexOf('>', match.index);
        i = close === -1 ? source.length : close + 1;
        continue;
      }
      stack.push({ name, at: i, length: end - i });
      i = end;
      continue;
    }
    const next = source.indexOf('<', i + 1);
    const end = next === -1 ? source.length : next;
    text(i, end);
    i = end;
  }
  for (const open of stack) add(open.at, open.length, `<${open.name}> 태그를 열었는데 닫는 </${open.name}> 태그가 없어요.`);

  const lineStarts = [0];
  for (let c = 0; c < source.length; c++) if (source[c] === '\n') lineStarts.push(c + 1);
  return found
    .map((issue, order) => {
      let line = lineStarts.length - 1;
      while (lineStarts[line] > issue.at) line--;
      return { order, line: line + 1, column: issue.at - lineStarts[line] + 1, length: issue.length, message: issue.message };
    })
    .sort((a, b) => a.line - b.line || a.column - b.column || a.order - b.order)
    .map(({ line, column, length, message }) => ({ line, column, length, message }));
}
