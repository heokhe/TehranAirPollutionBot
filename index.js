import dotenv from 'dotenv';
import Telegraf from 'telegraf';
import { scrape } from './scraper';
import { writeMessage } from './message';

if (!process.env.TOKEN) {
  dotenv.config();
}

const { TOKEN, API_ROOT, BOT_USERNAME } = process.env;

const bot = new Telegraf(TOKEN, {
  username: BOT_USERNAME,
  telegram: {
    ...(API_ROOT && {
      apiRoot: API_ROOT
    })
  }
});

bot.startPolling();

bot.start(ctx => ctx.reply(`
سلام! برای مطلع شدن از وضعیت آلودگی هوای تهران از فرمان /now استفاده کنید.
`));

bot.command('/now', async ctx => {
  const { now, last24hours } = await scrape();
  ctx.reply(writeMessage({ now, last24hours }), {
    parse_mode: 'Markdown'
  });
});

bot.on('inline_query', async ctx => {
  const { now, last24hours } = await scrape();
  const message = writeMessage({ now, last24hours });
  return ctx.answerInlineQuery([{
    type: 'article',
    id: ctx.inlineQuery.id,
    title: 'شاخص آلودگی تهران',
    description: 'هم‌اکنون',
    input_message_content: {
      message_text: message,
      parse_mode: 'Markdown'
    }
  }]);
});
