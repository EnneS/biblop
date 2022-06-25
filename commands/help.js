const { SlashCommandBuilder } = require('@discordjs/builders');
const { s } = require('@sapphire/shapeshift');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Donne la liste des commandes disponibles'),
	async execute(message, args) {
		const client = message.client

		let desc = ''
		for (const [name, command] of client.commands) {
			desc += `**${name}**: ${command.data.description}\n`
		}

		const HelpEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Liste des commandes')
			.setDescription(desc)

		message.channel.send({embeds: [HelpEmbed]})
	},
};
