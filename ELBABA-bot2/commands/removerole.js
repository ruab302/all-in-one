const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removerole')
    .setDescription('إزالة رول من مستخدم')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('المستخدم اللي عايز تشيل منه الرتبة')
        .setRequired(true)
    )
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('الرتبة اللي عايز تشيلها')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles),
  
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return interaction.reply({ content: '❌ لا تمتلك صلاحية إدارة الرتب.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const member = interaction.guild.members.cache.get(user.id);
    const role = interaction.options.getRole('role');

    if (!member) {
      return interaction.reply({ content: '❌ العضو مش موجود في السيرفر.', ephemeral: true });
    }

    try {
      await member.roles.remove(role);
      
      const embed = new EmbedBuilder()
        .setColor(0x9b59b6)
        .setTitle('🗑️ تم إزالة الرتبة')
        .setDescription(`> المستخدم: ${member}\n> الرتبة: ${role}`)
        .setFooter({ text: 'All in One • إدارة', iconURL: interaction.client.user.displayAvatarURL() });
      
      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      await interaction.reply({ content: '❌ حدث خطأ أثناء إزالة الرتبة.', ephemeral: true });
    }
  },
};
