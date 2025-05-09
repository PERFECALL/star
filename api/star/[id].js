const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const path = req.url.replace('/api/star/', '');
        const streamUrl = `http://starshare.st/live/42166/42166/${path}`;

        if (path.endsWith('.m3u8')) {
            // Fetch the m3u8 playlist
            const response = await axios.get(streamUrl, {
                headers: {
                    'User-Agent': 'VLC/3.0.11 LibVLC/3.0.11',
                    'Referer': 'http://starshare.org/',
                },
                responseType: 'text',
            });

            let playlist = response.data;

            // Rewrite segment URLs to go through this proxy
            playlist = playlist.replace(/^(?!#)(.*\.ts)$/gm, segment => {
                const basePath = path.substring(0, path.lastIndexOf('/') + 1);
                return `/api/star/${basePath}${segment}`;
            });

            res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
            res.send(playlist);
        } else {
            // Proxy .ts or other stream files
            const response = await axios.get(streamUrl, {
                headers: {
                    'User-Agent': 'VLC/3.0.11 LibVLC/3.0.11',
                    'Referer': 'http://starshare.org/',
                },
                responseType: 'stream',
            });

            res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
            response.data.pipe(res);
        }
    } catch (error) {
        console.error('Error occurred while streaming:', error.message);
        res.status(500).send('স্ট্রিম আনার সময় ত্রুটি');
    }
};