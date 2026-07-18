const {
    PermissionFlagsBits
} = require("discord.js");

const EXCHANGER_ROLE_ID = "1510212479274188870";
const MANAGER_ROLE_ID = "1508649940132434100";
const OWNER_ROLE_ID = "1508649102592966797";

async function lockTicket(channel, claimedByUserId, clientUserId) {

    // Hide from all Exchangers
    await channel.permissionOverwrites.edit(EXCHANGER_ROLE_ID, {
        ViewChannel: false
    });

    // Claimed staff can still see
    await channel.permissionOverwrites.edit(claimedByUserId, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true
    });

    // Client can still see
    await channel.permissionOverwrites.edit(clientUserId, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true
    });

    // Manager can always see
    await channel.permissionOverwrites.edit(MANAGER_ROLE_ID, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true
    });

    // Owner can always see
    await channel.permissionOverwrites.edit(OWNER_ROLE_ID, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true
    });

}

module.exports = {
    lockTicket
};