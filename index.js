const fs = require('fs');
var https = require('https');

let picturesArray = []; //geht es wenn definiert hier?

// sagt dem Request, welche Web-Adresse abgefragt werden soll
var options = {
  host: 'memegen-link-examples-upleveled.netlify.app',
  path: '/',
};

var request = https.request(options, function (res) {
  var data = '';

  // 'data' liefert das nächste Datenpaket in 'chunk'
  res.on('data', function (chunk) {
    //there is a response
    data += chunk;
  });

  // 'end' sagt, dass der Datenstrom zu Ende ist
  //let picturesArray = []; geht es, wenn definiert hier?
  res.on('end', function () {
    let currentStart = 0;
    //let picturesArray = [];

    for (let counter = 0; counter < 10; counter++) {
      let startIndexImg = data.indexOf('img src="', currentStart) + 9;
      let endIndexImg = data.indexOf('"', startIndexImg);

      let imageData = data.slice(startIndexImg, endIndexImg);
      currentStart = endIndexImg;
      //console.log(imageData);
      picturesArray.push(imageData);
    }
    console.log(picturesArray);
  });
});

request.on('error', function (e) {
  console.log(e.message);
});
request.end();

const memesDir = './memes';
fs.mkdir(memesDir, (err) => {
  if (err) {
    throw err;
  }
  console.log('Directory is created');
});

/*
habe auch sowas gefunden:
var fs = require("fs");

var data = "New File Contents";

fs.writeFile("temp.txt", data, (err) => {
  if (err) console.log(err);
  console.log("Successfully Written to File.");
});
Run this code by executing node write.js in the terminal and then open up temp.txt in your editor, you should now see the new contents of the file.

so this works and the picture goes into the file

https.get(
  'https://api.memegen.link/images/keanu.jpg?width=300',
  function (res) {
    res.on('data', function (chunk) {
      console.log(chunk); //chunk is here numbers etc image-data
      fs.writeFile('./meme/img1.jpg', chunk, function () {
        console.log('created');
      });
    });
  },
);
*/
for (let i = 0; i < picturesArray.length; i++) {
  https.get(picturesArray[i], function (res) {
    res.on('data', function (chunk) {
      //console.log(chunk); //chunk is here numbers etc image-data
      fs.writeFile('./meme/img1.jpg', chunk, function () {
        console.log('created');
      });
    });
  });
}
