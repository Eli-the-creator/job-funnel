import { scrapeIndeed } from './src/scrapers/indeed/indeed.js';
import { applyInExternlaWebOnIndeed } from './src/scrapers/indeed/send-resume-indeed.js';

const main = async () => {
  //   await scrapeIndeed();
  await applyInExternlaWebOnIndeed();
};

main();
