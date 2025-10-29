const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('show')
    .setDescription('لإظهار الروم الحالي 👀')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels),

  async execute(interaction) {
    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      ViewChannel: true,
    });

    const embed = new EmbedBuilder()
      .setColor('#00ffff')
      .setTitle('تم إظهار الروم 👀')
      .setDescription(`تم إظهار الروم بواسطة <@${interaction.user.id}>`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
