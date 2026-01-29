from flask import Flask, render_template, jsonify, request, redirect, session
from pymongo import MongoClient
import config

app = Flask(__name__)
app.secret_key = "wms_secret_key"

# ---------------- MONGODB CONNECTION ----------------
client = MongoClient(config.MONGO_URI)
db = client[config.DB_NAME]
inventory_col = db["inventory"]
users_col = db["users"]
reports_col=db["reports"]

# ---------------- LOGIN ----------------
@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "").strip()

        user = users_col.find_one({
            "username": username,
            "password": password
        })

        if user:
            session["user"] = user["username"]
            return redirect("/dashboard")
        else:
            return render_template("login.html", error="Invalid Username or Password")

    return render_template("login.html")


# ---------------- LOGOUT ----------------
@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

# ---------------- DASHBOARD ----------------
@app.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect("/")
    return render_template("dashboard.html")

# ---------------- MERGED PAGES ----------------
@app.route("/inventory-orders-receiving")
def inv_ord_recv():
    if "user" not in session:
        return redirect("/")

    inventory = list(inventory_col.find({}, {
        "_id": 0,
        "ID": 1,
        "Product Name": 1,
        "Sub-Category": 1,
        "Quantity": 1
    }))

    return render_template("inv_ord_recv.html", inventory=inventory)

#----Shipping---------
@app.route("/shipping")
def shipping_page():
    if "user" not in session:
        return redirect("/")
    return render_template("ship_report.html")

#----Reports-------
@app.route("/reports")
def reports_page():
    if "user" not in session:
        return redirect("/")

    item_id = request.args.get("item_id")

    query = {}
    if item_id:
        query = {"item_id": item_id}

    reports_data = list(
        reports_col.find(query, {
            "_id": 0,
            "item_id": 1,
            "event_type": 1,
            "quantity_impact": 1,
            "sell_price": 1,
            "min_stock": 1,
            "lead_time": 1 
        })
    )

    return render_template("reports.html", reports=reports_data)


# ---------------- API ----------------
@app.route("/api/inventory")
def inventory():
    total_skus = inventory_col.count_documents({})
    low_stock = inventory_col.count_documents({"Quantity": {"$lt": 50}})

    # static trend same as before (graph change nahi)
    trend = [12, 18, 10, 15, 17, 22]

    return jsonify({
        "total_skus": total_skus,
        "low_stock": low_stock,
        "trend": trend
    })

@app.route("/api/shipments")
def shipments():
    return jsonify([
        {"order": "Customer: Picking", "status": "Picking"},
        {"order": "Customer: Packed", "status": "Packed"},
        {"order": "Customer: Packed", "status": "Shipped"},
        {"order": "Stashifier: B4-50", "status": "In Transit"}
    ])

# ---------------- SEARCH API ----------------
@app.route("/api/search")
def search():
    q = request.args.get("q", "").strip()

    pages = [
        {"name": "dashboard", "url": "/dashboard"},
        {"name": "inventory", "url": "/inventory-orders-receiving"},
        {"name": "orders", "url": "/inventory-orders-receiving"},
        {"name": "receiving", "url": "/inventory-orders-receiving"},
        {"name": "shipping", "url": "/shipping"},
        {"name": "reports", "url": "/reports"},
    ]

    report=reports_col.find_one(
        {"item_id":{"$regex": f"^{q}", "$options": "i"}},
        {"_id":0}
    )

    result=[p for p in pages if q in p["name"]]
    if report:
        result.append({
            "name": report["item_id"],
            "url": f"/reports?item_id={report['item_id']}"
        })
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)



