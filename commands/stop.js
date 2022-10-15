/*
  Discord /stpú prikaz pre stopnutie aktualnej pesnicky
  a za nou nasledujuce ( ak nejake su ) a nasledne
  odpojenie bota z voice kanala
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
    footer_icon, /* Footer ikona, ktora bude pouzita pri embed spravach */
    footer_icon_error /* Footer ikona pri error embedoch */
    } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Ukonci prehravanie hudby.'),
    
    run: async ( { interaction, client } ) => {

        if (!interaction.member.voice.channel) {
            // Member sa nenachadza vo voice kanali
            const Embed = new EmbedBuilder()
                .setTitle(`Hudba ${emoji_error}`)
                .setDescription('Pre pouzitie tohto prikazu sa musis nachadzat vo Voice kanali!')
                .setFooter( { text: `${footer}`, iconURL: `${footer_icon_error}` } )
                .setColor(farba_error)
            
            return interaction.editReply( { embeds: [Embed] } ); }

        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) {
            // Queue neexistuje
            const Embed = new EmbedBuilder()
                .setTitle(`Hudba ${emoji_error}`)
                .setColor(farba_error)
                .setDescription('Nemozno stopnut bota pokial ziadna pesnicka nehra!')
                .setFooter( { text: `${footer}`, iconURL: `${footer_icon_error}` } )
            
            return interaction.editReply( { embeds: [Embed] } ) }
        
        // Queue existuje, teda ju mozeme zrusit
        queue.destroy()

        const Embed = new EmbedBuilder()
            .setTitle(`Hudba ${emoji_check}`)
            .setColor(farba_nonerror)
            .setDescription('Vypinam aktualne hrajuce pesnicky...\nOdpajam sa z voice kanala...')
            .setFooter( { text: `${footer}`, iconURL: `${footer_icon}` } )
        
        await interaction.editReply( { embeds: [Embed] } )
    }
}