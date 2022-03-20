/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
const fetch = (...args) => import('node-fetch')
  .then(({ default: fetch }) => fetch(...args));
const Discord = require('discord.js'); // start
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

const Bot = async () => {
  bot.login(config.token);
  bot.on('ready', (messageCreate) => {
    console.log('✔️  Bot foi iniciado');
    return messageCreate;
  });

  function sleep(ms) {
    return new Promise(
      (resolve) => setTimeout(resolve, ms),
    );
  }

  let dataRanking = [];
  async function pull() {
    console.log('start Pull');
    const { data } = await fetch(`${config.url}/api/bot`).then((data) => data.json());
    if (data) {
      dataRanking = await data;
    }

    const players = [];
    for (let i = 0; i < dataRanking.length; i += 1) {
      players.push(dataRanking[i].account_id);
    }

    for (let n = 0; n < players.length; n += 1) {
      console.log(n, players.length);
      await sleep(10 * 60 * 1000);
      const send = players[n];
      console.log('Busca', new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }), send);
      const result = await fetch(`${config.url}/api/auto/${send}`);
      console.log('result', result);
    }
  }
  await pull();

  setInterval(pull, 240 * 60 * 1000);

  bot.on('messageCreate', async (messageCreate) => {
    if (messageCreate.author.bot) return;
    if (messageCreate.channel.type === 'dm') return;
    if (!messageCreate.content.startsWith(config.prefix)) return;

    const args = messageCreate.content.slice(config.prefix.length).trim().split(/ +/g);
    const [comando, info] = args.shift().toLowerCase().split('=');

    // comando ping
    if (comando === 'hello' || comando === 'h') {
      await messageCreate.channel.send('Hello world!');
    } else if (comando === 'help' || comando === '?') {
      await messageCreate.channel.send(`\n
      Commands:
      !p => Verifica seu ping
      !r=account_id => Verifica seu ranked e seu status médio
      !help => Mostra os comandos disponíveis     
      `);
    } else if (comando === 'r') {
      if (dataRanking) {
        const [playerData] = dataRanking.filter((x) => +x.account_id === +info);

        if (playerData) {
          const img = `${playerData.avatarfull.slice(0, playerData.avatarfull.length - 9)}_medium.jpg`;
          await messageCreate.channel.send({
            files: [img],
          });
          await messageCreate.channel.send(
            `Aqui esta  ${playerData.personaname}:
          ➡️ Position: ${playerData.id} de ${dataRanking.length}
          Rating : ${playerData.ranking.toLocaleString('pt-BR')}  
          Kill/Deaths/Assists = ${playerData.kills}/${playerData.deaths}/${playerData.assists}
          Last/Denies = ${playerData.last_hits}/${playerData.denies}
          GPM = ${playerData.gold_per_min.toLocaleString('pt-BR')}
          XPM = ${playerData.xp_per_min.toLocaleString('pt-BR')}
          Hero damage = ${playerData.hero_damage.toLocaleString('pt-BR')}
          Tower damage = ${playerData.tower_damage.toLocaleString('pt-BR')}
          Hero healing = ${playerData.hero_healing.toLocaleString('pt-BR')}   
          Win/Matches = ${playerData.win}/${+playerData.matches}
          Win rate = ${playerData.winRate}%

          veja o ranking completo: https://dota-try-hard.vercel.app/${playerData.account_id}
          `,
          );
        } else {
          await messageCreate.channel.send(`
          Infelizmente você não esta no ranking
          busque no site: https://dota-try-hard.vercel.app/${info}`);
        }
      } else {
        await messageCreate.channel.send('Desculpe! DataBase esta offline');
        pull();
      }
    }
  });
};
Bot();
