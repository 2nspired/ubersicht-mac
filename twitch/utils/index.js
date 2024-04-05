import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

// --------------------------------------------
// ADD TWITCH USER NAME TO PULL FROM
// --------------------------------------------

const username = "fr0zair";
const refreshFrequency = 1000 * 60 * 15; // time in ms

// --------------------------------------------
// LOAD PAGE VIA PUPPETEER AND RETREIVE PAGE DATA
// --------------------------------------------

async function getPageData(userName) {
  if (!userName) {
    console.log("Please provide a username.");
    return;
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const response = await page.goto(`https://twitchtracker.com/${userName}`);

  const retries = 5;
  while (retries > 0) {
    try {
      await page.waitForSelector("div.rank-badge");
      break;
    } catch (error) {
      console.error("Error loading page:", error);
      retries--;
      console.log("Retrying page load...", "retries left:", retries);
    }
  }

  console.log("Load URL:", page.url());

  // await page.screenshot({
  //   path: `${username}-pageload-screenshot.png`,
  //   fullPage: true,
  // });

  const statusCode = response.status();
  const statusOk = response.ok();
  console.log(
    (() => {
      if (statusOk === true) {
        return "Page succesfully loaded,";
      }
    })(),
    "status code:",
    statusCode
  );
  if (!statusOk) {
    console.error("Error loading page");
    await browser.close();
    return;
  }
  const pageData = await page.evaluate(
    () => document.documentElement.innerHTML
  );

  if (pageData === undefined || pageData === null) {
    console.log("Error retreiving page data.");
    return;
  }

  console.log("Page data successfully retrieved");
  await browser.close();
  return pageData;
}

// --------------------------------------------
// SCRAPE DATA FROM: https://twitchtracker.com/
// --------------------------------------------
// TODO: Add subscribers via TWITCH API - cannot scrape this data from any site unfortunately

async function scrapeData(pageData) {
  const $ = cheerio.load(pageData);
  let scrapedData = {};

  scrapedData.username = $("#app #app-title").text().trim();
  scrapedData.rank = $(".rank-badge > span:last-child").text();
  scrapedData.rankPercentile = $("#mini-profile >div:last-child")
    .text()
    .split(" ", 2)
    .join(" ");
  scrapedData.followers = $(
    "ul.list-group > li:eq(3) > div:first > div:last > span:last"
  ).text();
  scrapedData.avgViewers = $(
    "ul.list-group > li:eq(3) > div:last > div:last > span:last"
  ).text();
  // TODO: Subscribers, call different function requiring authentication from Twitch and Twitch App integration.
  return scrapedData;
}

// --------------------------------------------
// MAIN FUNCTION
// --------------------------------------------

export default async function getData() {
  const retreivedData = await getPageData(username);
  const scrapedData = await scrapeData(retreivedData);
  console.log("scrapedData:", scrapedData);

  //
}

getData(username);
