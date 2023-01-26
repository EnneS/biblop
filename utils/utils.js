const { EmbedBuilder, ButtonStyle } = require('discord.js')
const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const log = require('log')

module.exports = {
    sendPlayingMessage(client, song) {
        // Send the song info to the channel
		const embedNewSong = new  EmbedBuilder()
		.setColor(0x0099FF)
		.setAuthor({name: song.name + ' - ' + song.author + ' | [' + song.duration + ']'})
		.setDescription('🎶')

		// Action buttons
		const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('skip')
				.setLabel('⏭')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId('stop')
				.setLabel('❌')
				.setStyle(ButtonStyle.Danger),
		);

		module.exports.deleteLastMessage(client)

		client.lastChannel.send({embeds : [embedNewSong], components : [row]})
				.then((m) => client.lastMessage = m)

		log.info("🎶 Now playing: " + song.name + " - " + song.author)
    },
    deleteLastMessage(client) {
        if (client.lastMessage) {
			client.lastMessage.delete()
			client.lastMessage = null
		}
    },
	cleanSongRequest (songRequest) {
		// path looks like https://www.youtube.com/watch?v=vHJfMFJRGpY&list=RDMMvHJfMFJRGpY&start_radio=1&ab_channel=Blaze-Topic&blabla=blabla
		// only keep https://www.youtube.com/watch?v=vHJfMFJRGpY
		let path = songRequest.split('&')[0]
		return path
	}
}