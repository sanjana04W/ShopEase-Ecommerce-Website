const fs = require('fs');
const https = require('https');
const path = require('path');

const imagesToDownload = [
  'speaker', 'earbuds', 'hiking_boots', 'sneakers', 'oxford_shoes',
  'card_holder', 'fitness_band', 'keyboard', 'messenger_bag',
  'duffel_bag', 'aviator', 'sport_glasses', 'gym_shoes'
];

const downloadImage = (filename) => {
  return new Promise((resolve, reject) => {
    // We use loremflickr to try and get product-related images, or picsum as fallback. 
    // Let's use loremflickr as it accepts tags!
    const url = `https://loremflickr.com/400/400/${filename.replace('_', ',')}`;
    const dest = path.join(__dirname, 'public', 'images', `${filename}.jpg`);
    
    // loremflickr redirects, so we need to follow redirects or just use curl/fetch.
    // Node fetch is easier.
    fetch(url)
      .then(async res => {
        if (!res.ok) throw new Error(`unexpected response ${res.statusText}`);
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(dest, buffer);
        resolve();
      })
      .catch(err => {
        console.error(`Error downloading ${filename}:`, err);
        // Fallback to picsum if loremflickr fails
        const fallbackUrl = `https://picsum.photos/seed/${filename}/400/400`;
        fetch(fallbackUrl)
          .then(async res => {
            const buffer = Buffer.from(await res.arrayBuffer());
            fs.writeFileSync(dest, buffer);
            resolve();
          }).catch(reject);
      });
  });
};

async function run() {
  console.log('Downloading 13 unique images...');
  for (const img of imagesToDownload) {
    try {
      await downloadImage(img);
      console.log(`Downloaded ${img}.jpg`);
    } catch (e) {
      console.error(e);
    }
  }
  console.log('Done!');
}

run();
