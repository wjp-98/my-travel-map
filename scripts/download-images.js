const fs = require('fs');
const path = require('path');
const https = require('https');

const images = [
  {
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    filename: 'paris.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
    filename: 'kyoto.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded',
    filename: 'barcelona.jpg'
  }
];

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(__dirname, '../public/images', filename));
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
};

const downloadAll = async () => {
  try {
    for (const image of images) {
      await downloadImage(image.url, image.filename);
    }
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
};

downloadAll(); 