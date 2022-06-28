const { SlashCommandBuilder } = require('@discordjs/builders') 
const { s } = require('@sapphire/shapeshift') 
const { MessageEmbed } = require('discord.js') 

module.exports = {
	aliases: ['s'],
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip la musique en cours'),
	async execute(message, args) {
		const client = message.client
		let guildQueue = client.player.getQueue(message.guild.id)
		if (!guildQueue) return message.reply('Y\'a pas de son fréro') && message.react('❌')
		guildQueue.skip()
		message.react('⏭')
	},
} 
