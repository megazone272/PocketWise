# 💰 PocketWise - AI Personal Finance & Expense Tracker

<div align="center">

### A clean, web-based personal finance dashboard powered by AI

PocketWise helps you keep track of your daily expenses, manage monthly budgets, and get quick AI insights on where your money goes. Built with vanilla JavaScript, Firebase, and a modern glassmorphic interface.

<p align="center">
  <a href="https://pocketwise.ox0x.com">
    <img src="https://img.shields.io/badge/Live_Demo-pocketwise.ox0x.com-4f46e5?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://github.com/megazone272/PocketWise">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repo" />
  </a>
  <img src="https://img.shields.io/badge/PWA-Offline_Ready-00D1B2?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA Ready" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" />
</p>

<br/>

<img src="screenshots/02_dashboard_dark.png" alt="PocketWise Main Dashboard" width="100%" style="border-radius: 10px;" />

</div>

---

## 📌 Why I Built PocketWise

Managing daily finances usually means dealing with bloated spreadsheets or paying monthly subscriptions for over-complicated finance apps. 

I created PocketWise to solve that. It gives you a fast, lightweight dashboard to track cash flow, monitor bill due dates, and set savings goals. It also includes an AI assistant (using Google Gemini & Groq) so you can ask natural questions about your spending habits, scan physical receipts, and get practical advice on saving more money every month.

---

## 📸 Screenshots & Interface Walkthrough

<div align="center">

### 🌙 Dark & ☀️ Light Themes
<table>
  <tr>
    <td width="50%" align="center"><b>Dark Mode Dashboard</b></td>
    <td width="50%" align="center"><b>Light Mode Dashboard</b></td>
  </tr>
  <tr>
    <td><img src="screenshots/02_dashboard_dark.png" width="100%" alt="Dark Theme Dashboard" /></td>
    <td><img src="screenshots/10_dashboard_light.png" width="100%" alt="Light Theme Dashboard" /></td>
  </tr>
</table>

### 💳 Transactions Ledger & Receipt Scanner
<table>
  <tr>
    <td width="50%" align="center"><b>Transaction History & Search</b></td>
    <td width="50%" align="center"><b>Add Transaction & AI Receipt Reader</b></td>
  </tr>
  <tr>
    <td><img src="screenshots/03_transactions.png" width="100%" alt="Transactions View" /></td>
    <td><img src="screenshots/04_add_transaction_modal.png" width="100%" alt="Add Transaction Modal" /></td>
  </tr>
</table>

### 🎯 Monthly Budgets & 📈 Expense Analytics
<table>
  <tr>
    <td width="50%" align="center"><b>Category Budgets & Goals</b></td>
    <td width="50%" align="center"><b>Spending Trends & Breakdown</b></td>
  </tr>
  <tr>
    <td><img src="screenshots/05_budgets.png" width="100%" alt="Category Budgets" /></td>
    <td><img src="screenshots/06_analytics.png" width="100%" alt="Charts & Analytics" /></td>
  </tr>
</table>

### 🤖 Gemini AI Assistant & 📅 Bills Calendar
<table>
  <tr>
    <td width="50%" align="center"><b>AI Finance Assistant</b></td>
    <td width="50%" align="center"><b>Upcoming Bills & Calendar View</b></td>
  </tr>
  <tr>
    <td><img src="screenshots/07_ai_assistant.png" width="100%" alt="AI Assistant Chat" /></td>
    <td><img src="screenshots/08_notifications_calendar.png" width="100%" alt="Calendar View" /></td>
  </tr>
</table>

### ⚙️ App Settings & 📱 Mobile Layout
<table>
  <tr>
    <td width="50%" align="center"><b>Preferences & Account Settings</b></td>
    <td width="50%" align="center"><b>Mobile View</b></td>
  </tr>
  <tr>
    <td><img src="screenshots/09_settings.png" width="100%" alt="Settings Panel" /></td>
    <td><img src="screenshots/11_mobile_view.png" width="100%" alt="Mobile Responsive Layout" /></td>
  </tr>
