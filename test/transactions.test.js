import test from "node:test";
import assert from "node:assert/strict";
import {
  createTransactionsState,
  getFilteredTransactions,
  validateTransaction,
  formatCurrency,
  TRANSACTION_CATEGORIES,
  RECURRING_FREQUENCIES,
} from "../transactions.js";

test("createTransactionsState returns sensible defaults", () => {
  const state = createTransactionsState();
  assert.deepEqual(state.transactions, []);
  assert.deepEqual(state.filters, { search: "", type: "all", category: "all" });
  assert.equal(state.editingId, null);
});

test("filters transactions by search, type, and category", () => {
  const state = createTransactionsState([
    { id: 1, type: "expense", date: "2026-07-13", category: "Dining", description: "Dinner with team", amount: 42.5 },
    { id: 2, type: "income", date: "2026-07-12", category: "Salary", description: "Monthly salary", amount: 3200 },
  ]);

  state.filters = { search: "dinner", type: "expense", category: "all" };
  const filtered = getFilteredTransactions(state.transactions, state.filters);

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].description, "Dinner with team");
});

test("getFilteredTransactions matches on category and date too", () => {
  const transactions = [
    { id: 1, type: "expense", date: "2026-07-13", category: "Dining", description: "Lunch", amount: 12 },
    { id: 2, type: "expense", date: "2026-01-01", category: "Travel", description: "Flight", amount: 300 },
  ];
  assert.equal(getFilteredTransactions(transactions, { search: "travel", type: "all", category: "all" }).length, 1);
  assert.equal(getFilteredTransactions(transactions, { search: "2026-01-01", type: "all", category: "all" }).length, 1);
  assert.equal(getFilteredTransactions(transactions, { search: "", type: "all", category: "Dining" }).length, 1);
});

test("formatCurrency renders USD with two decimal places", () => {
  assert.equal(formatCurrency(1234.5), "$1,234.50");
  assert.equal(formatCurrency(0), "$0.00");
  assert.equal(formatCurrency(-42), "-$42.00");
});

test("validateTransaction requires all fields", () => {
  const error = validateTransaction({ type: "expense", date: "", category: "", description: "" });
  assert.equal(error, "Please complete all fields.");
});

test("validateTransaction rejects an invalid calendar date", () => {
  const payload = { type: "expense", date: "2026-02-30", category: "Dining", description: "Test", amount: 10 };
  assert.equal(validateTransaction(payload), "Please enter a valid date.");
});

test("validateTransaction rejects unknown categories", () => {
  const payload = { type: "expense", date: "2026-07-01", category: "Not A Category", description: "Test", amount: 10 };
  assert.equal(validateTransaction(payload), "Please choose a valid category.");
});

test("validateTransaction enforces description length bounds", () => {
  const base = { type: "expense", date: "2026-07-01", category: "Dining", amount: 10 };
  assert.equal(validateTransaction({ ...base, description: "a" }), "Description must be between 2 and 140 characters.");
  assert.equal(validateTransaction({ ...base, description: "a".repeat(141) }), "Description must be between 2 and 140 characters.");
});

test("validateTransaction rejects non-positive or absurd amounts", () => {
  const base = { type: "expense", date: "2026-07-01", category: "Dining", description: "Test meal" };
  assert.equal(validateTransaction({ ...base, amount: 0 }), "Please enter a valid amount greater than 0.");
  assert.equal(validateTransaction({ ...base, amount: -5 }), "Please enter a valid amount greater than 0.");
  assert.equal(validateTransaction({ ...base, amount: Number.NaN }), "Please enter a valid amount greater than 0.");
  assert.equal(validateTransaction({ ...base, amount: 200000000 }), "Please enter a valid amount greater than 0.");
});

test("validateTransaction requires a valid frequency when recurring", () => {
  const payload = { type: "expense", date: "2026-07-01", category: "Dining", description: "Test", amount: 10, recurring: true, frequency: "biweekly" };
  assert.equal(validateTransaction(payload), "Please choose a valid recurring frequency.");
  for (const frequency of RECURRING_FREQUENCIES) {
    assert.equal(validateTransaction({ ...payload, frequency }), "");
  }
});

test("validateTransaction flags exact duplicates but allows editing the original", () => {
  const existing = [{ id: "abc", type: "expense", date: "2026-07-01", category: "Dining", description: "Lunch", amount: 20 }];
  const duplicate = { type: "expense", date: "2026-07-01", category: "Dining", description: "Lunch", amount: 20 };
  assert.equal(validateTransaction(duplicate, existing), "This transaction already exists.");
  assert.equal(validateTransaction(duplicate, existing, "abc"), "");
});

test("TRANSACTION_CATEGORIES has no duplicates and is non-empty", () => {
  assert.ok(TRANSACTION_CATEGORIES.length > 0);
  assert.equal(new Set(TRANSACTION_CATEGORIES).size, TRANSACTION_CATEGORIES.length);
});
