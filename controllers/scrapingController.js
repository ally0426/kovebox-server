const axios = require("axios");

// Function to fetch Google Events based on keywords and location
const fetchGoogleEvents = async (keywords, location, limit = 20) => {
  const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

  const query = `${keywords.join(" OR ")} events in ${location}`;
  const googleSearchUrl = `https://www.googleapis.com/customsearch/v1`;

  let events = [];
  let startIndex = 1; // Google Custom Search uses 1-based indexing
  const maxResultsPerRequest = 10; // Google Custom Search API has a max of 10 results per request

  try {
    while (events.length < limit) {
      const response = await axios.get(googleSearchUrl, {
        params: {
          key: apiKey,
          cx: searchEngineId,
          q: query,
          start: startIndex,
          num: maxResultsPerRequest,
        },
      });

      if (response.data && Array.isArray(response.data.items)) {
        events = events.concat(
          response.data.items.map((item) => ({
            source: "Google Search",
            title: item.title,
            snippet: item.snippet,
            link: item.link,
          }))
        );
      }

      // Update startIndex for the next batch and break if fewer than 10 results are returned
      if (response.data.items.length < maxResultsPerRequest) break;
      startIndex += maxResultsPerRequest;
    }

    // Return only up to the limit specified
    return events.slice(0, limit);
  } catch (error) {
    console.error("Error fetching Google Events:", error);
    return [];
  }
};

// Main function to fetch all events with pagination
const fetchAllEvents = async (lat, lng, limit = 20, offset = 0) => {
  const keywords = ["korean", "kpop", "korean food"];
  const location = lat && lng ? `${lat},${lng}` : "Los Angeles, CA";

  const googleEvents = await fetchGoogleEvents(
    keywords,
    location,
    limit + offset
  );

  // Apply limit and offset to simulate pagination
  const paginatedEvents = googleEvents.slice(offset, offset + limit);

  return paginatedEvents;
};

module.exports = { fetchAllEvents };

//1.
// const axios = require("axios");

// // Function to fetch Google Events based on keywords and location
// const fetchGoogleEvents = async (keywords, location) => {
//   const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
//   const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

//   // Combine keywords with "events" and location to create a query string
//   const query = `${keywords.join(" OR ")} events in ${location}`;
//   const googleSearchUrl = `https://www.googleapis.com/customsearch/v1`;

//   try {
//     const response = await axios.get(googleSearchUrl, {
//       params: {
//         key: apiKey,
//         cx: searchEngineId,
//         q: query,
//         num: 10, // Fetch up to 10 results at a time
//       },
//     });

//     // Check if response.data.items exists and is an array
//     if (response.data && Array.isArray(response.data.items)) {
//       const events = response.data.items.map((item) => ({
//         source: "Google Search",
//         title: item.title,
//         snippet: item.snippet,
//         link: item.link,
//       }));
//       return events;
//     } else {
//       console.warn("No items found in Google Custom Search response.");
//       return [];
//     }
//   } catch (error) {
//     console.error("Error fetching Google Events:", error);
//     return [];
//   }
// };

// // Main function to fetch all events with pagination
// const fetchAllEvents = async (lat, lng, limit = 20, offset = 0) => {
//   const keywords = ["korean", "kpop", "korean food"];
//   const location = lat && lng ? `${lat},${lng}` : "Los Angeles, CA";

//   const googleEvents = await fetchGoogleEvents(keywords, location);

//   // Apply limit and offset to simulate pagination
//   const paginatedEvents = googleEvents.slice(offset, offset + limit);

//   return paginatedEvents;
// };

// module.exports = { fetchAllEvents };

//2.
// const axios = require("axios");

// // Function to fetch Google Events based on keywords and location
// const fetchGoogleEvents = async (keywords, location) => {
//   const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
//   const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

//   // Combine keywords with "events" and location to create a query string
//   const query = `${keywords.join(" OR ")} events in ${location}`;

//   const googleSearchUrl = `https://www.googleapis.com/customsearch/v1`;

//   try {
//     const response = await axios.get(googleSearchUrl, {
//       params: {
//         key: apiKey,
//         cx: searchEngineId,
//         q: query,
//         num: 10, // Limit to 10 results
//       },
//     });

//     // Map results to a simplified format
//     const events = response.data.items.map((item) => ({
//       source: "Google Search",
//       title: item.title,
//       snippet: item.snippet,
//       link: item.link,
//     }));

//     console.log("Fetched Google Events:", events);
//     return events;
//   } catch (error) {
//     console.error("Error fetching Google Events.:", error);
//     return [];
//   }
// };

// // Main function to fetch all events, only using Google Events
// const fetchAllEvents = async (lat, lng) => {
//   const keywords = ["korean event", "kpop event", "korean food event"];

