const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const fs = require("fs");
const { claimMM, getRequest } = require("../utils/mmManager");

const EXCHANGER_ROLE_ID = "1510212479274188870";

module.exports = {

    async execute(interaction) {

        const request = getRequest(interaction.channel.id);

        if (!request) {
            return interaction.reply({
                content: "❌ No active MM request found.",
                ephemeral: true
            });
        }

        // Prevent the requester from claiming their own MM
        if (request.requestedBy === interaction.user.id) {
            return interaction.reply({
                content: "❌ You cannot become the middleman for your own ticket.",
                ephemeral: true
            });
        }

        // Check if the user is an Exchanger
        if (!interaction.member.roles.cache.has(EXCHANGER_ROLE_ID)) {
            return interaction.reply({
                content: "❌ Only Exchangers can claim MM requests.",
                ephemeral: true
            });
        }

        // Check available limit
        const limits = JSON.parse(
            fs.readFileSync("./data/limits.json", "utf8")
        );

        const staff = limits[interaction.user.id];

        if (!staff) {
            return interaction.reply({
                content: "❌ No exchange limit assigned.",
                ephemeral: true
            });
        }

        if (staff.available < request.amount) {
            return interaction.reply({
                content:
`❌ Your available limit is not enough.

Required: ₹${request.amount.toLocaleString()}

Available: ₹${staff.available.toLocaleString()}`,
                ephemeral: true
            });
        }

        // Already claimed?
        if (request.middleman) {
            return interaction.reply({
                content: "❌ This MM request has already been claimed.",
                ephemeral: true
            });
        }

        // Save middleman
        claimMM(
            interaction.channel.id,
            interaction.user.id
        );

        // Disable buttons
        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("claim_mm")
                .setLabel(`Claimed by ${interaction.user.username}`)
                .setEmoji("🛡️")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            new ButtonBuilder()
                .setCustomId("cancel_mm")
                .setLabel("Cancel")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)

        );

        await interaction.update({

            content:
`# 🛡️ MIDDLEMAN ASSIGNED

👨‍💼 Primary Exchanger
<@${request.requestedBy}>

🛡️ Middleman
${interaction.user}

💰 Amount
₹${request.amount.toLocaleString()}

✅ Waiting for crypto from the Primary Exchanger.`,

            components: [row]

        });

    }

};