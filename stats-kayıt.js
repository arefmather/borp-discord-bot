const { MessageEmbed } = require("discord.js");
const kayıtliste = require("../models/kayıtliste.js");

module.exports.run = async (client, message, args) => {
  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true })).setColor(client.config.embedColor);
  let memberData = await kayıtliste.findById(member.id);
  if (!memberData) return message.channel.send(embed.setDescription(`${member} üyesinin kayıt verisi bulunamadı!`));
  message.channel.send(embed.setDescription(`${member} toplam **${memberData.kayıtliste2}** kayıtı bulunuyor!`));
};

module.exports.config = {
  name: "stats-kayıt",
  description: "Belirtilen yetkilinin kayıt sayısı.",
  usage: "stats-kayıt @üye",
  aliases: ["stats-kayıt"],
};
