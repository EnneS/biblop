const { SlashCommandBuilder } = require('@discordjs/builders') 
const { s } = require('@sapphire/shapeshift') 
const {  EmbedBuilder } = require('discord.js') 

module.exports = {
	aliases: ['st'],
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Déconnecte le bot'),
	async execute(message, args) {
		const client = message.client
		let guildQueue = client.player.getQueue(message.guild.id)
		guildQueue.stop()
		message.react('👋')
	},
} 
