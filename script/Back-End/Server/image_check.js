var request = require('request');

const path = require('path')

let fpath = "profile.png";

var request = require('request');
var options = {
  'method': 'POST',
  'url': 'https://eastus.api.cognitive.microsoft.com/contentmoderator/moderate/v1.0/ProcessImage/Evaluate',
  'headers': {
    'Ocp-Apim-Subscription-Key': '5cb93105c3b34cf0972df936167f0160',
    'Content-Type': 'image/png'
  },
  body: fs.createReadStream(fpath)

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

