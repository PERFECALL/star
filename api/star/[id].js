const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const path = req.url.replace('/api/mac1/', '');
        const streamUrl = `http://xtv.ooo:8080/live/387546/200900/${path}`;

        const response = await axios.get(streamUrl, {
            headers: {
                'User-Agent': 'VLC/3.0.11 LibVLC/3.0.11',
                'Referer': 'http://xtv.ooo/',
            },
            responseType: 'stream',
        });

        res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
        response.data.pipe(res);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('স্ট্রিম আনার সময় ত্রুটি');
    }
};
