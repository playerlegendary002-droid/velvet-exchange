const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("addlimit")

        .setDescription("Add exchange limit to a staff member")

        .addUserOption(option =>
            option
                .setName("staff")
                .setDescription("Staff member")
                .setRequired(true)
        )

        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("Amount to add")
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

        limits[member.id].total += amount;
        limits[member.id].available += amount;

        fs.writeFileSync(
            "./data/limits.json",
            JSON.stringify(limits, null, 4)
        );

        await interaction.reply({

            content:
`✅ Added ₹${amount.toLocaleString()} to ${member}

New Total: ₹${limits[member.id].total.toLocaleString()}
Available: ₹${limits[member.id].available.toLocaleString()}`

        });

    }

};