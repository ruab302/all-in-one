const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setname')
    .setDescription('يغير اسم البوت داخل السيرفر')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageNicknames)
    .addStringOption(option =>
      option.setName('name')
        .setDescription('الاسم الجديد للبوت')
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

    const newName = interaction.options.getString('name');

    try {
      await interaction.guild.members.me.setNickname(newName);
      await interaction.reply({ content: `✅ تم تغيير اسم البوت داخل السيرفر إلى: **${newName}**`, ephemeral: true });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '⚠️ حصل خطأ أثناء تغيير الاسم.', ephemeral: true });
    }
  }
};
