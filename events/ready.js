const chalk = require('chalk');
const moment = require('moment');
const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');

var prefix = ayarlar.prefix;

module.exports = client => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: Aktif, Komutlar yüklendi!`);
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: ${client.user.username} ismi ile giriş yapıldı!`);
  //client.user.setStatus('offline');
  //client.user.setGame(`Deneme aşamasında `);
  //client.user.setStatus("ofline");
  //client.user.setActivity("ASGARD YAPIM AŞAMASI",{ type: "WATCHING"}); //// TYPE - WATCHING , PLAYING , LISTENING gibi değiştirilebilir.

  const aktiviteListesi = [
      `Rhot Group`
    ]

    client.user.setStatus('DND')

    setInterval(() => {
      const Aktivite = Math.floor(Math.random() * (aktiviteListesi.length - 1))
      client.user.setActivity(aktiviteListesi[Aktivite])
    }, 5000)

  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: Oyun ismi ayarlandı!`);
  console.log(client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString());

};
