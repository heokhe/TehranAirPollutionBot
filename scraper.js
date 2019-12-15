import cheerio from 'cheerio';
import superagent from 'superagent';

export async function fetchData() {
  // extracted from .env before bot.startPolling() gets called:
  const url = process.env.TARGET_URL,
    { text: html } = await superagent.get(url).timeout(30000),
    $ = cheerio.load(html),
    numbers = $('.aqival');

  if (!numbers.length) throw new Error('Malformed HTML received');

  const index = parseInt(numbers.eq(1).text()),
    last24hours = parseInt(numbers.eq(0).text());
  return { now: index, last24hours };
}
