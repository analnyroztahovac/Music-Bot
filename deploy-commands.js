// Subor pre registrovanie NOVYCH discord prikazov

// Constanty pre zakladne udaje ako clientID, guildID, token atd
const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');

// ClientID + GuildID
const { clientID, guildID, token } = require('./config.json');


// Constanta pre vytvorene prikazy
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

// Output log
rest.put(Routes.applicationGuildCommands(clientID, guildID), { body: commands })
    .then(() => console.log('Uspesne registrovane ${data.length} prikazy.'))
    .catch(console.error);
