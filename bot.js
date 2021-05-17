const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
const db = require("wio.db");
//const dbs = require('quick.db')
require('./util/eventLoader')(client);
const fynx = require("./ayarlar.json");
const { Player } = require("discord-player");
//const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const ms = require("parse-ms");

const { YOUTUBE_API_KEY } = require("./ayarlar.json");
const YoutubeAPI = require("simple-youtube-api");
const youtube = new YoutubeAPI(YOUTUBE_API_KEY);



const player = new Player(client);
client.player = player;


const { Client, MessageEmbed } = require('discord.js');


var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};


client.on("ready", () => {
  client.channels.cache.get("843616658336776224").join();
});


client.on("voiceStateUpdate", async(oldState, newState) => {
    if (!oldState.channelID && newState.channelID && newState.member.id != client.user.id) {
        if(newState.channelID === "843616658336776224") {
          var kontrol = db.fetch(`welcome_${newState.member.id}`);
          if(kontrol === "mesajalındı") {return}
          var VC = newState.member.voice.channelID;
          const channel = newState.guild.channels.cache.get(VC);
      channel.join()
          .then(connection => {
              const dispatcher = connection.play('./Rhot.mp3');
              db.set(`welcome_${newState.member.id}`, 'mesajalındı')
          }).catch(console.error);
}
        }
    });



client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);
