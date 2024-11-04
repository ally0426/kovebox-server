<<<<<<< HEAD:api/controllers/scrapingController.js
const axios = require("axios");
=======
// const axios = require("axios");
// const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const axios = require("axios");
// const chromium = require("chrome-aws-lambda");
>>>>>>> 24ab25dc170f81a2026cf6f7d430bcf6ee7f2a5e:controllers/scrapingController.js

// Function to fetch Google Calendar events
const fetchGoogleEvents = async (accessToken, lat, lng) => {
  const calendarId = "primary";
  const googleCalendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;

<<<<<<< HEAD:api/controllers/scrapingController.js
  try {
    const response = await axios.get(googleCalendarUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime",
        timeMin: new Date().toISOString(),
        location: `${lat},${lng}`,
      },
    });

    return response.data.items.map((event) => ({
      source: "Google Calendar",
      title: event.summary,
      date: event.start.dateTime || event.start.date,
      location: event.location || "Online",
      link: event.htmlLink,
    }));
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error);
    return [];
=======
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
>>>>>>> 24ab25dc170f81a2026cf6f7d430bcf6ee7f2a5e:controllers/scrapingController.js
  }
};

// Function to fetch Eventbrite events
const fetchEventbriteEvents = async (lat, lng) => {
  const eventbriteUrl = `https://www.eventbriteapi.com/v3/events/search/?location.latitude=${lat}&location.longitude=${lng}&token=${process.env.EVENTBRITE_API_TOKEN}`;

  try {
    const response = await axios.get(eventbriteUrl);
    return response.data.events.map((event) => ({
      source: "Eventbrite",
      title: event.name.text,
      date: event.start.local,
      location: event.venue?.address.localized_address_display || "Online",
      link: event.url,
    }));
  } catch (error) {
    console.error("Error fetching Eventbrite events:", error);
    return [];
  }
};

// Function to fetch and combine events from both Google and Eventbrite
const fetchAllEvents = async (googleAccessToken, lat, lng) => {
  const [googleEvents, eventbriteEvents] = await Promise.all([
    fetchGoogleEvents(googleAccessToken, lat, lng),
    fetchEventbriteEvents(lat, lng),
  ]);

  return [...googleEvents, ...eventbriteEvents];
};

module.exports = { fetchAllEvents };

// const axios = require("axios");

// // Eventbrite and Meetup API tokens (store securely in environment variables)
// const EVENTBRITE_API_TOKEN = process.env.EVENTBRITE_API_TOKEN;
// const MEETUP_ACCESS_TOKEN = process.env.MEETUP_ACCESS_TOKEN;

// // Function to fetch Eventbrite events using the API
// const fetchEventbriteEvents = async () => {
//   const allActivities = [];
//   const eventbriteUrls = [
//     `https://www.eventbriteapi.com/v3/events/search/?q=korean&token=${EVENTBRITE_API_TOKEN}`,
//     `https://www.eventbriteapi.com/v3/events/search/?q=kpop&token=${EVENTBRITE_API_TOKEN}`,
//     `https://www.eventbriteapi.com/v3/events/search/?q=korean%20cooking&token=${EVENTBRITE_API_TOKEN}`,
//   ];

//   for (const url of eventbriteUrls) {
//     try {
//       const response = await axios.get(url);
//       const events = response.data.events;
//       events.forEach((event) => {
//         allActivities.push({
//           source: "Eventbrite",
//           title: event.name.text,
//           date: event.start.local,
//           location: event.venue?.address.localized_address_display || "Online",
//           link: event.url,
//         });
//       });
//     } catch (error) {
//       console.error(`Error fetching Eventbrite events from ${url}:`, error);
//     }
//   }

//   return allActivities;
// };

// // Function to fetch Meetup events using the API
// const fetchMeetupEvents = async () => {
//   const allActivities = [];
//   const meetupUrls = [
//     `https://api.meetup.com/find/upcoming_events?text=korean`,
//     `https://api.meetup.com/find/upcoming_events?text=kpop`,
//     `https://api.meetup.com/find/upcoming_events?text=korean%20cooking`,
//   ];

//   for (const url of meetupUrls) {
//     try {
//       const response = await axios.get(url, {
//         headers: {
//           Authorization: `Bearer ${MEETUP_ACCESS_TOKEN}`,
//         },
//       });
//       const events = response.data.events;
//       events.forEach((event) => {
//         allActivities.push({
//           source: "Meetup",
//           title: event.name,
//           date: new Date(event.time), // convert timestamp
//           location: event.venue
//             ? `${event.venue.city}, ${event.venue.state}`
//             : "Online",
//           link: event.link,
//         });
//       });
//     } catch (error) {
//       console.error(`Error fetching Meetup events from ${url}:`, error);
//     }
//   }

//   return allActivities;
// };

// // Main function to fetch both Eventbrite and Meetup activities
// const fetchActivities = async (req, res) => {
//   try {
//     // Fetch Eventbrite and Meetup events concurrently
//     const [eventbriteActivities, meetupActivities] = await Promise.all([
//       fetchEventbriteEvents(),
//       fetchMeetupEvents(),
//     ]);

