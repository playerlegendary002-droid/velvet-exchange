const {
    AttachmentBuilder
} = require("discord.js");

const discordTranscripts = require("discord-html-transcripts");
const config = require("../config.json");

module.exports = {

    async execute(interaction) {

        await interaction.reply({

            content: "📄 Creating transcript...\n🔒 This ticket will close in **10 seconds**.",

            ephemeral: false

        });

        try {

            const attachment = await discordTranscripts.createTranscript(
                interaction.channel,
                {
                    limit: -1,
                    filename: `${interaction.channel.name}.html`
                }
            );

            const logChannel = interaction.guild.channels.cache.get(
                config.logChannel
            );

            if (logChannel) {

                await logChannel.send({

                    content:
`# 📄 Ticket Closed

**Channel:** ${interaction.channel.name}

**Closed By:** ${interaction.user}

**Closed At:** <t:${Math.floor(Date.now() / 1000)}:F>`,

                    files: [attachment]

                });

            }

        } catch (err) {

            console.error("Transcript Error:", err);

        }

        setTimeout(async () => {

            try {

                await interaction.channel.delete();

            } catch (err) {

                console.error(err);

            }

        }, 10000);

    }

};