# PocketWise 💰

A simple, glassmorphic personal finance dashboard I built to track daily expenses, keep an eye on monthly bills, and test out Gemini AI for receipt scanning.

[Live Demo](https://pocketwise.ox0x.com) • [GitHub Repo](https://github.com/megazone272/PocketWise)

---

<div align="center">
  <img src="screenshots/02_dashboard_dark.png" alt="PocketWise Dark Dashboard" width="100%" />
</div>

---

## What is this?

Honestly, I was getting pretty annoyed with bloated expense apps that ask for $10 a month just to log basic transactions. I wanted something clean that I could open on my phone or laptop, add an expense in 5 seconds, and actually see where my money was going without setting up complicated Excel formulas.

So I built PocketWise over a few weekends. It runs completely in the browser using vanilla JS, CSS glassmorphism, and Firebase for saving data. I also wired it up to Google Gemini so I could take pictures of receipts or ask questions about my spending habits in plain English or Arabic.

---

## App Screenshots

Here is how the dashboard looks across different sections:

<div align="center">

### Dark & Light Themes
<table>
  <tr>
    <td width="50%" align="center"><b>Dark Mode</b></td>
    <td width="50%" align="center"><b>Light Mode</b></td>
  </tr>
  <tr>
    <td><img src="screenshots/02_dashboard_dark.png" width="100%" alt="Dark Mode" /></td>
    <td><img src="screenshots/10_dashboard_light.png" width="100%" alt="Light Mode" /></td>
  </tr>
</table>

### Transactions & Receipt OCR
<table>
  <tr>
    <td width="50%" align="center"><b>Transactions List</b></td>
    <td width="50%" align="center"><b>Add Expense / Receipt Scan</b></td>
  </tr>
  <tr>
    <td><img src="screenshots/03_transactions.png" width="100%" alt="Transactions" /></td>
    <td><img src="screenshots/04_add_transaction_modal.png" width="100%" alt="Add Transaction" /></td>
  </tr>
</table>

### Budgets & Chart Analytics
<table>
  <tr>
    <td width="50%" align="center"><b>Monthly Category Budgets</b></td>
    <td width="50%" align="center"><b>Visual Analytics & Trends</b></td>
  </tr>
  <tr>
    <td><img src="screenshots/05_budgets.png" width="100%" alt="Budgets" /></td>
    <td><img src="screenshots/06_analytics.png" width="100%" alt="Analytics" /></td>
  </tr>
</table>

### AI Chatbot & Bills Calendar
<table>
  <tr>
    <td width="50%" align="center"><b>Gemini AI Chat</b></td>
    <td width="50%" align="center"><b>Bills Calendar View</b></td>
  </tr>
  <tr>
    <td><img src="screenshots/07_ai_assistant.png" width="100%" alt="AI Chat" /></td>
    <td><img src="screenshots/08_notifications_calendar.png" width="100%" alt="Calendar" /></td>
  </tr>
</table>

### Settings & Mobile Interface
<table>
  <tr>
    <td width="50%" align="center"><b>Settings Panel</b></td>
    <td width="50%" align="center"><b>Mobile Layout</b></td>
  </tr>
  <tr>
    <td><img src="screenshots/09_settings.png" width="100%" alt="Settings" /></td>
    <td><img src="screenshots/11_mobile_view.png" width="100%" alt="Mobile" /></td>
  </tr>
</table>

### Authentication
<p align="center">
  <img src="screenshots/01_auth_page.png" width="80%" alt="Auth Page" />
</p>

</div>

---

## Main Things You Can Do

- **Ask AI about your money**: You can chat with Gemini to ask stuff like "where did most of my money go this month?" or ask for advice on lowering your food budget.
- **Scan paper receipts**: Just snap or upload a photo of a receipt. The AI reads the merchant name, total cost, and date so you don't have to type it manually.
- **Voice logging**: If you're on your phone and lazy to type, hit the mic button and just speak out your transaction.
- **Manage daily transactions**: Full control to add, edit, search, or filter income and expenses by category. You can export everything to CSV, JSON, or printable PDF summaries whenever you want.
- **Budget tracking with warnings**: Set monthly limits for categories like groceries or entertainment. It shows a visual warning once you hit 80% of your budget limit.
- **Bills & subscriptions calendar**: A visual calendar so you don't forget when upcoming bills or subscriptions are due.
- **Dark & Light mode**: Switch themes whenever you want. The glassmorphism UI adapts smoothly.
- **English & Arabic (RTL)**: Native Arabic support with full Right-To-Left layout direction.
- **Works offline (PWA)**: Built with service workers so it caches locally and works even if your Wi-Fi drops.

---

## Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Glassmorphism), Vanilla JS (ES6 modules)
- **Database & Auth**: Firebase Auth + Cloud Firestore
- **Charts**: Chart.js 4.4
- **AI Integration**: Google Gemini API & Groq REST API
- **PDF Export**: jsPDF & AutoTable

---

## Folder Structure

```text
PocketWise/
├── index.html          # Main web page
├── style.css           # Custom glassmorphism styles
├── script.js           # Main app logic & navigation
├── server.js           # Node.js backend proxy for AI API keys
├── firebase.js         # Firebase Auth & Firestore setup
├── settings.js         # Theme & language preferences
├── transactions.js     # Transaction CRUD operations
├── translations.js     # English and Arabic translation dictionaries
├── chart.js            # Chart.js integration
├── calendar.js         # Bills calendar logic
├── sw.js               # Service Worker for PWA offline support
├── screenshots/        # App screenshots
└── README.md           # Documentation
```

---

## How to Run It Locally

If you want to spin this up on your local machine:

1. Clone the repo:
   ```bash
   git clone https://github.com/megazone272/PocketWise.git
   cd PocketWise
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Copy `.env.example` to `.env` and paste your Firebase & Gemini API keys inside:
   ```bash
   cp .env.example .env
   ```

4. Start the app:
   ```bash
   npm start
   ```

5. Open your browser to `http://localhost:3007`.

---

## Security Notes

Your financial data is saved in Firebase Firestore under strict rules (`request.auth.uid == userId`) so only you can access your own account. All secret Gemini API keys are kept safely on the Node backend side and never exposed in public frontend JS.

---

## Author

Created by **Nour Ahmed**
- GitHub: [@megazone272](https://github.com/megazone272)
- Repo: [megazone272/PocketWise](https://github.com/megazone272/PocketWise)

Feel free to leave a ⭐ star on GitHub if you like the project!
