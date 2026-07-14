const {
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

module.exports = {

    async execute(interaction) {

        const menu = new StringSelectMenuBuilder()

            .setCustomId("sell_coin_select")

            .setPlaceholder("🪙 Select Cryptocurrency")

            .addOptions([

                {
                    label: "USDT (TRC20)",
                    value: "USDT_TRC20",
                    emoji: "💵"
                },

                {
                    label: "USDT (BEP20)",
                    value: "USDT_BEP20",
                    emoji: "💵"
                },

                {
                    label: "USDT (Polygon)",
                    value: "USDT_POLYGON",
                    emoji: "💵"
                },

                {
                    label: "Bitcoin (BTC)",
                    value: "BTC",
                    emoji: "🟠"
                },

                {
                    label: "Litecoin (LTC)",
                    value: "LTC",
                    emoji: "⚪"
                },

                {
                    label: "Solana (SOL)",
                    value: "SOL",
                    emoji: "🟣"
                }

            ]);

        const row = new ActionRowBuilder().addComponents(menu);

        await interaction.reply({

            content:
`# 💱 Velvet Exchange

### Sell Crypto

**Step 1 of 4**

Select the cryptocurrency you want to sell.`,

            components: [row],

            ephemeral: true

        });

    }

};