const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('لقفل الشات الحالي 🔒')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({ content: '❌ معندكش صلاحية لقفل الشات.', ephemeral: true });
    }

    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: false,
    });

    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setTitle('🔒 تم قفل الشات')
      .setDescription(`تم قفل الروم بواسطة <@${interaction.user.id}>`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
