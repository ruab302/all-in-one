const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('يعرض صورة المستخدم')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('المستخدم اللي عايز تشوف صورته')
        .setRequired(false)
    ),
  
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    
    const embed = new EmbedBuilder()
      .setTitle(`🖼️ Avatar لـ ${user.username}`)
      .setImage(user.displayAvatarURL({ size: 1024, dynamic: true }))
      .setColor('#9b59b6');
    
    await interaction.reply({ embeds: [embed] });
  }
};
