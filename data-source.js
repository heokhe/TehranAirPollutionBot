import { EventEmitter } from 'events';
import { fetchData } from './scraper';

export class DataSource extends EventEmitter {
  constructor() {
    super();
    this.TARGET_URL = process.env.TARGET_URL;
    this.now = 0;
    this.last24hours = 0;
    this.isReady = false;
    setInterval(this.update.bind(this), 1000 * 60 * 10);
  }

  async getData() {
    if (!this.isReady) await this.update(true);
    return {
      now: this.now,
      last24hours: this.last24hours
    };
  }

  async update(throwErrors = false) {
    try {
      const { now, last24hours } = await fetchData(this.TARGET_URL);
      if (!this.isReady) this.isReady = true;
      this.now = now;
      this.last24hours = last24hours;
    } catch (e) {
      this.emit('error', e);
      if (throwErrors) throw e;
    }
  }
}
