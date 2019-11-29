import dotenv from 'dotenv';
import Telegraf from 'telegraf';
import { scrape } from './scraper';

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

bot.start(ctx => ctx.reply('hi'));
bot.command('/now', async ctx => {
  const { now } = await scrape();
  ctx.replyWithHTML(`Now: <b>${now}</b>`);
});
