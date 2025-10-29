const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leavevc')
    .setDescription('يخلي البوت يخرج من الروم الصوتي'),

  async execute(interaction) {
    try {
      const guild = interaction.guild;
      if (!guild) return interaction.reply({ content: '❌ لا يمكن العثور على السيرفر.', ephemeral: true });

      const connection = getVoiceConnection(guild.id);
      const voiceChannel = guild.members.me?.voice?.channel;

      if (!voiceChannel && !connection) {
        return interaction.reply({ content: '❌ البوت مش موجود في أي روم صوتي.', ephemeral: true });
      }

      if (connection) {
        connection.destroy();
      }

      if (interaction.client._vcConnections) {
        interaction.client._vcConnections.delete(guild.id);
      }

      return interaction.reply({ content: '👋 تم خروج البوت من الروم الصوتي بنجاح.' });
    } catch (err) {
      console.error('❌ خطأ في leavevc:', err);
      interaction.reply({ content: '⚠️ حصل خطأ أثناء محاولة مغادرة الروم الصوتي.', ephemeral: true });
    }
  }
};
