const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {

    async execute(interaction) {

        const oldRow = interaction.message.components[0];

        const newRow = new ActionRowBuilder();

        oldRow.components.forEach(button => {

            const b = ButtonBuilder.from(button);

            if (b.data.custom_id === "payment_received") {

                b.setDisabled(true)
                 .setLabel("Payment Received")
                 .setStyle(ButtonStyle.Secondary);

            }

            newRow.addComponents(b);

        });

        await interaction.update({

            components: [newRow]

        });

        await interaction.followUp({

            content:
                "💵 **Payment received successfully.**\n\nPlease wait while our staff sends your crypto.",

            ephemeral: false

        });

    }

};