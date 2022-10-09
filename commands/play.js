const {
    SlashCommandBuilder,
    EmbedBuilder,
    Client,
    Embed
} = require("discord.js");
const {
    QueryType
} = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Spusti prehravanie hudby.')
        .addSubcommand((subcommand) =>
            subcommand
            .setName("song")
            .setDescription("Nacita jednu pesnicku.")
            .addStringOption((option) =>
                option.setName("url").setDescription("URL pesnicky").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
            .setName("playlist")
            .setDescription("Nacita playlist pesniciek.")
            .addStringOption((option) =>
                option.setName("url").setDescription("URL playlistu").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
            .setName("search")
            .setDescription("Vyhlada pesnicku podla navzu.")
            .addStringOption((option) =>
                option.setName("nazov").setDescription("Zadaj nazov pesnicky").setRequired(true))
        ),

    run: async ({
        client,
        interaction
    }) => {

        if (!interaction.member.voice.channel) {
            // Member sa nenachadza vo voice kanali, posleme empeheemral embed
            const Embed = new EmbedBuilder()
                .setTitle('❌ Hudba')
                .setDescription('Pre pouzitie tohto prikazu sa musis nachadzat vo Voice kanali!')
                .setFooter({
                    text: 'Imedium Music Bot'
                })
                .setColor(0xff5555)

            return interaction.editReply({
                embeds: [Embed],
                ephemeral: true
            });
        }
        // Member sa nachadza sa vo voice kanali

        const queue = await client.player.createQueue(interaction.guild)
        if (!queue.connection)
            // Pokial nie je BOT v danom voice kanali , tak sa tam pripoji
            await queue.connect(interaction.member.voice.channel)

        // Vyberieme ktory argument member pouzil (song; playlist; search)
        const argument = interaction.options.getSubcommand()
        if (argument === "song") {

            // Vybral pridat prave jednu songu do rady
            let url = interaction.options.getString("url");
            const hladanie = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })

            if (hladanie.tracks.length === 0) {
                // Nepodarilo sa najst zaidnu pesnicku s takou url
                const Embed = new EmbedBuilder()
                    .setTitle("❌ Hudba")
                    .setDescription('Nepodarilo sa najst ziadne video s URL `' + url + '`!')
                    .setFooter({
                        text: 'Imedium Music Bot'
                    })
                    .setColor(0xff5555)
                return interaction.editReply({
                    embeds: [Embed]
                });
            }

            const song = hladanie.tracks[0];
            await queue.addTrack(song);

            const Embed = new EmbedBuilder()
                .setTitle("<:purple_checkmark:1028654948751245332> Hudba")
                .setDescription(`Uspesne sa podarilo najst a pridat do poradia tvoju hudbu!`)
                .setThumbnail(song.thumbnail)
                .addFields({
                    name: `**${song.title}** - ${song.duration}`,
                    value: `${song.url}`
                })
                .setFooter({
                    text: "Imedium Music Bot"
                })
                .setColor(0x8c66b2)
            await interaction.editReply({
                embeds: [Embed]
            })
        }

        // Vybral playlist argument
        else if (argument === "playlist") {

            let url = interaction.options.getString("url");
            const hladanie = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            if (hladanie.tracks.length === 0) {
                // Nepodarilo sa najst zaidnu pesnicku s takou url
                const Embed = new EmbedBuilder()
                    .setTitle("❌ Hudba")
                    .setDescription('Nepodarilo sa najst ziadne video s URL `' + url + '`!')
                    .setFooter({
                        text: 'Imedium Music Bot'
                    })
                    .setColor(0xff5555)
                return interaction.editReply({
                    embeds: [Embed]
                });
            }

            const playlist = hladanie.playlist
            await queue.addTracks(hladanie.tracks)

            // Posleme spravu s embedom
            const Embed = new EmbedBuilder()
                .setTitle("<:purple_checkmark:1028654948751245332> Hudba")
                .setDescription('Uspesne sa podarilo najst a pridat do poradia tvoj playlist!')
                .setThumbnail(playlist.thumbnail)
                .addFields({
                    name: `**${playlist.title}** - ${result.tracks.length} pesniciek`,
                    value: `${playlist.url}`
                })
                .setFooter({
                    text: 'Imedium Music Bot'
                })
                .setColor(0x8c66b2)
            await interaction.editReply({
                embeds: [Embed]
            })
        }
        // Vybral search argument
        else if (argument === "search") {

            let nazov = interaction.options.getString("nazov");
            const hladanie = await client.player.search(nazov, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (hladanie.tracks.length === 0) {
                // Nepodarilo sa najst zaidnu pesnicku s takou url
                const Embed = new EmbedBuilder()
                    .setTitle("❌ Hudba")
                    .setDescription('Nepodarilo sa najst ziadne video s nazvom `' + nazov + '`!')
                    .setFooter({
                        text: 'Imedium Music Bot'
                    })
                    .setColor(0xff5555)
                return interaction.editReply({
                    embeds: [Embed]
                });
            }

            const song = hladanie.tracks[0]
            await queue.addTrack(song)

            // Posleme spravu s embedom
            const Embed = new EmbedBuilder()
                .setTitle("<:purple_checkmark:1028654948751245332> Hudba")
                .setDescription(`Uspesne sa podarilo najst a pridat do poradia tvoju hudbu!`)
                .setThumbnail(song.thumbnail)
                .addFields({
                    name: `**${song.title}** - ${song.duration}`,
                    value: `${song.url}`
                })
                .setFooter({
                    text: 'Imedium Music Bot'
                })
                .setColor(0x8c66b2)
            await interaction.editReply({
                embeds: [Embed]
            });
        }
        if (!queue.playing) await queue.play()
    }
}