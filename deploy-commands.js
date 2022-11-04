// Subor pre registrovanie NOVYCH discord prikazov

// Constanty pre zakladne udaje ako clientID, guildID, token atd
const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');

// ClientID + GuildID
const { clientID, guildID, token } = require('./config.json');


// Constanta pre vytvorene prikazy
const list_suborov = ["global_commands", "guild_commands"]
const rest = new REST({ version: '10' }).setToken(token);

for ( nazov_suboru of list_suborov ) {
    
    const commands = [];
    const commandsPath = path.join(__dirname, nazov_suboru)
    const commandFiles = fs.readdirSync(`./${nazov_suboru}`).filter(file => file.endsWith('.js'));

    for ( const file of commandFiles ) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath)
        commands.push(command.data.toJSON())
    }

    switch (nazov_suboru) {
        case "global_commands":
            rest.put(Routes.applicationCommands(clientID), { body: commands })
                .then(() => console.log('Uspesne registrovane Global prikazy'))
            break;
        case "guild_commands":
            rest.put(Routes.applicationGuildCommands(clientID, guildID), { body: commands })
                .then(() => console.log('Uspesne registrovane Guild prikazy!') )
            break; }
}