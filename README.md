# 💳 PocketWise | AI Personal Finance & Expense Intelligence Dashboard

> **Your Money, Simplified.** Track every move, uncover financial patterns, and let AI guide your next best financial decision.

<p align="center">
  <img src="screenshots/02_dashboard_dark.png" alt="PocketWise Dashboard" width="100%" />
</p>

<p align="center">
  <a href="https://pocketwise.ox0x.com">
    <img src="https://img.shields.io/badge/Live_Demo-pocketwise.ox0x.com-4f46e5?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://pocketwise.ox0x.com">
    <img src="https://img.shields.io/badge/PWA-Offline_Ready-00D1B2?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA Ready" />
  </a>
  <a href="https://pocketwise.ox0x.com">
    <img src="https://img.shields.io/badge/AI_Powered-Gemini_Engine-8E44AD?style=for-the-badge&logo=google&logoColor=white" alt="AI Powered" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" />
</p>

---

## 🌟 Overview
**PocketWise** is a cutting-edge, progressive web application (PWA) that offers state-of-the-art modern ways to track personal finances, intelligently budget with the help of AI, and even discover financial insights guided by AI. It is backed by Google Gemini AI for content understanding, Chart.js for beautiful data visualiza-tions and a modern Glassmorphism UI design, that makes PocketWise available and convenient to use regardless of your device mobile, tablet or desktop.
---
## 📸 Screenshots & Interface walkthrough
<div align="center">
🌙 Dark & ☀ Light Dashboard Modes
<table>
<tr>
<td width="50%" align="center"><b>Dark Mode Dashboard</b></td>
<td width="50%" align="center"><b>Light Mode Dashboard</b></td>
</tr>
<tr>
<td><img src="screenshots/02_dashboard_dark.png" width="100%" /></td>
<td><img src="screenshors/10_dashboard_light.png" width="100%" /></td>
</tr>
</table>
💳 Transaction Management & AI Receipt Scanner
Transaction ledger & filters on the one side and adding your expense together with AI modal in the background on the other side.
Transactions Ledger & Filters
.
"Add Expense & AI Scanner Modal"
.
### 🎯 Monthly Budget Planner & Analytics Trends
Budgets
n
.
Interactive Analytics & Trends
Analytics

< TD>
< BR ALIGN=CENTER>
### ✦ AI Financial Assistant &Notifications Calendar
Gemini AI Financial Assistant Notifications &Bills Calendar


### 🔐 Authenticate Yourself & 📱 Responsiveness in Mobile




---  ---
## ✨ Core Features
### 📊 Financial Dashboard & Health Monitoring
- Your finances at a glance:
- Instant balance, monthly earning & expenses
- Net savings and trends
- Visual indicators for positive changes and negative ones
- Overall health evaluation, cash flow, savings percentages, and budgeting performance. The assessment is presented using dynamic charts and a score (0 -100).
- At-a-glance widgets: goals achieved vs. targets, bills due, etc.
- Real-time feed of transactions for the activity timeline.
### 💳 Full Transaction Handling
- All the CRUD (create, replace/update, delete) functions to add, update or delete your transaction records.
- Powerful filters to find transaction quickly, like searching for name, type (income/expense), category or custom filters.
- Manage expenses that you have to pay on a regular basis.
(weekly, monthly or yearly).
- Smart scanning of receipts with help of the artificial intelligence that automatically extracts the individual lines of expenses from a physical receipt picture or uploadedPDF file.
- **Data Management**: Full support for exporting and importing data in both **JSON** and **CSV** formats, along with a downloadable **PDF reports** feature.
### 🎯 3. Budget Planner & Goal Tracker
- **Monthly Budget Limits**: Decide how much you can spend and watch as the remaining percentage is continuously updated.
- **Warning System**: A graphical indicator that the 80% spending limit have been reached or the monthly budget has been over-exceeded. The warning system is part of the app and it gives the user a way to take quick actions.
- **Savings Goals**: Setting the final target, a user is allowed to create a countdown of days.
### 📈 4. Advanced Data Interpretation & Visualization
- **Line Charts**: Visual depiction of your income vs. spending.
- **Pie/Bar Charts with the category of expenses vs. income**: It's the pictorial representation of your discretionary budget.
- **Chart.js 4**: High-quality, animated, customizable charts for data analysis.
### ✦ 5. AI-Driven Financial Assistant & Voice Command
- **Gemini-Backed Chatbot**: A real-time conversation with suggestions on ways to make your spending habits more effective, reduce the budget waste, and identify possible money-saving measures.
- **Immediate Quick Actions (1-Click)**: One-tap suggestions like *I'll cut expenses by 15%*, *I'll increase my savings*, and *Show me the summary of my transactions*.
- **Voice Control**: Speak a financial request directly to the AI by tapping on the microphone button.
### 🔔 6. Calendar & Smart Alerts
- **Monthly Calendar View**: You can find an easy way to see and remember the bills you need to pay through the calendar.
- **Notifications**: Receive the first-hand alerts regarding a major expense, the reminder of the upcoming bills, and the notification of the potential recurrent subscription.
### ⚙ 7. Customize & Work Offline
- **Appearance (Dark / Light)**: The mode change is done smoothly, and the beautiful glassmorphism style makes it possible to have an attractive interface without losing its functionality.
- **Multilingual / RTL Ready**: English and Spanish (Español) are pre-set language options. Additionally, you can choose Arabic (العربية) as your language for the user interface with its native RTL text layout.
- **PWA Features**: It works both on mobile and desktop as a native app with a local copy of a database and service workers allowing full offline support after the first access.
-, **Keyboard Command (Cmd / Ctrl + K) Window** allows performing fast actions and navigating using just the keyboard.
---
## 🛠 Technology Stack
Component | Technology / Library
--- | ---
**Core UI Framework** | HTML5, JavaScript (ES6+Modules), Vanilla CSS3 (Glassmorphism design system')
**Fonts / Text** | Font Library (Outfit, Inter)
**Charts** | JavaScript Chart Library 4.4, Highlight.js
**Identity & Storage** | Firebase Auth, Cloud Firestore
**Brain & Chatbot AI** | Google Gemini API (REST API)
**PWA & Offline Support** | Web Application Manifest, Service Worker
**Printing / Exporting to PDF** | jsPDF, AutoTable
---
## 🚀 Get Started / How to Install
### Choice a: Web App on the Fly (Instant Use)
Jump into your web-connected computer at
[https://pocketwise.ox0x.com](https://pocketwise.ox0x.com)
to try out the web app version of the software.
### Choice b: Development / Debugging / Customizing
1. **Fork/Git the Repo**
```bash
git clone https://github.com/your-username/pocketwise.git
cd pocketwise
2. **Run / Show / Play Locally**
The method is to use a local static server like, e. g., live-server or the serve:
```bash
npx serve.
```
3. **View on a browser**
Go to the local computer page, usually `http://localhost:3000` or the same address that was printed in your console by the static server.
---
## 🛡 Protection & Users' Data Protection
Security of user's data is handled using the following mechanisms:
- **Client-Side Calculation and Data Security**: The user is safe to do transaction-related calculations on his own PC without giving his privacy away online.
- User accounts are secured by Firebase Auth and Firestore Rules. Each authenticated user is given a separate, isolated database.
- If Internet is unavailable, or it's slow, the client will fall back to the local copy in the browser (localStorage). It allows you to still do your work offline and later sync everything when back online.
---
## 📄 License
This project is available under the MIT License read all about it in LICENSE.

