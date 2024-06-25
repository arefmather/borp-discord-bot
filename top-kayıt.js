const { MessageEmbed } = require("discord.js");
const kayıtliste = require("../models/kayıtliste.js");

module.exports.run = async (client, message, args) => {
  let embed = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true })).setColor(client.config.embedColor);
  let data = await kayıtliste.find().sort({ kayıtliste2: "descending" });
  message.channel.send(embed.setDescription(`Yetkili Kayıt Sıralaması\n\n${data.length ? data.map((d, index) => `\`${index+1}.\` <@${d._id}> | ${d.kayıtliste2}`).join("\n") : "Bulunamadı!"}`));
};

module.exports.config = {
  name: "top-kayıt",
  description: "En çok kayıt alanlar.",
  usage: "top-kayıt",
  aliases: ["top-kayıt"],
};