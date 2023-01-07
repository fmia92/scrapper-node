import { scrapeAndSave, SCRAPPINGS } from './utils.js'

for (const infoToScrape of Object.keys(SCRAPPINGS)) {
  await scrapeAndSave(infoToScrape)
}
