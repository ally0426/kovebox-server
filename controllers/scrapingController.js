// const axios = require("axios");
// const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const axios = require("axios");
// const chromium = require("chrome-aws-lambda");

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
// const meetupUrl = "https://www.meetup.com/find/events/?keywords=korean&allMeetups=true";

// List of Eventbrite URLs to scrape
const eventbriteUrls = [
  "https://www.eventbrite.com/d/online/korean/",
  "https://www.eventbrite.com/d/online/kpop/",
  "https://www.eventbrite.com/d/online/korean-cooking/",
];

// Function to scrape multiple Eventbrite URLs
const scrapeEventbrite = async (req, res) => {
  try {
    const allActivities = [];

    // Loop through each URL and scrape the data
    for (const url of eventbriteUrls) {
      try {
        // Fetch the HTML of the page
        const { data } = await axios.get(url);

        // Load the HTML into Cheerio
        const $ = cheerio.load(data);

        // Select all anchor tags with href containing "/e/" (Eventbrite event links)
        const activityElements = $('a[href*="/e/"]');

        // Iterate over each event link found
        activityElements.each((i, element) => {
          const title = $(element)
            .find(".eds-event-card__formatted-name--is-clamped")
            .text()
            .trim();
          const date = $(element)
            .find(".eds-event-card-content__sub-content .eds-text-bs--fixed")
            .text()
            .trim();
          const location = $(element)
            .find('[data-spec="event-card__formatted-location"]')
            .text()
            .trim();
          const link = $(element).attr("href"); // Get the link directly

          // Add the event to the list if all required data is available
          if (title && date && location && link) {
            allActivities.push({
              title,
              date,
              location,
              link: `https://www.eventbrite.com${link}`, // Ensure full URL
            });
          }
        });
      } catch (error) {
        console.error(`Error scraping Eventbrite from ${url}:`, error);
        // Continue with the next URL even if one fails
      }
    }

    // After gathering all activities, create the final activities array
    const activities = [...allActivities];

    // Send the activities array as a response
    res.json(activities);
  } catch (error) {
    console.error("Error scraping Eventbrite:", error);
    res.status(500).json({ message: "Error scraping Eventbrite" });
  }
};

// Function to scrape Meetup activities
// const scrapeMeetup = async (req, res) => {
//   try {
//     const { data } = await axios.get(meetupUrl);
//     const $ = cheerio.load(data);
//     const activities = [];

//     $(".eventCard--link").each((index, element) => {
//       const title = $(element).find(".text--labelSecondary").text().trim();
//       const date = $(element).find(".eventTimeDisplay-startDate").text().trim();
//       const location = $(element).find(".venueDisplay-venue").text().trim();
//       const link = $(element).attr("href");

//       activities.push({
//         title,
//         date,
//         location,
//         link: `https://www.meetup.com${link}`,
//       });
//     });

//     res.json({ success: true, data: activities });
//   } catch (error) {
//     console.error("Error fetching data from Meetup:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error fetching data from Meetup" });
//   }
// };

module.exports = { scrapeEventbrite };

// module.exports = { scrapeEventbrite, scrapeMeetup };
