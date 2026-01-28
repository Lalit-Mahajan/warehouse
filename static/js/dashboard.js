let inventoryChart = null;

fetch("/api/inventory")
    .then(r => r.json())
    .then(d => {
        document.getElementById("totalSkus").innerText = d.total_skus;
        document.getElementById("lowStock").innerText = d.low_stock;

        const ctx = document.getElementById("inventoryChart").getContext("2d");

        /* 🔥 DESTROY OLD CHART */
        if (inventoryChart) {
            inventoryChart.destroy();
        }

        inventoryChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                datasets: [{
                    data: d.trend,
                    borderColor: "#ffffff",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,   /* ✅ VERY IMPORTANT */
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        ticks: { color: "#aaa" },
                        grid: { display: false }
                    },
                    y: {
                        ticks: { color: "#aaa" },
                        grid: { color: "rgba(255,255,255,0.1)" }
                    }
                }
            }
        });
    });

fetch("/api/shipments")
    .then(r => r.json())
    .then(data => {
        let list = document.getElementById("shipmentList");
        list.innerHTML = "";

        data.forEach(s => {
            let li = document.createElement("li");
            li.className = "list-group-item";
            li.innerHTML = `
            <span><i class="bi bi-box-seam me-2"></i>${s.order}</span>
            <span class="badge bg-info">${s.status}</span>
        `;
            list.appendChild(li);
        });
    });
