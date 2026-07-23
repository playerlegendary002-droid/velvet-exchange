const fs = require("fs");
const path = require("path");

const MM_PATH = path.join(__dirname, "../data/mm.json");

function loadMM() {

    if (!fs.existsSync(MM_PATH)) {
        fs.writeFileSync(MM_PATH, "{}");
    }

    return JSON.parse(
        fs.readFileSync(MM_PATH, "utf8")
    );

}

function saveMM(data) {

    fs.writeFileSync(
        MM_PATH,
        JSON.stringify(data, null, 4)
    );

}

function createRequest(channelId, requestedBy, amount) {

    const data = loadMM();

    data[channelId] = {

        requestedBy,
        middleman: null,
        amount,
        status: "waiting"

    };

    saveMM(data);

}

function claimMM(channelId, middlemanId) {

    const data = loadMM();

    if (!data[channelId]) return false;

    data[channelId].middleman = middlemanId;
    data[channelId].status = "active";

    saveMM(data);

    return true;

}

function removeRequest(channelId) {

    const data = loadMM();

    delete data[channelId];

    saveMM(data);

}

function getRequest(channelId) {

    const data = loadMM();

    return data[channelId];

}

module.exports = {

    createRequest,
    claimMM,
    removeRequest,
    getRequest

};