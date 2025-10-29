const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('يعرض بروفايل المستخدم')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('المستخدم المراد عرض بروفايله (اختياري)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;

    const embed = new EmbedBuilder()
      .setTitle(`💜 بروفايل ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '🆔 ID', value: user.id },
        { name: '🎮 التاج', value: user.tag },
        { name: '📅 انضم لديسكورد في', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>` }
      )
      .setColor('#9b59b6');

    await interaction.reply({ embeds: [embed] });
  }
};
