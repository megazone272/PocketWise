import {
  createInitialTransactions,
  createTransactionsState,
  formatCurrency,
  getFilteredTransactions,
  validateTransaction,
} from "./transactions.js";
import { translations } from "./translations.js";
import { createCharts } from "./chart.js";

const themeToggle = document.getElementById("themeToggle");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const body = document.body;
const authView = document.getElementById("authView");
const appView = document.getElementById("appView");
const authForm = document.getElementById("authForm");
const authSwitchBtn = document.getElementById("authSwitchBtn");
const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");
const authName = document.getElementById("authName");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const themeSelect = document.getElementById("themeSelect");
const languageSelect = document.getElementById("languageSelect");
const notificationsToggle = document.getElementById("notificationsToggle");
const geminiKeyInput = document.getElementById("geminiKeyInput");
const connectGeminiBtn = document.getElementById("connectGeminiBtn");
const clearDataBtn = document.getElementById("clearDataBtn");
const analyticsExpenseValue = document.getElementById("analyticsExpenseValue");
const analyticsIncomeValue = document.getElementById("analyticsIncomeValue");
const analyticsSavingsValue = document.getElementById("analyticsSavingsValue");

const STORAGE_KEY = "pocketwise-transactions";

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const loadTransactions = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return createInitialTransactions();
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : createInitialTransactions();
  } catch {
    return createInitialTransactions();
  }
};

const saveTransactions = (transactions) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

const state = createTransactionsState(loadTransactions());

const loadGoals = () => {
  const stored = localStorage.getItem("pocketwise-goals");
  return stored ? JSON.parse(stored) : [];
};

const saveGoals = (goals) => {
  localStorage.setItem("pocketwise-goals", JSON.stringify(goals));
};

const loadBills = () => {
  const stored = localStorage.getItem("pocketwise-bills");
  return stored ? JSON.parse(stored) : [];
};

const saveBills = (bills) => {
  localStorage.setItem("pocketwise-bills", JSON.stringify(bills));
};

const loadConversation = () => {
  const stored = localStorage.getItem("pocketwise-conversation");
  return stored ? JSON.parse(stored) : [];
};

const saveConversation = (conversation) => {
  localStorage.setItem("pocketwise-conversation", JSON.stringify(conversation));
};

const goals = loadGoals();
const bills = loadBills();
let conversation = loadConversation();
let currentPage = 1;

const loadUser = () => {
  const storedUser = localStorage.getItem("pocketwise-user");
  return storedUser ? JSON.parse(storedUser) : null;
};

const saveUser = (user) => {
  localStorage.setItem("pocketwise-user", JSON.stringify(user));
};

const loadSettings = () => ({
  theme: localStorage.getItem("pocketwise-theme") || "dark",
  language: localStorage.getItem("pocketwise-language") || "en",
  notifications: localStorage.getItem("pocketwise-notifications") !== "false",
  geminiKey: localStorage.getItem("pocketwise-gemini-key") || "",
});

const saveSettings = (settings) => {
  localStorage.setItem("pocketwise-theme", settings.theme);
  localStorage.setItem("pocketwise-language", settings.language);
  localStorage.setItem("pocketwise-notifications", String(settings.notifications));
  localStorage.setItem("pocketwise-gemini-key", settings.geminiKey);
};

const settings = loadSettings();
let isRegisterMode = false;

