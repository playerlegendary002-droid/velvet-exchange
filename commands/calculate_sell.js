const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("calculate-sell")
        .setDescription("Calculate Sell Amount")
        .addNumberOption(option =>
            option
                .setName("amount")
                .setDescription("INR Amount")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {

        const amount = interaction.options.getNumber("amount");

        const rates = JSON.parse(
            fs.readFileSync("./data/rates.json", "utf8")
        );

        const rate = rates.sell;

        const usdt = amount / rate;

        const embed = new EmbedBuilder()
            .setColor(0xff4444)
            .setTitle("💹 Velvet Exchange Calculator")
            .addFields(
                {
                    name: "📉 Type",
                    value: "SELL",
                    inline: true
                },
                {
                    name: "💰 INR Amount",
                    value: `₹${amount}`,
                    inline: true
                },
                {
                    name: "💲 Sell Rate",
                    value: `₹${rate}`,
                    inline: true
                },
                {
                    name: "━━━━━━━━━━━━━━━━━━",
                    value: `## 🪙 Client Receives\n${usdt.toFixed(4)} USDT`
                }
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};