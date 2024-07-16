let $transactionTable = $('#transactionTable');
let $filterByName = $('#filterByName');
let $filterByAmount = $('#filterByAmount');
let transactionGraphContext = document.getElementById('transactionGraph').getContext('2d');
let transactions = [];
let customers = [];
let transactionGraph;

// ----------------- Add data from the JSON data -----------------
$.getJSON('db.json', function (data) {
    transactions = data.transactions;
    customers = data.customers;
    displayTransactions(transactions);
    displayChart(transactions);
});

// ----------------- Display transactions  -----------------
function displayTransactions(transactions) {
    $transactionTable.empty();
    $.each(transactions, function (_, transaction) {
        let customer = customers.find(c => c.id === transaction.customer_id);
        let row = `
                <tr>
                    <td class="rounded-3">${customer.name}</td>
                    <td class="rounded-3">${transaction.date}</td>
                    <td class="rounded-3">${transaction.amount}</td>
                </tr>
            `;
        $transactionTable.append(row);
    });
}

// ----------------- filtering part   -----------------
function filterTransactions() {
    let nameFilter = $filterByName.val().toLowerCase();
    let amountFilter = parseFloat($filterByAmount.val());
    let filteredTransactions = transactions.filter(transaction => {
        let customer = customers.find(c => c.id === transaction.customer_id);
        let matchesName = customer.name.toLowerCase().includes(nameFilter);
        let matchesAmount = isNaN(amountFilter) || transaction.amount >= amountFilter;
        return matchesName && matchesAmount;
    });
    displayTransactions(filteredTransactions);
    displayChart(filteredTransactions);
}

$filterByName.on('input', filterTransactions);
$filterByAmount.on('input', filterTransactions);

// ----------------- Display graph part  -----------------
function displayChart(transactions) {
    if (transactionGraph) {
        transactionGraph.destroy();
    }

    let groupedByDate = transactions.reduce((acc, transaction) => {
        acc[transaction.date] = (acc[transaction.date] || 0) + transaction.amount;
        return acc;
    }, {});
    let labels = Object.keys(groupedByDate);
    let data = Object.values(groupedByDate);

    transactionGraph = new Chart(transactionGraphContext, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Transaction Amount',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(206, 16, 16, 0.5)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    distribution: 'linear'
                }]
            }
        }
    });
}

// ----------------- Button Up Part  -----------------
$('#btnUp').on('click', function () {
    $('body').animate({ scrollTop: 0 }, 1000)
})