const modal = document.getElementById("transactionModal");
const form = document.getElementById("transactionForm");
const modalTitle = document.getElementById("modalTitle");
const transactionIdInput = document.getElementById("transactionId");
const typeInput = document.getElementById("typeInput");
const dateInput = document.getElementById("dateInput");
const categoryInput = document.getElementById("categoryInput");
const amountInput = document.getElementById("amountInput");
const descriptionInput = document.getElementById("descriptionInput");
const formError = document.getElementById("formError");
const transactionsList = document.getElementById("transactionsList");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const categoryFilter = document.getElementById("categoryFilter");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importInput = document.getElementById("importInput");
const budgetInput = document.getElementById("budgetInput");
const saveBudgetBtn = document.getElementById("saveBudgetBtn");
const monthlyBudgetValue = document.getElementById("monthlyBudgetValue");
const spentBudgetValue = document.getElementById("spentBudgetValue");
const remainingBudgetValue = document.getElementById("remainingBudgetValue");
const budgetProgressBar = document.getElementById("budgetProgressBar");
const budgetPercentText = document.getElementById("budgetPercentText");
const budgetStatusText = document.getElementById("budgetStatusText");
const budgetWarning = document.getElementById("budgetWarning");
const assistantChat = document.getElementById("assistantChat");
const assistantForm = document.getElementById("assistantForm");
const assistantInput = document.getElementById("assistantInput");
const suggestionChips = document.querySelectorAll(".suggestion-chip");
const searchScopeSelect = document.getElementById("searchScopeSelect");
const sortSelect = document.getElementById("sortSelect");
const pageSizeSelect = document.getElementById("pageSizeSelect");
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const pageInfoText = document.getElementById("pageInfoText");
const recurringInput = document.getElementById("recurringInput");
const frequencyInput = document.getElementById("frequencyInput");
const receiptInput = document.getElementById("receiptInput");
const goalForm = document.getElementById("goalForm");
const goalNameInput = document.getElementById("goalNameInput");
const goalTargetInput = document.getElementById("goalTargetInput");
const goalCurrentInput = document.getElementById("goalCurrentInput");
const goalDeadlineInput = document.getElementById("goalDeadlineInput");
const goalsList = document.getElementById("goalsList");
const billForm = document.getElementById("billForm");
const billNameInput = document.getElementById("billNameInput");
const billAmountInput = document.getElementById("billAmountInput");
const billDateInput = document.getElementById("billDateInput");
const billsList = document.getElementById("billsList");
const notificationsList = document.getElementById("notificationsList");
const calendarGrid = document.getElementById("calendarGrid");
const recentActivityList = document.getElementById("recentActivityList");
const summaryNetValue = document.getElementById("summaryNetValue");
const summaryTrendValue = document.getElementById("summaryTrendValue");
const summaryNextBillValue = document.getElementById("summaryNextBillValue");
const summaryNextBillDate = document.getElementById("summaryNextBillDate");
const summaryGoalValue = document.getElementById("summaryGoalValue");
const summaryGoalLabel = document.getElementById("summaryGoalLabel");
const goalProgressBar = document.getElementById("goalProgressBar");
const goalProgressText = document.getElementById("goalProgressText");
const savingsGoalTitle = document.getElementById("savingsGoalTitle");
const goalCurrentValue = document.getElementById("goalCurrentValue");
const goalTargetValue = document.getElementById("goalTargetValue");
const lineChartCanvas = document.getElementById("lineChart");
const categoryChartCanvas = document.getElementById("categoryChart");

const applyTheme = () => {
  const storedTheme = localStorage.getItem("pocketwise-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = storedTheme || (prefersDark ? "dark" : "light");
  body.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀" : "☾";
  if (themeSelect) themeSelect.value = theme;
};

const applyLanguage = (language = settings.language) => {
  const lang = language === "ar" ? "ar" : "en";
  body.setAttribute("data-lang", lang);
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const text = translations[lang][key];
    if (text) {
      element.textContent = text;
    }
  });
  document.querySelectorAll("[placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (key) {
      element.placeholder = translations[lang][key];
    }
  });
};

