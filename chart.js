const Chart = window.Chart;
let lineChart;
let categoryChart;

export const createCharts = (lineCanvas, categoryCanvas, transactions, goals, bills) => {
  if (!lineCanvas || !categoryCanvas || !Chart) {
    return;
  }

  const monthlySummary = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));

    const monthLabel = date.toLocaleString('en', { month: 'short' });

    const monthTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === date.getMonth() && transactionDate.getFullYear() === date.getFullYear();
    });

    const income = monthTransactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const expense = monthTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, item) => sum + Number(item.amount), 0);

    return { monthLabel, income, expense };
  });

  const categoryTotals = transactions.reduce((accumulator, transaction) => {
    if (transaction.type !== 'expense') {
      return accumulator;
    }

    accumulator[transaction.category] = (accumulator[transaction.category] || 0) + Number(transaction.amount);
    return accumulator;
  }, {});

  const categoryEntries = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  lineChart?.destroy();
  
  const ctxLine = lineCanvas.getContext('2d');
  const incomeGradient = ctxLine.createLinearGradient(0, 0, 0, 300);
  incomeGradient.addColorStop(0, 'rgba(74, 222, 128, 0.4)');
  incomeGradient.addColorStop(1, 'rgba(74, 222, 128, 0.0)');
  
  const expenseGradient = ctxLine.createLinearGradient(0, 0, 0, 300);
  expenseGradient.addColorStop(0, 'rgba(248, 113, 113, 0.4)');
  expenseGradient.addColorStop(1, 'rgba(248, 113, 113, 0.0)');

  lineChart = new Chart(lineCanvas, {
    type: 'line',
    data: {
      labels: monthlySummary.map((item) => item.monthLabel),
      datasets: [
        {
          label: 'Income',
          data: monthlySummary.map((item) => item.income),
          borderColor: '#4ade80',
          backgroundColor: incomeGradient,
          borderWidth: 2,
          pointBackgroundColor: '#4ade80',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#4ade80',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Expenses',
          data: monthlySummary.map((item) => item.expense),
          borderColor: '#f87171',
          backgroundColor: expenseGradient,
          borderWidth: 2,
          pointBackgroundColor: '#f87171',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#f87171',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#c8d0e0',
            usePointStyle: true,
            padding: 20,
            font: { family: "'Inter', sans-serif", size: 12 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleColor: '#fff',
          bodyColor: '#c8d0e0',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false, drawBorder: false },
          ticks: { color: '#94a3b8', font: { family: "'Inter', sans-serif" } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)', borderDash: [5, 5], drawBorder: false },
          ticks: {
            color: '#94a3b8',
            font: { family: "'Inter', sans-serif" },
            callback: function(value) { return '$' + value; }
          }
        }
      }
    },
  });

  categoryChart?.destroy();
  categoryChart = new Chart(categoryCanvas, {
    type: 'doughnut',
    data: {
      labels: categoryEntries.map(([category]) => category),
      datasets: [
        {
          data: categoryEntries.map(([, amount]) => amount),
          backgroundColor: ['#4f46e5', '#8b5cf6', '#22c55e', '#fb923c', '#38bdf8', '#f43f5e'],
          borderWidth: 0,
          hoverOffset: 4
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#c8d0e0',
            usePointStyle: true,
            padding: 15,
            font: { family: "'Inter', sans-serif", size: 12 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          bodyColor: '#fff',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed !== null) {
                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
              }
              return label;
            }
          }
        }
      }
    },
  });

  return { monthlySummary, categoryEntries, goals, bills };
};

export function renderCalendar(bills = [], transactions = []) {
  const calendarGrid = document.getElementById('calendarGrid');
  if (!calendarGrid) return;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const billDates = new Set(bills.map((bill) => bill.date));
  const transactionDates = new Set(transactions.map((t) => t.date));

  let html = dayNames
    .map((name) => `<div class="calendar-day-header">${name}</div>`)
    .join('');

  for (let i = 0; i < startDayOfWeek; i++) {
    html += '<div class="calendar-day empty"></div>';
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday =
      day === now.getDate() &&
      month === now.getMonth() &&
      year === now.getFullYear();

    const hasBill = billDates.has(dateStr);
    const hasTransaction = transactionDates.has(dateStr);
    const hasEvent = hasBill || hasTransaction;

    let eventType = '';
    if (hasBill && hasTransaction) {
      eventType = 'both';
    } else if (hasBill) {
      eventType = 'bill';
    } else if (hasTransaction) {
      eventType = 'transaction';
    }

    const activeClass = isToday ? ' active' : '';
    const eventClass = hasEvent ? ' has-event' : '';
    const eventDot = hasEvent ? `<span class="event-dot ${eventType}"></span>` : '';

    html += `
      <div class="calendar-day${activeClass}${eventClass}" data-date="${dateStr}">
        <span class="day-number">${day}</span>
        ${eventDot}
      </div>
    `;
  }

  calendarGrid.innerHTML = html;
}
