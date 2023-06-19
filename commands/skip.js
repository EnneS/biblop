const { SlashCommandBuilder } = require('@discordjs/builders') 
const { useQueue } = require("discord-player");

module.exports = {
	aliases: ['sk'],
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip la musique en cours'),
	async execute(message, args) {
		let guildQueue = useQueue(message.guild.id);
		if (!guildQueue) return message.reply('Y\'a pas de son fréro') && message.react('❌')
		guildQueue.node.skip()
		
		if(message.author) message.react('⏭')
	},
} 
