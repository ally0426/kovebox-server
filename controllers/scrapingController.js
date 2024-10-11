// const axios = require("axios");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

// const urls = {
//   eventbrite: {
//     korea: 'https://www.eventbrite.com/d/online/korea/',
//     korean: 'https://www.eventbrite.com/d/online/korean/',
//     kpop: 'https://www.eventbrite.com/d/online/k-pop/',
//     koreanCooking: 'https://www.eventbrite.com/d/online/korean-cooking/',
//     kpopDance: 'https://www.eventbrite.com/d/online/k-pop-dance/',
//     koreanMartialArt: 'https://www.eventbrite.com/d/online/korean-martial-art/',
//     koreanArt: 'https://www.eventbrite.com/d/online/korean-art/'
//   },
//   meetup: {
//     korea: 'https://www.meetup.com/find/events/?keywords=korea&allMeetups=true',
//     korean: 'https://www.meetup.com/find/events/?keywords=korean&allMeetups=true',
//     kpop: 'https://www.meetup.com/find/events/?keywords=k-pop&allMeetups=true',
//     koreanCooking: 'https://www.meetup.com/find/events/?keywords=korean+cooking&allMeetups=true',
//     kpopDance: 'https://www.meetup.com/find/events/?keywords=k-pop+dance&allMeetups=true',
//     koreanMartialArt: 'https://www.meetup.com/find/events/?keywords=korean+martial+art&allMeetups=true',
//     koreanArt: 'https://www.meetup.com/find/events/?keywords=korean+art&allMeetups=true'
//   },
//   google: {
//     korea: 'https://www.google.com/search?q=korea+events',
//     korean: 'https://www.google.com/search?q=korean+events',
//     kpop: 'https://www.google.com/search?q=k-pop+events',
//     koreanCooking: 'https://www.google.com/search?q=korean+cooking+events',
//     kpopDance: 'https://www.google.com/search?q=k-pop+dance+events',
//     koreanMartialArt: 'https://www.google.com/search?q=korean+martial+art+events',
//     koreanArt: 'https://www.google.com/search?q=korean+art+events'
//   }
// };

// Define the URL for scraping Eventbrite
// const eventbriteUrl = [
//   "https://www.eventbrite.com/d/online/korea/",
//   "https://www.eventbrite.com/d/online/korean/",
//   "https://www.eventbrite.com/d/online/k-pop/",
//   "https://www.eventbrite.com/d/online/korean-cooking/",
//   "https://www.eventbrite.com/d/online/k-pop-dance/",
//   "https://www.eventbrite.com/d/online/korean-martial-art/",
//   "https://www.eventbrite.com/d/online/korean-art/",
// ];

// Define the URL for scraping Meetup
const meetupUrl =
  "https://www.meetup.com/find/events/?keywords=korean&allMeetups=true";

// List of Eventbrite URLs to scrape
const eventbriteUrls = [
  "https://www.eventbrite.com/d/online/korean/",
  "https://www.eventbrite.com/d/online/kpop/",
  "https://www.eventbrite.com/d/online/korean-cooking/",
];

const scrapeEventbrite = async (req, res) => {
  try {
    console.log("Launching Puppeteer...");
    const browser = await puppeteer.launch({ headless: true });

    const allActivities = [];

    // Iterate over each URL to scrape data
    for (const url of eventbriteUrls) {
      const page = await browser.newPage();
      console.log(`Navigating to: ${url}`);

      // Set User-Agent to avoid being blocked
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36"
      );

      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      console.log(`Page loaded successfully for: ${url}`);

      // Evaluate the page content for scraping
      const activities = await page.evaluate(() => {
        const activityElements = document.querySelectorAll('a[href*="/e/"]');
        const activities = [];

        activityElements.forEach((element) => {
          const title = element.innerText.trim();
          const link = element.href;

          // Extract the location using the 'data-event-location' attribute
          const location =
            element.getAttribute("data-event-location") || "Online";

          // Find the parent container of the <a> element to access the date info
          const parentElement = element.parentElement;
          const dateElement = parentElement.querySelector("p");

          // Extract date if available
          const date = dateElement
            ? dateElement.innerText.trim()
            : "Date not provided";

          // Only add the activity if title and link are present
          if (title && link) {
            activities.push({
              title,
              date,
              location,
              link: link.startsWith("http")
                ? link
                : `https://www.eventbrite.com${link}`,
            });
          }
        });

        return activities;
      });

      console.log(`Scraped ${activities.length} activities from: ${url}`);
      allActivities.push(...activities);

      // Close the page to free resources
      await page.close();
    }

    await browser.close();

    console.log(`Total activities scraped: ${allActivities.length}`);

    // Return the combined scraped activities
    res.json({
      success: true,
      data: allActivities,
    });
  } catch (error) {
    console.error("Error fetching data from Eventbrite with Puppeteer:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching data from Eventbrite",
      error: error.message,
    });
  }
};

// Function to scrape Meetup activities
const scrapeMeetup = async (req, res) => {
  try {
    const { data } = await axios.get(meetupUrl);
    const $ = cheerio.load(data);
    const activities = [];

    $(".eventCard--link").each((index, element) => {
      const title = $(element).find(".text--labelSecondary").text().trim();
      const date = $(element).find(".eventTimeDisplay-startDate").text().trim();
      const location = $(element).find(".venueDisplay-venue").text().trim();
      const link = $(element).attr("href");

      activities.push({
        title,
        date,
        location,
        link: `https://www.meetup.com${link}`,
      });
    });

    res.json({ success: true, data: activities });
  } catch (error) {
    console.error("Error fetching data from Meetup:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching data from Meetup" });
  }
};

// module.exports = { scrapeEventbrite };

module.exports = { scrapeEventbrite, scrapeMeetup };