const animateCounter = (element, from, to, prefix = "", suffix = "") => {
  const duration = 700;
  const start = performance.now();

  const step = (time) => {
    const progress = Math.min(1, (time - start) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = from + (to - from) * eased;
    element.textContent = `${prefix}${Math.round(current * 100) / 100}${suffix}`;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
};

const renderAnalytics = () => {
  const expenses = state.transactions.filter((transaction) => transaction.type === "expense");
  const income = state.transactions.filter((transaction) => transaction.type === "income");
  const totalExpenses = expenses.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  const totalIncome = income.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  const savings = totalIncome - totalExpenses;

  animateCounter(analyticsExpenseValue, Number(analyticsExpenseValue.dataset.value || 0), totalExpenses, "$", "");
  animateCounter(analyticsIncomeValue, Number(analyticsIncomeValue.dataset.value || 0), totalIncome, "$", "");
  animateCounter(analyticsSavingsValue, Number(analyticsSavingsValue.dataset.value || 0), savings, "$", "");
  analyticsExpenseValue.dataset.value = String(totalExpenses);
  analyticsIncomeValue.dataset.value = String(totalIncome);
  analyticsSavingsValue.dataset.value = String(savings);
};

const getSortedTransactions = (transactions) => {
  const nextTransactions = [...transactions];
  const sort = sortSelect?.value || "date-desc";
  nextTransactions.sort((left, right) => {
    if (sort === "amount-desc") return Number(right.amount) - Number(left.amount);
    if (sort === "amount-asc") return Number(left.amount) - Number(right.amount);
    if (sort === "date-asc") return new Date(left.date) - new Date(right.date);
    return new Date(right.date) - new Date(left.date);
  });
  return nextTransactions;
};

const getPaginatedTransactions = (transactions) => {
  const pageSize = Number(pageSizeSelect?.value || 10);
  const startIndex = (currentPage - 1) * pageSize;
  return transactions.slice(startIndex, startIndex + pageSize);
};

const renderTransactions = () => {
  const visibleTransactions = getFilteredTransactions(state.transactions, state.filters);
  const sortedTransactions = getSortedTransactions(visibleTransactions);
  const pageCount = Math.max(1, Math.ceil(sortedTransactions.length / (Number(pageSizeSelect?.value || 10))));
  currentPage = Math.min(currentPage, pageCount);

  if (!sortedTransactions.length) {
    transactionsList.innerHTML = '<div class="empty-state">No transactions match your filters yet.</div>';
    pageInfoText.textContent = "Page 1";
    return;
  }

  const pagedTransactions = getPaginatedTransactions(sortedTransactions);
  transactionsList.innerHTML = pagedTransactions
    .map(
      (transaction) => `
        <article class="transaction-row">
          <div class="transaction-main">
            <span class="type-badge ${transaction.type}">${transaction.type}</span>
            <div class="transaction-meta">
              <strong>${escapeHtml(transaction.description)}</strong>
              <p>${escapeHtml(transaction.category)} • ${escapeHtml(transaction.date)}${transaction.recurring ? " • Recurring" : ""}</p>
            </div>
          </div>
          <div class="transaction-actions">
            <span class="amount ${transaction.type === "income" ? "positive" : "negative"}">
              ${transaction.type === "income" ? "+" : "-"}${formatCurrency(transaction.amount)}
            </span>
            <button class="action-btn" data-action="edit" data-id="${transaction.id}">✎</button>
            <button class="action-btn delete" data-action="delete" data-id="${transaction.id}">🗑</button>
          </div>
        </article>
      `
    )
    .join("");

  pageInfoText.textContent = `Page ${currentPage} of ${pageCount}`;
};

const BUDGET_STORAGE_KEY = "pocketwise-budget";

const loadBudget = () => {
  const storedBudget = Number(localStorage.getItem(BUDGET_STORAGE_KEY));
  return Number.isFinite(storedBudget) && storedBudget > 0 ? storedBudget : 5000;
};

const saveBudget = () => {
  const value = Number(budgetInput.value);
  if (Number.isFinite(value) && value >= 0) {
    localStorage.setItem(BUDGET_STORAGE_KEY, String(value));
    renderBudgetPlanner();
  }
};

const getCurrentMonthExpenses = () => {
  const now = new Date();
  return state.transactions.filter((transaction) => {
    if (transaction.type !== "expense") {
      return false;
    }

    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getFullYear() === now.getFullYear() &&
      transactionDate.getMonth() === now.getMonth()
    );
  });
};

const renderBudgetPlanner = () => {
  const budget = Number(budgetInput.value) || loadBudget();
  const spent = getCurrentMonthExpenses().reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  const remaining = budget - spent;
  const percent = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;

  monthlyBudgetValue.textContent = formatCurrency(budget);
  spentBudgetValue.textContent = formatCurrency(spent);
  remainingBudgetValue.textContent = formatCurrency(remaining);
  budgetProgressBar.style.width = `${percent}%`;
  budgetPercentText.textContent = `${percent}%`;

  if (remaining < 0) {
    budgetStatusText.textContent = "Over budget";
    budgetWarning.textContent = `You exceeded your monthly budget by ${formatCurrency(Math.abs(remaining))}.`;
    budgetWarning.className = "budget-warning danger";
  } else if (percent >= 80) {
    budgetStatusText.textContent = "Near limit";
    budgetWarning.textContent = "You are close to your monthly budget limit.";
    budgetWarning.className = "budget-warning warning";
  } else {
    budgetStatusText.textContent = "On track";
    budgetWarning.textContent = "You are within your monthly budget.";
    budgetWarning.className = "budget-warning";
  }
};

const persistAndRender = () => {
  saveTransactions(state.transactions);
  renderTransactions();
  renderBudgetPlanner();
  renderAnalytics();
  renderDashboardSummary();
  renderGoals();
  renderBills();
  renderNotifications();
  renderCalendar();
  renderCharts();
};

const createAssistantMessage = (role, text) => {
  const wrapper = document.createElement("div");
  wrapper.className = `assistant-message ${role}`;

  const avatar = document.createElement("div");
  avatar.className = "assistant-avatar";
  avatar.textContent = role === "user" ? "YO" : "AI";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  const title = document.createElement("strong");
  title.textContent = role === "user" ? "You" : "PocketWise AI";
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  bubble.append(title, paragraph);

  wrapper.append(avatar, bubble);
  return wrapper;
};

const createTypingIndicator = () => {
  const wrapper = document.createElement("div");
  wrapper.className = "assistant-message assistant";

  const avatar = document.createElement("div");
  avatar.className = "assistant-avatar";
  avatar.textContent = "AI";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  const dots = document.createElement("div");
  dots.className = "typing-dots";
  dots.innerHTML = "<span></span><span></span><span></span>";
  bubble.appendChild(dots);

  wrapper.append(avatar, bubble);
  return wrapper;
};

const addAssistantMessage = (role, text) => {
  assistantChat.appendChild(createAssistantMessage(role, text));
  assistantChat.scrollTop = assistantChat.scrollHeight;
};

const renderConversation = () => {
  assistantChat.innerHTML = "";
  conversation.forEach((entry) => addAssistantMessage(entry.role, entry.text));
};

const getGeminiResponse = async (prompt) => {
  const apiKey = settings.geminiKey;
  if (!apiKey) {
    return "Add your Gemini API key in Settings to enable live AI analysis.";
  }

  const expenses = state.transactions.filter((transaction) => transaction.type === "expense");
  const income = state.transactions.filter((transaction) => transaction.type === "income");
  const totalExpenses = expenses.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  const totalIncome = income.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  const net = totalIncome - totalExpenses;
  const budget = Number(localStorage.getItem("pocketwise-budget") || 5000);
  const nextBill = [...bills].sort((left, right) => new Date(left.date) - new Date(right.date))[0];
  const goal = goals[0];

  const contextPrompt = `You are PocketWise AI. Analyze this user's finances and respond with concise advice. User request: ${prompt}. Financial context: income ${formatCurrency(totalIncome)}, expenses ${formatCurrency(totalExpenses)}, net flow ${formatCurrency(net)}, monthly budget ${formatCurrency(budget)}, next bill ${nextBill ? `${nextBill.name} on ${nextBill.date}` : "none"}, goal ${goal ? `${goal.name} ${Math.round((Number(goal.current) / Number(goal.target)) * 100)}% complete` : "none"}. Focus on financial analysis, budget recommendations, and spending insights.`;

  const requestBody = {
    contents: [
      ...conversation.slice(-6),
      { role: "user", parts: [{ text: contextPrompt }] },
    ].map((entry) => ({ role: entry.role === "assistant" ? "model" : "user", parts: [{ text: entry.text }] })),
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    throw new Error("Unable to reach Gemini.");
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "I’m here to help with your finances.";
};

const streamAssistantResponse = async (text, targetMessage) => {
  const chunks = text.split(/(\s+)/);
  let index = 0;

  const renderNextChunk = () => {
    if (index >= chunks.length) {
      return;
    }

    const chunk = chunks[index];
    targetMessage.textContent += chunk;
    index += 1;
    window.setTimeout(renderNextChunk, 20);
  };

  renderNextChunk();
};

const handleAssistantSubmit = async (prompt) => {
  const trimmed = prompt.trim();
  if (!trimmed) {
    return;
  }

  conversation.push({ role: "user", text: trimmed });
  saveConversation(conversation);
  addAssistantMessage("user", trimmed);
  assistantInput.value = "";

  const typingMessage = createTypingIndicator();
  assistantChat.appendChild(typingMessage);
  assistantChat.scrollTop = assistantChat.scrollHeight;

  try {
    const response = await getGeminiResponse(trimmed);
    conversation.push({ role: "assistant", text: response });
    saveConversation(conversation);
    typingMessage.remove();

    const assistantMessage = createAssistantMessage("assistant", "");
    assistantChat.appendChild(assistantMessage);
    assistantChat.scrollTop = assistantChat.scrollHeight;
    const messageText = assistantMessage.querySelector("p");
    await streamAssistantResponse(response, messageText);
  } catch (error) {
    typingMessage.remove();
    addAssistantMessage("assistant", error.message || "The assistant is unavailable right now.");
  }
};

const openModal = (id = null) => {
  state.editingId = id;
  formError.textContent = "";
  form.reset();

  if (id) {
    const transaction = state.transactions.find((item) => item.id === id);
    if (transaction) {
      modalTitle.textContent = "Edit Transaction";
      transactionIdInput.value = transaction.id;
      typeInput.value = transaction.type;
      dateInput.value = transaction.date;
      categoryInput.value = transaction.category;
      amountInput.value = transaction.amount;
      descriptionInput.value = transaction.description;
    }
  } else {
    modalTitle.textContent = "Add Transaction";
    transactionIdInput.value = "";
    dateInput.value = new Date().toISOString().split("T")[0];
    typeInput.value = "expense";
    categoryInput.value = "";
    amountInput.value = "";
    descriptionInput.value = "";
  }

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
};

const closeModal = () => {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  form.reset();
  formError.textContent = "";
  state.editingId = null;
};

const handleSubmit = (event) => {
  event.preventDefault();

  const payload = {
    type: typeInput.value,
    date: dateInput.value,
    category: categoryInput.value.trim(),
    description: descriptionInput.value.trim(),
    amount: Number(amountInput.value),
    recurring: recurringInput.checked,
    frequency: frequencyInput.value,
    receipt: receiptInput.files?.[0]?.name || "",
  };

  const validationMessage = validateTransaction(payload);
  if (validationMessage) {
    formError.textContent = validationMessage;
    return;
  }

  if (state.editingId) {
    state.transactions = state.transactions.map((transaction) =>
      transaction.id === state.editingId ? { ...transaction, ...payload } : transaction
    );
  } else {
    state.transactions.unshift({
      id: Date.now(),
      ...payload,
    });
  }

  persistAndRender();
  closeModal();
};

const exportTransactions = () => {
  const blob = new Blob([JSON.stringify(state.transactions, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "pocketwise-transactions.json";
  link.click();
  URL.revokeObjectURL(url);
};

const importTransactions = async (file) => {
  const text = await file.text();
  const parsed = JSON.parse(text);

  if (!Array.isArray(parsed)) {
    throw new Error("Invalid import file.");
  }

  state.transactions = parsed;
  persistAndRender();
};

const renderGoals = () => {
  if (!goalsList) {
    return;
  }

  if (!goals.length) {
    goalsList.innerHTML = '<div class="empty-state">No goals yet. Add one to start saving.</div>';
    return;
  }

  goalsList.innerHTML = goals
    .map((goal) => {
      const progress = Math.min(100, Math.round((Number(goal.current) / Number(goal.target)) * 100));
      return `
        <article class="stack-item">
          <div class="stack-header">
            <strong>${escapeHtml(goal.name)}</strong>
            <span>${progress}%</span>
          </div>
          <div class="goal-progress-track compact"><div class="goal-progress-bar" style="width:${progress}%"></div></div>
          <p>${formatCurrency(goal.current)} / ${formatCurrency(goal.target)} • Due ${escapeHtml(goal.deadline)}</p>
        </article>
      `;
    })
    .join("");
};

const renderBills = () => {
  if (!billsList) {
    return;
  }

  if (!bills.length) {
    billsList.innerHTML = '<div class="empty-state">No bills yet. Add reminders for upcoming payments.</div>';
    return;
  }

  billsList.innerHTML = bills
    .map((bill) => `
      <article class="stack-item">
        <div class="stack-header">
          <strong>${escapeHtml(bill.name)}</strong>
          <span>${formatCurrency(bill.amount)}</span>
        </div>
        <p>Due ${escapeHtml(bill.date)}</p>
      </article>
    `)
    .join("");
};

const renderNotifications = () => {
  if (!notificationsList) {
    return;
  }

  const items = [];
  if (goals.length) {
    const goal = goals[0];
    items.push(`Goal reminder: ${escapeHtml(goal.name)} is ${Math.round((Number(goal.current) / Number(goal.target)) * 100)}% complete.`);
  }
  if (bills.length) {
    const nextBill = [...bills].sort((left, right) => new Date(left.date) - new Date(right.date))[0];
    items.push(`Upcoming bill: ${escapeHtml(nextBill.name)} is due on ${escapeHtml(nextBill.date)}.`);
  }
  if (!items.length) {
    items.push("You’re all caught up for now.");
  }

  notificationsList.innerHTML = items.map((item) => `<li class="notification-item">${item}</li>`).join("");
};

const renderCalendar = () => {
  if (!calendarGrid) {
    return;
  }

  const days = Array.from({ length: 35 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - 14 + index);
    return date;
  });

  calendarGrid.innerHTML = days
    .map((date) => {
      const hasBill = bills.some((bill) => bill.date === date.toISOString().split("T")[0]);
      const hasTransaction = state.transactions.some((transaction) => transaction.date === date.toISOString().split("T")[0]);
      return `<div class="calendar-day ${hasBill || hasTransaction ? "active" : ""}"><span>${date.getDate()}</span></div>`;
    })
    .join("");
};

const renderDashboardSummary = () => {
  const expenses = state.transactions.filter((transaction) => transaction.type === "expense");
  const income = state.transactions.filter((transaction) => transaction.type === "income");
  const net = income.reduce((sum, item) => sum + Number(item.amount), 0) - expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const sortedBills = [...bills].sort((left, right) => new Date(left.date) - new Date(right.date));
  const nextBill = sortedBills[0];
  const activeGoal = goals[0];
  const goalProgress = activeGoal ? Math.min(100, Math.round((Number(activeGoal.current) / Number(activeGoal.target)) * 100)) : 0;

  animateCounter(summaryNetValue, Number(summaryNetValue.dataset.value || 0), net, "$", "");
  summaryNetValue.dataset.value = String(net);
  summaryTrendValue.textContent = net >= 0 ? "Positive flow" : "Watch spending";
  summaryNextBillValue.textContent = nextBill ? formatCurrency(nextBill.amount) : "$0.00";
  summaryNextBillDate.textContent = nextBill ? `Due ${nextBill.date}` : "No upcoming bills";
  summaryGoalValue.textContent = `${goalProgress}%`;
  summaryGoalLabel.textContent = activeGoal ? `${activeGoal.name} • ${activeGoal.deadline}` : "No active goal";
  goalProgressBar.style.width = `${goalProgress}%`;
  goalProgressText.textContent = `${goalProgress}%`;
  savingsGoalTitle.textContent = activeGoal ? activeGoal.name : "Emergency fund";
  goalCurrentValue.textContent = activeGoal ? formatCurrency(activeGoal.current) : "$0.00";
  goalTargetValue.textContent = activeGoal ? formatCurrency(activeGoal.target) : "$0.00";

  const recentActivity = [...state.transactions].sort((left, right) => new Date(right.date) - new Date(left.date)).slice(0, 6);
  recentActivityList.innerHTML = recentActivity.map((item) => `<li class="activity-item"><span>${escapeHtml(item.description)}</span><strong>${formatCurrency(item.amount)}</strong></li>`).join("");
};

const renderCharts = () => {
  createCharts(lineChartCanvas, categoryChartCanvas, state.transactions, goals, bills);
};

const addGoal = (event) => {
  event.preventDefault();
  const goal = {
    id: Date.now(),
    name: goalNameInput.value.trim(),
    target: Number(goalTargetInput.value),
    current: Number(goalCurrentInput.value),
    deadline: goalDeadlineInput.value,
  };

  if (!goal.name || !goal.target || !goal.deadline) {
    return;
  }

  goals.push(goal);
  saveGoals(goals);
  goalForm.reset();
  persistAndRender();
};

const addBill = (event) => {
  event.preventDefault();
  const bill = {
    id: Date.now(),
    name: billNameInput.value.trim(),
    amount: Number(billAmountInput.value),
    date: billDateInput.value,
  };

  if (!bill.name || !bill.amount || !bill.date) {
    return;
  }

  bills.push(bill);
  saveBills(bills);
  billForm.reset();
  persistAndRender();
};

const syncSettingsControls = () => {
  if (themeSelect) themeSelect.value = settings.theme;
  if (languageSelect) languageSelect.value = settings.language;
  if (notificationsToggle) notificationsToggle.checked = settings.notifications;
  if (geminiKeyInput) geminiKeyInput.value = settings.geminiKey;
};

const initializeAuth = () => {
  const user = loadUser();
  if (user) {
    authView.classList.add("hidden");
    appView.classList.remove("hidden");
  } else {
    authView.classList.remove("hidden");
    appView.classList.add("hidden");
  }
};

const toggleAuthMode = () => {
  isRegisterMode = !isRegisterMode;
  authTitle.textContent = isRegisterMode ? "Create Account" : "Sign In";
  authSubtitle.textContent = isRegisterMode ? "Start building better habits" : "Welcome back";
  authSwitchBtn.textContent = isRegisterMode ? "Already have an account?" : "Need an account?";
  authName.hidden = !isRegisterMode;
  authName.required = isRegisterMode;
  authName.placeholder = translations[settings.language === "ar" ? "ar" : "en"].fullName;
  authEmail.placeholder = translations[settings.language === "ar" ? "ar" : "en"].email;
  authPassword.placeholder = translations[settings.language === "ar" ? "ar" : "en"].password;
  authForm.querySelector("button").textContent = isRegisterMode ? "Create Account" : "Sign In";
};

applyTheme();
applyLanguage();
syncSettingsControls();
initializeAuth();
budgetInput.value = loadBudget();
renderBudgetPlanner();
renderAnalytics();
renderDashboardSummary();
renderGoals();
renderBills();
renderNotifications();
renderCalendar();
renderCharts();
renderConversation();

themeToggle.addEventListener("click", () => {
  const nextTheme = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
  body.setAttribute("data-theme", nextTheme);
  localStorage.setItem("pocketwise-theme", nextTheme);
  settings.theme = nextTheme;
  saveSettings(settings);
  themeToggle.textContent = nextTheme === "dark" ? "☀" : "☾";
  if (themeSelect) themeSelect.value = nextTheme;
});

if (themeSelect) {
  themeSelect.addEventListener("change", (event) => {
    const nextTheme = event.target.value;
    body.setAttribute("data-theme", nextTheme);
    settings.theme = nextTheme;
    saveSettings(settings);
    themeToggle.textContent = nextTheme === "dark" ? "☀" : "☾";
  });
}

if (languageSelect) {
  languageSelect.addEventListener("change", (event) => {
    settings.language = event.target.value;
    saveSettings(settings);
    applyLanguage(settings.language);
    toggleAuthMode();
  });
}

if (searchScopeSelect) {
  searchScopeSelect.addEventListener("change", () => {
    currentPage = 1;
    renderTransactions();
  });
}

if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    currentPage = 1;
    renderTransactions();
  });
}

if (pageSizeSelect) {
  pageSizeSelect.addEventListener("change", () => {
    currentPage = 1;
    renderTransactions();
  });
}

if (prevPageBtn) {
  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage -= 1;
      renderTransactions();
    }
  });
}

