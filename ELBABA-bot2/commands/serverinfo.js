const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('📊 يعرض معلومات عن السيرفر'),

  async execute(interaction) {
    const { guild } = interaction;

    const embed = new EmbedBuilder()
      .setTitle(`📊 معلومات السيرفر: ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: '👑 المالك', value: `<@${guild.ownerId}>`, inline: true },
        { name: '👥 الأعضاء', value: `${guild.memberCount}`, inline: true },
        { name: '📅 أُنشئ في', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true }
      )
      .setColor('#9b59b6');

    await interaction.reply({ embeds: [embed] });
  },
};
