/*
  Discord /play {search | song | playlist} prikaz pre
  pridavanie a nasledne prehravanie hudby vo Voice Kanaloch.
 
 ++> Vysvetlenia roznych argumentov:
    - search: Pokusi sa vyhladat pesnicku podla nazvu na roznych platformach (yt, soundcloud and watnot)
    - song: Prehra pesnicku podla vlozenej URL adresy
    - playlist: Prehra cely playlist podla vlozenej URL adresy
*/

/* Zakladne constanty potrebne pre celkove fungovanie prikazu */
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

/* "Konfiguracia" emoji a farieb pre embedy */
const { 
    emoji_check, /* Emoji, ktory sa zobrazi pri uspesnej akcii vedla textu "Hudba" */
    emoji_error, /* Emoji , ktory sa zobrazi pri NEuspensej akcii vedla textu "Hudba" */
    farba_error, /* Farba, ktora bude pouzita pri Embede pokial doslo niekde ku chybe */
    farba_nonerror, /* Farba, ktora bude pouzita pri Embede pokial NEdoslo niekde ku chybe */
    footer, /* Footer, ktory bude pouzity pri embed spravach */
    footer_icon /* Footer ikona, ktora bude pouzita pri embed spravach */
    } = require('../config.json');

// Struktura prikazu, subcommandy, popisky, options
module.exports = {
    data: new SlashCommandBuilder()
        // Vytvorenie samotneho prikazu /play
        .setName('play')
        .setDescription('Spusti prehravanie hudby.')
        // Subcommand pre nacitanie prave jednej pesnicky podla URL
        .addSubcommand((subcommand) =>
            subcommand
            .setName("song")
            .setDescription("Nacita jednu pesnicku.")
            .addStringOption((option) =>
                option.setName("url").setDescription("URL pesnicky").setRequired(true))
        )
        // Subcommand pre nacitanie playlistu podla URL
        .addSubcommand((subcommand) =>
            subcommand
            .setName("playlist")
            .setDescription("Nacita playlist pesniciek.")
            .addStringOption((option) =>
                option.setName("url").setDescription("URL playlistu").setRequired(true))
        )
        // Subcommand pre vyhladanie pesnicky podla jej nazvu
        .addSubcommand((subcommand) =>
            subcommand
            .setName("search")
            .setDescription("Vyhlada pesnicku podla navzu.")
            .addStringOption((option) =>
                option.setName("nazov").setDescription("Zadaj nazov pesnicky").setRequired(true))
        ),

    // Spustenie funkcie prikazu
    run: async ({ client, interaction }) => {

        if (!interaction.member.voice.channel) {
            // Member sa nenachadza vo voice kanali, posleme empeheemral embed
            const Embed = new EmbedBuilder()
                .setTitle(`Hudba ${emoji_error}`)
                .setDescription('Pre pouzitie tohto prikazu sa musis nachadzat vo Voice kanali!')
                .setFooter({
                    text: `${footer}`, iconURL: `${footer_icon}`
                })
                .setColor(farba_error)

            return interaction.editReply({
                embeds: [Embed]
            });
        }

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
                    .setTitle(`Hudba ${emoji_error}`)
                    .setDescription('Nepodarilo sa najst ziadne video s URL `' + url + '`!')
                    .setFooter({
                        text: `${footer}`, iconURL: `${footer_icon}`
                    })
                    .setColor(farba_error)
                return interaction.editReply({
                    embeds: [Embed]
                });
            }

            const song = hladanie.tracks[0];
            await queue.addTrack(song);

            const Embed = new EmbedBuilder()
                .setTitle(`Hudba ${emoji_check}`)
                .setDescription(`Uspesne sa podarilo najst a pridat do poradia tvoju hudbu!`)
                .setThumbnail(song.thumbnail)
                .addFields({
                    name: `**${song.title}** - \`${song.duration}\``,
                    value: `${song.url}`
                })
                .setFooter({
                    text: `${footer}`, iconURL: `${footer_icon}`
                })
                .setColor(farba_nonerror)
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
                    .setTitle(`Hudba ${emoji_error}`)
                    .setDescription(`Nepodarilo sa najst ziadne video s URL \`${url}\`.`)
                    .setFooter({
                        text: `${footer}`, iconURL: `${footer_icon}`
                    })
                    .setColor(farba_error)
                return interaction.editReply({
                    embeds: [Embed]
                });
            }

            const playlist = hladanie.playlist
            await queue.addTracks(hladanie.tracks)

            // Posleme spravu s embedom
            const Embed = new EmbedBuilder()
                .setTitle(`Hudba ${emoji_check}`)
                .setDescription('Uspesne sa podarilo najst a pridat do poradia tvoj playlist!')
                .setThumbnail(playlist.thumbnail)
                .addFields({
                    name: `**${playlist.title}** - ${result.tracks.length} pesniciek`,
                    value: `${playlist.url}`
                })
                .setFooter({
                    text: `${footer}`, iconURL: `${footer_icon}`
                })
                .setColor(farba_nonerror)
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
                    .setTitle(`Hudba ${emoji_error}`)
                    .setDescription(`Nepodarilo sa najst ziadne video s nazvom \`${nazov}\` !`)
                    .setFooter({
                        text: `${footer}`, iconURL: `${footer_icon}`
                    })
                    .setColor(farba_error)
                return interaction.editReply({
                    embeds: [Embed]
                });
            }

            const song = hladanie.tracks[0]
            await queue.addTrack(song)

            // Posleme spravu s embedom
            const Embed = new EmbedBuilder()
                .setTitle(`Hudba ${emoji_check}`)
                .setDescription(`Podla tvojho zadaneho nazvu \`${nazov}\` sa podarilo najst a pridat do poradia tuto pesnicku.`)
                .setThumbnail(song.thumbnail)
                .addFields({
                    name: `**${song.title}** - \`${song.duration}\``,
                    value: `${song.url}`
                })
                .setFooter({
                    text: `${footer}`, iconURL: `${footer_icon}`
                })
                .setColor(farba_nonerror)
            await interaction.editReply({
                embeds: [Embed]
            });
        }
        if (!queue.playing) await queue.play()
    }
}