const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('scrim-create')
    .setDescription('إنشاء سكرم جديد')
    .addStringOption(option =>
      option.setName('scrim_time')
        .setDescription('وقت السكرم (مثال: 19:00)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('spare_time')
        .setDescription('وقت الاحتياط (مثال: 18:30)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('start_time')
        .setDescription('وقت البدء (مثال: 19:15)')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('map_type')
        .setDescription('نوع دوران الخرائط')
        .setRequired(true)
        .addChoices(
          { name: 'Type 1: Erangel, Miramar, Sanhok', value: 1 },
          { name: 'Type 2: Erangel, Miramar, Erangel', value: 2 },
          { name: 'Type 3: Erangel, Miramar, Vikendi', value: 3 }
        )
    )
    .addStringOption(option =>
      option.setName('mode')
        .setDescription('وضع التسجيل')
        .addChoices(
          { name: 'Auto', value: 'auto' },
          { name: 'Manual (On)', value: 'on' }
        )
    ),

  async execute(interaction, args, client, scrims = {}, config = {}, saveData) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const scrimTime = interaction.options.getString('scrim_time');
      const spareTime = interaction.options.getString('spare_time');
      const startTime = interaction.options.getString('start_time');
      const mapType = interaction.options.getInteger('map_type');
      const mode = interaction.options.getString('mode') || 'auto';

      const mapRotationOptions = {
        1: ['Room [1]: Erangel', 'Room [2]: Miramar', 'Room [3]: Sanhok'],
        2: ['Room [1]: Erangel', 'Room [2]: Miramar', 'Room [3]: Erangel'],
        3: ['Room [1]: Erangel', 'Room [2]: Miramar', 'Room [3]: Vikendi']
      };

      const mapRotation = mapRotationOptions[mapType];
      const scrimId = scrimTime.replace(/:/g, '-');

      const scrimsPath = path.join(__dirname, '..', 'scrims.json');
      const diskScrims = fs.existsSync(scrimsPath)
        ? JSON.parse(fs.readFileSync(scrimsPath, 'utf8'))
        : {};

      if (diskScrims[scrimId]) {
        return interaction.editReply({ content: '❌ فيه سكريم بالفعل بنفس الوقت!' });
      }

      const scrimEntry = {
        id: scrimId,
        scrimTime,
        spareTime,
        startTime,
        mapType,
        mapRotation,
        mode,
        members: [],
        pending: [],
        createdBy: {
          id: interaction.user.id,
          tag: interaction.user.tag,
          username: interaction.member?.displayName || interaction.user.username
        },
        createdAt: new Date().toISOString(),
        regMessageId: null,
        regMessageChannelId: null,
        listMessageId: null,
        listMessageChannelId: null
      };

      diskScrims[scrimId] = scrimEntry;
      scrims[scrimId] = scrimEntry;
      fs.writeFileSync(scrimsPath, JSON.stringify(diskScrims, null, 2));
      if (typeof saveData === 'function') saveData();

      const serverName = "𝐄𝐋¹ ᴢ ᴇ ᴛ丨𝐄𝗦𝗣𝗢𝗥𝗧𝗦";
      const serverIcon = interaction.guild?.iconURL({ dynamic: true, size: 64 }) || null;

      const logsEmbed = new EmbedBuilder()
        .setAuthor({ name: serverName, iconURL: serverIcon })
        .setTitle('Scrim created')
        .addFields(
          { name: 'Scrim Details', value: `**Scrim Time:** ${scrimTime}\n**Spare Time:** ${spareTime}\n**Start Time:** ${startTime}` },
          { name: 'Map Rotation', value: mapRotation.join('\n') },
          { name: 'Created By', value: `User: <@${interaction.user.id}>\nUser ID: ${interaction.user.id}\nUsername: ${scrimEntry.createdBy.username}` },
          { name: 'Creation Time', value: `<t:${Math.floor(Date.now() / 1000)}:R>` }
        )
        .setColor('#6f00ff')
        .setThumbnail(interaction.user.displayAvatarURL({ extension: 'png', size: 256 }))
        .setTimestamp();

      const logsChannelId = config?.channels?.logs || null;
      let logsChannel = null;
      if (logsChannelId) {
        try { logsChannel = await client.channels.fetch(logsChannelId); } catch {}
      }
      if (!logsChannel) logsChannel = interaction.channel;
      await logsChannel.send({ embeds: [logsEmbed] });

      const bigDescription = [
        `- تم فتح باب التسجيل لـ سكرم الساعة ${scrimTime} بتوقيت مصر و السعوديه`,
        ``,
        `-  التوحيد 2`,
        ``,
        `-  غرف متقدمة`,
        ``,
        `-  استمتع مع   𝐄𝐋¹ ᴢ ᴇ ᴛ丨𝐄𝗦𝗣𝗢𝗥𝗧𝐒`,
        ``,
        `--------------------------------------`,
        ``,
        `・𝗦𝗰𝗿𝗶𝗺 𝗥𝗲𝗴𝗶𝘀𝘁𝗿𝗮𝘁𝗶𝗼𝗻 𝗛𝗮𝘀 𝗢𝗽𝗲𝗻𝗲𝗱 𝗙𝗼𝗿 𝗦𝗰𝗿𝗶𝗺 𝗔𝘁 ${scrimTime}`,
        ``,
        `・𝗨𝗻𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻: 𝟮`,
        ``,
        `・𝗔𝗱𝘃𝗮𝗻𝗰𝗲𝗱 𝗥𝗼𝗼𝗺s`,
        ``,
        `・𝗘𝗻𝗷𝗼𝘆   𝐄𝐋¹ ᴢ ᴇ ᴛ丨𝐄𝗦𝗣𝗢𝗥𝗧𝐒`,
        ``,
        `𝗠𝗲𝗻𝘁𝗶𝗼𝗻: ||**@everyone**||`
      ].join('\n');

      const regEmbed = new EmbedBuilder()
        .setDescription(bigDescription)
        .setColor('#6f00ff')
        .setTimestamp();

      const registerBtn = new ButtonBuilder()
        .setCustomId(`register_${scrimId}`)
        .setLabel('Register')
        .setStyle(ButtonStyle.Success);

      const cancelBtn = new ButtonBuilder()
        .setCustomId(`cancelreg_${scrimId}`)
        .setLabel('Cancel Registration')
        .setStyle(ButtonStyle.Secondary);

      const rowReg = new ActionRowBuilder().addComponents(registerBtn, cancelBtn);

      const regChannelId = config?.channels?.registration || null;
      let regChannel = null;
      if (regChannelId) {
        try { regChannel = await client.channels.fetch(regChannelId); } catch {}
      }
      if (!regChannel) regChannel = interaction.channel;

      const regMessage = await regChannel.send({ content: '@everyone', embeds: [regEmbed], components: [rowReg] });

      const smallEmbed = new EmbedBuilder()
        .setTitle('Total Registered 0')
        .setDescription('Registered Teams:\n*No teams yet*')
        .setColor('#6f00ff')
        .setTimestamp();

      const listMessage = await regChannel.send({ embeds: [smallEmbed] });

      diskScrims[scrimId].regMessageId = regMessage.id;
      diskScrims[scrimId].regMessageChannelId = regChannel.id;
      diskScrims[scrimId].listMessageId = listMessage.id;
      diskScrims[scrimId].listMessageChannelId = regChannel.id;

      fs.writeFileSync(scrimsPath, JSON.stringify(diskScrims, null, 2));
      if (typeof saveData === 'function') saveData();

      await interaction.editReply({ content: `🟢 تم إنشاء السكرم بنجاح!\n📅 Time: **${scrimTime}**\n📍 Channel: <#${regChannel.id}>` });

    } catch (err) {
      console.error(err);
      if (interaction.deferred) {
        await interaction.editReply({ content: '❌ حصل خطأ أثناء إنشاء السكرم.' });
      } else {
        await interaction.reply({ content: '❌ حصل خطأ أثناء إنشاء السكرم.', ephemeral: true });
      }
    }
  }
};
