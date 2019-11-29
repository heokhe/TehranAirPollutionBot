import cheerio from 'cheerio';
import superagent from 'superagent';

const TARGET_URL = 'http://airnow.tehran.ir/';

export async function scrape() {
  const { text: html } = await superagent.get(TARGET_URL),
    $ = cheerio.load(html);
  const numbers = $('.aqival'),
    index = parseInt(numbers.eq(1).text()),
    last24hours = parseInt(numbers.eq(0).text());
  return { now: index, last24hours };
}