if (nextPageBtn) {
  nextPageBtn.addEventListener("click", () => {
    const pageSize = Number(pageSizeSelect?.value || 10);
    const visibleTransactions = getFilteredTransactions(state.transactions, state.filters);
    const pageCount = Math.max(1, Math.ceil(visibleTransactions.length / pageSize));
    if (currentPage < pageCount) {
      currentPage += 1;
      renderTransactions();
    }
  });
}

if (notificationsToggle) {
  notificationsToggle.addEventListener("change", (event) => {
    settings.notifications = event.target.checked;
    saveSettings(settings);
  });
}

if (geminiKeyInput) {
  geminiKeyInput.addEventListener("change", (event) => {
    settings.geminiKey = event.target.value;
    saveSettings(settings);
  });
}

if (connectGeminiBtn) {
  connectGeminiBtn.addEventListener("click", () => {
    if (settings.geminiKey) {
      window.alert("Gemini is ready to use with your saved API key.");
    } else {
      window.alert("Add your Gemini API key in settings to enable live AI responses.");
    }
  });
}

if (clearDataBtn) {
  clearDataBtn.addEventListener("click", () => {
    if (window.confirm("Clear all stored data?")) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("pocketwise-budget");
      localStorage.removeItem("pocketwise-user");
      localStorage.removeItem("pocketwise-gemini-key");
      localStorage.removeItem("pocketwise-goals");
      localStorage.removeItem("pocketwise-bills");
      localStorage.removeItem("pocketwise-conversation");
      window.location.reload();
    }
  });
}

