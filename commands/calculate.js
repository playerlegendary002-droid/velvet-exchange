const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("calculate")
        .setDescription("Velvet Exchange Professional Calculator")

        .addStringOption(option =>
            option
                .setName("type")
                .setDescription("Select transaction type")
                .setRequired(true)
                .addChoices(
                    { name: "🟢 Buy", value: "buy" },
                    { name: "🔴 Sell", value: "sell" }
                )
        )

        .addStringOption(option =>
            option
                .setName("coin")
                .setDescription("Select coin")
                .setRequired(true)
                .addChoices(
                    { name: "USDT", value: "usdt" }
                )
        )

        .addStringOption(option =>
            option
                .setName("input")
                .setDescription("What is the client entering?")
                .setRequired(true)
                .addChoices(
                    { name: "🇮🇳 INR", value: "inr" },
                    { name: "💵 USDT", value: "usdt" }
                )
        )

        .addNumberOption(option =>
            option
                .setName("amount")
                .setDescription("Enter amount")
                .setRequired(true)
        ),

    async execute(interaction) {

        const member = interaction.member;

        if (
            !member.roles.cache.some(
                role => role.name === "Exchanger"
            )
        ) {

            return interaction.reply({
                content:
                    "❌ You must have the **Exchanger** role to use this command.",
                ephemeral: true
            });

        }

        const type = interaction.options.getString("type");
        const coin = interaction.options.getString("coin");
        const input = interaction.options.getString("input");
        const amount = interaction.options.getNumber("amount");

        const rates = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "../data/rates.json"),
                "utf8"
            )
        );

        const buyRate = rates.buy;
        const sellRate = rates.sell;

        let rate;
        let formula;
        let output;
        let outputTitle;
                if (type === "buy") {

            if (input === "usdt") {

                rate = buyRate;

                output = amount * rate;

                formula = `${amount} × ${rate}`;

                outputTitle = "💸 Client Pays";

            } else {

                rate = buyRate;

                output = amount / rate;

                formula = `${amount} ÷ ${rate}`;

                outputTitle = "🪙 Client Receives";

            }

        }

        else if (type === "sell") {

            if (input === "usdt") {

                rate = sellRate;

                output = amount * rate;

                formula = `${amount} × ${rate}`;

                outputTitle = "💰 Client Receives";

            } else {

                rate = sellRate;

                output = amount / rate;

                formula = `${amount} ÷ ${rate}`;

                outputTitle = "🪙 Client Sold";

            }

        }

        let enteredAmount;

        if (input === "usdt") {

            enteredAmount = `${amount.toFixed(4)} USDT`;

        }

        else {

            enteredAmount =
                `₹${amount.toLocaleString(undefined,{
                    minimumFractionDigits:2,
                    maximumFractionDigits:2
                })}`;

        }

        let finalAmount;

        if (input === "usdt") {

            finalAmount =
                `₹${output.toLocaleString(undefined,{
                    minimumFractionDigits:2,
                    maximumFractionDigits:2
                })}`;

        }

        else {

            finalAmount =
                `${output.toFixed(4)} USDT`;

        }

        const color =
            type === "buy"
                ? 0x00C853
                : 0xD50000;

        const title =
            type === "buy"
                ? "🟢 BUY Calculator"
                : "🔴 SELL Calculator";
                const embed = new EmbedBuilder()

            .setColor(color)

            .setTitle("💹 Velvet Exchange Calculator")

            .setDescription(
                `### ${title}\n━━━━━━━━━━━━━━━━━━━━━━`
            )

            .addFields(

                {
                    name: "🪙 Coin",
                    value: coin.toUpperCase(),
                    inline: true
                },

                {
                    name: "💲 Current Rate",
                    value: `₹${rate}`,
                    inline: true
                },

                {
                    name: "📥 Client Entered",
                    value: enteredAmount,
                    inline: true
                },

                {
                    name: "🧮 Formula",
                    value: `\`${formula}\``,
                    inline: false
                },

                {
                    name: "━━━━━━━━━━━━━━━━━━━━━━",
                    value:
                        `## ${outputTitle}\n${finalAmount}`,
                    inline: false
                }

            )

            .setFooter({

                text: "Velvet Exchange • Professional Calculator"

            })

            .setTimestamp();

        await interaction.reply({

            embeds: [embed],
            ephemeral: true

        });

    }

};