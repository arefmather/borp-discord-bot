const { MessageEmbed } = require("discord.js");
const kayıtliste = require("../models/kayıtliste.js");

module.exports.run = async (client, message, args) => {
  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true })).setColor(client.config.embedColor);
  if (!member) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({ timeout: 5000 }));
  if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription(`${member} senden üstün veya aynı rolde!`)).then(x => x.delete({ timeout: 5000 }));
  if (!args[1] || !args[2]) return message.channel.send(embed.setDescription("Lütfen üyenin steam profil linkini ve steam hex ID'sini belirtin!")).then(x => x.delete({ timeout: 5000 }));
  if (client.config.unregisterRoles.some(r => member.roles.cache.has(r))) {
    await kayıtliste.findByIdAndUpdate(message.author.id, { $inc: { kayıtliste2: 1 } }, { upsert: true });
    await kayitlar.findByIdAndUpdate(member.id, { $push: { kayitlar: [{ isim: args[1], roller: client.config.whrol, tarih: Date.now() }] } }, { upsert: true });
  };
  await member.roles.set(member.roles.cache.map(r => r.id).filter(r => !client.config.unregisterRoles.includes(r) && !client.config.unregisterRoles.includes(r)).concat(client.config.whrol)).catch(err => { return undefined; });
  message.channel.send(embed.setDescription(`${member}, başarıyla kayıt edildi.`));
};

module.exports.config = {
  name: "k",
  description: "Belirtilen üyeyi kayıt eder.",
  usage: "k @üye steamProfil hexID",
  aliases: ["k"],
};
