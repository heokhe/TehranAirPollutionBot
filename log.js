/**
 * @param {import('telegraf').Telegraf} bot
 * @param {string} [logChannelId]
 */
export function loggerFactory(bot, logChannelId) {
  return err => {
    if (logChannelId) {
      bot.telegram.sendMessage(logChannelId, `⛔️ *Error: ${err.message}*

${err}`, {
        parse_mode: 'Markdown'
      });
    } else {
      console.log(err);
    }
  };
}
