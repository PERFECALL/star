const { exec } = require('child_process');
const axios = require('axios');

module.exports = async (req, res) => {
    try {
        const path = req.url.replace('/api/star/', '');
        const streamUrl = `http://starshare.st/live/42166/42166/${path}`;

        if (path.endsWith('.m3u8')) {
            exec(
                `curl -s -L "${streamUrl}" -H "User-Agent: VLC/3.0.11 LibVLC/3.0.11" -H "Referer: http://starshare.org/"`,
                (error, stdout, stderr) => {
                    if (error) {
                        console.error('Curl error:', error);
                        return res.status(500).send('স্ট্রিম আনার সময় ত্রুটি');
                    }

                    // Rewrite .ts paths to route through proxy
                    const basePath = path.substring(0, path.lastIndexOf('/') + 1);
                    const modified = stdout.replace(/^(?!#)(.*\.ts)$/gm, segment =>
                        `/api/star/${basePath}${segment}`
                    );

                    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
                    res.send(modified);
                }
            );
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
        console.error('Streaming error:', error.message);
        res.status(500).send('স্ট্রিম আনার সময় ত্রুটি');
    }
};