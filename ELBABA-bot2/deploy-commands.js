const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];

function loadCommandsRecursive(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      loadCommandsRecursive(filePath);
    } else if (file.endsWith('.js')) {
      const command = require(`./${filePath}`);
      if (command.data) {
        commands.push(command.data.toJSON());
        console.log(`✅ Loaded: ${command.data.name}`);
      }
    }
  }
}

loadCommandsRecursive('commands');

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

const clientId = '1433052586524676107';

(async () => {
  try {
    console.log(`⏳ جاري تسجيل ${commands.length} أوامر Slash Commands...`);
    
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );
    
    console.log('✅ تم تسجيل جميع أوامر Slash Commands بنجاح!');
  } catch (error) {
    console.error('❌ خطأ في تسجيل الأوامر:', error);
  }
})();
