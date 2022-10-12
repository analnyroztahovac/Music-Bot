const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { token } = require('./config.json');
const { Player } = require("discord-player");

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates
	]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


client.slashcommands = new Collection()
client.player = new Player(client, {
	ytdlOptions: {
		quality: "highestaudio",
		highWaterMark: 1 << 25
	}
})

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Proces bezi!');
});

client.on('interactionCreate', async interaction => {
	
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);
	const command_name = interaction.commandName;

	// Check ci je command platny
	if (!command) return;

	// Ephemeral defer pre info command
	if (command_name === "info") {
		await interaction.deferReply( { ephemeral: true } )
		await command.run( { interaction } )
		return };
	
	try {
		await interaction.deferReply()
		await command.run( {client, interaction} )
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Niekde nastala chyba, skus znovu!', ephemeral: true });
	}
});

client.login(token);
