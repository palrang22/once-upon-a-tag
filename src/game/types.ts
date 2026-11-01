export type VillagerId = 'rabbit' | 'cat' | 'bear' | 'tiger' | 'fox' | 'dog';
export type SceneId = 'rabbit-cafe' | 'bear-library' | 'cat-shop' | 'fox-studio';
export type FileKind = 'html' | 'css' | 'js' | 'ts';
export type FrameKind = 'phone' | 'browser' | 'card';

export interface Note { title: string; body: string[]; code?: string; parts?: { code: string; text: string }[] }

/** 채점 조건. `label`은 의뢰 안에서 유일해야 한다(체크리스트 문구 겸 `lines.fail` 키). */
export type Check =
  | { kind: 'exists'; selector: string; label: string }
  | { kind: 'count'; selector: string; min: number; label: string }
  | { kind: 'text'; selector: string; equals: string[]; label: string }
  | { kind: 'filled'; selector: string; label: string }
  | { kind: 'attr'; selector: string; attr: string; equals?: string; label: string }
  | { kind: 'style'; selector: string; prop: string; equals: string; label: string }
  | { kind: 'layout'; selectors: [string, string]; rule: 'sameY' | 'sameX' | 'gapAtLeast'; px?: number; label: string }
  | { kind: 'hasHoverRule'; selector: string; label: string };

export interface Commission {
  id: string; // '1-4'
  part: 1 | 2 | 3 | 4 | 5;
  villager: VillagerId;
  scene: SceneId;
  title: string;
  newConcepts: string[];
  lines: { intro: string[]; fail: Record<string, string>; success: string };
  starter: { html: string; css?: string; ts?: string };
  locked: Exclude<FileKind, 'html'>[];
  frame: FrameKind;
  checks: Check[];
  reward: number;
  /** 힌트 보기(무료)를 누르면 뜨는 구조 힌트 쪽지. 정답 대신 모양을 보여준다. */
  hint: Note;
  /** 의뢰를 시작하기 전에 새 문법을 설명하는 쪽지. */
  learn: Note;
  /** 의뢰를 통과한 뒤 배운 개념을 다시 정리하는 쪽지. */
  recap: Note;
  /** 신뢰할 수 있는 정적 SVG 목업 마크업. 인라인으로 그려 게임 웹폰트를 상속한다. */
  mockup?: string;
}

export interface CheckResult {
  label: string;
  pass: boolean;
  /** count 검사의 현재 개수 등, 체크리스트에 덧붙일 정보 */
  actual?: number;
}
