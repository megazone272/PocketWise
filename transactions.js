export const createInitialTransactions = () => [
  { id: 1, type: "income", date: "2026-07-01", category: "Salary", description: "July salary", amount: 4850 },
  { id: 2, type: "expense", date: "2026-07-11", category: "Groceries", description: "Weekly groceries", amount: 136.42 },
  { id: 3, type: "expense", date: "2026-07-09", category: "Dining", description: "Team dinner", amount: 46.8 },
  { id: 4, type: "expense", date: "2026-07-05", category: "Utilities", description: "Electricity and internet", amount: 118.6 },
  { id: 5, type: "income", date: "2026-06-30", category: "Salary", description: "June salary", amount: 4850 },
  { id: 6, type: "income", date: "2026-06-20", category: "Freelance", description: "Website design milestone", amount: 975 },
  { id: 7, type: "expense", date: "2026-06-15", category: "Housing", description: "June rent", amount: 1450 },
  { id: 8, type: "expense", date: "2026-06-08", category: "Utilities", description: "Mobile and internet", amount: 122.4 },
  { id: 9, type: "expense", date: "2026-06-04", category: "Transport", description: "Metro and ride share", amount: 74.3 },
  { id: 10, type: "income", date: "2026-05-31", category: "Salary", description: "May salary", amount: 4850 },
  { id: 11, type: "expense", date: "2026-05-22", category: "Travel", description: "Weekend train tickets", amount: 84 },
  { id: 12, type: "expense", date: "2026-05-17", category: "Shopping", description: "Running shoes", amount: 92.5 },
  { id: 13, type: "expense", date: "2026-05-03", category: "Housing", description: "May rent", amount: 1450 },
  { id: 14, type: "income", date: "2026-04-30", category: "Salary", description: "April salary", amount: 4850 },
  { id: 15, type: "expense", date: "2026-04-14", category: "Groceries", description: "Monthly grocery shop", amount: 412.76 },
  { id: 16, type: "expense", date: "2026-04-03", category: "Housing", description: "April rent", amount: 1450 },
  { id: 17, type: "income", date: "2026-03-31", category: "Salary", description: "March salary", amount: 4850 },
  { id: 18, type: "expense", date: "2026-03-21", category: "Healthcare", description: "Dental checkup", amount: 95 },
  { id: 19, type: "expense", date: "2026-03-03", category: "Housing", description: "March rent", amount: 1450 },
  { id: 20, type: "income", date: "2026-02-28", category: "Salary", description: "February salary", amount: 4850 },
  { id: 21, type: "expense", date: "2026-02-14", category: "Dining", description: "Birthday dinner", amount: 128 },
  { id: 22, type: "expense", date: "2026-02-03", category: "Housing", description: "February rent", amount: 1450 },
];

export const createTransactionsState = (transactions = createInitialTransactions()) => ({
  transactions,
  filters: {
    search: "",
    type: "all",
    category: "all",
  },
  editingId: null,
});

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

export const validateTransaction = (payload) => {
  if (!payload.type || !payload.date || !payload.category || !payload.description) {
    return "Please complete all fields.";
  }

  const amount = Number(payload.amount);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100000000) {
    return "Please enter a valid amount greater than 0.";
  }

  return "";
};

export const getFilteredTransactions = (transactions, filters) => {
  const search = String(filters.search || "").trim().toLowerCase();
  return transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(search) ||
      transaction.category.toLowerCase().includes(search);
    const matchesType = filters.type === "all" || transaction.type === filters.type;
    const matchesCategory = filters.category === "all" || transaction.category === filters.category;

    return matchesSearch && matchesType && matchesCategory;
  });
};
