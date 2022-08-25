const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders') 
const { s } = require('@sapphire/shapeshift') 
const log = require('log')

module.exports = {
	aliases: ['p'],
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Joue une musique à partir d\'une URL'),
	async execute(message, args) {
		const client = message.client
		const guildQueue = client.player.getQueue(message.guild.id) 
		const queue = client.player.createQueue(message.guild.id)
		const songRequest = args.join(' ')
		const isPlaylist = songRequest.includes('playlist') || songRequest.includes('album')
		const embedSuccess = new EmbedBuilder().setColor(0x0099FF)

		// Join & add the song to the queue
		await queue.join(message.member.voice.channel)
		if (!isPlaylist) {
			let song = await queue.play(songRequest)
				.catch(err => {
					const embedError = new  EmbedBuilder()
					.setColor(0xFF0000)
					.setDescription('Marche po')
					message.channel.send({embeds : [embedError]})
					
					if(!guildQueue)
						queue.stop()
				}) 
			if (song) {
				embedSuccess
					.setAuthor({name: message.member.displayName + ' | Ajouté en #' + queue.songs.length, iconURL: message.member.displayAvatarURL({dynamic: true})})
					.setDescription('**' + song.name + '** par **' + song.author + '** [' + song.duration + ']')
				
				log.info(message.member.displayName + ' a ajouté ' + song.name + ' par ' + song.author + ' [' + song.duration + ']')
			}
		} else {
			let songs = await queue.playlist(songRequest)
				.catch(err => {
					const embedError = new  EmbedBuilder()
					.setColor('#ff0000')
					.setDescription('Marche po')
					message.channel.send({embeds : [embedError]})

					if(!guildQueue)
						queue.stop()
				}) 
			embedSuccess
				.setAuthor({name: message.member.displayName + ' | ' + queue.songs.length + ' chansons ajoutées en file d\'attente', iconURL: message.member.displayAvatarURL({dynamic: true})})
			
			log.info(message.member.displayName + ' a ajouté ' + queue.songs.length + ' chansons à la file d\'attente')
		}
	
		message.channel.send({embeds : [embedSuccess]})
		message.react('🎶')
	},
} 
