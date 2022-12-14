/* 
  Discord /info prikaz pre zobrazenie zakladnych informacii bota
  ako aj source code, dostupne prikazy a ich vysvetlenia atd.
*/

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

/* "Konfiguracia" emoji a farieb pre embedy */
const { 
    emoji_check, /* Emoji, ktory sa zobrazi pri uspesnej akcii vedla textu "Hudba" */
    farba_nonerror, /* Farba, ktora bude pouzita pri Embede pokial NEdoslo niekde ku chybe */
    footer, /* Footer, ktory bude pouzity pri embed spravach */
    footer_icon /* Footer ikona, ktora bude pouzita pri embed spravach */
    } = require('../config.json');

// Struktura prikazu, popisky
module.exports = {
    data: new SlashCommandBuilder()
        // Vytvorenie samotneho prikazu /info
        .setName('info')
        .setDescription('Zobrazi zakladne informacie bota.'),
    
    // Spustenie funkcie prikazu
    run: async ( { interaction } ) => {
        
        // Embed const
        const Embed = new EmbedBuilder()
            .setTitle(`Hudba ${emoji_check}`)
            .setDescription('Open source, jednoduchy a napriek tomu efektivny discord music bot.\nSource kod mozno najst na: https://github.com/analnyroztahovac/Music-Bot\n**Zoznam prikazov:**')
            .setColor(farba_nonerror)
            .addFields(
                { 
                    name: 'Prikaz \`/play search | song | playlist\`:',
                    value: `**+>** \`search\` argument sluzi na vyhladanie pesnicky podla jej nazvu\n
                            **+>** \`song\` argument sluzi na vyhladnie pesnicky podla jej URL adresy\n
                            **+>** \`playlist\` argument sluzi na vyhladanie playlistu podla jeho URL adresy` 
                },
                { 
                    name: 'Prikaz \`/poradie ( strana )\`:',
                    value: `Prikaz sluzi na zobrazenie aktualne hranej pesnicky ( *ak nejaka je* ) a za nou nasledujuce v poradi ( *ak nejake su* )\n
                            **+>** \`strana\` je optioal argument pre zobrazenie poradia na zadanej strane` 
                },
                {
                    name: 'Prikaz \`/skip\`:',
                    value: `Prikaz sluzi na preskocanie aktualnej pesnicky a zaroven automaticky pustenie za nou nasledujucu.`
                },
                { 
                    name: 'Prikaz \`/stop\`:',
                    value: `Prikaz sluzi na ukoncenie prehravania aktualnej pesnicky a zaroven za nou nasledujuce ( *ak nejake su* )` 
                }
                )
            .setFooter( { text: footer, iconURL: footer_icon } )
        
        // Odpovieme na interaction
        return interaction.editReply( { embeds: [Embed], ephemeral: true } )
    }
}
