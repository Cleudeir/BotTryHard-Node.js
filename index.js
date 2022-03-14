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
  bot.on('ready', () => {
    console.log('✔️  Bot foi iniciado');
  });

  let dataRanking = [];
  async function pull() {
    const { data } = await fetch(`${config.url}/api/bot`)
      .then((resp) => resp.json())
      .then((resp) => resp)
      .catch(() => []);
    dataRanking = data;
    return data;
  }
  await pull();
  setInterval(pull, 9 * 60 * 1000);
  async function auto() {
    const players = [];
    console.log('Busca');
    for (let i = 0; i < dataRanking.length; i += 1) {
      if (dataRanking[i].matches < 20) { players.push(dataRanking[i].account_id); }
    }
    const result = await fetch(
      `${config.url}/api/auto`,
      {
        method: 'POST',
        body: JSON.stringify(players.slice(0, 10)),
      },
    );
    console.log('result', result.statusText);
  }
  await auto();

  setInterval(auto, 10 * 60 * 1000);
  bot.on('message', async (message) => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const [comando, info] = args.shift().toLowerCase().split('=');

    // comando ping
    if (comando === 'ping' || comando === 'p') {
      const m = await message.channel.send('Ping?');
      m.edit(`Ping! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms.`);
    } else if (comando === 'help' || comando === '?') {
      const m = await message.channel.send('help?');
      m.edit(`\n
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
          await message.channel.send({
            files: [img],
          });
          const m = await message.channel.send('Ranking...');
          m.edit(
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
          Win/Loss = ${playerData.win}/${+playerData.matches - +playerData.win}
          Win rate = ${playerData.winRate}%

          veja o ranking completo: https://dota-try-hard.vercel.app/${playerData.account_id}
          `,
          );
        } else {
          await message.channel.send(`
          Infelizmente você não esta no ranking
          busque no site: https://dota-try-hard.vercel.app/${info}`);
        }
      } else {
        await message.channel.send('Desculpe! DataBase esta offline');
        pull();
      }
    }
  });
};
Bot();
