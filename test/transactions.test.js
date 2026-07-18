import test from 'node:test';
import assert from 'node:assert/strict';
import { createTransactionsState, getFilteredTransactions, validateTransaction } from '../transactions.js';

test('filters transactions by search, type, and category', () => {
  const state = createTransactionsState([
    { id: 1, type: 'expense', date: '2026-07-13', category: 'Dining', description: 'Dinner with team', amount: 42.5 },
    { id: 2, type: 'income', date: '2026-07-12', category: 'Salary', description: 'Monthly salary', amount: 3200 },
  ]);

  state.filters = { search: 'dinner', type: 'expense', category: 'all' };

  const filtered = getFilteredTransactions(state.transactions, state.filters);

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].description, 'Dinner with team');
});

test("rejects calendar-invalid dates and safely searches incomplete records", () => {
  assert.equal(validateTransaction({ type: "expense", date: "2026-02-30", category: "Dining", description: "Lunch", amount: 12 }), "Please enter a valid date.");
  assert.equal(getFilteredTransactions([{ type: "expense", date: "2026-07-01", category: "Dining", description: null, amount: 10 }], { search: "2026", type: "all", category: "all" }).length, 1);
});
