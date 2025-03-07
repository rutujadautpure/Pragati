const express = require('express');
const axios = require('axios');

const router = express.Router();

// Route to display finance videos
router.get('/videostop5', async (req, res) => {
    try {
        const videos = await getTopFinanceVideos();
        res.render('finance_videos', { videos });
    } catch (error) {
        console.error('Error fetching videos:', error);  // Log the error here
        res.status(500).send('Something went wrong!');
    }
});


// Function to fetch top finance videos from YouTube
async function getTopFinanceVideos() {
    const API_KEY = 'YOUR_YOUTUBE_API_KEY';  // Replace with your YouTube API key
    const searchQuery = 'finance';
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&order=viewCount&maxResults=5&key=${API_KEY}`;

    const response = await axios.get(url);
    const videos = response.data.items.map(item => ({
        title: item.snippet.title,
        description: item.snippet.description,
        videoId: item.id.videoId,
        thumbnail: item.snippet.thumbnails.high.url,
    }));

    return videos;
}

module.exports = router;
