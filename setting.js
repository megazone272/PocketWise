
const DEFAULT_SETTINGS = {
  theme: 'dark',               
  language: 'en',              
  notifications: true,         
  currency: 'USD',             
  budgetAlertThreshold: 80,    
  defaultView: 'dashboard',    
  dateFormat: 'YYYY-MM-DD',    
  autoSync: true,             
};

let currentSettings = { ...DEFAULT_SETTINGS };

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

export function getSettings() {
  return currentSettings;
}

export function updateSettings(newSettings) {
  currentSettings = { ...currentSettings, ...newSettings };
  localStorage.setItem('pocketwise_settings', JSON.stringify(currentSettings));
  applySettings(currentSettings);
  return currentSettings;
}

export function resetSettings() {
  currentSettings = { ...DEFAULT_SETTINGS };
  localStorage.setItem('pocketwise_settings', JSON.stringify(currentSettings));
  applySettings(currentSettings);
  return currentSettings;
}

function applySettings(settings) {

  document.body.dataset.theme = settings.theme;
  document.documentElement.lang = settings.language;
  
  const isRTL = settings.language === 'ar';
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.textContent = settings.theme === 'dark' ? '☾' : '☀';
  }
  
  const langSelect = document.getElementById('languageSelect');
  if (langSelect) langSelect.value = settings.language;
  
  const notifToggle = document.getElementById('notificationsToggle');
  if (notifToggle) notifToggle.checked = settings.notifications;
  
  const currencySelect = document.getElementById('currencySelect');
  if (currencySelect) currencySelect.value = settings.currency;
  
  const budgetAlertInput = document.getElementById('budgetAlertInput');
  if (budgetAlertInput) budgetAlertInput.value = settings.budgetAlertThreshold;
  
  const defaultViewSelect = document.getElementById('defaultViewSelect');
  if (defaultViewSelect) defaultViewSelect.value = settings.defaultView;
  
  applyCurrency(settings.currency);
}

function applyCurrency(currency) {
  window.__CURRENCY = currency;
}

export function exportSettings() {
  return JSON.stringify(currentSettings, null, 2);
}

export function importSettings(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    updateSettings(data);
    return true;
  } catch {
    return false;
  }
}

loadSettings();