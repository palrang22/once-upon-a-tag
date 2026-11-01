import { describe, expect, it } from 'vitest';
import { lintHtml } from '../game/htmlLint';
import { commissions } from '../game/progress';

describe('chapter 1 commissions', () => {
  it.each(commissions.map(c => [c.id, c] as const))('%s has a failure line for exactly each check', (_id, commission) => {
    expect(Object.keys(commission.lines.fail).sort()).toEqual(commission.checks.map(check => check.label).sort());
  });

  it.each(commissions.map(c => [c.id, c] as const))('%s starts from syntactically valid code', (_id, commission) => {
    expect(lintHtml(commission.starter.html)).toEqual([]);
  });
});
