const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders') 
const { s } = require('@sapphire/shapeshift') 
const log = require('log')
const { cleanSongRequest } = require("../utils/utils");


module.exports = {
	aliases: ['p'],
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Joue une musique à partir d\'une URL'),
	async execute(message, args) {
		message.react('⏳')

		const client = message.client
		const queue = client.player.createQueue(message.guild.id)
		const songRequest = args.join(' ')
		const isPlaylist = songRequest.includes('playlist') || songRequest.includes('album')
		const embedSuccess = new EmbedBuilder().setColor(0x0099FF)

		// Join & add the song to the queue
		await queue.join(message.member.voice.channel)
		if (!isPlaylist) {
			// Clean the songRequest first
			let songRequestCleaned = cleanSongRequest(songRequest)
			let song = await queue.play(songRequestCleaned)
			if (song) {
				embedSuccess
					.setAuthor({name: message.member.displayName + ' | Ajouté en #' + queue.songs.length, iconURL: message.member.displayAvatarURL({dynamic: true})})
					.setDescription('**' + song.name + '** par **' + song.author + '** [' + song.duration + ']')
				
				log.info(message.member.displayName + ' a ajouté ' + song.name + ' par ' + song.author + ' [' + song.duration + ']')
			}
		} else {
			let resp = await queue.playlist(songRequest)
			embedSuccess
				.setAuthor({name: message.member.displayName + ' | ' + resp.songs.length + ' chansons ajoutées en file d\'attente', iconURL: message.member.displayAvatarURL({dynamic: true})})
				.setDescription('lezgooooo')

			log.info(message.member.displayName + ' a ajouté ' + resp.songs.length + ' chansons à la file d\'attente')
		}
	
		message.channel.send({embeds : [embedSuccess]})
		await message.reactions.removeAll()
		message.react('🎶')
	},
} 
