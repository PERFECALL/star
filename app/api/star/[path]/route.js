import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request, { params }) {
  try {
    const { path } = params;
    const streamUrl = `http://starshare.st/live/42166/42166/${path}`;

    const response = await axios.get(streamUrl, {
      headers: {
        'User-Agent': 'VLC/3.0.11 LibVLC/3.0.11',
        'Referer': 'http://starshare.org/',
      },
      responseType: 'stream',
    });

    return new NextResponse(response.data, {
      headers: {
        'Content-Type': response.headers['content-type'] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error:', error.message);
    return new NextResponse('স্ট্রিম আনতে সমস্যা হচ্ছে', { status: 500 });
  }
}
