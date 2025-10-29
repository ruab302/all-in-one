const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const xpData = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('يعرض مستواك الحالي وعدد نقاطك'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const userXP = xpData.get(userId) || { xp: 0, level: 1 };

    const embed = new EmbedBuilder()
      .setTitle(`🏆 المستوى - ${interaction.user.username}`)
      .setDescription(`المستوى الحالي: **${userXP.level}**\nالخبرة (XP): **${userXP.xp}**`)
      .setColor('#9b59b6')
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }));

    await interaction.reply({ embeds: [embed] });
  }
};
