const { Client, Collection, MessageEmbed } = require("discord.js");
const client = new Client({ fetchAllMembers: true });
const fs = require("fs");
const config = client.config = require("./config.json");
const moment = require("moment");
require("moment-duration-format");
require("moment-timezone");
moment.locale("tr");
const mongoose = require("mongoose");
mongoose.connect(config.mongooseConnectURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(x => console.log("MongoDB bağlantısı kuruldu!")).catch(err => console.error(err));
mongoose.connection.on('error', (err) => {
  console.log(`[Mongoose Error]: ${err}`);
});

Array.prototype.clear = function() {
  let newArray = [];
  for (let i of this) {
   if (!newArray.includes(i) && i !== "" && i !== " ") newArray.push(i);
  };
  return newArray;
};

const yetkiliRolId = '1070464429721923585';
const kategoriId = '1074766006553170039';
const bossRol = '1070464429608677512';
const ogRol = '1070464429608677511';
const patronRol = '1226634149818011679';
const patronyardimcisiRol = '1226636296349552790';

client.on('message', async message => {
  if (!message.guild) return;
  if (message.content.startsWith('!oluşum-aç')) {
    if (!message.member.roles.cache.has(yetkiliRolId)) {
      return message.reply("Bu komutu kullanma izniniz yok.");
    }

    const args = message.content.slice('!oluşum-aç'.length).trim().split(/ +/);
    const roleName = args.join(' ');

    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    const role = await message.guild.roles.create({
      data: {
        name: roleName,
        color: randomColor
      }
    });

    const channel = await message.guild.channels.create(roleName, {
      type: 'text'
    });

    const category = message.guild.channels.cache.get(kategoriId);
    if (category) {
      await channel.setParent(category.id);
    } else {
      console.log('Kategori bulunamadı.');
    }

    await channel.updateOverwrite(message.guild.id, {
      VIEW_CHANNEL: false
    });
    await channel.updateOverwrite(message.guild.roles.everyone, {
      VIEW_CHANNEL: false,
      SEND_MESSAGES: false
    });
    await channel.updateOverwrite(client.user, {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true
    });
    await channel.updateOverwrite(yetkiliRolId, {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true
    });
    await channel.updateOverwrite(bossRol, {
      SEND_MESSAGES: true
    });
    await channel.updateOverwrite(ogRol, {
      SEND_MESSAGES: true
    });
	  await channel.updateOverwrite(patronRol, {
      SEND_MESSAGES: true
    });
    await channel.updateOverwrite(patronyardimcisiRol, {
      SEND_MESSAGES: true
    });
    await channel.updateOverwrite(role, {
      VIEW_CHANNEL: true
    });

    await message.channel.send(`Rol ve kanal başarıyla oluşturuldu.`);
  }
});

client.on('message', message => {
    if (message.content === '!say') {
        const totalMembers = message.guild.memberCount;
        const onlineMembers = message.guild.members.cache.filter(member => member.presence.status !== 'offline').size;

        let voiceChannelCount = 0;
        message.guild.channels.cache.forEach(channel => {
            if (channel.type === 'voice') {
                voiceChannelCount += channel.members.size;
            }
        });

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Sunucu Bilgisi')
            .addField('Toplam Üye Sayısı', totalMembers, true)
            .addField('Çevrimiçi Üye Sayısı', onlineMembers, true)
            .addField('Sesteki Toplam Üye Sayısı', voiceChannelCount, true)
            .setTimestamp();

        message.channel.send(embed);
    }
});

const events = fs.readdirSync("./events");
for (let event of events) {
  if (!event.endsWith(".js")) continue;
  let prop = require(`./events/${event}`);
  if (!prop.config) continue;
  if (prop.config.name !== "ready") {
    client.on(prop.config.name, prop);
  } else {
    client.on(prop.config.name, () => prop(client));
  };
  console.log(`[EVENT]: ${event} yüklendi!`);
};

client.commands = new Collection();
client.aliases = new Collection();
const commands = fs.readdirSync("./commands");
for (let command of commands) {
  if (!command.endsWith(".js")) continue;
  let prop = require(`./commands/${command}`);
  client.commands.set(prop.config.name, prop);
  if (prop.config.aliases) {
    prop.config.aliases.clear().forEach(aliase => {
      client.aliases.set(aliase, prop.config.name);
    });
  };
  console.log(`[KOMUT]: ${prop.config.name} yüklendi!`);
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.login(config.botToken).then(x => console.log(`${client.user.tag} olarak bota giriş yapıldı!`)).catch(err => console.error(`Bota giriş yapılamadı!\n[HATA]: ${err}`));