const fs = require('node:fs');
const path = require('node:path');

// Require the necessary discord.js classes
const { Client, Intents, Collection, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
const PREFIX = '!'

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

const { Player } = require("discord-music-player");
const player = new Player(client, {
    leaveOnEmpty: true,
	deafenOnJoin: true,
});
client.player = player;

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
	

client.user.setActivity("blo-blo-blo-blop", {
	type: "STREAMING",
  });
});

client.on("messageCreate", async message => {
	if (message.content[0] != PREFIX) return

    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
	const command = client.commands.get(args.shift());
	
	if (!command) return

	// Save channel for events, the messages will be sent in the same channel
	client.lastChannel = message.channel;

	try {
		await command.execute(message, args)
	} catch (error) {
		console.error(error)
		await message.reply({ content: error.message, ephemeral: true });
	}
});

client.player
	.on('songFirst', (queue, song) => {
		const embedSuccess = new MessageEmbed()
		.setColor('#0099ff')
		.setAuthor({name: '🎶 ' + song.name + ' - ' + song.author + ' | [' + song.duration + ']'})
		client.lastChannel.send({embeds : [embedSuccess]})
	})

// Login to Discord with your client's token
client.login(token);
