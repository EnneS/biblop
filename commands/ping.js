const { SlashCommandBuilder } = require('@discordjs/builders') 

module.exports = {
	aliases: [],
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!') 
	},
} 
