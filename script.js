import { createTransactionsState, formatCurrency, getFilteredTransactions, validateTransaction, TRANSACTION_CATEGORIES } from "./transactions.js";
import { createCharts } from "./chart.js";
import { translate, RTL_LANGUAGES, SUPPORTED_LANGUAGES } from "./translations.js";
import {
  startFirebase, firebase, collection, doc, addDoc, setDoc, updateDoc, deleteDoc, query, where, onSnapshot,
  serverTimestamp, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider,
  signInWithPopup, sendPasswordResetEmail, signOut, updateProfile,
} from "./firebase.js";

const $ = (id) => document.getElementById(id);
const body = document.body;
const state = createTransactionsState([]);
let user = null, settings = { theme: "dark", language: "en", notifications: true }, goals = [], bills = [], notifications = [], conversation = [], currentPage = 1, unsubscribers = [];
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[char]));
const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T12:00:00`).getTime());
const cleanText = (value, max = 140) => String(value ?? "").trim().replace(/[<>]/g, "").slice(0, max);
const own = (data = {}) => ({ ...data, uid: user.uid, updatedAt: serverTimestamp() });
const status = (message, error = false) => { const node = $("formError"); if (node) { node.textContent = message; node.className = error ? "form-error" : "form-success"; } };
const money = (value) => formatCurrency(Number(value) || 0);
async function guarded(action, successMessage = "") {
  try {
    await action();
    if (successMessage) status(successMessage);
  } catch (error) {
    console.error("[PocketWise]", error);
    status(error?.message || "Something went wrong. Please try again.", true);
  }
}
const monthTotals = () => state.transactions.reduce((total, item) => {
  const now = new Date(), date = new Date(`${item.date}T12:00:00`);
  if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()) total[item.type === "income" ? "income" : "expenses"] += Number(item.amount) || 0;
  return total;
}, { income: 0, expenses: 0 });
const currentExpenses = () => monthTotals().expenses;

function applyTheme() {
  body.dataset.theme = settings.theme === "light" ? "light" : "dark";
  $("themeToggle").textContent = body.dataset.theme === "dark" ? "☾" : "☀";
  if ($("themeSelect")) $("themeSelect").value = body.dataset.theme;
}
function applyI18n() {
  const language = SUPPORTED_LANGUAGES.includes(settings.language) ? settings.language : "en";
  body.dataset.lang = language;
  document.documentElement.lang = language;
  document.documentElement.dir = RTL_LANGUAGES.has(language) ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = translate(language, node.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => { node.placeholder = translate(language, node.dataset.i18nPlaceholder); });
  if ($("languageSelect")) $("languageSelect").value = language;
}
function populateCategoryOptions() {
  const optionsHtml = TRANSACTION_CATEGORIES
    .map(category => `<option value="${esc(category)}">${esc(category)}</option>`)
    .join("");

  const categorySelect = $("categoryInput");
  if (categorySelect) {
    categorySelect.innerHTML =
      '<option value="">Select Category</option>' + optionsHtml;
  }

  const filter = $("categoryFilter");
  if (filter) {
    filter.innerHTML =
      '<option value="all">All Categories</option>' + optionsHtml;
  }
}
async function saveSettings(patch) {
  settings = { ...settings, ...patch };
  applyTheme();
  applyI18n();
  if (!user) return;
  await setDoc(doc(null, "settings", user.uid), own(settings), { merge: true });
}
function renderAll() { renderTransactions(); renderBudget(); renderAnalytics(); renderGoals(); renderBills(); renderNotifications(); renderSummary(); createCharts($("lineChart"), $("categoryChart"), state.transactions, goals, bills); }
function renderAnalytics() {
  const totals = monthTotals(), net = totals.income - totals.expenses;
  const balance = state.transactions.reduce((sum, item) => sum + (item.type === "income" ? 1 : -1) * Number(item.amount || 0), 0);
  $("analyticsExpenseValue").textContent = money(totals.expenses); $("analyticsIncomeValue").textContent = money(totals.income); $("analyticsSavingsValue").textContent = money(net); const projection = Math.max(0, net); if ($("projectedSavingsValue")) $("projectedSavingsValue").textContent = money(projection);
  $("balanceValue").textContent = money(balance); $("monthlyIncomeValue").textContent = money(totals.income); $("monthlyExpenseValue").textContent = money(totals.expenses); $("monthlySavingsValue").textContent = money(net);
}
function renderTransactions() {
  const filters = state.filters, search = $("searchInput")?.value || "";
  filters.search = search; filters.type = $("typeFilter")?.value || "all"; filters.category = $("categoryFilter")?.value || "all";
  const sort = $("sortSelect")?.value || "date-desc", size = Number($("pageSizeSelect")?.value || 10);
  const entries = getFilteredTransactions(state.transactions, filters).sort((a,b) => sort === "amount-desc" ? b.amount-a.amount : sort === "amount-asc" ? a.amount-b.amount : sort === "date-asc" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  const pages = Math.max(1, Math.ceil(entries.length / size)); currentPage = Math.min(currentPage, pages);
  const list = $("transactionsList");
  list.innerHTML = entries.length ? entries.slice((currentPage-1)*size, currentPage*size).map((item) => `<article class="transaction-row"><div class="transaction-main"><span class="type-badge ${item.type}">${esc(item.type)}</span><div class="transaction-meta"><strong>${esc(item.description)}</strong><p>${esc(item.category)} · ${esc(item.date)}${item.recurring ? " · Recurring" : ""}</p></div></div><div class="transaction-actions"><span class="amount ${item.type === "income" ? "positive" : "negative"}">${item.type === "income" ? "+" : "-"}${money(item.amount)}</span><button class="action-btn" data-action="edit" data-id="${esc(item.id)}">Edit</button><button class="action-btn delete" data-action="delete" data-id="${esc(item.id)}">Delete</button></div></article>`).join("") : '<div class="empty-state">No transactions yet. Add your first income or expense.</div>';
  $("pageInfoText").textContent = `Page ${currentPage} of ${pages}`;
  renderOtherMatches(search);
}
function renderOtherMatches(search) {
  const scope = $("searchScopeSelect")?.value || "transactions";
  const container = $("otherMatchesList");
  if (!container) return;
  if (scope !== "all" || !search) { container.innerHTML = ""; container.classList.add("hidden"); return; }
  const term = search.toLowerCase();
  const matchedGoals = goals.filter((goal) => goal.name?.toLowerCase().includes(term));
  const matchedBills = bills.filter((bill) => bill.name?.toLowerCase().includes(term));
  const matchedNotifications = notifications.filter((item) => item.message?.toLowerCase().includes(term));
  const rows = [
    ...matchedGoals.map((goal) => `<li class="notification-item">Goal: ${esc(goal.name)} — ${money(goal.current)} / ${money(goal.target)}</li>`),
    ...matchedBills.map((bill) => `<li class="notification-item">Bill: ${esc(bill.name)} — due ${esc(bill.date)}</li>`),
    ...matchedNotifications.map((item) => `<li class="notification-item">Notification: ${esc(item.message)}</li>`),
  ];
  container.classList.remove("hidden");
  container.innerHTML = rows.length ? rows.join("") : '<li class="empty-state">No matching goals, bills, or notifications.</li>';
}
function budget() { return Number(settings.monthlyBudget) || 0; }
function renderBudget() {
  const planned = budget(), spent = currentExpenses(), remaining = planned - spent, percent = planned ? Math.min(100, Math.round((spent/planned)*100)) : 0;
  $("budgetInput").value = planned || ""; $("monthlyBudgetValue").textContent = money(planned); $("spentBudgetValue").textContent = money(spent); $("remainingBudgetValue").textContent = money(remaining); $("budgetProgressBar").style.width = `${percent}%`; $("budgetPercentText").textContent = `${percent}%`;
  $("budgetStatusText").textContent = !planned ? "Set a budget" : remaining < 0 ? "Over budget" : percent >= 80 ? "Near limit" : "On track";
  $("budgetWarning").textContent = !planned ? "Set a monthly budget to track progress." : remaining < 0 ? `You exceeded your budget by ${money(Math.abs(remaining))}.` : "You are within your monthly budget.";
}
function renderGoals() { $("goalsList").innerHTML = goals.length ? goals.map((goal) => { const pct = Math.min(100, Math.round((Number(goal.current)/Number(goal.target))*100)); return `<article class="stack-item"><div class="stack-header"><strong>${esc(goal.name)}</strong><span>${pct}%</span></div><div class="goal-progress-track compact"><div class="goal-progress-bar" style="width:${pct}%"></div></div><p>${money(goal.current)} / ${money(goal.target)} · Due ${esc(goal.deadline)}</p></article>`; }).join("") : '<div class="empty-state">No savings goals yet.</div>'; }
function renderBills() { $("billsList").innerHTML = bills.length ? [...bills].sort((a,b)=>a.date.localeCompare(b.date)).map((bill)=>`<article class="stack-item"><div class="stack-header"><strong>${esc(bill.name)}</strong><span>${money(bill.amount)}</span></div><p>Due ${esc(bill.date)}</p></article>`).join("") : '<div class="empty-state">No bills scheduled.</div>'; }
function renderNotifications() { $("notificationsList").innerHTML = notifications.length ? notifications.slice(0,5).map((n)=>`<li class="notification-item">${esc(n.message)}</li>`).join("") : '<li class="empty-state">No new notifications.</li>'; }
function renderSummary() {
  const totals = monthTotals(), net = totals.income - totals.expenses, next = [...bills].filter((bill)=>bill.date >= new Date().toISOString().slice(0,10)).sort((a,b)=>a.date.localeCompare(b.date))[0], goal = goals[0], progress = goal ? Math.min(100,Math.round(goal.current/goal.target*100)) : 0;
  $("summaryNetValue").textContent = money(net); $("summaryTrendValue").textContent = net >= 0 ? "Positive flow" : "Watch spending"; $("summaryNextBillValue").textContent = next ? money(next.amount) : "—"; $("summaryNextBillDate").textContent = next ? `Due ${next.date}` : "No upcoming bills"; $("summaryGoalValue").textContent = `${progress}%`; $("summaryGoalLabel").textContent = goal ? esc(goal.name) : "No active goal"; $("goalProgressBar").style.width = `${progress}%`; $("goalProgressText").textContent = `${progress}%`; $("savingsGoalTitle").textContent = goal?.name || "No goal selected"; $("goalCurrentValue").textContent = money(goal?.current); $("goalTargetValue").textContent = money(goal?.target);
  $("recentActivityList").innerHTML = state.transactions.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,6).map((item)=>`<li class="activity-item"><span>${esc(item.description)}</span><strong>${money(item.amount)}</strong></li>`).join("") || '<li class="empty-state">No activity yet.</li>';
}
function subscribe(collectionName, apply) { unsubscribers.push(onSnapshot(query(collection(null, collectionName), where("uid", "==", user.uid)), (snapshot) => { apply(snapshot.docs.map((item)=>({ id:item.id, ...item.data() }))); renderAll(); }, (error)=>status(`Could not load ${collectionName}: ${error.message}`, true))); }
function subscribeData() {
  unsubscribers.forEach((stop)=>stop()); unsubscribers=[];
  subscribe("transactions", (items)=>state.transactions=items); subscribe("goals", (items)=>goals=items); subscribe("bills", (items)=>bills=items); subscribe("notifications", (items)=>notifications=items.sort((a,b)=>String(b.createdAt?.seconds||0).localeCompare(String(a.createdAt?.seconds||0))));
  unsubscribers.push(onSnapshot(doc(null, "settings", user.uid), (snapshot)=> { settings={...settings,...(snapshot.data()||{})}; applyTheme(); applyI18n(); renderAll(); }));
}
async function note(message) { if (settings.notifications) await addDoc(collection(null, "notifications"), own({ message: cleanText(message, 180), createdAt: serverTimestamp(), read: false })); }

// ==========================================================
// ✅ دالة حفظ المعاملة (مع فحص تفصيلي)
// ==========================================================
async function saveTransaction(event) {
  event.preventDefault();
  console.log("🟢 [saveTransaction] بدأت");

  const type = $("typeInput").value;
  const date = $("dateInput").value;
  const categoryRaw = $("categoryInput").value;
  const descriptionRaw = $("descriptionInput").value;
  const amountRaw = $("amountInput").value;
  const recurring = $("recurringInput").checked;
  const frequency = $("frequencyInput").value;

  const category = cleanText(categoryRaw, 40);
  const description = cleanText(descriptionRaw);
  const amount = Number(amountRaw);

  console.log("📋 [type]", type);
  console.log("📋 [date]", date);
  console.log("📋 [category raw]", categoryRaw);
  console.log("📋 [category cleaned]", category);
  console.log("📋 [description raw]", descriptionRaw);
  console.log("📋 [description cleaned]", description);
  console.log("📋 [amount]", amount);
  console.log("📋 [recurring]", recurring);
  console.log("📋 [frequency]", frequency);

  if (!type) return status("نوع المعاملة مطلوب.", true);
  if (!date) return status("التاريخ مطلوب.", true);
  if (!category) return status("الفئة مطلوبة (يرجى اختيار فئة صالحة).", true);
  if (!description) return status("الوصف مطلوب.", true);
  if (isNaN(amount) || amount <= 0) return status("المبلغ يجب أن يكون أكبر من صفر.", true);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return status("تنسيق التاريخ غير صحيح (YYYY-MM-DD).", true);

  const payload = { type, date, category, description, amount, recurring, frequency, receipt: "" };
  const id = $("transactionId").value;

  const error = validateTransaction(payload, state.transactions, id);
  if (error) {
    console.error("❌ فشل التحقق من validateTransaction:", error);
    return status(error, true);
  }

  console.log("✅ التحقق ناجح، محاولة الحفظ...");

  try {
    if (!user?.uid) throw new Error("No authenticated user.");
    const ref = collection(null, "transactions");
    if (id) {
      await updateDoc(doc(null, "transactions", id), own(payload));
    } else {
      await addDoc(ref, own({ ...payload, createdAt: serverTimestamp() }));
      await note(`${payload.type === "income" ? "Income recorded" : "Expense recorded"}: ${payload.description}`);
    }
    console.log("✅ تم الحفظ بنجاح");
    closeModal();
  } catch (error) {
    console.error("❌ خطأ في الحفظ:", error);
    status(error.message, true);
  }
}

let modalTriggerElement = null;
function openModal(id="") {
  $("transactionForm").reset();
  $("transactionId").value=id;
  $("dateInput").value=new Date().toISOString().slice(0,10);
  if (id) {
    const item = state.transactions.find((entry) => entry.id === id);
    if (!item) { status("That transaction no longer exists.", true); return; }
    Object.entries(item).forEach(([key, value]) => { const input = $(`${key}Input`); if (input && typeof value !== "object") input.value = value; });
    $("recurringInput").checked = Boolean(item.recurring);
  }
  modalTriggerElement = document.activeElement;
  $("transactionModal").classList.remove("hidden");
  $("transactionModal").setAttribute("aria-hidden","false");
  $("descriptionInput").focus();
}
function closeModal() {
  $("transactionModal").classList.add("hidden");
  $("transactionModal").setAttribute("aria-hidden","true");
  status("");
  if (modalTriggerElement?.focus) modalTriggerElement.focus();
  modalTriggerElement = null;
}
async function askAI(prompt) { const response=await fetch("/api/assistant",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${await user.getIdToken()}`},body:JSON.stringify({prompt,transactions:state.transactions,goals,bills,budget:budget()})}); const data=await response.json(); if(!response.ok) throw new Error(data.error||"Assistant is unavailable."); return data.text; }
async function handleAssistant(eventOrText) { if(eventOrText?.preventDefault) eventOrText.preventDefault(); const prompt=typeof eventOrText === "string" ? eventOrText : $("assistantInput").value; if(!cleanText(prompt,500)) return; $("assistantInput").value=""; conversation.push({role:"user",text:prompt}); renderConversation(); try { const text=await askAI(prompt); conversation.push({role:"assistant",text}); renderConversation(); } catch(error) { conversation.push({role:"assistant",text:error.message}); renderConversation(); } }
function download(name, content, type) { const url=URL.createObjectURL(new Blob([content],{type})); const link=document.createElement("a"); link.href=url; link.download=name; link.click(); URL.revokeObjectURL(url); }
function renderConversation() { const chat=$("assistantChat"); chat.replaceChildren(...conversation.map((entry)=> { const row=document.createElement("div"); row.className=`assistant-message ${entry.role}`; const bubble=document.createElement("div"); bubble.className="message-bubble"; const title=document.createElement("strong"); title.textContent=entry.role === "user" ? "You" : "PocketWise AI"; const p=document.createElement("p"); p.textContent=entry.text; bubble.append(title,p); row.append(bubble); return row; })); }

