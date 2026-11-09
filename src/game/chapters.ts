import type { VillagerId } from './types';

export type PartNumber = 1 | 2 | 3 | 4 | 5;

export const PART_NAMES: Record<PartNumber, string> = { 1: 'HTML', 2: 'CSS', 3: 'JavaScript', 4: 'TypeScript', 5: 'React' };

export interface Chapter { number: number; part: PartNumber; title: string; villager: VillagerId }

/** Curriculum order (PLAN.md). Chapters without commission files show as "준비 중". */
export const CHAPTERS: Chapter[] = [
  { number: 1, part: 1, title: '토끼 카페 첫 홈페이지', villager: 'rabbit' },
  { number: 2, part: 2, title: '글자와 색 (토끼 카페)', villager: 'rabbit' },
  { number: 3, part: 2, title: '상자 다루기 (곰 도서관)', villager: 'bear' },
  { number: 4, part: 2, title: '배치 (고양이 잡화점)', villager: 'cat' },
  { number: 5, part: 2, title: '마무리 디테일 (여우 사진관)', villager: 'fox' },
  { number: 6, part: 3, title: '버튼을 일하게 하기 (강아지 간식가게)', villager: 'dog' },
  { number: 7, part: 3, title: '조건과 반복 (호랑이 체육관)', villager: 'tiger' },
  { number: 8, part: 3, title: '데이터로 화면 만들기 (고양이 잡화점)', villager: 'cat' },
  { number: 9, part: 4, title: '타입 기초 (곰 도서관)', villager: 'bear' },
  { number: 10, part: 4, title: '타입 좁히기 (여우 사진관)', villager: 'fox' },
  { number: 11, part: 4, title: '다시 쓰는 타입 (강아지 간식가게)', villager: 'dog' },
  { number: 12, part: 5, title: '컴포넌트와 props (호랑이 체육관)', villager: 'tiger' },
  { number: 13, part: 5, title: '상태와 주문 (고양이 잡화점)', villager: 'cat' },
];

/** Commission ids are `<chapter>-<n>`, e.g. '1-4'. */
export const chapterOf = (commissionId: string) => Number(commissionId.split('-')[0]);
