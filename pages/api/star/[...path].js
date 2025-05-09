const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const path = req.query.path.join('/');  // capture path like "23869.m3u8" or "23869/1.ts"
        const streamUrl = `http://starshare.st/live/42166/42166/${path}`;

        const response = await axios.get(streamUrl, {
            headers: {
                'User-Agent': 'VLC/3.0.11 LibVLC/3.0.11',
                'Referer': 'http://starshare.org/',
            },
            responseType: 'stream',
        });

        res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
        res.setHeader('Access-Control-Allow-Origin', '*');  // Optional: helpful for media players
        response.data.pipe(res);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('স্ট্রিম লিংক আনার সময় ত্রুটি হয়েছে');
    }
};