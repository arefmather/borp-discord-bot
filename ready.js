module.exports = (client) => {
  client.user.setPresence({ activity: { name: client.config.botStatus }, status: "idle" });
  console.log("Bot hazır!");
};

module.exports.config = {
  name: "ready"
};