const axios = require('axios').default;

const baseUrl = 'https://www.googleapis.com/youtube/v3/';
const maxResults = 5;

exports.searchSongs = async query => {
  try {
    const response = await axios.get(
      `${baseUrl}search?q=${query}&maxResults=${maxResults}&type=video&part=snippet,id&key=${process.env.YOUTUBE_API_KEY}&videoEmbeddable=true`
    );
    return response['data']['items'];
  } catch (error) {
    console.error(error);
  }
};

exports.songDetails = async songId => {
  try {
    const response = await axios.get(
      `${baseUrl}videos?id=${songId}&type=video&part=snippet,contentDetails&key=${process.env.YOUTUBE_API_KEY}`
    );
    return response['data']['items'];
  } catch (error) {
    console.error(error);
  }
};
