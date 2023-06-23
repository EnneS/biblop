const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders') 
const { useMasterPlayer } = require("discord-player");
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

		const player = useMasterPlayer()
		const songRequest = args.join(' ')
		const query = cleanSongRequest(songRequest)

		// Play song
		await player.play(message.member.voice.channel, query)
			.then(async res => {
				const queue = useQueue(message.guild.id)
				const track = res.track
				const embedSuccess = new EmbedBuilder().setColor(0x0099FF)
					.setAuthor({name: message.member.displayName + ' | Ajouté en #' + (queue.tracks.toArray().length + 1), iconURL: message.member.displayAvatarURL({dynamic: true})})
					.setDescription('**' + track.title + '** par **' + track.author + '** [' + track.duration + ']')
				
				message.channel.send({embeds : [embedSuccess]})
				await message.reactions.removeAll()
				message.react('🎶')
				log.info(message.member.displayName + ' a ajouté ' + track.title + ' par ' + track.author + ' [' + track.duration + ']')
			})
	},
} 
