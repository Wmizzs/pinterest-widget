const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const BOARD_URL = 'https://www.pinterest.co.uk/pinchaos/supernatural-vibes/'; // Replace with your board

app.get('/', async (req, res) => {
  try {
    const { data } = await axios.get(BOARD_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $ = cheerio.load(data);
    const images = [];

    $('img').each((_, el) => {
      const src = $(el).attr('src');
      if (src && src.includes('pinimg.com')) {
        images.push(src);
      }
    });

    if (images.length === 0) return res.send('<h1>No images found.</h1>');

    const randomImage = images[Math.floor(Math.random() * images.length)];

    res.send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="60">
          <style>
            body { margin: 0; background: #000; display: flex; align-items: center; justify-content: center; height: 100vh; }
            img { max-width: 100%; max-height: 100%; object-fit: contain; }
          </style>
        </head>
        <body>
          <img src="${randomImage}" />
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(`<h1>Scrape failed: ${err.message}</h1>`);
  }
});

module.exports = app;
