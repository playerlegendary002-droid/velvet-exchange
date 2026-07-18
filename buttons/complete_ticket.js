const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const fs = require("fs");
const { saveOrder } = require("../utils/orderManager");
const { checkTicketAccess } = require("../utils/checkTicketAccess");

module.exports = {

    async execute(interaction) {

        // Only claimed exchanger, manager or owner
        if (!(await checkTicketAccess(interaction))) return;

        let ticketData;

        try {
            ticketData = JSON.parse(interaction.channel.topic);
        } catch {
            return interaction.reply({
                content: "❌ Invalid ticket data.",
                ephemeral: true
            });
        }

        if (ticketData.claimedBy) {

            saveOrder({
                orderId: interaction.channel.name,
                customer: ticketData.user,
                staff: ticketData.claimedBy,
                amount: Number(ticketData.amount),
                status: "Completed",
                completedAt: new Date().toISOString()
            });

            const limits = JSON.parse(
                fs.readFileSync("./data/limits.json", "utf8")
            );

            if (limits[ticketData.claimedBy]) {

                limits[ticketData.claimedBy].available += Number(ticketData.amount);

                if (
                    limits[ticketData.claimedBy].available >
                    limits[ticketData.claimedBy].total
                ) {
                    limits[ticketData.claimedBy].available =
                        limits[ticketData.claimedBy].total;
                }

                fs.writeFileSync(
                    "./data/limits.json",
                    JSON.stringify(limits, null, 4)
                );
            }
        }

        const oldRow = interaction.message.components[0];
        const newRow = new ActionRowBuilder();

        oldRow.components.forEach(button => {

            const b = ButtonBuilder.from(button);

            if (b.data.custom_id === "complete_ticket") {

                b.setDisabled(true)
                    .setLabel("Completed")
                    .setStyle(ButtonStyle.Secondary);

            }

            newRow.addComponents(b);

        });

        await interaction.update({
            components: [newRow]
        });

        try {

            const customer = await interaction.client.users.fetch(ticketData.user);

            await customer.send(
`💎 **Velvet Exchange**

━━━━━━━━━━━━━━━━━━━━━━

# ✅ Exchange Completed

🆔 **Order ID**
${interaction.channel.name}

💰 **Exchange Amount**
₹${ticketData.amount}

👨‍💼 **Exchanger**
<@${ticketData.claimedBy}>

📅 **Status**
Completed

━━━━━━━━━━━━━━━━━━━━━━

Thank you for choosing **Velvet Exchange** ❤️

Keep this message as your exchange receipt.`
            );

        } catch (err) {

            console.log("Could not send DM to customer.");

        }

        await interaction.followUp({

            content:
`# ✅ Exchange Completed

━━━━━━━━━━━━━━━━━━━━━━

❤️ **Thank you for using Velvet Exchange!**

Your exchange has been completed successfully.

## ⭐ Leave a Vouch

Please go to <#1526317310602776697>

Copy the message below and paste it in the vouch channel.

\`\`\`
+rep <@${ticketData.claimedBy}> | ₹${ticketData.amount}
Fast & trusted exchange ❤️
\`\`\`

✅ Shiba will automatically register your vouch.

Thank you for choosing **Velvet Exchange** 💎`,

            ephemeral: false

        });

    }

};