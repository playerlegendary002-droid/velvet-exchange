const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("checklimit")
        .setDescription("Check a staff member's exchange limit")

        .addUserOption(option =>
            option
                .setName("staff")
                .setDescription("Staff member")
                .setRequired(true)
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const member = interaction.options.getUser("staff");

        const limits = JSON.parse(
            fs.readFileSync("./data/limits.json", "utf8")
        );

        const staff = limits[member.id];

        if (!staff) {

            return interaction.reply({

                content: "❌ This staff member has no limit assigned.",

                ephemeral: true

            });

        }

        const locked = staff.total - staff.available;

        const embed = new EmbedBuilder()

            .setColor("Green")

            .setTitle("💰 Staff Exchange Limit")

            .addFields(

                {
                    name: "👤 Staff",
                    value: `${member}`,
                    inline: false
                },

                {
                    name: "💰 Total Limit",
                    value: `₹${staff.total.toLocaleString()}`,
                    inline: true
                },

                {
                    name: "💵 Available",
                    value: `₹${staff.available.toLocaleString()}`,
                    inline: true
                },

                {
                    name: "🔒 Locked",
                    value: `₹${locked.toLocaleString()}`,
                    inline: true
                }

            )

            .setTimestamp();

        await interaction.reply({

            embeds: [embed]

        });

    }

};