module.exports = (client) => {

    client.once("ready", () => {

        console.clear();

        console.log("==============================");
        console.log(" Velvet Exchange V2");
        console.log("==============================");
        console.log(`Logged in as ${client.user.tag}`);
        console.log("==============================");

    });

};