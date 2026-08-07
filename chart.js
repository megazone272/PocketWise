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
    const income = monthTransactions.filter((transaction) => transaction.type === 'income').reduce((sum, item) => sum + Number(item.amount), 0);
    const expense = monthTransactions.filter((transaction) => transaction.type === 'expense').reduce((sum, item) => sum + Number(item.amount), 0);
    return { monthLabel, income, expense };
  });

  const categoryTotals = transactions.reduce((accumulator, transaction) => {
    if (transaction.type !== 'expense') {
      return accumulator;
    }

    accumulator[transaction.category] = (accumulator[transaction.category] || 0) + Number(transaction.amount);
    return accumulator;
  }, {});

  const categoryEntries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).slice(0, 6);

  lineChart?.destroy();
  lineChart = new Chart(lineCanvas, {
    type: 'line',
    data: {
      labels: monthlySummary.map((item) => item.monthLabel),
      datasets: [
        {
          label: 'Income',
          data: monthlySummary.map((item) => item.income),
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79,70,229,0.2)',
          tension: 0.35,
          fill: true,
        },
        {
          label: 'Expenses',
          data: monthlySummary.map((item) => item.expense),
          borderColor: '#fb923c',
          backgroundColor: 'rgba(249,115,22,0.2)',
          tension: 0.35,
          fill: true,
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false },
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
        },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });

  return { monthlySummary, categoryEntries, goals, bills };
};
