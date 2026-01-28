// Shipment Trend Line Chart
// Shipment Trend Line Chart
new Chart(document.getElementById("shipmentTrend"), {
    type: "line",
    data: {
        labels: ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
            data: [10, 25, 40, 55, 70, 90],
            borderColor: "#7CFF9B",
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 3,
            fill: false
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,   // ✅ CRITICAL FIX
        plugins: { legend: { display: false } },
        scales: {
            x: { ticks: { color: "#aaa" }, grid: { display: false } },
            y: { ticks: { color: "#aaa" }, grid: { color: "rgba(255,255,255,0.1)" } }
        }
    }
});


// Key Metrics Bar Chart
new Chart(document.getElementById("keyMetrics"), {
    type: "bar",
    data: {
        labels: ["2d", "7d", "30d"],
        datasets: [
            { data: [80, 90, 70], backgroundColor: "#7CFF9B" },
            { data: [60, 75, 85], backgroundColor: "#6EC1FF" }
        ]
    },
    options: {
        plugins: { legend: { display: false } },
        scales: {
            x: { ticks: { color: "#aaa" } },
            y: { ticks: { color: "#aaa" } }
        }
    }
});
