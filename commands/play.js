const { SlashCommandBuilder, EmbedBuilder, Client } = require("discord.js");
const { QueryType } = require("discord-player");
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
    .setName(play)
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

    async execute({client, interaction}) {
        if (!interaction.member.voice.channel) {
            // Member sa nenachadza vo voice kanali, posleme empeheemral embed
            const Embed = new EmbedBuilder()
                .setTitle('❌ Hudba')
                .setDescription('Pre pouzitie tohto prikazu sa musis nachadzat vo Voice kanali!')
                .setFooter('Imedium Music Bot')
                .setColor(0xff5555)

                return interaction.reply({ embeds: [Embed], ephemeral: true });
        }
        // Member sa nachadza sa vo voice kanali
        
        const queue = await client.player.createQueue(interaction.guild)
        if (!queue.connection) 
            // Pokial nie je BOT v danom voice kanali , tak sa tam pripoji
            await queue.connect(interaction.member.voice.channel)
        
        const Embed = new EmbedBuilder()
        
        // Vyberieme ktory argument member pouzil (song; playlist; search)
        switch ( interaction.options.getSubcommand() ) {
            // Vybral song argument
            case "song": {
                
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
                        .setDescription('Nepodarilo sa najst ziadne video s URL `'+url+'`!')
                        .setFooter('Imeidum Music Bot')
                        .setColor(0xff5555)
                    return interaction.reply( { embed: [Embed] } ); }
                
                const song = result.tracks[0];
                await queue.addTrack(song);

                const Embed = new EmbedBuilder()
                    .setTitle("✅ Hudba")
                    .setDescription(`Uspesne sa podarilo najst a pridat do poradia tvoju hudbu!`)
                    .addFields(
                        { name: `**${song.title}** - ${song.duration}`, value: `${song.url}` }
                    )
                    .setFooter("Imedium Music Bot")
                    .setColor(0x59e17f)
                return interaction.reply( {embed: [Embed] } )
            }
            
            // Vybral playlist argument
            case "playlist": {
                
                let url = interaction.options.getString("url");
                const hladanie = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST
                })
                
                if (result.tracks.length === 0) {
                    // Nepodarilo sa najst zaidnu pesnicku s takou url
                    const Embed = new EmbedBuilder()
                        .setTitle("❌ Hudba")
                        .setDescription('Nepodarilo sa najst ziadne video s URL `'+url+'`!')
                        .setFooter('Imeidum Music Bot')
                        .setColor(0xff5555)
                    return interaction.reply( { embed: [Embed] } );}
                
                const playlist = result.playlist
                await queue.addTracks(result.tracks)
                
                // Posleme spravu s embedom
                const Embed = new EmbedBuilder()
                    .setTitle("✅ Hudba")
                    .setDescription('Uspesne sa podarilo najst a pridat do poradia tvoj playlist!')
                    .addFields(
                        { name: `**${playlist.title}** - ${result.tracks.length} pesniciek`, value: `${playlist.url}`}
                    )
                    .setFooter("Imedium Music Bot")
                    .setColor(0x59e17f)
                return interaction.reply( { embed: [Embed] } ); }
            
            // Vybral search argument
            case "search": {
                
                let nazov = interaction.options.getString("nazov");
                const hladanie = await client.player.search(nazov, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.AUTO
                })
                
                if (result.tracks.length === 0) {
                    // Nepodarilo sa najst zaidnu pesnicku s takou url
                    const Embed = new EmbedBuilder()
                        .setTitle("❌ Hudba")
                        .setDescription('Nepodarilo sa najst ziadne video s URL `'+url+'`!')
                        .setFooter('Imeidum Music Bot')
                        .setColor(0xff5555)
                    return interaction.reply( { embed: [Embed] } );}
                    
                const song = result.tracks[0]
                await queue.addTracks(song)
                
                // Posleme spravu s embedom
                const Embed = new EmbedBuilder()
                    .setTitle("✅ Hudba")
                    .setDescription(`Uspesne sa podarilo najst a pridat do poradia tvoju hudbu!`)
                    .addFields(
                        { name: `**${song.title}** - ${song.duration}`, value: `${song.url}` }
                    )
                    .setFooter("Imedium Music Bot")
                    .setColor(0x59e17f)
                return interaction.reply( { embed: [Embed] } ); }
                }
        if (!queue.playing) await queue.play()
    }
}