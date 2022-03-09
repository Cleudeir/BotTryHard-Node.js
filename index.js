const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Discord = require("discord.js"); //start
const config = require("./env.json");

const bot = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
});



const Bot = async () =>{   

    bot.login(config.token);
    bot.on("ready", () => {
    console.log(`✔️  Bot foi iniciado`); 
    });
    setInterval(pull,60*60*1000)
    let dataRanking = pull()
 
    async function pull (){
        const { data } = await fetch('https://dota-try-hard.vercel.app/api/bot')
        .then((resp) => resp.json())
        .then((resp) => resp)
        .catch((err) => err.message);  
        
        dataRanking = data

        console.log(dataRanking ? dataRanking.length : 'Error')
        return data
    }  

    bot.on("message", async message => {

        if(message.author.bot) return;
        if(message.channel.type === "dm") return;
        if(!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const [comando,info] = args.shift().toLowerCase().split('=');
    
    // comando ping
    if(comando === "ping") {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms.`);
    }
    if(comando === "r" && dataRanking) {
        const [playerData] = dataRanking.filter(x=> +x.account_id === +info)
        console.log(playerData)
        const img = await message.channel.send({files:[playerData.avatarfull]});      
        const m = await message.channel.send("Ranking...");   
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
        Win/Loss = ${playerData.win}/${ +playerData.matches - +playerData.win}
        Win rate = ${playerData.winRate}%

        veja o ranking completo: https://dota-try-hard.vercel.app/${playerData.account_id}
        `)        
    }else{
        const m = await message.channel.send("Desculpe! DataBase esta offline");
    }
    });
  }
Bot()

