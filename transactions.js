export const createInitialTransactions = () => [
  {
    id: 1,
    type: "expense",
    date: "2026-07-13",
    category: "Dining",
    description: "Dinner with team",
    amount: 42.5,
  },
  {
    id: 2,
    type: "income",
    date: "2026-07-12",
    category: "Salary",
    description: "Monthly salary",
    amount: 3200,
  },
  {
    id: 3,
    type: "expense",
    date: "2026-07-10",
    category: "Groceries",
    description: "Weekly groceries",
    amount: 128.5,
  },
  {
    id: 4,
    type: "income",
    date: "2026-07-08",
    category: "Freelance",
    description: "Design project",
    amount: 780,
  },
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
