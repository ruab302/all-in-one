const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('إلغاء إسكات مستخدم')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('المستخدم اللي عايز تلغي إسكاته')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers),
  
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({ content: '❌ لا تمتلك صلاحية إسكات الأعضاء.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ content: '❌ العضو مش موجود في السيرفر.', ephemeral: true });
    }

    try {
      await member.timeout(null);
      
      const embed = new EmbedBuilder()
        .setColor(0x9b59b6)
        .setTitle('🔈 تم إلغاء الإسكات')
        .setDescription(`> المستخدم: ${member}`)
        .setFooter({ text: 'All in One • إدارة', iconURL: interaction.client.user.displayAvatarURL() });
      
      await interaction.reply({ embeds: [embed] });
    } catch {
      await interaction.reply({ content: '❌ فشل في إلغاء الإسكات.', ephemeral: true });
    }
  },
};
