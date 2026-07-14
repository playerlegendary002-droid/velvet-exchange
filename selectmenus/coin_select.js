const {
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

module.exports = {

    async execute(interaction) {

        const coin = interaction.values[0];

        const paymentMenu = new StringSelectMenuBuilder()

            .setCustomId(`payment_select|${coin}`)

            .setPlaceholder("💳 Select Payment Method")

            .addOptions([

                {
                    label: "FamApp",
                    value: "FamApp",
                    emoji: "💚"
                },

                {
                    label: "Omni Card",
                    value: "Omni",
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
                }

            ]);

        const row = new ActionRowBuilder()
            .addComponents(paymentMenu);

        await interaction.update({

            content:

`# 💱 Velvet Exchange

### Step 2 of 4

🪙 Coin Selected

**${coin}**

Now choose your payment method.`,

            components: [row]

        });

    }

};