// ==========================================================
// ✅ دالة المصادقة
// ==========================================================
async function authSubmit(event) {
  event.preventDefault();
  console.log("🟢 [authSubmit] تم الضغط على Sign In من النموذج");
  const email = $("authEmail").value.trim();
  const password = $("authPassword").value;
  const name = cleanText($("authName").value, 80);
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    $("authSubtitle").textContent = "Enter a valid email address.";
    return;
  }
  if (password.length < 8) {
    $("authSubtitle").textContent = "Use at least 8 characters for your password.";
    return;
  }
  try {
    let credential;
    if ($("authName").hidden) {
      console.log("🔵 [authSubmit] محاولة تسجيل الدخول...");
      credential = await signInWithEmailAndPassword(firebase().auth, email, password);
      console.log("✅ [authSubmit] تسجيل الدخول ناجح");
    } else {
      if (name.length < 2) throw new Error("Enter your full name.");
      console.log("🔵 [authSubmit] محاولة إنشاء حساب...");
      credential = await createUserWithEmailAndPassword(firebase().auth, email, password);
      await updateProfile(credential.user, { displayName: name });
      await setDoc(doc(null, "users", credential.user.uid), {
        uid: credential.user.uid,
        email: credential.user.email,
        displayName: name,
        createdAt: serverTimestamp()
      }, { merge: true });
      console.log("✅ [authSubmit] إنشاء الحساب ناجح");
    }
  } catch (error) {
    console.error("❌ [authSubmit] خطأ:", error.message);
    $("authSubtitle").textContent = error.message.replace("Firebase: ", "");
  }
}

