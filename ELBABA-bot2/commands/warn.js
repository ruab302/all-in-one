const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('تحذير عضو معين')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('المستخدم اللي عايز تحذره')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('سبب التحذير')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),
  
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({ content: '❌ ماعندكش صلاحية التحذير.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'بدون سبب';

    const embed = new EmbedBuilder()
      .setTitle('⚠️ تم تحذير عضو')
      .addFields(
        { name: '👤 العضو', value: `${user.tag}`, inline: true },
        { name: '🧑‍⚖️ بواسطة', value: `${interaction.user.tag}`, inline: true },
        { name: '📄 السبب', value: reason }
      )
      .setColor('#9b59b6');

    await interaction.reply({ embeds: [embed] });
  }
};
