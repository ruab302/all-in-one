const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('يعرض سرعة استجابة البوت'),
  
  async execute(interaction) {
    await interaction.reply(`🏓 البينج: ${interaction.client.ws.ping}ms`);
  }
};