async function authSubmitDirect(email, password) {
  console.log("🟢 [authSubmitDirect] محاولة تسجيل الدخول...");
  const fakeEvent = { preventDefault: () => {} };
  $("authEmail").value = email;
  $("authPassword").value = password;
  await authSubmit(fakeEvent);
}
window.authSubmitDirect = authSubmitDirect;

// ==========================================================
// ✅ دالة bind (مع تعديل زر Save)
// ==========================================================
function bind() {
  console.log("🔵 [bind] جاري ربط الأحداث...");

  const authForm = document.getElementById('authForm');
  if (authForm) {
    authForm.addEventListener('submit', authSubmit);
    console.log("✅ [bind] ربط نموذج تسجيل الدخول");
  }

  const signInBtn = document.getElementById('signInBtn');
  if (signInBtn) {
    const newBtn = signInBtn.cloneNode(true);
    signInBtn.parentNode.replaceChild(newBtn, signInBtn);
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const email = document.getElementById('authEmail').value.trim();
      const password = document.getElementById('authPassword').value;
      authSubmitDirect(email, password);
    });
    console.log("✅ [bind] ربط زر Sign In");
  }

  // ==========================================================
  // ✅ ربط زر Save Transaction مباشرةً (بدون الاعتماد على form submit)
  // ==========================================================
  const saveBtn = document.querySelector('#transactionForm .primary-btn');
  if (saveBtn) {
    // إزالة أي مستمعات سابقة
    saveBtn.removeEventListener('click', saveTransaction);
    saveBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log("🟢 [click] زر Save تم الضغط عليه");
      // إنشاء حدث وهمي لتمريره إلى saveTransaction
      const fakeEvent = { preventDefault: () => {}, stopPropagation: () => {} };
      saveTransaction(fakeEvent);
    });
    console.log("✅ [bind] تم ربط زر Save Transaction مباشرةً");
  } else {
    console.error("❌ زر Save Transaction غير موجود");
  }

  // جعل saveTransaction عالمية (كحل احتياطي)
  window.saveTransaction = saveTransaction;

  // ==========================================================
  // باقي الأحداث (لم تتغير)
  // ==========================================================
  $("openModalBtn").addEventListener("click", () => openModal());
  $("addExpenseBtn").addEventListener("click", () => openModal());
  $("closeModalBtn").addEventListener("click", closeModal);
  $("cancelModalBtn").addEventListener("click", closeModal);
  $("transactionModal").addEventListener("click", (event) => {
    if (event.target.id === "transactionModal") closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !$("transactionModal").classList.contains("hidden")) closeModal();
  });
  $("transactionsList").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    if (button.dataset.action === "edit") openModal(button.dataset.id);
    if (button.dataset.action === "delete" && confirm("Delete this transaction?")) {
      guarded(() => deleteDoc(doc(null, "transactions", button.dataset.id)), "Transaction deleted.");
    }
  });
  ["searchInput","typeFilter","categoryFilter","sortSelect","pageSizeSelect","searchScopeSelect"].forEach((id) => {
    $(id)?.addEventListener("input", () => {
      currentPage = 1;
      renderTransactions();
    });
  });
  $("prevPageBtn").addEventListener("click", () => {
    currentPage = Math.max(1, currentPage - 1);
    renderTransactions();
  });
  $("nextPageBtn").addEventListener("click", () => {
    currentPage++;
    renderTransactions();
  });
  $("globalSearchInput")?.addEventListener("input", (event) => {
    if ($("searchInput")) $("searchInput").value = event.target.value;
    currentPage = 1;
    renderTransactions();
  });
  $("globalSearchInput")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      $("transactionsSection")?.scrollIntoView({ behavior: "smooth" });
    }
  });
  $("saveBudgetBtn").addEventListener("click", () => {
    const value = Number($("budgetInput").value);
    if (!Number.isFinite(value) || value <= 0) return status("Enter a valid monthly budget.", true);
    guarded(async () => {
      await saveSettings({ monthlyBudget: value });
      await note(`Monthly budget set to ${money(value)}.`);
    }, "Budget saved.");
  });
  $("themeToggle").addEventListener("click", () => guarded(() => saveSettings({ theme: body.dataset.theme === "dark" ? "light" : "dark" })));
  $("themeSelect")?.addEventListener("change", (e) => guarded(() => saveSettings({ theme: e.target.value })));
  $("languageSelect")?.addEventListener("change", (e) => guarded(() => saveSettings({ language: e.target.value })));
  $("notificationsToggle")?.addEventListener("change", (e) => guarded(() => saveSettings({ notifications: e.target.checked })));
  $("goalForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const goal = {
      name: cleanText($("goalNameInput").value, 80),
      target: Number($("goalTargetInput").value),
      current: Number($("goalCurrentInput").value),
      deadline: $("goalDeadlineInput").value
    };
    if (goal.name.length < 2 || !Number.isFinite(goal.target) || goal.target <= 0 || goal.current < 0 || goal.current > goal.target || !validDate(goal.deadline)) {
      return status("Enter a valid goal, amount, progress, and deadline.", true);
    }
    guarded(async () => {
      await addDoc(collection(null, "goals"), own({ ...goal, createdAt: serverTimestamp() }));
      e.target.reset();
    }, "Goal saved.");
  });
  $("billForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const bill = {
      name: cleanText($("billNameInput").value, 80),
      amount: Number($("billAmountInput").value),
      date: $("billDateInput").value
    };
    if (bill.name.length < 2 || !Number.isFinite(bill.amount) || bill.amount <= 0 || !validDate(bill.date)) {
      return status("Enter a valid bill name, amount, and due date.", true);
    }
    guarded(async () => {
      await addDoc(collection(null, "bills"), own({ ...bill, createdAt: serverTimestamp() }));
      await note(`${bill.name} is due ${bill.date}.`);
      e.target.reset();
    }, "Bill saved.");
  });
  $("exportBtn")?.addEventListener("click", () => download("pocketwise-transactions.json", JSON.stringify(state.transactions, null, 2), "application/json"));
  $("exportCsvBtn")?.addEventListener("click", () => {
    const keys = ["date","type","category","description","amount","recurring","frequency"];
    download("pocketwise-transactions.csv",
      [keys.join(","), ...state.transactions.map((item) => keys.map((key) => `"${String(item[key] ?? "").replaceAll('"', '""')}"`).join(","))].join("\n"),
      "text/csv;charset=utf-8"
    );
  });
  $("importBtn")?.addEventListener("click", () => $("importInput").click());
  $("importInput")?.addEventListener("change", (event) => {
    guarded(async () => {
      const records = JSON.parse(await event.target.files[0].text());
      if (!Array.isArray(records)) throw new Error("Import must be a JSON array.");
      for (const record of records) {
        const payload = {
          type: record.type,
          date: record.date,
          category: cleanText(record.category, 40),
          description: cleanText(record.description),
          amount: Number(record.amount),
          recurring: Boolean(record.recurring),
          frequency: record.frequency || "monthly",
          receipt: ""
        };
        const error = validateTransaction(payload, state.transactions);
        if (error) throw new Error(error);
        await addDoc(collection(null, "transactions"), own({ ...payload, createdAt: serverTimestamp() }));
      }
    }, "Transactions imported successfully.").finally(() => {
      event.target.value = "";
    });
  });
  $("clearDataBtn")?.addEventListener("click", () => {
    if (!confirm("Delete all of your PocketWise financial data? This cannot be undone.")) return;
    guarded(async () => {
      for (const name of ["transactions","goals","bills","notifications"]) {
        for (const item of await new Promise((resolve, reject) => {
          const stop = onSnapshot(query(collection(null, name), where("uid", "==", user.uid)), (snapshot) => {
            stop();
            resolve(snapshot.docs);
          }, reject);
        })) {
          await deleteDoc(item.ref);
        }
      }
      await deleteDoc(doc(null, "settings", user.uid));
    }, "All data cleared.");
  });
  $("assistantForm").addEventListener("submit", handleAssistant);
  document.querySelectorAll(".suggestion-chip").forEach((button) => {
    button.addEventListener("click", () => handleAssistant(button.dataset.text));
  });
  $("authSwitchBtn").addEventListener("click", () => {
    const register = $("authName").hidden;
    $("authName").hidden = !register;
    $("authName").required = register;
    $("authTitle").textContent = register ? "Create Account" : "Sign In";
    $("authSwitchBtn").textContent = register ? "Already have an account?" : "Need an account?";
  });
  $("googleSignInBtn")?.addEventListener("click", async () => {
    try {
      await signInWithPopup(firebase().auth, new GoogleAuthProvider());
    } catch (error) {
      $("authSubtitle").textContent = error.message.replace("Firebase: ", "");
    }
  });
  $("forgotPasswordBtn")?.addEventListener("click", async () => {
    const email = $("authEmail").value.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) return $("authSubtitle").textContent = "Enter your email first.";
    try {
      await sendPasswordResetEmail(firebase().auth, email);
      $("authSubtitle").textContent = "Password reset email sent.";
    } catch (error) {
      $("authSubtitle").textContent = error.message.replace("Firebase: ", "");
    }
  });
  $("logoutBtn")?.addEventListener("click", async () => {
    try {
      await signOut(firebase().auth);
    } catch (error) {
      $("authSubtitle").textContent = error.message.replace("Firebase: ", "");
    }
  });
  const scrollToSection = (id) => $(id)?.scrollIntoView({ behavior: "smooth" });
  $("viewAnalyticsBtn")?.addEventListener("click", () => scrollToSection("analyticsSection"));
  $("openAssistantBtn")?.addEventListener("click", () => scrollToSection("assistantSection"));
  $("notificationsBtn")?.addEventListener("click", () => scrollToSection("notificationsList"));
  $("addGoalBtn")?.addEventListener("click", () => $("goalNameInput")?.focus());
  $("addBillBtn")?.addEventListener("click", () => $("billNameInput")?.focus());
  document.querySelectorAll(".nav-links a[data-section]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      document.querySelectorAll(".nav-links a").forEach((item) => item.classList.toggle("active", item === link));
      scrollToSection(`${link.dataset.section}Section`);
    });
  });
  console.log("✅ [bind] تم ربط جميع الأحداث");
}

