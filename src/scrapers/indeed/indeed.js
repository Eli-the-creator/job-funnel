import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// ES module fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//helper
import {
  onlyJuniorRemoteJobs,
  openBrowserAndSetCookies,
  sleep,
} from '../../utils/helper.js';

// Plugin
puppeteer.use(StealthPlugin());

const INDEED_JOBTILE = 'junior+react';
const INDEED_URL = `https://pl.indeed.com/jobs?q=${INDEED_JOBTILE}&sc=0kf%3Aattr%28DSQF7%29%3B`;

export const scrapeIndeed = async () => {
  const { browser, page } = await openBrowserAndSetCookies(INDEED_URL);

  await sleep(1000);
  //Start
  await page.goto(INDEED_URL);
  await sleep(1000);
  // find all job links
  const jobData = await page.$$eval(
    'a.jcs-JobTitle.css-jspxzf.eu4oa1w0',
    (links) => {
      return links.map((link, idx) => ({
        id: idx,
        href: link.href,
        title: link.innerText,
      }));
    },
  );
  for (let i = 0; i < jobData.length; i++) {
    await page.goto(jobData[i].href);
    // const companyName = await page.$eval(
    //   'span.css-1saizt3.e1wnkr790',
    //   (span) => {
    //     return span.innerText;
    //   },
    // );
    const button = await page.$eval(
      '#jobsearch-ViewJobButtons-container',
      (button) => button.innerText.replace('\n&nbsp;', '').toLowerCase(),
    );
    if (button === 'aplikuj teraz') {
      await page.click('.css-t8wchy.e8ju0x51');
      const url = await page.evaluate(() => {
        return window.location.href;
      });
      jobData[i].applyUrl = url;
    } else {
      await page.click('.css-1oxck4n.e8ju0x51');
      const url = await page.evaluate(() => {
        return window.location.href;
      });
      jobData[i].applyUrl = url;
    }
    // Description
    const elements = await page.$$('p, li');
    // Initialize an empty array to store the text content
    let descriptionArray = [];
    for (let element of elements) {
      const text = await page.evaluate((el) => el.textContent.trim(), element);
      descriptionArray.push(text); // Push each element's text into the array
    }
    // Join all the text contents into a single string
    jobData[i].description = descriptionArray.join(' ');
    jobData[i].buttontext = button;
    jobData[i].easyApply = button === 'aplikuj teraz' ? true : false;
    // jobData[i].companyName = companyName;
  }
  //filter data by Title and Description
  const juniorOnlyData = onlyJuniorRemoteJobs(jobData);
  console.log('Pure data  : ', jobData);
  console.log('filtered : ', juniorOnlyData);
  //write to file
  appendToJsonFile(juniorOnlyData, 'indeed-apply.json');
  await page.screenshot({ path: 'dupa.png' });
  await browser.close();
};

function appendToJsonFile(newData, fileName) {
  const filePath = path.join(__dirname, fileName);

  // Чтение текущего содержимого файла
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Ошибка чтения файла:', err);
      return;
    }

    // Парсинг текущих данных
    let jsonData = [];
    try {
      jsonData = JSON.parse(data);
    } catch (parseError) {
      console.error('Ошибка парсинга JSON:', parseError);
      return;
    }

    // Добавление нового объекта
    jsonData.push(newData);

    // Запись обратно в файл
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeError) => {
      if (writeError) {
        console.error('Ошибка записи файла:', writeError);
      } else {
        console.log('Новый объект успешно добавлен!');
      }
    });
  });
}

// Query + params
//https://pl.indeed.com/jobs?q=React&sc=0kf%3Aattr%28DSQF7%29%3B&fromage=1

// check Profile
// await page.goto('https://profile.indeed.com/?hl=pl_PL&co=PL&from=gnav-homepage')
