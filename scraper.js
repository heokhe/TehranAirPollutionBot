import cheerio from 'cheerio';
import superagent from 'superagent';

const TARGET_URL = 'http://airnow.tehran.ir/';

export async function scrape() {
  const { text: html } = await superagent.get(TARGET_URL);
  const $ = cheerio.load(html);
  const now = parseInt($('.aqival').eq(1).text());
  return { now };
}
