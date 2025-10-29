const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hide')
    .setDescription('لإخفاء الروم الحالي 👻')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels),

  async execute(interaction) {
    await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      ViewChannel: false,
    });

    const embed = new EmbedBuilder()
      .setColor('#800080')
      .setTitle('تم إخفاء الروم 👻')
      .setDescription(`تم إخفاء الروم بواسطة <@${interaction.user.id}>`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