//   // Convert lat/lng to a general location (e.g., "Los Angeles, CA")
//   const location = lat && lng ? `${lat},${lng}` : "Los Angeles, CA"; // Default location

//   const googleEvents = await fetchGoogleEvents(keywords, location);

//   // Return only the Google Events results as the event data
//   return googleEvents;
// };

// module.exports = { fetchAllEvents };

// //1.
// const axios = require("axios");

// // Function to fetch Google Calendar events from a public calendar using an API key
// const fetchGoogleEvents = async (calendarId, apiKey) => {
//   const googleCalendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;

//   try {
//     const response = await axios.get(googleCalendarUrl, {
//       params: {
//         key: apiKey,
//         maxResults: 10,
//         singleEvents: true,
//         orderBy: "startTime",
//         timeMin: new Date().toISOString(),
//       },
//     });

//     return response.data.items.map((event) => ({
//       source: "Google Calendar",
//       title: event.summary,
//       date: event.start.dateTime || event.start.date,
//       location: event.location || "Online",
//       link: event.htmlLink,
//     }));
//   } catch (error) {
//     console.error("Error fetching Google Calendar events:", error);
//     return [];
//   }
// };

// // Function to fetch Eventbrite events
// const fetchEventbriteEvents = async (lat, lng) => {
//   const eventbriteUrl = `https://www.eventbriteapi.com/v3/events/search/?location.latitude=${lat}&location.longitude=${lng}&token=${process.env.EVENTBRITE_API_TOKEN}`;

//   try {
//     const response = await axios.get(eventbriteUrl);
//     return response.data.events.map((event) => ({
//       source: "Eventbrite",
//       title: event.name.text,
//       date: event.start.local,
//       location: event.venue?.address.localized_address_display || "Online",
//       link: event.url,
//     }));
//   } catch (error) {
//     console.error("Error fetching Eventbrite events:", error);
//     return [];
//   }
// };

// // Function to fetch combined events from Google and Eventbrite
// const fetchAllEvents = async (lat, lng) => {
//   const calendarId = "your_public_calendar_id@group.calendar.google.com"; // Replace with your public calendar ID
//   const apiKey = process.env.GOOGLE_API_KEY; // Google API Key stored in .env

//   const googleEvents = await fetchGoogleEvents(calendarId, apiKey);
//   const eventbriteEvents = await fetchEventbriteEvents(lat, lng);

//   console.log("Google Events: ", googleEvents);
//   console.log("Eventbrite Events: ", eventbriteEvents);

//   return [...googleEvents, ...eventbriteEvents];
// };

// module.exports = { fetchAllEvents };

// 2.
// const axios = require("axios");

// // Function to fetch Google Calendar events
// const fetchGoogleEvents = async (accessToken, lat, lng) => {
//   const calendarId = "primary";
//   const googleCalendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;

//   try {
//     const response = await axios.get(googleCalendarUrl, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       params: {
//         maxResults: 10,
//         singleEvents: true,
//         orderBy: "startTime",
//         timeMin: new Date().toISOString(),
//         location: `${lat},${lng}`,
//       },
//     });

//     return response.data.items.map((event) => ({
//       source: "Google Calendar",
//       title: event.summary,
//       date: event.start.dateTime || event.start.date,
//       location: event.location || "Online",
//       link: event.htmlLink,
//     }));
//   } catch (error) {
//     console.error("Error fetching Google Calendar events:", error);
//     return [];
//   }
// };

// // Function to fetch Eventbrite events
// const fetchEventbriteEvents = async (lat, lng) => {
//   const eventbriteUrl = `https://www.eventbriteapi.com/v3/events/search/?location.latitude=${lat}&location.longitude=${lng}&token=${process.env.EVENTBRITE_API_TOKEN}`;

//   try {
//     const response = await axios.get(eventbriteUrl);
//     return response.data.events.map((event) => ({
//       source: "Eventbrite",
//       title: event.name.text,
//       date: event.start.local,
//       location: event.venue?.address.localized_address_display || "Online",
//       link: event.url,
//     }));
//   } catch (error) {
//     console.error("Error fetching Eventbrite events:", error);
//     return [];
//   }
// };

// // Function to fetch and combine events from both Google and Eventbrite
// const fetchAllEvents = async (googleAccessToken, lat, lng) => {
//   const [googleEvents, eventbriteEvents] = await Promise.all([
//     fetchGoogleEvents(googleAccessToken, lat, lng),
//     fetchEventbriteEvents(lat, lng),
//   ]);

//   return [...googleEvents, ...eventbriteEvents];
// };

// module.exports = { fetchAllEvents };

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

// 3.
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
