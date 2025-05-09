import axios from 'axios';

export default async function handler(req, res) {
  try {
    const path = req.query.path.join('/'); // Handle nested segments like 23869/1.ts
    const baseStreamUrl = `http://starshare.st/live/42166/42166/`;
    const streamUrl = `${baseStreamUrl}${path}`;

    if (path.endsWith('.m3u8')) {
      // Fetch original playlist
      const response = await axios.get(streamUrl, {
        headers: {
          'User-Agent': 'VLC/3.0.11 LibVLC/3.0.11',
          'Referer': 'http://starshare.org/',
        }
      });

      // Rewrite segment URLs to go through your proxy
      let playlist = response.data.replace(/([^\s#]+\.ts)/g, segment =>
        `${req.url.replace(path, '')}${path.split('/')[0]}/${segment}`
      );

      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      return res.status(200).send(playlist);
    } else {
      // Stream .ts or any other file directly
      const response = await axios.get(streamUrl, {
        headers: {
          'User-Agent': 'VLC/3.0.11 LibVLC/3.0.11',
          'Referer': 'http://starshare.org/',
        },
        responseType: 'stream'
      });

      res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
      response.data.pipe(res);
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Stream Error');
  }
}
