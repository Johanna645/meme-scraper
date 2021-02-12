// for creating folders, saving files on the harddrive
const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');

// create a folder and wait until it exist
fs.mkdirSync('memes');

// delcare a function that downloads a file and saves it to the harddrive
const saveImage = (imageUrl) => {
  // given a url, extract the file name
  // imagine urls are formatted like https://blablaa.com/images/dog.jpg?width=300
  // then the file name is everything after the last / and the last ? in the url
  const fileName = imageUrl.slice(
    imageUrl.lastIndexOf('/') + 1,
    imageUrl.lastIndexOf('?'),
  );

  // tell axios to read that url as a binary stream (it's important to read images as a binary stream rather than text - it wouldn't look right if you opened the image)
  axios({
    method: 'get',
    url: imageUrl,
    responseType: 'stream',
  }).then((response) => {
    // write the data stream to the folder that was previously created; use only the file name, not the whole url, as the target name
    response.data.pipe(fs.createWriteStream('memes/' + fileName));
  });
};

// connect to the page with memes on it
axios.get('https://memegen-link-examples-upleveled.netlify.app').then(
  (response) => {
    // status should be HTTP code 200 which means the connection was successful
    if (response.status === 200) {
      // response from the server is in response.data - that is the html document just requested
      const html = response.data;
      // now use cheerio to turn that html string into an object that can be searched, filtered, etc.
      const $ = cheerio.load(html);

      // now ask cheerio (which is $) to return all images
      $('img').each((i, elem) => {
        // every image has a number, consider only 0 - 9, skip the rest
        if (i >= 10) return;

        // for every image, read it's src attribute, i.e., the image file url and call previously defined 'saveImage'-function to download the image
        const imageUrl = $(elem).attr('src');
        saveImage(imageUrl);
      });
    }
  },
  // if anything fails in the request, this part is called
  (err) => console.log(err),
);
