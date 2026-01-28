document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.querySelector(".search-box");
    if (!searchBox) return;

    // 🔹 All searchable names
    const items = [
        { name: "Dashboard", url: "/dashboard" },
        { name: "Inventory", url: "/inventory-orders-receiving" },
        { name: "Orders", url: "/inventory-orders-receiving" },
        { name: "Order Management", url: "/inventory-orders-receiving" },
        { name: "Receiving", url: "/inventory-orders-receiving" },
        { name: "Receiving Operations", url: "/inventory-orders-receiving" },
        { name: "Shipping", url: "/shipping-reports" },
        { name: "Reports", url: "/shipping-reports" },
        { name: "Supplier", url: "/shipping-reports" },
        { name: "Shipment Volume Trend", url: "/shipping-reports" }
    ];

    // 🔹 Create native dropdown (no CSS)
    const list = document.createElement("datalist");
    list.id = "search-list";

    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item.name;
        list.appendChild(option);
    });

    document.body.appendChild(list);
    searchBox.setAttribute("list", "search-list");

    // 🔹 Enter key → redirect
    searchBox.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;

        const value = searchBox.value.toLowerCase();
        const match = items.find(i => i.name.toLowerCase() === value);

        if (match) {
            window.location.href = match.url;
        } else {
            alert("No matching page found");
        }
    });
});
