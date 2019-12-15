/**
 * @param {import('telegraf').Telegraf} bot
 * @param {string} [logChannelId]
 */
export function loggerFactory(bot, logChannelId) {
  return err => {
    if (logChannelId) {
      const stackTrace = err.stack
        ? err.stack
          .split('\n')
          .slice(1)
          .map(line => line.trim())
          .join('\n')
        : '';
      bot.telegram.sendMessage(logChannelId, `
⛔️ *Error: ${err.message}*

\`${stackTrace}\`
`, {
        parse_mode: 'Markdown'
      });
    } else {
      console.log(err);
    }
  };
}
