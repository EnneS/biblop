const { SlashCommandBuilder } = require('@discordjs/builders') 
const { s } = require('@sapphire/shapeshift') 
const {  EmbedBuilder } = require('discord.js') 
const { Message } = require('discord.js/src/structures/Message')

module.exports = {
	aliases: ['sk'],
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip la musique en cours'),
	async execute(message, args) {
		const client = message.client
		let guildQueue = client.player.getQueue(message.guild.id)
		if (!guildQueue) return message.reply('Y\'a pas de son fréro') && message.react('❌')
		guildQueue.skip()
		
		if(message.author) message.react('⏭')
	},
} 
