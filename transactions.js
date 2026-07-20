export const createInitialTransactions = () => [];

export const RECURRING_FREQUENCIES = ["weekly", "monthly", "yearly"];

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
  // 1. التحقق من وجود جميع الحقول
  if (!["income", "expense"].includes(payload.type) || !payload.date || !payload.category || !payload.description) {
    return "Please complete all fields.";
  }

  // 2. التحقق من صحة التاريخ
  const parsedDate = new Date(`${payload.date}T12:00:00`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.date) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== payload.date) {
    return "Please enter a valid date.";
  }

  // 3. التحقق من صحة الفئة (غير حساس لحالة الأحرف)
  const isValidCategory = TRANSACTION_CATEGORIES.some(
    (cat) => cat.toLowerCase() === payload.category.toLowerCase()
  );
  if (!isValidCategory) {
    return "Please choose a valid category.";
  }

  // 4. التحقق من الوصف
  if (payload.description.trim().length < 2 || payload.description.trim().length > 140) {
    return "Description must be between 2 and 140 characters.";
  }

  // 5. التحقق من المبلغ
  const amount = Number(payload.amount);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100000000) {
    return "Please enter a valid amount greater than 0.";
  }

  // 6. التحقق من التكرار
  if (payload.recurring && !RECURRING_FREQUENCIES.includes(payload.frequency)) {
    return "Please choose a valid recurring frequency.";
  }

  // 7. التحقق من عدم وجود معاملة مكررة
  const duplicate = existingTransactions.some(
    (transaction) =>
      transaction.id !== editingId &&
      transaction.type === payload.type &&
      transaction.date === payload.date &&
      transaction.category.toLowerCase() === payload.category.toLowerCase() &&
      transaction.description.trim().toLowerCase() === payload.description.trim().toLowerCase() &&
      Number(transaction.amount) === amount
  );
  if (duplicate) {
    return "This transaction already exists.";
  }

  return "";
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