//     // Combine the activities
//     const activities = [...eventbriteActivities, ...meetupActivities];

//     if (activities.length === 0) {
//       console.log("No activities found from Eventbrite or Meetup.");
//     }

//     // Send the combined activities as the response
//     res.json(activities);
//   } catch (error) {
//     console.error("Error fetching activities:", error);
//     res.status(500).json({ message: "Error fetching activities" });
//   }
// };

// module.exports = { fetchActivities };

// // const puppeteer = require("puppeteer");

// // // URLs for Eventbrite and Meetup to scrape
// // const eventbriteUrls = [
// //   "https://www.eventbrite.com/d/online/korean/",
// //   "https://www.eventbrite.com/d/online/kpop/",
// //   "https://www.eventbrite.com/d/online/korean-cooking/",
// // ];

// // const meetupUrls = [
// //   "https://www.meetup.com/find/?keywords=korean",
// //   "https://www.meetup.com/find/?keywords=kpop",
// //   "https://www.meetup.com/find/?keywords=korean%20cooking",
// // ];

// // // Function to scrape Eventbrite using Puppeteer
// // const scrapeEventbrite = async (browser) => {
// //   const allActivities = [];

// //   for (const url of eventbriteUrls) {
// //     try {
// //       const page = await browser.newPage();
// //       await page.goto(url, { waitUntil: "domcontentloaded" });

// //       // Debugging: Log page content to verify Eventbrite page loads correctly
// //       const pageContent = await page.content();
// //       console.log(`Loaded Eventbrite page content from ${url}`);

// //       const activities = await page.evaluate(() => {
// //         const activityElements = document.querySelectorAll('a[href*="/e/"]');
// //         const events = [];
// //         activityElements.forEach((element) => {
// //           const title = element
// //             .querySelector(".eds-event-card__formatted-name--is-clamped")
// //             ?.textContent.trim();
// //           const date = element
// //             .querySelector(
// //               ".eds-event-card-content__sub-content .eds-text-bs--fixed"
// //             )
// //             ?.textContent.trim();
// //           const location = element
// //             .querySelector('[data-spec="event-card__formatted-location"]')
// //             ?.textContent.trim();
// //           const link = element.getAttribute("href");

// //           if (title && date && location && link) {
// //             events.push({
// //               source: "Eventbrite",
// //               title,
// //               date,
// //               location,
// //               link: `https://www.eventbrite.com${link}`,
// //             });
// //           }
// //         });
// //         return events;
// //       });

// //       allActivities.push(...activities);
// //       await page.close();
// //     } catch (error) {
// //       console.error(`Error scraping Eventbrite from ${url}:`, error);
// //     }
// //   }
// //   return allActivities;
// // };

// // // Function to scrape Meetup using Puppeteer
// // const scrapeMeetup = async (browser) => {
// //   const allActivities1 = [];

// //   for (const url of meetupUrls) {
// //     try {
// //       const page = await browser.newPage();
// //       await page.goto(url, { waitUntil: "domcontentloaded" });

// //       await page.waitForSelector("a#event-card-in-search-results", {
// //         timeout: 10000,
// //       });

// //       const activities = await page.evaluate(() => {
// //         const activityElements = document.querySelectorAll(
// //           "a#event-card-in-search-results"
// //         );
// //         const events = [];
// //         activityElements.forEach((element) => {
// //           const title = element.querySelector("h2")?.textContent.trim();
// //           const location = element.querySelector("p")?.textContent.trim();
// //           const time = element
// //             .querySelector("[datetime]")
// //             ?.getAttribute("datetime");
// //           const link = element.getAttribute("href");

// //           if (title && location && time && link) {
// //             events.push({
// //               source: "Meetup",
// //               title,
// //               location,
// //               time,
// //               link: `https://www.meetup.com${link}`,
// //             });
// //           }
// //         });
// //         return events;
// //       });

// //       allActivities1.push(...activities);
// //       await page.close();
// //     } catch (error) {
// //       console.error(`Error scraping Meetup from ${url}:`, error);
// //     }
// //   }
// //   return allActivities1;
// // };

// // // Main function to scrape both Eventbrite and Meetup
// // const scrapeActivities = async (req, res) => {
// //   let browser;
// //   try {
// //     // Launch Puppeteer
// //     browser = await puppeteer.launch({ headless: true });

// //     // Scrape Eventbrite and Meetup activities
// //     const eventbriteActivities = await scrapeEventbrite(browser);
// //     const meetupActivities = await scrapeMeetup(browser);

// //     // Combine activities from both sources
// //     const activities = [...eventbriteActivities, ...meetupActivities];

// //     // Send the combined activities as a response
// //     res.json(activities);
// //   } catch (error) {
// //     console.error("Error scraping activities:", error);
// //     res.status(500).json({ message: "Error scraping activities" });
// //   } finally {
// //     if (browser) {
// //       await browser.close();
// //     }
// //   }
// // };

// // module.exports = { scrapeActivities };
