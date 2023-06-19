const { SlashCommandBuilder } = require('@discordjs/builders') 
const { s } = require('@sapphire/shapeshift') 
const { useQueue } = require("discord-player");

module.exports = {
	aliases: ['ap'],
	data: new SlashCommandBuilder()
		.setName('autoplay')
		.setDescription('Activer ou désactiver l\'autoplay'),
	async execute(message, args) {
		let guildQueue = useQueue(message.guild.id)
		if (!guildQueue) return message.reply('Y\'a pas de son fréro') && message.react('❌')
        const willRepeat = guildQueue.repeatMode === 0
        guildQueue.setRepeatMode(willRepeat ? 3 : 0)
		message.react('🔁')
        if (!willRepeat) message.react('❌')
	},
} 
