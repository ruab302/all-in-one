const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('يعرض معلومات عن المستخدم')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('المستخدم اللي عايز تشوف معلوماته')
        .setRequired(false)
    ),
  
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    const embed = new EmbedBuilder()
      .setTitle(`👤 معلومات ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '🆔 ID', value: user.id, inline: true },
        { name: '📅 انضم إلى ديسكورد في', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true }
      )
      .setColor('#9b59b6');

    if (member) {
      embed.addFields(
        { name: '📆 انضم إلى السيرفر في', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`, inline: true }
      );
    }

    await interaction.reply({ embeds: [embed] });
  }
};
