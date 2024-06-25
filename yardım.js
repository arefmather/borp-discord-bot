const { MessageEmbed } = require("discord.js");
const kayıtliste = require("../models/kayıtliste.js");

module.exports.run = async (client, message, args) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.displayAvatarURL({ dynamic: true })).setColor(client.config.embedColor);
  message.channel.send(embed.setDescription(`${client.commands.map(c => `\`-\` ${c.config.usage} \`|\` ${c.config.description}`).join("\n")}`).setFooter(``));
};

module.exports.config = {
  name: "yardım",
  description: "Komut listesi.",
  usage: "yardım",
  aliases: ["help"],
};