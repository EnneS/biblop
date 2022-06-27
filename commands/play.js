const { SlashCommandBuilder } = require('@discordjs/builders');
const { s } = require('@sapphire/shapeshift');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Joue une musique à partir d\'une URL'),
	async execute(message, args) {
		const client = message.client
		const guildQueue = client.player.getQueue(message.guild.id);
		const queue = client.player.createQueue(message.guild.id)
		const songRequest = args.join(' ')
		const isPlaylist = songRequest.includes('playlist')
		const embedSuccess = new MessageEmbed().setColor('#0099ff')
		
		// Join & add the song to the queue
		await queue.join(message.member.voice.channel);
		if (!isPlaylist) {
			let song = await queue.play(songRequest)
				.catch(err => {
					const embedError = new MessageEmbed()
					.setColor('#ff0000')
					.setDescription('Marche po')
					message.channel.send({embeds : [embedError]})
	
					if(!guildQueue)
						queue.stop()
				});
			embedSuccess
				.setAuthor({name: message.member.displayName + ' | Ajouté en #' + queue.songs.length, iconURL: message.member.displayAvatarURL({dynamic: true})})
				.setDescription('**' + song.name + '** par **' + song.author + '** [' + song.duration + ']')
		} else {
			let songs = await queue.playlist(songRequest)
				.catch(err => {
					const embedError = new MessageEmbed()
					.setColor('#ff0000')
					.setDescription('Marche po')
					message.channel.send({embeds : [embedError]})

					if(!guildQueue)
						queue.stop()
				});
			embedSuccess
				.setAuthor({name: message.member.displayName + ' | ' + queue.songs.length + ' chansons ajoutées en file d\'attente', iconURL: message.member.displayAvatarURL({dynamic: true})})	
		}
	
		message.channel.send({embeds : [embedSuccess]})
		message.react('🎶')
	},
};
