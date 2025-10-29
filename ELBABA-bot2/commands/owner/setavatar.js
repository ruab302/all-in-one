const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setavatar')
    .setDescription('تغيير صورة البوت (للأونر فقط)')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('رابط الصورة الجديدة')
        .setRequired(true)
    ),

  async execute(interaction) {
    const configPath = path.join(__dirname, '../../config.json');
    let config = {};
    try {
      if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      }
    } catch (err) {
      console.error('Error reading config:', err);
    }

    const allowedOwners = config?.owners || ['1042648956494155837', '1429871149126520853'];
    if (!allowedOwners.includes(interaction.user.id)) {
      return interaction.reply({ content: '🚫 هذا الأمر مخصص للأونر فقط.', ephemeral: true });
    }

    const url = interaction.options.getString('url');
    try {
      await interaction.client.user.setAvatar(url);
      await interaction.reply({ content: '✅ تم تغيير صورة البوت بنجاح!', ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '⚠️ حدث خطأ أثناء تغيير صورة البوت.', ephemeral: true });
    }
  }
};