addExpenseBtn?.addEventListener("click", () => {
  const badge = document.querySelector(".hero-badge");
  badge.animate(
    [{ transform: "translateY(0px)" }, { transform: "translateY(-4px)" }, { transform: "translateY(0px)" }],
    { duration: 500, easing: "ease-out" }
  );
  openModal();
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelectorAll(".nav-links a").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
    const targetId = link.dataset.section;
    const section = document.getElementById(`${targetId}Section`);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

document.getElementById("openModalBtn").addEventListener("click", () => openModal());
document.getElementById("closeModalBtn").addEventListener("click", closeModal);
document.getElementById("cancelModalBtn").addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

form.addEventListener("submit", handleSubmit);

searchInput.addEventListener("input", (event) => {
  state.filters.search = event.target.value;
  renderTransactions();
});

typeFilter.addEventListener("change", (event) => {
  state.filters.type = event.target.value;
  renderTransactions();
});

categoryFilter.addEventListener("change", (event) => {
  state.filters.category = event.target.value;
  renderTransactions();
});

transactionsList.addEventListener("click", (event) => {
  const actionButton = event.target.closest("button[data-action]");
  if (!actionButton) {
    return;
  }

  const { action, id } = actionButton.dataset;
  const transactionId = Number(id);

  if (action === "edit") {
    openModal(transactionId);
  } else if (action === "delete") {
    state.transactions = state.transactions.filter((transaction) => transaction.id !== transactionId);
    persistAndRender();
  }
});

saveBudgetBtn.addEventListener("click", saveBudget);
budgetInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    saveBudget();
  }
});

exportBtn.addEventListener("click", exportTransactions);
importBtn.addEventListener("click", () => importInput.click());
importInput.addEventListener("change", async (event) => {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  try {
    await importTransactions(file);
    formError.textContent = "Transactions imported successfully.";
  } catch {
    formError.textContent = "Unable to import transactions.";
  } finally {
    importInput.value = "";
  }
});

assistantForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleAssistantSubmit(assistantInput.value);
});

goalForm.addEventListener("submit", addGoal);
billForm.addEventListener("submit", addBill);

suggestionChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    handleAssistantSubmit(chip.dataset.text);
  });
});

authSwitchBtn.addEventListener("click", toggleAuthMode);
authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = authEmail.value.trim();
  const password = authPassword.value.trim();
  const name = authName.value.trim();

  if (!email || !password || (isRegisterMode && !name)) {
    window.alert("Please fill in the required fields.");
    return;
  }

  saveUser({ email, name: isRegisterMode ? name : "PocketWise User" });
  authView.classList.add("hidden");
  appView.classList.remove("hidden");
});

renderTransactions();