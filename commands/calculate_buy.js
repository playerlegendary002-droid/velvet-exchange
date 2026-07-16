const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("calculate-buy")
        .setDescription("Calculate Buy Amount")
        .addNumberOption(option =>
            option
                .setName("amount")
                .setDescription("USDT Amount")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {

        const amount = interaction.options.getNumber("amount");

        const rates = JSON.parse(
            fs.readFileSync("./data/rates.json", "utf8")
        );

        const rate = rates.buy;

        const total = amount * rate;

        const embed = new EmbedBuilder()
            .setColor(0x00ff88)
            .setTitle("💹 Velvet Exchange Calculator")
            .addFields(
                {
                    name: "📈 Type",
                    value: "BUY",
                    inline: true
                },
                {
                    name: "💰 Crypto",
                    value: `${amount} USDT`,
                    inline: true
                },
                {
                    name: "💲 Buy Rate",
                    value: `₹${rate}`,
                    inline: true
                },
                {
                    name: "━━━━━━━━━━━━━━━━━━",
                    value: `## 💵 Client Pays\n₹${total.toFixed(2)}`
                }
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};