const axios = require('axios');

module.exports = async (req, res) => {
    try {
        // Extract the path from the URL (replace '/api/mac1/' with actual part of the path)
        const path = req.url.replace('/api/star/', ''); // Adjust this path as needed
        // Construct the direct stream URL
        const streamUrl = `http://starshare.st/live/42166/42166/${path}`;

        // Make the request to the stream URL
        const response = await axios.get(streamUrl, {
            headers: {
                'User-Agent': 'VLC/3.0.11 LibVLC/3.0.11',
                'Referer': 'http://starshare.org/',  // Ensure this is correct for your use case
            },
            responseType: 'stream',  // Specify that we expect a stream
        });

        // Set the content type and pipe the data to the response
        res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
        response.data.pipe(res);  // Pipe the stream to the response object

    } catch (error) {
        // Log and return an error if the stream request fails
        console.error('Error occurred while streaming:', error.message);
        res.status(500).send('স্ট্রিম আনার সময় ত্রুটি');  // Return the error message in Bengali
    }
};