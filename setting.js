// settings.js - إدارة الإعدادات المركزية

const DEFAULT_SETTINGS = {
  theme: 'dark',               // dark | light
  language: 'en',              // en | ar | es
  notifications: true,         // true | false
  currency: 'USD',             // USD | EUR | EGP | GBP
  budgetAlertThreshold: 80,    // نسبة مئوية (80 = 80%)
  defaultView: 'dashboard',    // dashboard | transactions | analytics
  dateFormat: 'YYYY-MM-DD',    // تنسيق التاريخ
  autoSync: true,              // مزامنة تلقائية
};

let currentSettings = { ...DEFAULT_SETTINGS };

// ============================================================
// دوال الإعدادات
// ============================================================

// تحميل الإعدادات من localStorage (أو من Firebase لاحقاً)
export function loadSettings() {
  try {
    const saved = localStorage.getItem('pocketwise_settings');
    if (saved) {
      currentSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } else {
      currentSettings = { ...DEFAULT_SETTINGS };
    }
  } catch {
    currentSettings = { ...DEFAULT_SETTINGS };
  }
  return currentSettings;
}

// الحصول على الإعدادات الحالية
export function getSettings() {
  return currentSettings;
}

// تحديث إعدادات معينة
export function updateSettings(newSettings) {
  currentSettings = { ...currentSettings, ...newSettings };
  localStorage.setItem('pocketwise_settings', JSON.stringify(currentSettings));
  
  // تطبيق التغييرات فوراً
  applySettings(currentSettings);
  
  return currentSettings;
}

// إعادة ضبط الإعدادات إلى الافتراضية
export function resetSettings() {
  currentSettings = { ...DEFAULT_SETTINGS };
  localStorage.setItem('pocketwise_settings', JSON.stringify(currentSettings));
  applySettings(currentSettings);
  return currentSettings;
}

// تطبيق الإعدادات على الواجهة
function applySettings(settings) {
  // تطبيق المظهر
  document.body.dataset.theme = settings.theme;
  document.documentElement.lang = settings.language;
  
  // تطبيق اتجاه النص (RTL للعربية)
  const isRTL = settings.language === 'ar';
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  
  // تحديث عناصر الواجهة (مثل التبديلات)
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.textContent = settings.theme === 'dark' ? '☾' : '☀';
  }
  
  const langSelect = document.getElementById('languageSelect');
  if (langSelect) langSelect.value = settings.language;
  
  const notifToggle = document.getElementById('notificationsToggle');
  if (notifToggle) notifToggle.checked = settings.notifications;
  
  // تطبيق العملة (تحديث في المعاملات)
  applyCurrency(settings.currency);
}

// تطبيق العملة على التطبيق
function applyCurrency(currency) {
  // تحديث تنسيق العملة في كل مكان
  // سيتم استخدامها في transactions.js
  window.__CURRENCY = currency;
}

// تصدير الإعدادات كـ JSON (للتصدير)
export function exportSettings() {
  return JSON.stringify(currentSettings, null, 2);
}

// تحميل الإعدادات من JSON
export function importSettings(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    updateSettings(data);
    return true;
  } catch {
    return false;
  }
}

// تهيئة الإعدادات عند تحميل الصفحة
loadSettings();