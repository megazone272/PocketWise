# PocketWise

Personal finance tracker built with plain JavaScript, CSS glassmorphism, and Firebase, with a bit of AI thrown in to make sense of monthly spending.

<p align="center">
  <a href="https://pocketwise.ox0x.com"><b>Live Demo</b></a> •
  <a href="https://github.com/megazone272/PocketWise"><b>GitHub Repo</b></a>
</p>

<br/>

<div align="center">
  <img src="screenshots/02_dashboard_dark.png" alt="PocketWise Dashboard" width="100%" style="border-radius: 10px;" />
</div>

---

## Why I made this

I built PocketWise mainly because I needed a simple way to track my own expenses without dealing with spreadsheet templates or paying monthly for apps like YNAB or Mint. 

I wanted something fast that loads instantly in the browser, works offline when I'm out, and lets me ask natural questions about where my money actually went at the end of the month. So I put this together using standard web tech (vanilla JS, HTML, CSS) backed by Firebase for storage and Google Gemini for the AI part.

---

## Interface Screenshots

Here is how the app looks in action across different screens and modes:

<div align="center">

### Dark & Light Themes
<table>
  <tr>
    <td width="50%" align="center"><b>Dark Dashboard</b></td>
    <td width="50%" align="center"><b>Light Dashboard</b></td>
  </tr>
  <tr>
    <td><img src="screenshots/02_dashboard_dark.png" width="100%" alt="Dark Theme" /></td>
    <td><img src="screenshots/10_dashboard_light.png" width="100%" alt="Light Theme" /></td>
  </tr>
</table>

### Transactions & Receipt Scanner
<table>
  <tr>
    <td width="50%" align="center"><b>Transaction History</b></td>
    <td width="50%" align="center"><b>Add Expense & AI Receipt Scan</b></td>
  </tr>
  <tr>
    <td><img src="screenshots/03_transactions.png" width="100%" alt="Transactions" /></td>
    <td><img src="screenshots/04_add_transaction_modal.png" width="100%" alt="Add Modal" /></td>
  </tr>
</table>

### Budgets & Charts
<table>
  <tr>
    <td width="50%" align="center"><b>Monthly Budgets</b></td>
    <td width="50%" align="center"><b>Analytics & Trends</b></td>
  </tr>
  <tr>
    <td><img src="screenshots/05_budgets.png" width="100%" alt="Budgets" /></td>
    <td><img src="screenshots/06_analytics.png" width="100%" alt="Analytics" /></td>
  </tr>
</table>

### AI Assistant & Bills Calendar
<table>
  <tr>
    <td width="50%" align="center"><b>Gemini AI Chat</b></td>
    <td width="50%" align="center"><b>Upcoming Bills Calendar</b></td>
  </tr>
  <tr>
    <td><img src="screenshots/07_ai_assistant.png" width="100%" alt="AI Chat" /></td>
    <td><img src="screenshots/08_notifications_calendar.png" width="100%" alt="Calendar" /></td>
  </tr>
</table>

### Settings & Mobile Layout
<table>
  <tr>
    <td width="50%" align="center"><b>Settings Page</b></td>
    <td width="50%" align="center"><b>Mobile View</b></td>
  </tr>
  <tr>
    <td><img src="screenshots/09_settings.png" width="100%" alt="Settings" /></td>
    <td><img src="screenshots/11_mobile_view.png" width="100%" alt="Mobile" /></td>
  </tr>
</table>

### Login Screen
<p align="center">
  <img src="screenshots/01_auth_page.png" width="80%" alt="Login Screen" />
</p>

</div>

---

## Core Features

- **AI Finance Assistant**: Integrated with Gemini AI so you can ask things like "what did I spend the most on this week?" or get suggestions on cutting monthly expenses.
- **Receipt Photo Scanning**: Upload a photo of a paper receipt and the OCR extracts the total, date, and merchant automatically.
- **Voice Commands**: Tap the mic button to speak transactions or ask questions if you don't feel like typing.
- **Full Transaction Ledger**: Add, edit, filter, or search income and expenses. You can also export your records to CSV, JSON, or printable PDF summaries.
- **Budget Alerts**: Set spending caps for food, rent, entertainment, etc. The app flags categories when you reach 80% of your budget limit.
- **Bills & Subscription Reminders**: Interactive calendar showing upcoming payment due dates so nothing slips past.
- **Dark & Light Modes**: Toggle themes anytime with glassmorphic cards and smooth transitions.
- **Bilingual Support (English & Arabic)**: Includes full right-to-left (RTL) layout switching when Arabic is selected.
- **PWA & Offline Mode**: Saves a local copy via service workers so you can use it offline on your phone or PC.

---

## Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Glassmorphism styling), Vanilla JS (ES6 modules)
- **Database & Auth**: Firebase Auth + Cloud Firestore
- **Charts**: Chart.js 4.4
- **AI Integration**: Google Gemini API & Groq REST API
- **PDF Export**: jsPDF & AutoTable

---

## File Structure

```text
PocketWise/
├── index.html          # Application layout
├── style.css           # Custom CSS & Glassmorphism styles
├── script.js           # Main app logic & tab routing
├── server.js           # Node backend proxy for API requests
├── firebase.js         # Firebase Auth & Firestore setup
├── settings.js         # Theme & language switcher
├── transactions.js     # Transaction CRUD operations
├── translations.js     # English and Arabic translation dictionaries
├── chart.js            # Chart.js charts setup
├── calendar.js         # Bills calendar & reminders logic
├── sw.js               # Service Worker for offline PWA support
├── screenshots/        # Application screenshots
└── README.md           # Documentation
```

---

## Local Setup

To run this on your local machine:

1. Clone the repository:
   ```bash
   git clone https://github.com/megazone272/PocketWise.git
   cd PocketWise
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and put your Firebase & Gemini API keys inside:
   ```bash
   cp .env.example .env
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open `http://localhost:3007` in your web browser.

---

## Security

User data is stored securely in Firebase Firestore with rules set so each account can only read and write their own records (`request.auth.uid == userId`). API keys for Gemini are proxied through the server side so they aren't exposed in client-side JS code.

---

## Author

Made by **Nour Ahmed**
- GitHub: [@megazone272](https://github.com/megazone272)
- Repo: [megazone272/PocketWise](https://github.com/megazone272/PocketWise)

If you find PocketWise helpful, feel free to star the repo on GitHub!
