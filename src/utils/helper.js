//helper callback open browser and set cookies

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import chrome from 'chrome-cookies-secure';

puppeteer.use(StealthPlugin());

export const openBrowserAndSetCookies = async (URL) => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  //set cookies
  //
  const cookies = await chrome.getCookiesPromised(
    URL,
    'puppeteer',
    'Profile 4',
  );
  await page.setCookie(...cookies);

  return { browser, page };
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const onlyJuniorRemoteJobs = (jobsData) => {
  // delete all jobs with senior, middle, mid, lead words in title and description
  const filteredData = jobsData.map((job) => {
    if (
      job.title.toLowerCase().includes('senior') ||
      job.title.toLowerCase().includes('lead')
    ) {
      return null;
    }
    if (
      job.description.toLowerCase().includes('senior') ||
      job.description.toLowerCase().includes('lead')
    ) {
      return null;
    }
    return job;
  });

  return filteredData.filter((el) => el !== null);
};

export const applyToExternal = async () => {};

export const applyOnIndeed = async () => {};
