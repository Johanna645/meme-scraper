const fs = require('fs');
var https = require('https');

// sagt dem Request, welche Web-Adresse abgefragt werden soll
var options = {
  host: 'memegen-link-examples-upleveled.netlify.app',
  path: '/',
};

var request = https.request(options, function (res) {
  var data = '';

  // 'data' liefert das nächste Datenpaket in 'chunk'
  res.on('data', function (chunk) {
    data += chunk;
  });

  // 'end' sagt, dass der Datenstrom zu Ende ist
  res.on('end', function () {
    let currentStart = 0;
    for (let counter = 0; counter < 10; counter++) {
      let startIndexImg = data.indexOf('img src="', currentStart) + 9;
      let endIndexImg = data.indexOf('"', startIndexImg);

      console.log(data.slice(startIndexImg, endIndexImg));
      currentStart = endIndexImg;
    }
  });
});
request.on('error', function (e) {
  console.log(e.message);
});
request.end();
