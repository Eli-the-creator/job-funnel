import {
  sleep,
  openBrowserAndSetCookies,
  applyToExternal,
  applyOnIndeed,
} from '../../utils/helper.js';
import data from './indeed-apply.json' assert { type: 'json' };

const INDEED_URL = `https://pl.indeed.com`;

export const applyInExternlaWebOnIndeed = async () => {
  const { browser, page } = await openBrowserAndSetCookies(INDEED_URL);
  await sleep(1000);

  //Loop data from json
  for (const job of data) {
    if (job.easyApply) {
      //  apply on indeed
      await applyOnIndeed(job);
    } else {
      // apply external
      await applyToExternal(job);
    }
  }
};
