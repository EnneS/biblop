const { SlashCommandBuilder } = require('@discordjs/builders');
const { s } = require('@sapphire/shapeshift');
const { RepeatMode } = require('discord-music-player');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loop')
		.setDescription('Activer ou désactiver la répétition de la musique en cours'),
	async execute(message, args) {
		const client = message.client
		let guildQueue = client.player.getQueue(message.guild.id)
		if (!guildQueue) return message.reply('Y\'a pas de son fréro') && message.react('❌')
        const willRepeat = guildQueue.repeatMode === RepeatMode.DISABLED
        guildQueue.setRepeatMode(willRepeat ? RepeatMode.SONG : RepeatMode.DISABLED)
		message.react('🔁')
        if (!willRepeat) message.react('❌')
	},
};
