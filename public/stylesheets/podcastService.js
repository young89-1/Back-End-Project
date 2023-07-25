const { Client } = require('podcast-api');
require("dotenv").config()
const api = process.env.APIKEY

// Create a function to fetch podcast genres
const fetchPodcastGenres = async () => {
  const client = Client({ apiKey: api });

  try {
    const response = await client.fetchPodcastGenres({ top_level_only: 1 });
    return response.data.genres; // Return the genre data
  } catch (error) {
    console.error('Error fetching podcast genres:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

const fetchPodcast = async (title, genre) => {
  try {
    const client = Client({ apiKey: api });
    const response = await client.search({
      q: title,
      genre_ids: genre,
      language: 'English',
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

const fetchPodcastById = async (id) => {
  try {
    const client = Client({ apiKey: api });
    const response = await client.fetchPodcastById({ id });
    return response.data;
  } catch (error) {
    console.error('Error fetching podcast by ID:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

module.exports = { fetchPodcastGenres, fetchPodcast, fetchPodcastById };
