const fetch = (...args) =>
	import("node-fetch").then(({ default: fetch }) => fetch(...args));
const Discord = require("discord.js"); // Start
require("dotenv").config();

const config = {
	token: process.env.TOKEN,
	prefix: process.env.PREFIX,
	url: process.env.URL,
};

const bot = new Discord.Client({
	intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
});
let data;
let avgGlobal;
const _bot = async () => {
	bot.login(config.token);
	bot.on("ready", async (messageCreate) => {
		console.log("✔️  Bot foi iniciado");
		bot.user.setActivity("Dota2");
		setInterval(getData, 24 * 60 * 60 * 1000);
		async function getData() {
			const req2 = await fetch(`${process.env.URL}/ranking?limit=2000`);
			const json = await req2.json();
			data = json.data;
			avgGlobal = json.avgGlobal;
			console.log("data :", data.length);
			console.log("avgGlobal :", avgGlobal);
		}
		getData()
		return messageCreate;
	});

	bot.on("messageCreate", async (messageCreate) => {
		console.log(messageCreate.author.username);
		if (messageCreate.author.bot) {
			return;
		}

		if (messageCreate.channel.type === "dm") {
			return;
		}

		if (!messageCreate.content.startsWith(config.prefix)) {
			return;
		}

		const args = messageCreate.content
			.slice(config.prefix.length)
			.trim()
			.split(/ +/g);
		const [comando, info] = args.shift().toLowerCase().split("=");

		// Comando ping
		if (comando === "hello" || comando === "h") {
			await messageCreate.channel.send("Hello world!");
		} else if (comando === "help" || comando === "?") {
			await messageCreate.channel.send(`\n
      Commands:
	  !h = > Hello world
      !r=account_id => Verifica seu ranked e seu status médio
      !help => Mostra os comandos disponíveis
      `);
		} else if (comando === "r") {
			let userData;
			console.log('id: ', Number(info), typeof Number(info) === 'number');
			if (info && typeof info === 'number') {
				const filter = data.filter((_user) => _user.profile.account_id === Number(info));
				if (filter.length > 0) {
					userData = filter[0];
				}
				console.log(userData);
			} else if (info && info.length > 0) {
				const filter = data.filter((_user) => _user.profile.personaname.toLowerCase().includes(info.toLowerCase()));
				if (filter.length > 0) {
					userData = filter[0];
				}
				console.log(userData);
			}

			if (userData) {
				const img = `${userData.profile.avatarfull.slice(
					0,
					userData.profile.avatarfull.length - 9
				)}_medium.jpg`;
				await messageCreate.channel.send({
					files: [img],
				});
				await messageCreate.channel.send(
					`Aqui esta ${userData.profile.personaname}:
	Pos: ${userData.pos} de ${data.length} | Ranking Rating : ${userData.rankingRate
					}   
	Kill | Deaths | Assists = ${userData.kills} | ${userData.deaths} | ${userData.assists}
	Last | Denies = ${userData.last_hits} | ${userData.denies}
	GPM = ${Math.floor(userData.gold_per_min)}
	XPM = ${Math.floor(userData.xp_per_min)}
	Hero damage = ${Math.floor(userData.hero_damage)}
	Tower damage = ${Math.floor(userData.tower_damage)}
	Hero healing = ${Math.floor(userData.hero_healing)}   
	Win | Matches = ${userData.win} | ${Number(userData.matches)}
	Win rate = ${userData.winRate}%
	kiter rate = ${Math.floor((userData.leaver_status / userData.matches) * 100 * 100) / 100
					}%

	Veja o suas partidas recentes :
	https://dotatryhard.vercel.app/matches/${userData.profile.account_id},
	Veja o sua Win Rate com seu amigos e inimigos :
	https://dotatryhard.vercel.app/infos/${userData.profile.account_id}.

		`
				);
			} else {
				await messageCreate.channel.send(`
			Infelizmente você não foi encontrado, tente novamente
			ou busque no site:
			https://dotatryhard.vercel.app/.`);
			}

			await messageCreate.channel.send(
				`Obrigado! <@${messageCreate.author.id}>`
			);
		}
	});
};

_bot();
