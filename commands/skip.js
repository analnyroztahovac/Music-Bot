/*
  Discord /skip prikaz pre preskocenie aktualnej pesnicky
  a automaticke pustenie nasledujucej ( ak nejaka je )
*/

/* Zakladne constanty potrebne pre celkove fungovanie prikazu */
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

/* "Konfiguracia" emoji a farieb pre embedy */
const { 
    emoji_check, /* Emoji, ktory sa zobrazi pri uspesnej akcii vedla textu "Hudba" */
    emoji_error, /* Emoji , ktory sa zobrazi pri NEuspensej akcii vedla textu "Hudba" */
    farba_error, /* Farba, ktora bude pouzita pri Embede pokial doslo niekde ku chybe */
    farba_nonerror, /* Farba, ktora bude pouzita pri Embede pokial NEdoslo niekde ku chybe */
    footer, /* Footer, ktory bude pouzity pri embed spravach */
    footer_icon /* Footer ikona, ktora bude pouzita pri embed spravach */
    } = require('../config.json');

// Struktura prikazu, popisok
module.exports = {
    // Vytvorenie samotneho prikazu skip
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Preskoci aktualne hrajucu pesnicku.'),
    
    run: async ({ client, interaction } ) => {

        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) {
            // Queue neexistuje, cize error embed
            const Embed = new EmbedBuilder()
                .setTitle(`Hudba ${emoji_error}`)
                .setDescription('Nepodarilo sa preskocit aktualnu pesnicku pretoze ziadna dalsia nie je v poradi! Pokial chces hranie uplne ukoncit pouzi \`/stop\`.')
                .setFooter( { text: `${footer}`, iconURL: `${footer_icon}` } )
                .setColor(farba_error)
            
            return interaction.editReply( { embeds: [Embed] } ) }
        
        // Queue existuje, teda je zrejme mozne preskocit aktualnu
        const aktualne_hra = queue.current
        queue.skip()

        const Embed = new EmbedBuilder()
            .setTitle(`Hudba ${emoji_check}`)
            .setColor(farba_nonerror)
            .setDescription(`Uspesne si preskocil tuto pesnicku: \n**${aktualne_hra.title}**`)
            .setThumbnail(aktualne_hra.thumbnail)
            .setFooter( { text: `${footer}`, iconURL: `${footer_icon}` } )
        
        await interaction.editReply( { embeds: [Embed] } )
    }

}