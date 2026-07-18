export const createInitialTransactions = () => [];

export const TRANSACTION_CATEGORIES = [
  "Salary", "Freelance", "Investments", "Housing", "Groceries", "Dining",
  "Utilities", "Transport", "Healthcare", "Insurance", "Travel", "Shopping", "Education", "Other",
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

export const validateTransaction = (payload, existingTransactions = [], editingId = null) => {
  if (!["income", "expense"].includes(payload.type) || !payload.date || !payload.category || !payload.description) return "Please complete all fields.";
  const parsedDate = new Date(`${payload.date}T12:00:00`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.date) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== payload.date) return "Please enter a valid date.";
  if (!TRANSACTION_CATEGORIES.includes(payload.category)) return "Please choose a valid category.";
  if (payload.description.trim().length < 2 || payload.description.trim().length > 140) return "Description must be between 2 and 140 characters.";
  const amount = Number(payload.amount);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100000000) return "Please enter a valid amount greater than 0.";
  const duplicate = existingTransactions.some((transaction) => transaction.id !== editingId && transaction.type === payload.type && transaction.date === payload.date && transaction.category === payload.category && transaction.description.trim().toLowerCase() === payload.description.trim().toLowerCase() && Number(transaction.amount) === amount);
  return duplicate ? "This transaction already exists." : "";
};
export const getFilteredTransactions = (transactions, filters) => {
  const search = String(filters.search || "").trim().toLowerCase();
  return transactions.filter((transaction) => {
    const matchesSearch = [transaction.description, transaction.category, transaction.date]
      .some((value) => String(value || "").toLowerCase().includes(search));
    const matchesType = filters.type === "all" || transaction.type === filters.type;
    const matchesCategory = filters.category === "all" || transaction.category === filters.category;

    return matchesSearch && matchesType && matchesCategory;
  });
};
