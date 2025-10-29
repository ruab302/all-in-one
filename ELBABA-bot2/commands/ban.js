const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('يحظر عضو من السيرفر')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('المستخدم اللي عايز تحظره')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('سبب الحظر')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),
  
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply({ content: '❌ ماعندكش صلاحية البان.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);
    const reason = interaction.options.getString('reason') || 'بدون سبب';

    if (!member) {
      return interaction.reply({ content: '❌ العضو مش موجود في السيرفر.', ephemeral: true });
    }

    if (!member.bannable) {
      return interaction.reply({ content: '❌ مش قادر أعمل بان للشخص ده.', ephemeral: true });
    }

    await member.ban({ reason });

    const embed = new EmbedBuilder()
      .setTitle('🔨 تم حظر عضو')
      .addFields(
        { name: '👤 العضو', value: `${user.tag}`, inline: true },
        { name: '🧑‍⚖️ بواسطة', value: `${interaction.user.tag}`, inline: true },
        { name: '📄 السبب', value: reason }
      )
      .setColor('#9b59b6');

    await interaction.reply({ embeds: [embed] });
  }
};
