// calendar.js
export function renderCalendar(bills, transactions) {
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
  const billDates = bills.map(bill => bill.date);
  const transactionDates = transactions.map(t => t.date);
  const allEventDates = [...billDates, ...transactionDates];

  let html = '';
  dayNames.forEach(name => {
    html += `<div class="calendar-day-header">${name}</div>`;
  });

  for (let i = 0; i < startDayOfWeek; i++) {
    html += `<div class="calendar-day empty"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
    const hasEvent = allEventDates.includes(dateStr);

    let eventType = '';
    if (billDates.includes(dateStr)) eventType = 'bill';
    if (transactionDates.includes(dateStr)) eventType = 'transaction';
    if (billDates.includes(dateStr) && transactionDates.includes(dateStr)) eventType = 'both';

    html += `
      <div class="calendar-day ${isToday ? 'active' : ''} ${hasEvent ? 'has-event' : ''}" data-date="${dateStr}">
        <span class="day-number">${day}</span>
        ${hasEvent ? `<span class="event-dot ${eventType}"></span>` : ''}
      </div>
    `;
  }

  calendarGrid.innerHTML = html;
}