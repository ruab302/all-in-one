const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setprefix')
    .setDescription('تغيير بريفكس البوت (للأونر فقط)')
    .addStringOption(option =>
      option.setName('prefix')
        .setDescription('البريفكس الجديد')
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

    const newPrefix = interaction.options.getString('prefix');
    
    try {
      interaction.client.prefix = newPrefix;
      config.prefix = newPrefix;
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      await interaction.reply({ content: `✅ تم تغيير البريفكس إلى: \`${newPrefix}\``, ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '⚠️ حدث خطأ أثناء تغيير البريفكس.', ephemeral: true });
    }
  }
};
