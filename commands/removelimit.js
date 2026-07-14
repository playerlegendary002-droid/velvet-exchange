const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("removelimit")

        .setDescription("Remove exchange limit")

        .addUserOption(option =>
            option
                .setName("staff")
                .setDescription("Staff member")
                .setRequired(true)
        )

        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("Amount to remove")
                .setRequired(true)
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const member = interaction.options.getUser("staff");
        const amount = interaction.options.getInteger("amount");

        const limits = JSON.parse(
            fs.readFileSync("./data/limits.json", "utf8")
        );

        if (!limits[member.id]) {

            return interaction.reply({

                content: "❌ This staff member has no limit assigned.",

                ephemeral: true

            });

        }

        limits[member.id].total -= amount;

        if (limits[member.id].available > limits[member.id].total) {
            limits[member.id].available = limits[member.id].total;
        }

        if (limits[member.id].total < 0) {
            limits[member.id].total = 0;
            limits[member.id].available = 0;
        }

        fs.writeFileSync(
            "./data/limits.json",
            JSON.stringify(limits, null, 4)
        );

        await interaction.reply({

            content:
`✅ Removed ₹${amount.toLocaleString()} from ${member}

New Total: ₹${limits[member.id].total.toLocaleString()}
Available: ₹${limits[member.id].available.toLocaleString()}`

        });

    }

};