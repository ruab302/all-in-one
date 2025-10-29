const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('إسكات مستخدم')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('المستخدم اللي عايز تسكته')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('المدة بالدقائق')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('سبب الإسكات')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers),
  
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return interaction.reply({ content: '❌ لا تمتلك صلاحية إسكات الأعضاء.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);
    const duration = interaction.options.getInteger('duration') || 10;
    const reason = interaction.options.getString('reason') || 'بدون سبب';

    if (!member) {
      return interaction.reply({ content: '❌ العضو مش موجود في السيرفر.', ephemeral: true });
    }

    try {
      await member.timeout(duration * 60 * 1000, reason);
      
      const embed = new EmbedBuilder()
        .setColor(0x9b59b6)
        .setTitle('🔇 تم إسكات المستخدم')
        .setDescription(`> المستخدم: ${member}\n> المدة: ${duration} دقيقة\n> السبب: ${reason}`)
        .setFooter({ text: 'All in One • إدارة', iconURL: interaction.client.user.displayAvatarURL() });
      
      await interaction.reply({ embeds: [embed] });
    } catch {
      await interaction.reply({ content: '❌ فشل في إسكات العضو.', ephemeral: true });
    }
  },
};
