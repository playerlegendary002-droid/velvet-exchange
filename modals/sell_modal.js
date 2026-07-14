const {
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const config = require("../config.json");
const { nextSellTicket } = require("../utils/ticketManager");

module.exports = {

    async execute(interaction) {

        const [, coin, payment] = interaction.customId.split("|");

        const amount = interaction.fields.getTextInputValue("amount");
        const receive = interaction.fields.getTextInputValue("receive");

        const guild = interaction.guild;

        const ticketNumber = String(nextSellTicket()).padStart(3, "0");

        const channel = await guild.channels.create({

            name: `💰-sell-${ticketNumber}`,

            type: ChannelType.GuildText,

            parent: config.ticketCategory,

            topic:  JSON.stringify({
    user: interaction.user.id,
    amount: Number(amount),
    claimedBy: null
}),

            permissionOverwrites: [

                {
                    id: guild.roles.everyone.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },

                {
                    id: interaction.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                },

                {
                    id: config.staffRole,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                }

            ]

        });

        const embed = new EmbedBuilder()

            .setColor(config.botColor)

            .setTitle("💰 Sell Crypto Request")

            .setDescription(`

## 📋 SELL ORDER

━━━━━━━━━━━━━━━━━━━━━━

👤 **Customer**
${interaction.user}

💰 **Amount**
${amount}

🪙 **Coin**
${coin}

💳 **Receive Payment Via**
${payment}

🏦 **UPI / Bank Details**
\`${receive}\`

━━━━━━━━━━━━━━━━━━━━━━

🟡 **Status**
Waiting For Staff

`)

            .setFooter({
                text: `${config.botName} • SELL-${ticketNumber}`
            })

            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("claim_ticket")
                .setLabel("Claim")
                .setEmoji("👨‍💼")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("payment_received")
                .setLabel("Payment Sent")
                .setEmoji("💸")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("complete_ticket")
                .setLabel("Complete")
                .setEmoji("✅")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("close_ticket")
                .setLabel("Close")
                .setEmoji("🔒")
                .setStyle(ButtonStyle.Danger)

        );

        await channel.send({

            content: `<@${interaction.user.id}> <@&${config.staffRole}>`,

            embeds: [embed],

            components: [row]

        });
await interaction.reply({

    content: `✅ Your sell order has been created!\n${channel}`,

    ephemeral: true

});

try {
    await interaction.deleteReply();
} catch (err) {
    console.error(err);
}

    }

};