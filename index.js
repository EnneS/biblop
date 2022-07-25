const fs = require('node:fs')
const path = require('node:path')
const { Client, Intents, Collection, MessageEmbed } = require('discord.js')
const { token } = require('./config.json')
const PREFIX = '!'
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] })

// Registering commands
client.commands = new Collection()
client.aliases = new Collection()
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	const command = require(filePath)
	client.commands.set(command.data.name, command)
	command.aliases.forEach(alias => client.aliases.set(alias, command.data.name))
}

// Registering music player
const { Player } = require("discord-music-player")
const player = new Player(client, {
    leaveOnEmpty: true,
	deafenOnJoin: true,
})
client.player = player


client.once('ready', () => {
	console.log('Ready!')
	
	client.user.setActivity("blo-blo-blo-blo-blop", {
		type: "STREAMING",
	})
})

// Registering listeners
client
	.on("messageCreate", async message => {
		if (message.content[0] != PREFIX) return

		const args = message.content.slice(PREFIX.length).trim().split(/ +/g)
		let command = client.commands.get(args.shift())
		if (!command) command = client.commands.get(client.aliases.get(args.shift()))
		if (!command) return

		// Save channel for events, the messages will be sent in the same channel
		client.lastChannel = message.channel

		try {
			await command.execute(message, args)
		} catch (error) {
			console.error(error)
			await message.reply({ content: error.message, ephemeral: true })
		}
	})

client.player
	.on('songFirst', (queue, song) => {
		// Send the song info to the channel
		const embedNewSong = new MessageEmbed()
		.setColor('#0099ff')
		.setAuthor({name: '🎶 ' + song.name + ' - ' + song.author + ' | [' + song.duration + ']'})
		client.lastChannel.send({embeds : [embedNewSong]})
	})

client.login(token)
