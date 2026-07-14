const fs = require("fs");

const FILE = "./data/orders.json";

function getOrders() {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

function saveOrder(order) {
    const orders = getOrders();
    orders.push(order);

    fs.writeFileSync(
        FILE,
        JSON.stringify(orders, null, 4)
    );
}

module.exports = {
    getOrders,
    saveOrder
};