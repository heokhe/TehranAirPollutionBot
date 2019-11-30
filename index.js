import dotenv from 'dotenv';
import Telegraf from 'telegraf';
import { DataSource } from './data-source';
import { writeMessage } from './message';
import { loggerFactory } from './log';

dotenv.config();

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

bot.context.log = loggerFactory(bot, LOG_ID);
bot.catch(err => bot.context.log(err));

bot.start(ctx => ctx.reply(`
سلام! برای مطلع شدن از وضعیت آلودگی هوای تهران از فرمان /now استفاده کنید.
`));

const dataSource = new DataSource();
dataSource.on('error', err => bot.context.log(err));

bot.command('/now', async ctx => {
  try {
    const data = await dataSource.getData();
    ctx.reply(writeMessage(data), {
      parse_mode: 'Markdown'
    });
  } catch (_) {
    ctx.reply('خطایی رخ داد. لطفا دوباره امتحان کنید.');
  }
});

bot.on('inline_query', async ctx => {
  try {
    const data = await dataSource.getData();
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
  } catch (_) {
    return ctx.answerInlineQuery([]);
  }
});

bot.startPolling();
console.log(`@${BOT_USERNAME} is online...!`);