// ==========================================================
// ✅ دالة التشغيل الرئيسية
// ==========================================================
async function boot() {
  console.log("🔵 [boot] بدء التشغيل...");
  populateCategoryOptions();
  applyI18n();
  try {
    await startFirebase();
    console.log("✅ [boot] Firebase جاهز");
    bind();
    onAuthStateChanged(firebase().auth, async (account) => {
      user = account;
      $("authView").classList.toggle("hidden", !!account);
      $("appView").classList.toggle("hidden", !account);
      if (account) {
        const displayName = account.displayName || account.email;
        if ($("profileName")) $("profileName").textContent = displayName;
        const avatar = $("profileAvatar");
        if (avatar) avatar.textContent = displayName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
        try {
          await setDoc(doc(null, "users", account.uid), { uid: account.uid, email: account.email, displayName, updatedAt: serverTimestamp() }, { merge: true });
          subscribeData();
        } catch (error) {
          console.error("[PocketWise] Failed to sync user profile", error);
          status("We couldn't sync your profile. Some data may be out of date.", true);
        }
        renderConversation();
      } else {
        unsubscribers.forEach((stop) => stop());
        unsubscribers = [];
        state.transactions = [];
        goals = [];
        bills = [];
        notifications = [];
        renderAll();
      }
    });
  } catch (error) {
    console.error("❌ [boot] خطأ:", error);
    $("authSubtitle").textContent = "Service setup is required: " + error.message;
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}
boot();