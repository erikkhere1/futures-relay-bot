# Chika Relay Bot

A Discord bot that monitors a source channel for messages from users with "chika" or "ducci" in their username. When these users send a message ending with "--", the bot relays the message (without the "--") to a target channel with a role mention.

## Features

- Monitors a source channel for specific usernames
- Relays messages ending with "--" to target channels
- Removes the "--" from relayed messages
- Uses webhooks to mimic the original user's appearance
- Adds role mentions to relayed messages
- Supports multiple username patterns and target channels

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create an `env` file with your configuration:
   ```
   DISCORD_TOKEN=your_discord_bot_token
   SOURCE_CHANNEL_ID=your_source_channel_id
   TARGET_CHANNEL_ID=your_target_channel_id
   ```

3. Run the bot:
   ```bash
   npm start
   ```

## Configuration

The bot supports two username patterns:
- **"chika"** → relays to `TARGET_CHANNEL_ID` with role `813620731170652161`
- **"ducci"** → relays to channel `1316182395652669510` with role `929568766386376734`

## Railway Deployment

1. Push your code to GitHub
2. Connect your GitHub repo to Railway
3. Add environment variables in Railway dashboard
4. Deploy!

## Permissions Required

The bot needs these permissions in Discord:
- View Channels
- Send Messages  
- Manage Webhooks
- Read Message History 