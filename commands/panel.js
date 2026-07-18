const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const fs = require("fs");
const path = require("path");
const rates = require("../data/rates.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("panel")
        .setDescription("Send the Velvet Exchange panel"),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor("#00C853")
            .setTitle("💱 Velvet Exchange")
            .setDescription(`
━━━━━━━━━━━━━━━━━━━━

## 🇮🇳 INR EXCHANGES

**INR ➜ Crypto:** ₹${rates.buy}/$
**Crypto ➜ INR:** ₹${rates.sell}/$

━━━━━━━━━━━━━━━━━━━━

## 🪙 SUPPORTED COINS

• USDT (TRC20)
• USDT (BEP20)
• USDT (Polygon)
• BTC
• LTC
• SOL

━━━━━━━━━━━━━━━━━━━━

Click a button below to continue.
`)
            .setImage("https://cdn.discordapp.com/attachments/1524757345970688123/1526309394093047859/7029-dark.gif")
            .setFooter({
                text: "Velvet Exchange V2"
            });

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("buy_crypto")
                .setLabel("Buy Crypto")
                .setEmoji("💸")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("sell_crypto")
                .setLabel("Sell Crypto")
                .setEmoji("💰")
                .setStyle(ButtonStyle.Danger)

        );

        const message = await interaction.reply({
            embeds: [embed],
            components: [row],
            fetchReply: true
        });

        const panelPath = path.join(__dirname, "../data/panel.json");

        fs.writeFileSync(
            panelPath,
            JSON.stringify(
                {
                    channelId: interaction.channel.id,
                    messageId: message.id
                },
                null,
                4
            )
        );
    }
};