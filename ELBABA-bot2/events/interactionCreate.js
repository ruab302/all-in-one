// events/interactionCreate.js
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, InteractionType } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = async (interaction, client, scrims, config, saveData) => {
  try {
    // ---------- Setup Menu ----------
    if (interaction.isStringSelectMenu() && interaction.customId === 'setup_menu') {
      if (interaction.values[0] === 'channels') {
        return interaction.reply({ content: 'اكتب: !setchannel <نوع> <#روم>', ephemeral: true });
      }
      if (interaction.values[0] === 'messages') {
        return interaction.reply({ content: 'اكتب: !setmessage <نوع> <النص>', ephemeral: true });
      }
    }

    // ---------- Modal Submit (Team Registration) ----------
    if (interaction.type === InteractionType.ModalSubmit && interaction.customId.startsWith('modal_register_')) {
      const scrimId = interaction.customId.replace('modal_register_', '');
      const teamName = interaction.fields.getTextInputValue('teamNameInput').trim();
      if (!teamName) return interaction.reply({ content: '❌ لازم تكتب اسم الفريق.', ephemeral: true });
      if (!scrims[scrimId]) return interaction.reply({ content: '❌ السكرم مش موجود.', ephemeral: true });

      const pending = {
        id: `team_${Date.now()}`,
        name: teamName,
        ownerId: interaction.user.id,
        ownerTag: interaction.user.tag,
        createdAt: new Date().toISOString()
      };

      if (!scrims[scrimId].pending) scrims[scrimId].pending = [];
      scrims[scrimId].pending.push(pending);
      saveData();

      const teamRequestId = config.channels.teamRequest;
      const teamRequestChannel = await client.channels.fetch(teamRequestId).catch(() => null);

      if (scrims[scrimId].mode === 'on' && teamRequestChannel) {
        const embed = new EmbedBuilder()
          .setTitle('📩 Team Request')
          .setColor('#5B2C82')
          .addFields(
            { name: 'Team Name', value: teamName, inline: true },
            { name: 'Owner', value: `<@${interaction.user.id}>`, inline: true },
            { name: 'Scrim Time', value: scrims[scrimId].scrimTime, inline: false }
          )
          .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId(`accept_${scrimId}_${pending.id}`).setLabel('✅ Accept').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId(`reject_${scrimId}_${pending.id}`).setLabel('❌ Reject').setStyle(ButtonStyle.Danger)
        );

        await teamRequestChannel.send({ embeds: [embed], components: [row] });
        return interaction.reply({ content: '✅ تم إرسال طلب التسجيل.', ephemeral: true });
      } else {
        // auto-accept
        if (!scrims[scrimId].members) scrims[scrimId].members = [];
        scrims[scrimId].members.push(pending);
        scrims[scrimId].pending = scrims[scrimId].pending.filter(p => p.id !== pending.id);
        saveData();
        await updateListMessage(scrimId, client, scrims);
        return interaction.reply({ content: '✅ تم التسجيل بنجاح.', ephemeral: true });
      }
    }

    // ---------- Buttons ----------
    if (interaction.isButton()) {
      const id = interaction.customId;

      // فتح مودال التسجيل
      if (id.startsWith('register_')) {
        const scrimId = id.replace('register_', '');
        if (!scrims[scrimId]) return interaction.reply({ content: '❌ السكرم مش موجود.', ephemeral: true });

        const modal = new ModalBuilder()
          .setCustomId(`modal_register_${scrimId}`)
          .setTitle('Register Team');

        const input = new TextInputBuilder()
          .setCustomId('teamNameInput')
          .setLabel('Team Name')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(100)
          .setPlaceholder('اكتب اسم فريقك هنا')
          .setRequired(true);

        modal.addComponents(new ActionRowBuilder().addComponents(input));
        return interaction.showModal(modal);
      }

      // قبول أو رفض الفريق
      if (id.startsWith('accept_') || id.startsWith('reject_')) {
        const parts = id.split('_');
        const scrimId = parts[1];
        const teamId = parts.slice(2).join('_');

        if (!scrims[scrimId]) return interaction.reply({ content: '❌ السكرم مش موجود.', ephemeral: true });

        const pending = (scrims[scrimId].pending || []).find(p => p.id === teamId);
        if (!pending) return interaction.reply({ content: '❌ الطلب غير موجود.', ephemeral: true });

        if (id.startsWith('accept_')) {
          if (!scrims[scrimId].members) scrims[scrimId].members = [];
          scrims[scrimId].members.push(pending);
          scrims[scrimId].pending = scrims[scrimId].pending.filter(p => p.id !== teamId);
          saveData();
          await updateListMessage(scrimId, client, scrims);
          await interaction.update({ content: `✅ Accepted by <@${interaction.user.id}>`, components: [] });
        } else {
          scrims[scrimId].pending = scrims[scrimId].pending.filter(p => p.id !== teamId);
          saveData();
          await interaction.update({ content: `❌ Rejected by <@${interaction.user.id}>`, components: [] });
        }
      }
    }

  } catch (err) {
    console.error('⚠️ Interaction error:', err);
  }
};

// ---------- تحديث قائمة الفرق ----------
async function updateListMessage(scrimId, client, scrims) {
  const scrim = scrims[scrimId];
  if (!scrim || !scrim.listMessageId || !scrim.listMessageChannelId) return;

  const listChannel = await client.channels.fetch(scrim.listMessageChannelId).catch(() => null);
  if (!listChannel) return;

  const msg = await listChannel.messages.fetch(scrim.listMessageId).catch(() => null);
  if (!msg) return;

  const members = scrim.members || [];
  const embed = new EmbedBuilder()
    .setTitle(`📋 Registered Teams (${members.length})`)
    .setDescription(members.length
      ? members.map(t => `• ${t.name} — <@${t.ownerId}>`).join('\n')
      : 'لا يوجد فرق بعد.')
    .setColor('#5B2C82')
    .setTimestamp();

  await msg.edit({ embeds: [embed] });
}
