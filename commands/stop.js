const { SlashCommandBuilder } = require('@discordjs/builders') 
const { s } = require('@sapphire/shapeshift') 
const { useQueue } = require("discord-player");

module.exports = {
	aliases: ['st'],
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Déconnecte le bot'),
	async execute(message, args) {
		let guildQueue = useQueue(message.guild.id)
		guildQueue.delete();
		if(message.author) message.react('👋')
	},
} 
