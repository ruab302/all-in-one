const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('مسح عدد معين من الرسائل')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('عدد الرسائل اللي عايز تمسحها (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),
  
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({ content: '❌ لا تمتلك صلاحية مسح الرسائل.', ephemeral: true });
    }

    const amount = interaction.options.getInteger('amount');

    await interaction.deferReply({ ephemeral: true });
    await interaction.channel.bulkDelete(amount, true);
    
    const embed = new EmbedBuilder()
      .setColor(0x9b59b6)
      .setTitle('🧹 تم مسح الرسائل')
      .setDescription(`> تم مسح **${amount}** رسالة.`)
      .setFooter({ text: 'All in One • إدارة', iconURL: interaction.client.user.displayAvatarURL() });

    const msg = await interaction.channel.send({ embeds: [embed] });
    await interaction.editReply({ content: '✅ تم مسح الرسائل بنجاح' });
    
    setTimeout(() => msg.delete().catch(() => {}), 5000);
  },
};
