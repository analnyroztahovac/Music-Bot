// Zakladne variability
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, ActivityType } = require("discord.js");
const { token } = require('./config.json');
const { Player } = require("discord-player");

const client = new Client({ intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates ] });

client.commands = new Collection();
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25 } 
    } );

// Loopneme cez subory global a guild commandov
const list_suborov = ["global_commands", "guild_commands"];
for ( nazov_suboru of list_suborov ) {
	const commandsPath = path.join(__dirname, `${nazov_suboru}`);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for ( const file of commandFiles ) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		client.commands.set(command.data.name, command);
	} }

client.once('ready', () => { console.log('Proces bezi!'); } );

/* 
  Reakcia na prikazy, ak sa jedna o prikaz
  info tak ho deferneme ako ephemeral
*/
client.on('interactionCreate', async interaction => {
	
	if (!interaction.isChatInputCommand()) return;

	const command_name = interaction.commandName;
	const command = client.commands.get(command_name);

	// Check ci je command platny
	if (!command) return;

	// Ephemeral defer pre info command
	if (command_name === "info") {
		await interaction.deferReply( { ephemeral: true } )
		await command.run( { interaction } )
		return };
	

    // Pokusim sa ho spustit
	try {
		await interaction.deferReply()
		await command.run( { client, interaction } )
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Niekde nastala chyba, skus znovu!', ephemeral: true });
	}
});


/*
  Reakcia na spustenie hudby alebo ukoncenie,
  prehravania a nasledne pre nastavenie
  aktivity bota podla prehravanej pesnicky.
*/
const player = client.player;

// Pri zacati prehravania hudby
player.on('trackStart', async ( queue ) => {
    
    // Zistime dlzku aktualnej hudby a nahradime ju podla potreby
    let songName = queue.current.title
	
	if ( songName.length >= 63 ) {
        songName = songName.slice(0,60).concat("..."); }

    await client.user.setActivity(`${songName}`, { type: ActivityType.Playing } );
});

// Pri ukonceni prehravania hudby
player.on('queueEnd', async () => {

    // Ukoncil hranie, zmazeme status
    await client.user.setActivity() } );

player.on('botDisconnect', async () => {

	// Odpojil sa z roomky, zmazeme status
	await client.user.setActivity() } );


client.login(token);
