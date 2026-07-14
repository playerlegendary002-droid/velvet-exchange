const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("setsellrate")

        .setDescription("Update the sell exchange rate")

        .addNumberOption(option =>
            option
                .setName("rate")
                .setDescription("New sell rate")
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

        const oldRate = rates.sell;

        rates.sell = rate;

        fs.writeFileSync(
            "./data/rates.json",
            JSON.stringify(rates, null, 4)
        );

        await interaction.reply({

            content:
`✅ Sell rate updated successfully!

Old Rate: ₹${oldRate}

New Rate: ₹${rate}`

        });

    }

};