const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('لفتح الشات الحالي 🔓')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({ content: '❌ معندكش صلاحية لفتح الشات.', ephemeral: true });
    }

    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: true,
    });

    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setTitle('🔓 تم فتح الشات')
      .setDescription(`تم فتح الروم بواسطة <@${interaction.user.id}>`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
