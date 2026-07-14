const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

module.exports = {

    async execute(interaction) {

        const coin = interaction.customId.split("|")[1];
        const payment = interaction.values[0];

        const modal = new ModalBuilder()
            .setCustomId(`sell_modal|${coin}|${payment}`)
            .setTitle("Velvet Exchange - Sell Crypto");

        const amount = new TextInputBuilder()
            .setCustomId("amount")
            .setLabel("Amount to Sell")
            .setPlaceholder("Example: 250 USDT")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const receive = new TextInputBuilder()
            .setCustomId("receive")
            .setLabel("UPI ID / Bank Details")
            .setPlaceholder("Enter your UPI ID or Bank Account Details")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(amount),
            new ActionRowBuilder().addComponents(receive)
        );

        await interaction.showModal(modal);

    }

};