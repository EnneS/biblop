const { SlashCommandBuilder } = require('@discordjs/builders') 
const { s } = require('@sapphire/shapeshift') 
const { EmbedBuilder } = require('discord.js') 
const { useQueue } = require("discord-player");

module.exports = {
	aliases: ['q'],
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Affiche la file d\'attente'),
	async execute(message, args) {
		let guildQueue = useQueue(message.guild.id)
		if (!guildQueue) return message.reply('Y\'a pas de son fréro') && message.react('❌')
		const currentTrack = guildQueue.currentTrack;
		if (!currentTrack) return message.reply('Y\'a pas de son fréro') && message.react('❌')
		let desc = `1. ${currentTrack.title} - ${currentTrack.author} • [${currentTrack.duration}]\n`

		for (const [i, song] of guildQueue.tracks.toArray().entries()) {
			desc += `${i + 2}. ${song.title} - ${song.author} • [${song.duration}]\n`
		}
		const QueueEmbed = new  EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('File d\'attente')
			.setDescription(desc)
		message.channel.send({embeds: [QueueEmbed]})
	},
} 
