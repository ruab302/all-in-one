const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('يعرض قائمة الأوامر والفئات المتاحة'),

  async execute(interaction) {
    const mainEmbed = new EmbedBuilder()
      .setColor('#6614B8')
      .setTitle('Help Information about me!')
      .setDescription(`I'm **𝐀𝐈𝐎 𝐁𝐎𝐓.**

I operate under **𝐄𝐋¹ ᴢ ᴇ ᴛ丨ESPORTS**, built to serve your community efficiently.`)
      .addFields(
        { name: 'Command Count', value: '`23` Commands', inline: true },
        { name: 'Sub Command Count', value: '`0` Commands', inline: true },
        { name: 'Events Count', value: '`0` Events', inline: true },
        { name: 'Info about me', value: `I'm a re-make of <@1042648956494155837> — Type \`/help\` for more info..\nThis means slowly all my features and more will come back!\nI'm faster, have a higher quality, and stable.`, inline: false },
        { name: 'Command-Help Information', value: 'Please select one or more categories from the menu below to view their commands.', inline: false },
      )
      .setFooter({ text: 'The Bot works thanks to (160) Files of Code.', iconURL: interaction.client.user.displayAvatarURL() });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('help-category')
      .setPlaceholder('اختر قائمة الأوامر 📂')
      .addOptions([
        { label: '👑 الاونر', description: 'اعرض أوامر الاونر', value: 'owner' },
        { label: '⚙️ إدارة', description: 'اعرض أوامر الإدارة', value: 'admin' },
        { label: '📘 معلومات', description: 'اعرض أوامر المعلومات', value: 'info' },
        { label: '🏆 سكرم', description: 'اعرض أوامر الـ scrim', value: 'scrim' },
        { label: '🎯 تفاعل', description: 'اعرض أوامر الـ XP والتفاعل', value: 'fun' },
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    const sent = await interaction.reply({ embeds: [mainEmbed], components: [row], fetchReply: true });

    const collector = sent.createMessageComponentCollector({
      componentType: 3,
      time: 3600000,
    });

    collector.on('collect', async (i) => {
      if (i.user.id !== interaction.user.id)
        return i.reply({ content: '❌ هذا ليس طلبك.', ephemeral: true });

      let embed;

      if (i.values[0] === 'info') {
        embed = new EmbedBuilder()
          .setColor(0x6614B8)
          .setTitle('📘 أوامر المعلومات')
          .setDescription('كل أوامر المعلومات المتاحة:')
          .addFields(
            { name: '・/avatar', value: 'يعرض صورة المستخدم.' },
            { name: '・/ping', value: 'يعرض سرعة البوت.' },
            { name: '・/profile', value: 'اعرض ملفك الشخصي.' },
            { name: '・/serverinfo', value: 'يعرض معلومات عن السيرفر.' },
            { name: '・/userinfo', value: 'يعرض معلومات عن المستخدم.' },
          );
      } else if (i.values[0] === 'owner') {
        embed = new EmbedBuilder()
          .setColor(0x6614B8)
          .setTitle('👑 اوامر الاونر')
          .addFields(
            { name: '・/joinvc', value: '`دخول البوت للروم الصوتية.`' },
            { name: '・/leavevc', value: '`خروج البوت من الروم الصوتية.`' },
          );

      } else if (i.values[0] === 'admin') {
        embed = new EmbedBuilder()
          .setColor(0x6614B8)
          .setTitle('⚙️ أوامر الإدارة')
          .addFields(
            { name: '・/ban', value: '`لحظر مستخدم.`' },
            { name: '・/kick', value: '`لطرد مستخدم.`' },
            { name: '・/warn', value: '`لتحذير مستخدم.`' },
            { name: '・/lock', value: '`لاخفاء الروم.`' },
            { name: '・/unlock', value: '`لاظهار الروم.`' },
            { name: '・/addrole', value: '`لاعطاء رول لمستخدم.`' },
            { name: '・/removerole', value: '`لازاله رول من مستخدم.`' },
            { name: '・/mute', value: '`لكتم مستخدم.`' },
            { name: '・/unmute', value: '`لالغاء كتم مستخدم.`' },
            { name: '・/clear', value: '`لمسح الرسائل.`' },
          );
      } else if (i.values[0] === 'fun') {
        embed = new EmbedBuilder()
          .setColor(0x6614B8)
          .setTitle('🎯 أوامر التفاعل')
          .addFields(
            { name: '・/rank', value: '`اعرض مستوى المستخدم.`' },
            { name: '・/daily', value: '`خذ مكافأة يومية.`' },
            
          );
      } else if (i.values[0] === 'scrim') {
        embed = new EmbedBuilder()
          .setColor(0x6614B8)
          .setTitle('🏆 أوامر السكرم')
          .addFields(
            { name: '・/scrim create', value: '`انشاء سكرم جديد.`' },
            { name: '・/scrim start', value: '`بدء سكرم.`' },
            { name: '・/dashboard', value: '`لوحه تحكم السكرمات.`' },
            { name: '・/resultcalculator', value: '`حسب نقاط السكرم.`' },
          );
      }

      await i.update({ embeds: [embed], components: [row] });
    });

    collector.on('end', async () => {
      await sent.edit({ components: [] }).catch(() => {});
    });
  },
};
