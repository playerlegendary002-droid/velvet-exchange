const {
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

module.exports = {

    async execute(interaction) {

        const coin = interaction.values[0];

        const paymentMenu = new StringSelectMenuBuilder()

            .setCustomId(`sell_payment_select|${coin}`)

            .setPlaceholder("💳 Select Payment Method")

            .addOptions([
                {
                    label: "FamApp",
                    value: "FamApp",
                    emoji: "💚"
                },
                {
                    label: "Omni Card",
                    value: "Omni Card",
                    emoji: "💳"
                },
                {
                    label: "Paytm",
                    value: "Paytm",
                    emoji: "💙"
                },
                {
                    label: "PhonePe",
                    value: "PhonePe",
                    emoji: "🟣"
                },
                {
                    label: "Bank Transfer",
                    value: "Bank Transfer",
                    emoji: "🏦"
                }
            ]);

        const row = new ActionRowBuilder().addComponents(paymentMenu);

        await interaction.update({

            content:
`# 💱 Velvet Exchange

### Sell Crypto

**Step 2 of 4**

🪙 Coin Selected

**${coin}**

Now choose how you want to receive your payment.`,

            components: [row]

        });

    }

};