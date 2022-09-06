
const fetch = (...args) => import('node-fetch')
	.then(({ default: fetch }) => fetch(...args));
const Discord = require('discord.js'); // Start
require('dotenv').config();

const config = {
	token: process.env.TOKEN,
	prefix: process.env.PREFIX,
	url: process.env.URL,
};

const bot = new Discord.Client({
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
	],
});

const _bot = async () => {
	bot.login(config.token);
	bot.on('ready', messageCreate => {
		console.log('✔️  Bot foi iniciado');
		return messageCreate;
	});

	bot.on('messageCreate', async messageCreate => {
		if (messageCreate.author.bot) {
			return;
		}

		if (messageCreate.channel.type === 'dm') {
			return;
		}

		if (!messageCreate.content.startsWith(config.prefix)) {
			return;
		}

		const args = messageCreate.content.slice(config.prefix.length).trim().split(/ +/g);
		const [comando, info] = args.shift().toLowerCase().split('=');

		// Comando ping
		if (comando === 'hello' || comando === 'h') {
			await messageCreate.channel.send('Hello world!');
		} else if (comando === 'help' || comando === '?') {
			await messageCreate.channel.send(`\n
      Commands:
	  !h = > Hello world
      !r=account_id => Verifica seu ranked e seu status médio
      !help => Mostra os comandos disponíveis     
      `);
		} else if (comando === 'r') {
			const req = await fetch(`${process.env.URL}/player?account_id=${info}`);
			const reqJson = await req.json();
			const playerData = reqJson.avg;
			console.log(playerData);

			if (playerData) {
				const img = `${playerData.profile.avatarfull.slice(0, playerData.profile.avatarfull.length - 9)}_medium.jpg`;
				await messageCreate.channel.send({
					files: [img],
				});
				await messageCreate.channel.send(
					`Aqui esta  ${playerData.profile.personaname}:
	Rating : ${playerData.rankingRate.toLocaleString('pt-BR')}  
	Kill/Deaths/Assists = ${playerData.kills}/${playerData.deaths}/${playerData.assists}
	Last/Denies = ${playerData.last_hits}/${playerData.denies}
	GPM = ${playerData.gold_per_min.toLocaleString('pt-BR')}
	XPM = ${playerData.xp_per_min.toLocaleString('pt-BR')}
	Hero damage = ${playerData.hero_damage.toLocaleString('pt-BR')}
	Tower damage = ${playerData.tower_damage.toLocaleString('pt-BR')}
	Hero healing = ${playerData.hero_healing.toLocaleString('pt-BR')}   
	Win/Matches = ${playerData.win}/${Number(playerData.matches)}
	Win rate = ${playerData.winRate}%

	veja o ranking completo: https://dotatryhard.vercel.app
		`,
				);
			} else {
				await messageCreate.channel.send(`
			Infelizmente você não esta no ranking
			busque no site: https://dotatryhard.vercel.app
			`);
			}
		}
	});
};

_bot();
