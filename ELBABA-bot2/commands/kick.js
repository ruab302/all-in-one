const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('طرد عضو من السيرفر')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('المستخدم اللي عايز تطرده')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('سبب الطرد')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers),
  
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply({ content: '❌ ماعندكش صلاحية لطرد الأعضاء.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);
    const reason = interaction.options.getString('reason') || 'بدون سبب';

    if (!member) {
      return interaction.reply({ content: '❌ العضو مش موجود في السيرفر.', ephemeral: true });
    }

    if (!member.kickable) {
      return interaction.reply({ content: '❌ مش قادر أطرد الشخص ده.', ephemeral: true });
    }

    await member.kick(reason);

    const embed = new EmbedBuilder()
      .setTitle('👢 تم طرد عضو')
      .addFields(
        { name: '👤 العضو', value: `${user.tag}`, inline: true },
        { name: '🧑‍⚖️ بواسطة', value: `${interaction.user.tag}`, inline: true },
        { name: '📄 السبب', value: reason }
      )
      .setColor('#9b59b6');

    await interaction.reply({ embeds: [embed] });
  }
};
