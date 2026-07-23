const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const fs = require("fs");
const { createRequest } = require("../utils/mmManager");

const EXCHANGER_ROLE_ID = "1510212479274188870";

module.exports = {

    async execute(interaction) {

        let ticketData;

        try {
            ticketData = JSON.parse(interaction.channel.topic);
        } catch {
            return interaction.reply({
                content: "❌ Invalid ticket data.",
                ephemeral: true
            });
        }

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

        // Staff already has enough limit
        if (staff.available >= ticketData.amount) {
            return interaction.reply({
                content: "✅ Your available limit is enough. A Middleman is not required.",
                ephemeral: true
            });
        }

        // Save MM request
        createRequest(
            interaction.channel.id,
            interaction.user.id,
            Number(ticketData.amount)
        );

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("claim_mm")
                .setLabel("Claim MM")
                .setEmoji("🛡️")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("cancel_mm")
                .setLabel("Cancel")
                .setStyle(ButtonStyle.Danger)

        );

        await interaction.reply({

            content:
`<@&${EXCHANGER_ROLE_ID}>

# 🛡️ MIDDLEMAN REQUEST

👨‍💼 Requested By
${interaction.user}

💰 Exchange Amount
₹${Number(ticketData.amount).toLocaleString()}

📊 Your Available Limit
₹${staff.available.toLocaleString()}

⚠️ A higher limit exchanger is required.

Click **Claim MM** if you want to become the Middleman.`,

            components: [row]

        });

    }

};
