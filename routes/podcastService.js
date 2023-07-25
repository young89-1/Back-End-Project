//const { Client } = require('podcast-api');

// Create a function to fetch podcast genres
const fetchPodcastGenres = async () => {
  const client = Client({ apiKey: 'bac9507b968e4f6bb25327dd6a9765fd' });

  try {
    const response = await client.fetchPodcastGenres({ top_level_only: 1 });
    return response.data; // Return the genre data
  } catch (error) {
    console.error('Error fetching podcast genres:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

const client = Client({ apiKey: 'bac9507b968e4f6bb25327dd6a9765fd' });
client.fetchPodcastById({
  id: '4d3fe717742d4963a85562e9f84d8c79',
  next_episode_pub_date: 1479154463000,
  sort: 'recent_first',
}).then((response) => {
  // Get response json data here
  console.log(response.data);
}).catch((error) => {
  console.log(error)
});

module.exports = { fetchPodcastGenres, 
  fetchPodcastById };
