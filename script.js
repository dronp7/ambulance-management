let trips = JSON.parse(localStorage.getItem('trips')) || [];

document.getElementById('tripForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const trip = {
        from: document.getElementById('from').value,
        to: document.getElementById('to').value,
        ambulanceNumber: document.getElementById('ambulanceNumber').value,
        driver: document.getElementById('driver').value,
        nursingStaff: document.getElementById('nursingStaff').value,
        amount: parseFloat(document.getElementById('amount').value),
        expenses: parseFloat(document.getElementById('expenses').value),
        patientCondition: document.getElementById('patientCondition').value,
        problem: document.getElementById('problem').value,
        date: new Date().toISOString()
    };
    trips.push(trip);
    localStorage.setItem('trips', JSON.stringify(trips));
    this.reset();
    updateDashboard();
});

function updateDashboard() {
    updateTripHistory();
    updateFinancialSummary();
    updateIncomeChart();
}

function updateTripHistory() {
    const tbody = document.querySelector('#tripHistory tbody');
    tbody.innerHTML = '';
    trips.forEach(trip => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${trip.from}</td>
            <td>${trip.to}</td>
            <td>${trip.ambulanceNumber}</td>
            <td>${trip.driver}</td>
            <td>${trip.nursingStaff}</td>
            <td>${trip.amount}</td>
            <td>${trip.expenses}</td>
            <td>${trip.amount - trip.expenses}</td>
            <td>${trip.patientCondition}</td>
            <td>${trip.problem}</td>
        `;
    });
}

function updateFinancialSummary() {
    const totalIncome = trips.reduce((sum, trip) => sum + trip.amount, 0);
    const totalExpenses = trips.reduce((sum, trip) => sum + trip.expenses, 0);
    const totalNetIncome = totalIncome - totalExpenses;
    
    document.getElementById('financialSummary').innerHTML = `
        <p>Total Income: ₹${totalIncome}</p>
        <p>Total Expenses: ₹${totalExpenses}</p>
        <p>Total Net Income: ₹${totalNetIncome}</p>
    `;
}

function updateIncomeChart() {
    const ctx = document.getElementById('incomeChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: trips.map((_, index) => `Trip ${index + 1}`),
            datasets: [{
                label: 'Net Income',
                data: trips.map(trip => trip.amount - trip.expenses),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function generateDailyReport() {
    const today = new Date().toDateString();
    const dailyTrips = trips.filter(trip => new Date(trip.date).toDateString() === today);
    console.log('Daily Report:', dailyTrips);
    alert('Daily report generated! Check console for details.');
}

function generateWeeklyReport() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyTrips = trips.filter(trip => new Date(trip.date) >= oneWeekAgo);
    console.log('Weekly Report:', weeklyTrips);
    alert('Weekly report generated! Check console for details.');
}

function generateMonthlyReport() {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const monthlyTrips = trips.filter(trip => new Date(trip.date) >= oneMonthAgo);
    console.log('Monthly Report:', monthlyTrips);
    alert('Monthly report generated! Check console for details.');
}

updateDashboard();
