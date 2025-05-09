const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const path = req.url.replace('/api/star/', '');
        const streamUrl = `http://starshare.st/live/42166/42166/${path}`;

        if (path.endsWith('.m3u8')) {
            const response = await axios.get(streamUrl, {
                headers: {
                    'User-Agent': 'VLC/3.0.11 LibVLC/3.0.11',
                    'Referer': 'http://starshare.org/',
                },
                responseType: 'text',
            });

            let playlist = response.data;

            // Rewrite .ts segment URLs
            playlist = playlist.replace(/^(?!#)(.*\.ts)$/gm, segment => {
                const basePath = path.substring(0, path.lastIndexOf('/') + 1);
                return `/api/star/${basePath}${segment.trim()}`;
            });

            // Rewrite nested .m3u8 playlist URLs
            playlist = playlist.replace(/^(?!#)(.*\.m3u8)$/gm, nested => {
                const basePath = path.substring(0, path.lastIndexOf('/') + 1);
                return `/api/star/${basePath}${nested.trim()}`;
            });

            res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
            res.status(200).send(playlist);
        } else {
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
        console.error('Error fetching stream:', error.message);
        res.status(500).send('স্ট্রিম আনার সময় ত্রুটি');
    }
};