const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('احصل على مكافأتك اليومية'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const now = Date.now();
    const lastClaim = cooldowns.get(userId);

    if (lastClaim && now - lastClaim < 86400000) {
      const remaining = Math.ceil((86400000 - (now - lastClaim)) / (1000 * 60 * 60));
      return interaction.reply({ 
        content: `⏳ استنى ${remaining} ساعة قبل ما تاخد المكافأة اليومية تاني.`, 
        ephemeral: true 
      });
    }

    cooldowns.set(userId, now);
    const amount = Math.floor(Math.random() * 500) + 100;

    const embed = new EmbedBuilder()
      .setTitle('🎁 مكافأة يومية')
      .setDescription(`مبروك يا ${interaction.user}! خدت **${amount}** كوينز 💰`)
      .setColor('#9b59b6');

    await interaction.reply({ embeds: [embed] });
  }
};
