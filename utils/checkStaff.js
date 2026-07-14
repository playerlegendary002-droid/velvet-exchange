const config = require("../config.json");

module.exports = function (interaction) {

    return interaction.member.roles.cache.has(config.staffRole);

};