const { Client } = require('podcast-api');
require("dotenv").config()
const api = process.env.APIKEY

// Create a function to fetch podcast genres
const fetchPodcastGenres = async () => {
  const client = Client({ apiKey: api });

  try {
    const response = await client.fetchPodcastGenres({ top_level_only: 1 });
    return response.data; // Return the genre data
  } catch (error) {
    console.error('Error fetching podcast genres:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

// Create a function to fetch podcasts based on selected genre

// If apiKey is null, then we will connect to a mock server
// that returns fake data for testing purposes.
  

const fetchPodcast = async () => {
  try {
    const client = Client({ apiKey: api });
    const response = await client.search({
      q: 'sports',
      genre_ids: '77',
      language: 'English',
    });
    return(response.data.results);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { fetchPodcastGenres, fetchPodcast };
