const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders') 
const { useMainPlayer } = require("discord-player");
const { s } = require('@sapphire/shapeshift') 
const log = require('log')
const { cleanSongRequest } = require("../utils/utils");
const { useQueue } = require("discord-player");

module.exports = {
	aliases: ['p'],
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Joue une musique à partir d\'une URL'),
	async execute(message, args) {
		message.react('⏳')

		const player = useMainPlayer()
		const songRequest = args.join(' ')

		// Play song
		try {
			await player.play(message.member.voice.channel, cleanSongRequest(songRequest))
				.then(async res => {
					const queue = useQueue(message.guild.id)
					const track = res.track
					let desc = ""
					let authorDesc = ""
					if (track.playlist) {
						for (const [i, song] of track.playlist.tracks.entries()) {
							desc += `${i + 1}. **${song.title}** par **${song.author}** [${song.duration}]\n`
						}
						authorDesc = "Ajoutés en #" + ((queue.tracks.toArray().length +1 ) - (track.playlist.tracks.length) + 1)
						log.info(message.member.displayName + ' a ajouté la playlist ' + track.playlist.title + ' [' + track.playlist.tracks.length + ']') 
					} else {
						authorDesc = "Ajouté en #" + (queue.tracks.toArray().length + 1)
						desc = `**${track.title}** par **${track.author}** [${track.duration}]`
						log.info(message.member.displayName + ' a ajouté ' + track.title + ' par ' + track.author + ' [' + track.duration + ']')
					}
					const embedSuccess = new EmbedBuilder().setColor(0x0099FF)
						.setAuthor({name: message.member.displayName + ' | ' + authorDesc, iconURL: message.member.displayAvatarURL({dynamic: true})})
						.setDescription(desc)
					
					message.channel.send({embeds : [embedSuccess]})
					await message.reactions.removeAll()
					message.react('🎶')
				})
		} catch (error) {
			const embedError = new EmbedBuilder().setColor(0xFF0000)
				.setDescription('🙅‍♂️ Impossible de jouer la musique (peut-être que le lien est invalide ?)')
			message.channel.send({embeds : [embedError]})
			log.error(error)
		}
	},
} 
