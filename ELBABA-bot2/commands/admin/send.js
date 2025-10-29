const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('send')
    .setDescription('يبعت رسالة خاصة لشخص محدد')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .addUserOption(option =>
      option.setName('user')
        .setDescription('الشخص المراد إرسال الرسالة له')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('message')
        .setDescription('الرسالة المراد إرسالها')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const msg = interaction.options.getString('message');

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `Message from ${interaction.guild.name}`,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .setDescription(msg)
      .setColor(0x2f3136)
      .setFooter({
        text: `Sent by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    try {
      await user.send({ embeds: [embed] });
      await interaction.reply({ content: `✅ تم إرسال الرسالة إلى ${user.tag} بنجاح.`, ephemeral: true });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '⚠️ ما قدرتش أبعت له، يمكن قافل الخاص.', ephemeral: true });
    }
  },
};
