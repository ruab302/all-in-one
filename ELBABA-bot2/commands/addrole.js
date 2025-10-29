const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('إعطاء رول لمستخدم معين')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('المستخدم اللي عايز تديله الرتبة')
        .setRequired(true)
    )
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('الرتبة اللي عايز تديهاله')
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
      await member.roles.add(role);
      
      const embed = new EmbedBuilder()
        .setColor(0x9b59b6)
        .setTitle('✅ تم إعطاء الرتبة بنجاح')
        .setDescription(`> المستخدم: ${member}\n> الرتبة: ${role}`)
        .setFooter({ text: 'All in One • إدارة', iconURL: interaction.client.user.displayAvatarURL() });
      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ حدث خطأ أثناء محاولة إعطاء الرتبة.', ephemeral: true });
    }
  },
};
