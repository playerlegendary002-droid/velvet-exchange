module.exports = (client) => {

    client.on("interactionCreate", async (interaction) => {

        try {

            // =============================
            // Slash Commands
            // =============================
            if (interaction.isChatInputCommand()) {

                const command = client.commands.get(interaction.commandName);

                if (!command) return;

                await command.execute(interaction);
                return;
            }

            // =============================
            // Buttons
            // =============================
            if (interaction.isButton()) {

                const button = require(`../buttons/${interaction.customId}.js`);

                await button.execute(interaction);
                return;
            }

            // =============================
            // Select Menus
            // =============================
            if (interaction.isStringSelectMenu()) {

                const menuName = interaction.customId.split("|")[0];

                const menu = require(`../selectmenus/${menuName}.js`);

                await menu.execute(interaction);
                return;
            }

            // =============================
            // Modals
            // =============================
            if (interaction.isModalSubmit()) {

                const modalName = interaction.customId.split("|")[0];

                const modal = require(`../modals/${modalName}.js`);

                await modal.execute(interaction);
                return;
            }

        } catch (err) {

            console.error("================================");
            console.error("INTERACTION ERROR");
            console.error(err);
            console.error("================================");

            if (!interaction.replied && !interaction.deferred) {

                await interaction.reply({
                    content: "❌ Something went wrong.",
                    ephemeral: true
                }).catch(() => {});

            }

        }

    });

};