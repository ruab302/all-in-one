# Discord PUBG Mobile Scrim Management Bot

## Overview
This is a Discord bot designed to manage PUBG Mobile scrims (competitive gaming matches). The bot provides comprehensive features for team registration, scrim scheduling, result tracking, and admin controls.

## Current State
**Fully migrated to Slash Commands** on October 29, 2025.
All 32 commands now use modern Discord slash commands (`/command`).
Bot is running successfully with all features operational.

## Features
- **Scrim Management**: Create, start, end, and delete scrims
- **Team Registration**: Teams can register for scrims with approval system
- **Result Calculator**: Track kills, ranks, and WWCD (Winner Winner Chicken Dinner) for each round
- **Admin Dashboard**: Interactive dashboard for managing scrims and settings
- **Voice Channel Integration**: Bot can join and stay in voice channels
- **Slash Commands**: All features use modern Discord slash commands
- **Owner Commands**: Special commands for bot owners with security checks
- **Interactive Components**: Buttons, modals, and select menus for enhanced UX

## Project Architecture

### Main Files
- `index.js`: Main bot entry point, handles slash commands, events and interactions
- `deploy-commands.js`: Registers slash commands with Discord API
- `config.json`: Bot configuration (channels, messages, prefix, owners)
- `scrims.json`: Active scrims data
- `.env`: Environment variables (BOT_TOKEN)

### Directory Structure
- `commands/`: All bot slash commands organized by category
  - `admin/`: Admin-only commands (send)
  - `owner/`: Owner-only commands (setavatar, setname, setprefix, setup)
  - General commands: ping, help, userinfo, serverinfo, avatar, come, daily, profile, rank
  - Moderation: ban, kick, mute, unmute, warn, lock, unlock, clear, addrole, removerole, hide, show
  - Voice: joinvc, leavevc
  - Scrim commands: dashboard, resultcalculator, scrim-create, scrim-start
- `events/`: Discord event handlers
- Audio files: `silent.wav`, `make_silence.js` for voice channel functionality

### Dependencies
- discord.js v14: Discord API library
- @discordjs/voice: Voice channel support
- canvas & @napi-rs/canvas: Image generation for results
- mongoose: MongoDB integration
- sqlite3: Local database support
- dotenv: Environment variable management
- ffmpeg-static: Audio processing

## Slash Commands (32 total)

### 📌 Information Commands
- `/ping` - Shows bot latency
- `/avatar [user]` - Shows user avatar
- `/userinfo [user]` - Shows user information
- `/serverinfo` - Shows server information
- `/help` - Shows all available commands
- `/profile [user]` - Shows user profile
- `/rank` - Shows your level and XP

### 🎮 General Commands
- `/come <user>` - Send someone a DM notification
- `/daily` - Claim your daily reward (24h cooldown)

### 🛡️ Admin/Moderation Commands
- `/ban <user> [reason]` - Bans a user from server
- `/kick <user> [reason]` - Kicks a user from server
- `/mute <user> [duration] [reason]` - Mutes a user
- `/unmute <user>` - Unmutes a user
- `/warn <user> [reason]` - Warns a user
- `/lock` - Locks current channel
- `/unlock` - Unlocks current channel
- `/hide` - Hides current channel
- `/show` - Shows current channel
- `/clear <amount>` - Clears messages
- `/addrole <user> <role>` - Adds role to user
- `/removerole <user> <role>` - Removes role from user
- `/send <user> <message>` - Send DM to user (Admin only)

### 🎤 Voice Commands
- `/joinvc [channel]` - Join a voice channel and stay connected
- `/leavevc` - Leave the voice channel

### 🏆 Scrim Commands
- `/dashboard` - Shows scrim management panel
- `/resultcalculator <scrim_id>` - Shows result calculator for scrim
- `/scrim-create` - Creates a new scrim with all settings
- `/scrim-start` - Starts a scrim and notifies teams

### 👑 Owner Commands (Restricted)
- `/setavatar <url>` - Changes bot's avatar (Owner only)
- `/setname <name>` - Changes bot's nickname in server (Owner only)
- `/setprefix <prefix>` - Changes bot's prefix (Owner only)
- `/setup` - Interactive setup panel for channels and messages (Owner only)

### Legacy Support
- `.scrim create` - Still supported for backward compatibility

## Setup Requirements
1. Discord bot token (stored as BOT_TOKEN secret)
2. Discord server with proper channel IDs configured
3. Node.js runtime
4. Run `node deploy-commands.js` to register slash commands with Discord

## Running the Bot
The bot runs continuously using: `node index.js`
Workflow is configured to auto-start the bot.

## Security
- Owner commands require user ID verification against config.json
- Admin commands use Discord's built-in permission system
- Sensitive operations are ephemeral (only visible to command user)
- Owner IDs: Configurable in config.json

## User Preferences
User prefers Arabic language for bot responses and interface.

## Recent Changes
- **2025-10-29 (Latest)**: 
  - **COMPLETE MIGRATION TO SLASH COMMANDS**
  - Converted all remaining 15 commands to slash commands:
    - General: come, daily, profile, rank
    - Moderation: hide, show
    - Voice: joinvc, leavevc
    - Admin: send
    - Owner: setavatar, setname, setprefix, setup
    - Scrim: scrim-create, scrim-start
  - Total: **32 slash commands** registered and operational
  - Fixed owner authentication in all owner commands
  - Preserved all interactive components (buttons, modals, collectors)
  - Maintained backward compatibility with legacy `.scrim create` command
  - All commands tested and verified working
  - Bot running successfully with no errors

- **2025-10-29 (Earlier)**: 
  - Initial import and Replit environment configuration
  - Converted first 17 commands to Discord Slash Commands
  - Updated index.js to support both slash commands and legacy text commands
  - Registered all slash commands with Discord API
  - Updated bot activity status to display "/help"
  - Implemented command type detection for smooth migration

## Notes
- The bot uses a dual system temporarily: slash commands for all features, with legacy text command support for `.scrim create` for backward compatibility
- All new features should use slash commands only
- Owner IDs are hardcoded as fallback but should be managed via config.json
