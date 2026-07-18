const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");
const fs = require("fs");
const checkStaff = require("../utils/checkStaff");
const { lockTicket } = require("../utils/ticketPermissions");
module.exports = {

    async execute(interaction) {

        if (!checkStaff(interaction)) {

            return interaction.reply({

                content: "❌ Only staff members can use this button.",

                ephemeral: true

            });

        }





        let ticketData;

        try {
            ticketData = JSON.parse(interaction.channel.topic);
        } catch {

            return interaction.reply({
                content: "❌ Invalid ticket data.",
                ephemeral: true
            });

        }

        const amount = Number(ticketData.amount);

        const limits = JSON.parse(
            fs.readFileSync("./data/limits.json", "utf8")
        );

        const staff = limits[interaction.user.id];

        if (!staff) {

            return interaction.reply({

                content: "❌ No exchange limit has been assigned to you.",

                ephemeral: true

            });

        }

        if (staff.available < amount) {

            return interaction.reply({

                content:
`❌ You don't have enough exchange limit.

Available: ₹${staff.available.toLocaleString()}

Required: ₹${amount.toLocaleString()}`,

                ephemeral: true

            });

        }

        staff.available -= amount;

        limits[interaction.user.id] = staff;

        fs.writeFileSync(
            "./data/limits.json",
            JSON.stringify(limits, null, 4)
        );

        ticketData.claimedBy = interaction.user.id;

        await interaction.channel.setTopic(
    JSON.stringify(ticketData)
);

const clientUserId = ticketData.user;

await lockTicket(
    interaction.channel,
    interaction.user.id,
    clientUserId
);


        const oldRow = interaction.message.components[0];

        const newRow = new ActionRowBuilder();

        oldRow.components.forEach(button => {

            const b = ButtonBuilder.from(button);

            if (b.data.custom_id === "claim_ticket") {

                b.setDisabled(true)
                 .setLabel(`Claimed by ${interaction.user.username}`)
                 .setStyle(ButtonStyle.Secondary);

            }

            newRow.addComponents(b);

        });

        await interaction.update({

            components: [newRow]

        });

        await interaction.followUp({

            content:
`👨‍💼 Ticket claimed by ${interaction.user}

Remaining Limit: ₹${staff.available.toLocaleString()}`,

            ephemeral: false

        });

    }

};