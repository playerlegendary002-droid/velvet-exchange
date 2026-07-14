const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("setbuyrate")

        .setDescription("Update the buy exchange rate")

        .addNumberOption(option =>
            option
                .setName("rate")
                .setDescription("New buy rate")
                .setRequired(true)
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const rate = interaction.options.getNumber("rate");

        const rates = JSON.parse(
            fs.readFileSync("./data/rates.json", "utf8")
        );

        const oldRate = rates.buy;

        rates.buy = rate;

        fs.writeFileSync(
            "./data/rates.json",
            JSON.stringify(rates, null, 4)
        );

        await interaction.reply({

            content:
`✅ Buy rate updated successfully!

Old Rate: ₹${oldRate}

New Rate: ₹${rate}`

        });

    }

};