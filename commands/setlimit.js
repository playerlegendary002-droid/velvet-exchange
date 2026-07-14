const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("setlimit")

        .setDescription("Set exchange limit")

        .addUserOption(option =>
            option
                .setName("staff")
                .setDescription("Staff member")
                .setRequired(true)
        )

        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("Limit in INR")
                .setRequired(true)
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const member = interaction.options.getUser("staff");

        const amount = interaction.options.getInteger("amount");

        const data = JSON.parse(
            fs.readFileSync("./data/limits.json")
        );

        data[member.id] = {

            total: amount,

            available: amount

        };

        fs.writeFileSync(
            "./data/limits.json",
            JSON.stringify(data, null, 4)
        );

        await interaction.reply({

            content:
`✅ Limit updated

Staff : ${member}

Limit : ₹${amount.toLocaleString()}`

        });

    }

};