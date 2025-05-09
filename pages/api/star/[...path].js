const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const pathParts = req.query.path;
    const finalPath = Array.isArray(pathParts) ? pathParts.join('/') : pathParts;
    const streamUrl = `http://starshare.st/live/42166/42166/${finalPath}`;

    const response = await axios.get(streamUrl, {
      headers: {
        'User-Agent': 'VLC/3.0.11 LibVLC/3.0.11',
        'Referer': 'http://starshare.org/',
      },
      responseType: 'stream',
    });

    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    response.data.pipe(res);
  } catch (error) {
    console.error('Streaming error:', error.message);
    res.status(500).send('স্ট্রিম আনতে সমস্যা হচ্ছে');
  }
};
