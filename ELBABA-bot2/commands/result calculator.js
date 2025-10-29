const { 
  SlashCommandBuilder,
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  StringSelectMenuBuilder
} = require('discord.js');

function ensureResultsStructure(scrims, scrimId) {
  if (!scrims[scrimId]) return false;
  if (!scrims[scrimId].results) scrims[scrimId].results = {};
  const members = scrims[scrimId].members || [];
  for (const m of members) {
    if (!scrims[scrimId].results[m.id]) {
      scrims[scrimId].results[m.id] = {
        teamName: m.name,
        rounds: { round1: null, round2: null, round3: null }
      };
    } else {
      scrims[scrimId].results[m.id].teamName = m.name;
      if (!scrims[scrimId].results[m.id].rounds) 
        scrims[scrimId].results[m.id].rounds = { round1: null, round2: null, round3: null };
    }
  }
  return true;
}

console.log('✅ result calculator file is running!');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resultcalculator')
    .setDescription('Show scrim result calculator')
    .addStringOption(option =>
      option.setName('scrim_id')
        .setDescription('معرف السكرم')
        .setRequired(true)
    ),
  
  async execute(interaction, args, client, scrims) {
    try {
      const scrimId = interaction.options?.getString('scrim_id') || args?.[0];
      
      if (!scrimId || !scrims[scrimId]) 
        return interaction.reply({ content: '❌ السكرم مش موجود أو انتهى.', ephemeral: true });

      ensureResultsStructure(scrims, scrimId);

      const members = scrims[scrimId].members || [];
      if (!members.length) 
        return interaction.reply({ content: '❌ مفيش فرق مسجّلة في السكرم ده.', ephemeral: true });

      const select = new StringSelectMenuBuilder()
        .setCustomId(`rc_team_select|${scrimId}|round1`)
        .setPlaceholder('اختر الفريق اللي هتسجل له النتيجة')
        .addOptions(
          members.map(m => ({
            label: m.name.length > 100 ? m.name.slice(0, 100) : m.name,
            value: m.id,
            description: `Team ID: ${m.id}`
          }))
        );

      const row = new ActionRowBuilder().addComponents(select);

      const roundButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
           .setCustomId(`rc_round|round1|${scrimId}`)
           .setLabel('🟢 Round 1')
           .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
           .setCustomId(`rc_round|round2|${scrimId}`)
           .setLabel('🟡 Round 2')
           .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
           .setCustomId(`rc_round|round3|${scrimId}`)
           .setLabel('🔴 Round 3')
           .setStyle(ButtonStyle.Primary)
      );

      const controlButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`rc_double|${scrimId}`).setLabel('Double Points').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`rc_total|${scrimId}`).setLabel('Total').setStyle(ButtonStyle.Success)
      );

      await interaction.reply({ 
        content: '📊 اختر الجولة أو الفريق من القوائم بالأسفل:', 
        components: [roundButtons, row, controlButtons] 
      });
    } catch (err) {
      console.error('Result calculator error:', err);
      const replyMethod = interaction.replied || interaction.deferred ? 'editReply' : 'reply';
      return interaction[replyMethod]({ content: '⚠️ حصل خطأ أثناء تشغيل Result Calculator.', ephemeral: true });
    }
  }
};
