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
            .setCustomId(`buy_modal|${coin}|${payment}`)
            .setTitle("Velvet Exchange - Buy Crypto");

        const amount = new TextInputBuilder()
            .setCustomId("amount")
            .setLabel("Exchange Amount (INR)")
            .setPlaceholder("Example: 5000")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const wallet = new TextInputBuilder()
            .setCustomId("wallet")
            .setLabel("Wallet Address")
            .setPlaceholder("Paste your wallet address")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(amount),
            new ActionRowBuilder().addComponents(wallet)
        );

        await interaction.showModal(modal);

    }

};