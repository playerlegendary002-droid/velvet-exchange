const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const { checkTicketAccess } = require("../utils/checkTicketAccess");

module.exports = {

    async execute(interaction) {

        // Only claimed exchanger, manager or owner can use this button
        if (!(await checkTicketAccess(interaction))) return;

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