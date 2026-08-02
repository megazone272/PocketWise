# PocketWise 💰

I made PocketWise because I got tired of Excel sheets and $10/month expense apps. It's a quick web dashboard to log daily spending, check monthly bills, and scan receipts using Gemini AI.

[Try Live Demo](https://pocketwise.ox0x.com) | [Source Code on GitHub](https://github.com/megazone272/PocketWise)

---

<div align="center">
  <img src="screenshots/02_dashboard_dark.png" alt="PocketWise Dashboard" width="100%" />
</div>

---

## Why I wrote this

Tracking daily expenses shouldn't feel like a chore. Every app I tried was either crammed with ads, wanted a monthly subscription, or made me fill out ten input fields just to log a coffee purchase.

I wanted something clean that opens instantly on my phone or laptop. So I spent a few weekends building PocketWise. No heavy JS frameworks, no build steps — just vanilla HTML, CSS glassmorphism, and plain JavaScript. For saving data, I used Firebase. I also added Google Gemini so I can just snap a picture of a receipt when I don't feel like typing out transactions by hand.

---

## Screenshots

Here is what the interface looks like across different devices and modes:

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

## What it does

- **Receipt OCR with Gemini**: Take a photo of a paper receipt and upload it. The AI reads the vendor, total price, and date for you.
- **AI Finance Assistant**: You can ask questions in plain English or Arabic like "how much did I spend on groceries this month?" or "give me ideas to cut down spending".
- **Voice logging**: Tap the mic button and talk to add expenses when your hands are full.
- **Transaction Ledger**: Add, edit, search, or filter income and expenses. Supports CSV, JSON, and PDF exports whenever you need backups.
- **Category Budgets**: Set spending caps for food, rent, or utilities. It turns yellow/red when you hit 80% of your budget limit.
- **Bills Calendar**: Visual calendar layout so you don't forget upcoming bill payments or subscriptions.
- **Dark & Light Mode**: Glassmorphic theme switcher that adapts to your system preferences.
- **Full Arabic & RTL Support**: Native Right-To-Left layout support for Arabic speakers.
- **Offline PWA**: Service workers cache the app locally so it works even without internet access.

---

## Tech stack

- **Frontend**: HTML5, Vanilla CSS3 (Glassmorphism), Vanilla JS (ES6 modules)
- **Database & Auth**: Firebase Auth + Cloud Firestore
- **Charts**: Chart.js 4.4
- **AI Integration**: Google Gemini API & Groq REST API
- **PDF Export**: jsPDF & AutoTable

---

## Project structure

```text
PocketWise/
├── index.html          # Main HTML entry
├── style.css           # Glassmorphism design system
├── script.js           # Core UI & navigation router
├── server.js           # Node backend proxy for AI keys
├── firebase.js         # Firebase Auth & Firestore setup
├── settings.js         # Language & theme settings
├── transactions.js     # Transaction CRUD operations
├── translations.js     # English and Arabic translation dictionaries
├── chart.js            # Chart.js charts
├── calendar.js         # Bills calendar logic
├── sw.js               # Service Worker for offline PWA
├── screenshots/        # Application screenshots
└── README.md           # Documentation
```

---

## How to run it

1. Clone the repo:
   ```bash
   git clone https://github.com/megazone272/PocketWise.git
   cd PocketWise
   ```

2. Install npm packages:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Copy `.env.example` to `.env` and fill in your Firebase and Gemini API keys:
   ```bash
   cp .env.example .env
   ```

4. Run the server:
   ```bash
   npm start
   ```

5. Open your browser and go to `http://localhost:3007`.

---

## Security

Your data is stored in Firebase Firestore under security rules (`request.auth.uid == userId`) so no one else can read or write your transaction records. Secret Gemini API keys are proxied on the server side so they never leak in browser code.

---

## Author

Created by **Nour Ahmed**
- GitHub: [@megazone272](https://github.com/megazone272)
- Repository: [megazone272/PocketWise](https://github.com/megazone272/PocketWise)

If you find this project useful, feel free to give it a ⭐ star on GitHub!
