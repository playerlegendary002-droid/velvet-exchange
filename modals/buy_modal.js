const {
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const config = require("../config.json");
const { nextBuyTicket } = require("../utils/ticketManager");

module.exports = {

    async execute(interaction) {

        const customId = interaction.customId.split("|");

        const coin = customId[1];
        const payment = customId[2];

        const amount = interaction.fields.getTextInputValue("amount");
        const wallet = interaction.fields.getTextInputValue("wallet");

        const guild = interaction.guild;

        const ticketNumber = String(nextBuyTicket()).padStart(3, "0");

        const channel = await guild.channels.create({

            name: `💸-buy-${ticketNumber}`,

            type: ChannelType.GuildText,
            parent: config.ticketCategory,

            topic:  JSON.stringify({
                // Customer
    user: interaction.user.id,

    // Exchange
    amount: Number(amount),
    coin,
    payment,
    wallet,

    // Staff
    claimedBy: null,
    middleman: null,

    // Status
    status: "waiting",
    mmStatus: "none",

    // Audit
    createdAt: Date.now()
     }),

            permissionOverwrites: [

                {
                    id: guild.roles.everyone.id,
                    deny: [
                        PermissionFlagsBits.ViewChannel
                    ]
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

            .setTitle("💱 Velvet Exchange")

            .setDescription(`
## 📋 BUY ORDER

━━━━━━━━━━━━━━━━━━━━━━

👤 **Customer**
${interaction.user}

💰 **Amount**
₹${amount}

🪙 **Coin**
${coin}

💳 **Payment**
${payment}

🏦 **Wallet**
\`${wallet}\`

━━━━━━━━━━━━━━━━━━━━━━

🟡 **Status**
Waiting For Staff
`)
            .setFooter({
                text: `${config.botName} • BUY-${ticketNumber}`
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
                .setLabel("Payment Received")
                .setEmoji("💵")
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

    content: `✅ Your exchange ticket has been created!\n${channel}`,

    ephemeral: true

});

// Delete the interaction reply immediately
try {
    await interaction.deleteReply();
} catch (err) {
    console.error(err);
}

}

};