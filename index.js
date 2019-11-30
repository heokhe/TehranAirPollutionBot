import dotenv from 'dotenv';
import Telegraf from 'telegraf';
import { scrape } from './scraper';
import { writeMessage } from './message';

if (!process.env.TOKEN) {
  dotenv.config();
}

const {
  TOKEN, API_ROOT, BOT_USERNAME, LOG_ID
} = process.env;

const bot = new Telegraf(TOKEN, {
  username: BOT_USERNAME,
  telegram: {
    ...(API_ROOT && {
      apiRoot: API_ROOT
    })
  }
});

bot.context.log = err => {
  if (LOG_ID) {
    bot.telegram.sendMessage(LOG_ID, `⛔️ *Error: ${err.message}*

${err}`, {
      parse_mode: 'Markdown'
    });
  } else {
    console.log(err);
  }
};
bot.catch(err => bot.context.log(err));

bot.start(ctx => ctx.reply(`
سلام! برای مطلع شدن از وضعیت آلودگی هوای تهران از فرمان /now استفاده کنید.
`));

bot.command('/now', async ctx => {
  try {
    const data = await scrape();
    ctx.reply(writeMessage(data), {
      parse_mode: 'Markdown'
    });
  } catch (e) {
    ctx.reply('خطایی رخ داد. لطفا بعدا امتحان کنید.');
    ctx.log(e);
  }
});

bot.on('inline_query', async ctx => {
  try {
    const data = await scrape();
    return ctx.answerInlineQuery([{
      type: 'article',
      id: ctx.inlineQuery.id,
      title: 'شاخص آلودگی تهران',
      description: 'هم‌اکنون',
      input_message_content: {
        message_text: writeMessage(data),
        parse_mode: 'Markdown'
      }
    }]);
  } catch (e) {
    bot.log(e);
    return ctx.answerInlineQuery([]);
  }
});

bot.startPolling();
console.log(`@${BOT_USERNAME} is online...!`);