</table>

### 🔐 User Login Screen
<p align="center">
  <img src="screenshots/01_auth_page.png" width="80%" alt="Authentication Screen" />
</p>

</div>

---

## ⚡ What PocketWise Can Do

### 🤖 Smart AI Insights
- **Built-in Assistant**: Ask Gemini questions like "How much did I spend on food this month?" or "Give me 3 ways to cut my expenses."
- **Receipt OCR**: Take a picture of a store receipt, upload it, and let AI read the total amount and store name for you.
- **Voice Queries**: Use the mic icon to dictate queries or add transactions hands-free.

### 💳 Expense & Income Tracking
- **Quick Logging**: Add, edit, or delete transactions in seconds.
- **Filters & Search**: Look up past purchases by name, date range, or category.
- **Data Backup**: Export your financial logs to CSV or JSON anytime, or generate printable PDF summaries.

### 🎯 Budgets & Financial Goals
- **Budget Alerts**: Set spending limits for different categories. The app warns you when you cross 80% of your limit.
- **Goal Progress**: Track savings progress for specific milestones (e.g., emergency fund, new laptop, vacation).

### 🧾 Bills & Reminders
- **Calendar View**: See all your upcoming bill due dates alongside daily transactions on a clean visual grid.
- **Smart Notifications**: Get reminded before recurring payments or subscription renewals are due.

### 🎨 Customization & Accessibility
- **Glassmorphism UI**: High-contrast, modern visual style with customizable Dark and Light modes.
- **Bilingual (English & Arabic)**: Native right-to-left (RTL) layout support when switching to Arabic.
- **Offline PWA Support**: Installable as an app on your phone or desktop, working even without an active internet connection.

---

## 🛠️ Built With

- **Frontend**: HTML5, Vanilla CSS3 (CSS Variables + Glassmorphism styling), Vanilla JS (ES6 Modules)
- **Database & Auth**: Firebase Authentication & Cloud Firestore
- **Charts**: Chart.js 4.4
- **AI Engines**: Google Gemini API & Groq API
- **Offline Support**: Web Application Manifest & Service Workers

---

## 📁 Project Structure

```text
PocketWise/
├── index.html          # Main HTML structure
├── style.css           # Glassmorphism styling & animations
├── script.js           # Main application logic & navigation
├── server.js           # Node.js proxy server for API requests
├── firebase.js         # Firebase Auth & Firestore configuration
├── settings.js         # App preferences, language, & theme handling
├── transactions.js     # Transaction ledger CRUD operations
├── translations.js     # English & Arabic text strings
├── chart.js            # Chart.js initialization & data charts
├── calendar.js         # Monthly calendar & bill reminders logic
├── sw.js               # Service worker for offline caching
├── screenshots/        # Application interface screenshots
└── README.md           # Project documentation
```

---

## 🚀 How to Run Locally

If you want to run PocketWise on your own machine:

1. **Clone this repository:**
   ```bash
   git clone https://github.com/megazone272/PocketWise.git
   cd PocketWise
   ```

2. **Install node dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy `.env.example` to `.env` and add your Firebase and Groq / Gemini credentials:
   ```bash
   cp .env.example .env
   ```

4. **Launch the app:**
   ```bash
   npm start
   ```
   Then open `http://localhost:3007` in your browser.

---

## 🔒 Privacy & Security

- **Isolated User Data**: Firestore security rules ensure that each user can only read and write their own financial records (`request.auth.uid == userId`).
- **Local Cache**: Transactions are cached locally in your browser so you can keep working offline.
- **Secure API Key Handling**: Secret keys for AI services are handled through the Node backend proxy instead of exposed on the client.

---

## 👨‍💻 Creator

Developed by **Nour Ahmed**
- GitHub: [@megazone272](https://github.com/megazone272)
- Repo: [PocketWise on GitHub](https://github.com/megazone272/PocketWise)

If you find this project useful, feel free to give it a ⭐ on GitHub!
