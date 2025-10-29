const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('come')
    .setDescription('ينادي على شخص برسالة خاصة 💌')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('الشخص المراد مناداته')
        .setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    
    const embed = new EmbedBuilder()
      .setColor(0x9b59b6)
      .setTitle('📩 عندك رسالة جديدة!')
      .setDescription(`> ${interaction.user} بينادي عليك 😏✨`)
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: 'All in One • تفاعل', iconURL: interaction.client.user.displayAvatarURL() })
      .setTimestamp();

    try {
      await target.send({ embeds: [embed] });
      await interaction.reply({ content: `✅ تم إرسال النداء إلى ${target.tag}`, ephemeral: true });
    } catch (err) {
      await interaction.reply({ content: '❌ مقدرتش أبعتله، يمكن قافل الرسائل الخاصة.', ephemeral: true });
    }
  },
};
