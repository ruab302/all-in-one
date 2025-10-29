const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('ffmpeg-static');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joinvc')
    .setDescription('دخول قناة صوتية وتشغيل صمت مستمر')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('القناة الصوتية المراد الدخول إليها (اختياري)')
        .addChannelTypes(2)
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      if (!interaction.guild.members.me.permissions.has('Connect') || !interaction.guild.members.me.permissions.has('Speak')) {
        return interaction.reply({ content: '❌ البوت محتاج صلاحيات Connect و Speak في السيرفر عشان يدخل الصوت.', ephemeral: true });
      }

      let channel = interaction.options.getChannel('channel');
      if (!channel) {
        channel = interaction.member?.voice?.channel;
      }

      if (!channel) {
        return interaction.reply({ content: '❌ رجاءً حدد روم صوتي أو كون داخل روم صوتي وأعد المحاولة.', ephemeral: true });
      }

      if (!interaction.client._vcConnections) interaction.client._vcConnections = new Map();

      const guildKey = `${interaction.guild.id}`;
      if (interaction.client._vcConnections.get(guildKey)) {
        return interaction.reply({ content: '✅ البوت بالفعل متصل في قناة صوتية في هذا السيرفر.', ephemeral: true });
      }

      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: true
      });

      const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });

      const silentPath = path.join(__dirname, '..', 'silent.wav');
      if (!fs.existsSync(silentPath)) {
        return interaction.reply({ content: '❌ ملف silent.wav مش موجود في فولدر المشروع.', ephemeral: true });
      }

      let resource = createAudioResource(silentPath, {
        inputType: null,
        inlineVolume: false,
        ffmpegExecutable: ffmpeg
      });

      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Idle, () => {
        try {
          const r = createAudioResource(silentPath, { ffmpegExecutable: ffmpeg });
          player.play(r);
        } catch (e) { console.error('loop play error', e); }
      });

      interaction.client._vcConnections.set(guildKey, { connection, player, channelId: channel.id, startedAt: Date.now() });

      await interaction.reply({ content: `✅ دخلت الروم الصوتي وبدأت تشغيل صامت (silent loop) في <#${channel.id}>. هيفضل موجود طالما السيرفر شغال.` });

    } catch (err) {
      console.error('joinvc error', err);
      return interaction.reply({ content: '❌ حصل خطأ أثناء محاولة الدخول للكول. شوف الكونسول.', ephemeral: true });
    }
  }
};
