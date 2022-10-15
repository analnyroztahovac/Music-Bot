/*
  Discord /poradie (strana)?
  zobrazi aktualne hrajucu pesnicku (ak nejaka je) a za nou nasledujuce (ak nejake su).
  Na jednu stranu zobrazi maximalne 10 pesniciek, je mozne vybrat inu stranu.
 
 ++> Vysvetlenia roznych argumentov:
    - strana: Zobrazi pesnicky, ktore su v rade na danej strane (null ak je strana neplatna)

*/

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

/* const emoji a farieb pre embedy */
const { 
    emoji_check, /* Emoji, ktory sa zobrazi pri uspesnej akcii vedla textu "Hudba" */
    emoji_error, /* Emoji , ktory sa zobrazi pri NEuspensej akcii vedla textu "Hudba" */
    farba_error, /* Farba, ktora bude pouzita pri Embede pokial doslo niekde ku chybe */
    farba_nonerror, /* Farba, ktora bude pouzita pri Embede pokial NEdoslo niekde ku chybe */
    footer, /* Footer, ktory bude pouzity pri embed spravach */
    footer_icon, /* Footer ikona, ktora bude pouzita pri embed spravach */
    footer_icon_error /* Footer ikona pri error embedoch */
    } = require('../config.json');

// Struktura prikazu, popisky, option
module.exports = {
    data: new SlashCommandBuilder()
        // Vytvorenie samotneho prikazu /poradie
        .setName("poradie")
        .setDescription("Zobrazi aktualne poradie pesniciek.")
        // Option pre specifikovanie strany
        .addNumberOption((option) => option.setName("strana").setDescription("Zobrazi zadanu stranu poradia").setMinValue(1)),

    // Spustenie funkcie prikazu
    run: async ( { client, interaction } ) => {
        
        const queue = client.player.getQueue(interaction.guildId)
        
        if (!queue || !queue.playing) {
            // Pokial ziadny rad nie je, alebo nehra 
            const Embed = new EmbedBuilder()
                .setTitle(`Hudba ${emoji_error}`)
                .setDescription("Neboli najdene ziadne pesnicky v poradi.")
                .setFooter( { text: `${footer}`, iconURL: `${footer_icon_error}` } )
                .setColor(farba_error)
            return interaction.editReply( {embeds: [Embed] } ); }
        
        // Const, ktore vieme zadefinovat s tym ze existuje nejaka rada a zaroven aj hra
        const celkom_pesniciek = queue.tracks.length
        const max_stran = Math.ceil( celkom_pesniciek / 10 ) || 1
        const strana = ( interaction.options.getNumber("strana") || 1 ) - 1
        
        if (strana > max_stran) {
            // Vybral vacsiu stranu aka existuje
            const Embed = new EmbedBuilder()
                .setTitle(`Hudba ${emoji_error}`)
                .setDescription(`Zadal si vacsiu stranu nez existuje. Najvacsia strana, ktoru mozes zadat je ${max_stran}`)
                .setFooter( { text: `${footer}`, iconURL: `${footer_icon_error}` } )
                .setColor(farba_error)
            return interaction.editReply( { embeds: [Embed] } ); }
        
        // String pre pesnicky cez ktore loopneme a naformatujeme ich informacie
        const poradie_pesniciek = queue.tracks.slice(strana * 10, strana * 10 + 10).map((song, i) => {
            return `**${strana * 10 + i + 1 }.** ${song.title} **-** **\`${song.duration}\`**`
        }).join("\n")

        // Dodatkove constanty pre lepsiu citatelnost
        const aktualna_pesnicka = queue.current
        const info_aktualnej = `${aktualna_pesnicka.title} **-** **\`${aktualna_pesnicka.duration}\`** \n(${aktualna_pesnicka.url})` || "Ziadna"
    
        const Embed = new EmbedBuilder()
            .setTitle(`Hudba ${emoji_check}`)
            .setDescription(`Zobrazujem aktualne poradie pesniciek.\n Strana: **${strana + 1} / ${max_stran}** | Celkom pesniciek: **${celkom_pesniciek + 1}**`)
            .setThumbnail(aktualna_pesnicka.thumbnail)
            .addFields(
                { name: `Aktualne hra:`, value: `${info_aktualnej}` },
                { name: `Dalsie v poradi:`, value: `${poradie_pesniciek || "Ziadne dalsie."}` }, )
            .setColor(farba_nonerror)
            .setFooter( { text: `${footer}`, iconURL: `${footer_icon}` } )
        
        // Odpovieme na prikaz konecnym embedom
        await interaction.editReply({embeds: [Embed]})
    }
}