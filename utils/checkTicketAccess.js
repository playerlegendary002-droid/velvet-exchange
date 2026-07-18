const checkStaff = require("./checkStaff");

const MANAGER_ROLE_ID = "1508649940132434100";
const OWNER_ROLE_ID = "1508649102592966797";

async function checkTicketAccess(interaction) {

    if (!checkStaff(interaction)) {
        await interaction.reply({
            content: "❌ Only staff members can use this button.",
            ephemeral: true
        });
        return false;
    }

    let ticketData;

    try {
        ticketData = JSON.parse(interaction.channel.topic);
    } catch {
        await interaction.reply({
            content: "❌ Invalid ticket data.",
            ephemeral: true
        });
        return false;
    }

    // Ticket not claimed yet
    if (!ticketData.claimedBy) {
        return true;
    }

    // Claimed exchanger
    if (ticketData.claimedBy === interaction.user.id) {
        return true;
    }

    // Manager
    if (interaction.member.roles.cache.has(MANAGER_ROLE_ID)) {
        return true;
    }

    // Owner
    if (interaction.member.roles.cache.has(OWNER_ROLE_ID)) {
        return true;
    }

    await interaction.reply({
        content: "❌ This ticket is assigned to another exchanger.",
        ephemeral: true
    });

    return false;

}

module.exports = {
    checkTicketAccess
};