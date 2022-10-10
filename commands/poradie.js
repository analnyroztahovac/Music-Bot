const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

/* "Konfiguracia" emoji a farieb pre embedy */
const { 
    emoji_check, /* Emoji, ktory sa zobrazi pri uspesnej akcii vedla textu "Hudba" */
    farba_error, /* Farba, ktora bude pouzita pri Embede pokial doslo niekde ku chybe */
    farba_nonerror /* Farba, ktora bude pouzita pri Embede pokial NEdoslo niekde ku chybe */
    } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("poradie")
        .setDescription("Zobrazi aktualne poradie pesniciek.")
        .addNumberOption((option) => option.setName("strana").setDescription("Zobrazi zadanu stranu poradia").setMinValue(1)),

    run: async ( { client, interaction } ) => {
        
        const queue = client.player.getQueue(interaction.guildId)
        if (!queue || !queue.playing) {
            const Embed = new EmbedBuilder()
                .setTitle("❌ Hudba")
                .setDescription("Neboli najdene ziadne pesnicky v poradi.")
                .setFooter( { text:"Imedium Music Bot" } )
                .setColor(farba_error)
            return interaction.editReply( {embeds: [Embed] } )
        }
        const max_stran = Math.ceil(queue.tracks.length / 10) || 1
        const strana = (interaction.options.getNumber("strana") || 1) - 1

        if (strana > max_stran) {
            const Embed = new EmbedBuilder()
                .setTitle("❌ Hudba")
                .setDescription(`Zadal si vacsiu stranu nez existuje. Najvacsia strana, ktoru mozes zadat je ${max_stran}`)
                .setFooter( {text: "Imedium Music Bot"} )
                .setColor(farba_error)
            return interaction.editReply( { embeds: [Embed] } )
        }

        const poradie_pesniciek = queue.tracks.slice(strana * 10, strana * 10 + 10).map((song, i) => {
            return `**${strana * 10 + i + 1 }.** ${song.title} - \`${song.duration}\``
        }).join("\n")


        const aktualna_pesnicka = queue.current
        const info_o_aktualnej = `${aktualna_pesnicka.title} - ${aktualna_pesnicka.duration}` || "Ziadna"
        const Embed = new EmbedBuilder()
            .setTitle(`${emoji_check} Hudba`)
            .setDescription(`Zobrazujem aktualne poradie pesniciek. **\`${strana + 1} / ${max_stran}\`**`)
            .setThumbnail(aktualna_pesnicka.thumbnail)
            .addFields (
                { name: `Aktualne hra:`, value: `${info_o_aktualnej}` },
                { name: `Dalsie v poradi:`, value: `${poradie_pesniciek}` } )
            .setColor(farba_nonerror)
            .setFooter( { text: "Imedium Music Bot" } )
        
        await interaction.editReply({embeds: [Embed]})
    }
}