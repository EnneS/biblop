require("log-node")();
const fs = require('node:fs')
const path = require('node:path')
const { Client, IntentsBitField, Collection,  EmbedBuilder, ButtonStyle } = require('discord.js')
const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { sendPlayingMessage, deleteLastMessage } = require("./utils/utils");
const { token } = require('./config.json')
const PREFIX = '!'
const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.DirectMessages, IntentsBitField.Flags.GuildVoiceStates, IntentsBitField.Flags.MessageContent] })
const log = require('log')


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
const { Player } = require("discord-music-player");
const { DMPError } = require("discord-music-player");

const player = new Player(client, {
    leaveOnEmpty: true,
	deafenOnJoin: true,
})
client.player = player


client.once('ready', () => {
	log.notice('Ready!')
	
	client.user.setActivity("blo-blo-blo-blo-blop | !h", {
		type: "PLAYING",
	})
})

// Registering listeners
client
	.on("messageCreate", async message => {
		if (message.content[0] != PREFIX) return

		const args = message.content.slice(PREFIX.length).trim().split(/ +/g)
		const commandArg = args.shift()
		let command = client.commands.get(commandArg)
		if (!command) command = client.commands.get(client.aliases.get(commandArg))
		if (!command) return

		// Save channel for events, the messages will be sent in the same channel
		client.lastChannel = message.channel

		try {
			await command.execute(message, args)
		} catch (error) {
			const embedError = new  EmbedBuilder()
				.setColor('#ff0000')
			if (error instanceof Error) {
				embedError.setDescription(error.message)
			} else {
				embedError.setDescription('Marche po, contactez blop >:(')
			}
			message.channel.send({embeds : [embedError]})
			log.error(error)
		}
	})

client
	.on("interactionCreate", async interaction => {
		if (!interaction.isButton()) return;
			let command = client.commands.get(interaction.customId)
			if (!command) return
			
			try {
				await command.execute(interaction, null)
			} catch (error) {
				const embedError = new  EmbedBuilder()
				.setColor('#ff0000')
				.setDescription('Marche po, contactez blop >:(')
				interaction.channel.send({embeds : [embedError]})
	
				log.error(error)
			}

			interaction.deferReply();
			interaction.deleteReply();
	})

client.player
	.on('songFirst', (queue, song) => {
		sendPlayingMessage(client, song)
	})


client.player
	.on('songChanged', (queue, newSong, old) => {
		sendPlayingMessage(client, newSong)
	})

client.player
	.on('queueDestroyed', (queue) => {
		deleteLastMessage(client)
	})

client.player
	.on('queueEnd', (queue) => {
		deleteLastMessage(client)
	})

client.player
	.on('clientDisconnect', (queue) => {
		deleteLastMessage(client)
	})

client.player
	.on('error', (error) => {
		log.error(error)
	})


client.login(token)
