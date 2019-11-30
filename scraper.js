import cheerio from 'cheerio';
import superagent from 'superagent';

/** @param {string} url */
export async function fetchData(url) {
  const { text: html } = await superagent.get(url),
    $ = cheerio.load(html);
  const numbers = $('.aqival'),
    index = parseInt(numbers.eq(1).text()),
    last24hours = parseInt(numbers.eq(0).text());
  return { now: index, last24hours };
}
