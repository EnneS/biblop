const { SlashCommandBuilder } = require('@discordjs/builders');
const { s } = require('@sapphire/shapeshift');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Joue une musique à partir d\'une URL'),
	async execute(message, args) {
		const client = message.client
		let guildQueue = client.player.getQueue(message.guild.id);
		let queue = client.player.createQueue(message.guild.id)
		
		// Join & add the song to the queue
		await queue.join(message.member.voice.channel);
        let song = await queue.play(args.join(' '))
			.catch(err => {
				const embedError = new MessageEmbed()
				.setColor('#ff0000')
				.setDescription('Marche po')
				message.channel.send({embeds : [embedError]})

				if(!guildQueue)
                	queue.stop()
	        });

		// Send success message ==> displays song's info & position in queue
		const embedSuccess = new MessageEmbed()
			.setColor('#0099ff')
			.setAuthor({name: message.member.displayName + ' | Ajouté en #' + queue.songs.length, iconURL: message.member.displayAvatarURL({dynamic: true})})
			.setDescription('**' + song.name + '** par **' + song.author + '** [' + song.duration + ']')
	
		message.channel.send({embeds : [embedSuccess]})
		message.react('🎶')
	},
};
