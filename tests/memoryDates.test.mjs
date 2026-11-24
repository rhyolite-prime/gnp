import test from 'node:test';
import assert from 'node:assert/strict';
import { memoryDates } from '../utils/memoryDates.mjs';

test('memories use 30 actual days and the previous calendar anniversary', () => {
  assert.deepEqual(memoryDates(new Date(2026, 10, 13)), [
    { label: '30 days ago', date: '2026-10-14' },
    { label: 'A year ago', date: '2025-11-13' },
  ]);
});
test('anniversaries clamp leap day to February 28', () => {
  assert.deepEqual(memoryDates(new Date(2024, 1, 29)), [
    { label: '30 days ago', date: '2024-01-30' },
    { label: 'A year ago', date: '2023-02-28' },
  ]);
});
test('30 days ago crosses the year boundary', () => {
  assert.equal(memoryDates(new Date(2026, 0, 10))[0].date, '2025-12-11');
});
