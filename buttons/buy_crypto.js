const {
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

module.exports = {

    async execute(interaction) {

        const menu = new StringSelectMenuBuilder()

            .setCustomId("coin_select")

            .setPlaceholder("🪙 Select Cryptocurrency")

            .addOptions([

                {
                    label: "USDT (TRC20)",
                    description: "Tether on TRON",
                    value: "USDT_TRC20",
                    emoji: "💵"
                },

                {
                    label: "USDT (BEP20)",
                    description: "Tether on BNB Smart Chain",
                    value: "USDT_BEP20",
                    emoji: "💵"
                },

                {
                    label: "USDT (Polygon)",
                    description: "Tether on Polygon",
                    value: "USDT_POLYGON",
                    emoji: "💵"
                },

                {
                    label: "Bitcoin (BTC)",
                    description: "Bitcoin Network",
                    value: "BTC",
                    emoji: "🟠"
                },

                {
                    label: "Litecoin (LTC)",
                    description: "Litecoin Network",
                    value: "LTC",
                    emoji: "⚪"
                },

                {
                    label: "Solana (SOL)",
                    description: "Solana Network",
                    value: "SOL",
                    emoji: "🟣"
                }

            ]);

        const row = new ActionRowBuilder()

            .addComponents(menu);

        await interaction.reply({

            content:
`# 💱 Velvet Exchange

### Step 1 of 4

Select the cryptocurrency you want to buy.`,

            components: [row],

            ephemeral: true

        });

    }

};