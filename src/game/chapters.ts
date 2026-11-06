export type PartNumber = 1 | 2 | 3 | 4 | 5;

export const PART_NAMES: Record<PartNumber, string> = { 1: 'HTML', 2: 'CSS', 3: 'JavaScript', 4: 'TypeScript', 5: 'React' };

export interface Chapter { number: number; part: PartNumber; title: string }

/** Curriculum order from the design doc. Chapters without commission files show as "준비 중". */
export const CHAPTERS: Chapter[] = [
  { number: 1, part: 1, title: '토끼 카페 첫 홈페이지' },
  { number: 2, part: 2, title: '글자와 색 (토끼 카페)' },
  { number: 3, part: 2, title: '상자 다루기 (곰 도서관)' },
  { number: 4, part: 2, title: '배치 (고양이 잡화점)' },
  { number: 5, part: 2, title: '마무리 디테일 (여우 사진관)' },
];

/** Commission ids are `<chapter>-<n>`, e.g. '1-4'. */
export const chapterOf = (commissionId: string) => Number(commissionId.split('-')[0]);
