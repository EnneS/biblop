const { SlashCommandBuilder } = require('@discordjs/builders') 
const { s } = require('@sapphire/shapeshift') 
const {  EmbedBuilder } = require('discord.js') 

module.exports = {
	aliases: ['q'],
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Affiche la file d\'attente'),
	async execute(message, args) {
		const client = message.client
		let guildQueue = client.player.getQueue(message.guild.id)
		if (!guildQueue) return message.reply('Y\'a pas de son fréro') && message.react('❌')
		let desc = ''
		for (const [i, song] of guildQueue.songs.entries()) {
			desc += `${i + 1}. ${song.name} - ${song.author} • [${song.duration}]\n`
		}
		const QueueEmbed = new  EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('File d\'attente')
			.setDescription(desc)
		message.channel.send({embeds: [QueueEmbed]})
	},
} 
