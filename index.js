require('dotenv').config({ path: './env' });
const { Client, GatewayIntentBits, WebhookClient } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const SOURCE_CHANNEL_ID = process.env.SOURCE_CHANNEL_ID;
const TARGET_CHANNEL_ID = process.env.TARGET_CHANNEL_ID;

// ✅ NEW: Allowed user IDs (only these users can trigger the relay)
const ALLOWED_USER_IDS = new Set([
  // existing users can be added here if you want to lock it down fully
  "691850152096563201"
]);

// ✅ NEW: Additional tag to append at the end (role mention format)
const EXTRA_PING_ID = "1478962966807183615"; // will mention as <@&...>

// Helper to get or create a webhook in the target channel
async function getOrCreateWebhook(channel) {
  const webhooks = await channel.fetchWebhooks();
  let webhook = webhooks.find(wh => wh.owner.id === client.user.id);
  if (!webhook) {
    webhook = await channel.createWebhook({
      name: 'Relay Webhook',
      avatar: client.user.displayAvatarURL()
    });
  }
  return webhook;
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Only monitor the source channel
  if (message.channel.id !== SOURCE_CHANNEL_ID) return;

  console.log(`Message received from ${message.author.username}: "${message.content}"`);

  // ✅ NEW: Only allow specified user IDs (comment out if you want anyone to be able to use it)
  if (!ALLOWED_USER_IDS.has(message.author.id)) {
    console.log(`User ${message.author.id} not in allowed list, ignoring`);
    return;
  }

  // Check if message ends with '--'
  if (!message.content.trim().endsWith('--')) {
    console.log(`Message does not end with '--', ignoring`);
    return;
  }

  // Check if username contains 'chika' or 'ducci' (case-insensitive)
  const username = message.author.username.toLowerCase();
  let relayConfig = null;
  if (username.includes('chika')) {
    relayConfig = {
      targetChannelId: TARGET_CHANNEL_ID,
      roleId: '813620731170652161'
    };
    console.log(`Username contains 'chika', will relay to chikaalerts channel`);
  } else if (username.includes('ducci')) {
    relayConfig = {
      targetChannelId: '1316182395652669510',
      roleId: '929568766386376734'
    };
    console.log(`Username contains 'ducci', will relay to ducci channel`);
  }
  if (!relayConfig) {
    console.log(`Username does not contain 'chika' or 'ducci', ignoring`);
    return;
  }

  // Remove the trailing '--' from the message content before relaying
  const relayedContent = message.content.replace(/--\s*$/, '').trim();

  // Append the appropriate role mention to trigger a mention
  // ✅ UPDATED: add the extra ping at the end as well
  const finalContent = `${relayedContent} <@&${relayConfig.roleId}> <@&${EXTRA_PING_ID}>`;

  console.log(`Relaying message: "${finalContent}" to channel ${relayConfig.targetChannelId}`);
  
  // Relay the message to the target channel using a webhook to mimic the user
  const targetChannel = await client.channels.fetch(relayConfig.targetChannelId);
  if (targetChannel && targetChannel.isTextBased()) {
    const webhook = await getOrCreateWebhook(targetChannel);
    webhook.send({
      content: finalContent,
      username: message.author.username,
      avatarURL: message.author.displayAvatarURL()
    });
    console.log(`Message successfully relayed!`);
  } else {
    console.log(`Failed to fetch target channel or channel is not text-based`);
  }
});

client.login(process.env.DISCORD_TOKEN);
