const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "tickets.json");

if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify({ buy: 0, sell: 0 }, null, 2));
}

function nextBuyTicket() {

    const data = JSON.parse(fs.readFileSync(file));

    data.buy++;

    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    return data.buy;

}

function nextSellTicket() {

    const data = JSON.parse(fs.readFileSync(file));

    data.sell++;

    fs.writeFileSync(file, JSON.stringify(data, null, 2));

    return data.sell;

}

module.exports = {

    nextBuyTicket,
    nextSellTicket

};