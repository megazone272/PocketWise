const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  console.log('Launching Edge browser via Puppeteer...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 850, deviceScaleFactor: 2 });

  console.log('Navigating to https://pocketwise.ox0x.com...');
  await page.goto('https://pocketwise.ox0x.com', { waitUntil: 'networkidle2' });

  // 1. Auth Page
  console.log('Capturing Auth page...');
  await page.screenshot({ path: path.join(screenshotsDir, '01_auth_page.png') });

  // Bypass Auth to show main app view with sample data loaded into UI
  await page.evaluate(() => {
    const authView = document.getElementById('authView');
    const appView = document.getElementById('appView');
    if (authView) authView.classList.add('hidden');
    if (appView) appView.classList.remove('hidden');
  });

  await new Promise(r => setTimeout(r, 1200));

  // 2. Main Dashboard (Dark Mode)
  console.log('Capturing Dashboard (Dark Mode)...');
  await page.screenshot({ path: path.join(screenshotsDir, '02_dashboard_dark.png') });

  // 3. Transactions Section
  console.log('Capturing Transactions...');
  await page.evaluate(() => {
    const link = document.querySelector('a[data-section="transactions"]');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '03_transactions.png') });

  // 4. Add Transaction Modal
  console.log('Capturing Add Transaction Modal...');
  await page.evaluate(() => {
    const modal = document.getElementById('transactionModal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '04_add_transaction_modal.png') });
  await page.evaluate(() => {
    const modal = document.getElementById('transactionModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
  });

  // 5. Budgets Section
  console.log('Capturing Budgets...');
  await page.evaluate(() => {
    const link = document.querySelector('a[data-section="budgets"]');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '05_budgets.png') });

  // 6. Analytics Section
  console.log('Capturing Analytics...');
  await page.evaluate(() => {
    const link = document.querySelector('a[data-section="analytics"]');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(screenshotsDir, '06_analytics.png') });

  // 7. AI Assistant Section
  console.log('Capturing AI Assistant...');
  await page.evaluate(() => {
    const link = document.querySelector('a[data-section="assistant"]');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '07_ai_assistant.png') });

  // 8. Notifications & Calendar Section
  console.log('Capturing Notifications & Calendar...');
  await page.evaluate(() => {
    const link = document.querySelector('a[data-section="notifications"]');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '08_notifications_calendar.png') });

  // 9. Settings Section
  console.log('Capturing Settings...');
  await page.evaluate(() => {
    const link = document.querySelector('a[data-section="settings"]');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '09_settings.png') });

  // 10. Dashboard (Light Theme)
  console.log('Capturing Dashboard (Light Theme)...');
  await page.evaluate(() => {
    document.body.dataset.theme = 'light';
    const link = document.querySelector('a[data-section="dashboard"]');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '10_dashboard_light.png') });

  // 11. Mobile View (Dark Mode)
  console.log('Capturing Mobile View...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.evaluate(() => {
    document.body.dataset.theme = 'dark';
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '11_mobile_view.png') });

  console.log('All screenshots captured successfully!');
  await browser.close();
})();
