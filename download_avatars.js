let myArgv = process.argv[2];

var request = require('request');

var secret = require('./secrets');
var fs = require('fs');


console.log('Welcome to the GitHub Avatar Downloader!');
console.log("Downloading images......");

// function to download image for each contributor
function downloadImageByURL(url, filePath) {
  request.get(url)
  .on('error', function (err) {
    throw err;
  })
  .pipe(fs.createWriteStream(filePath));
}

//function to pass in Authorisation and parse JSON body
function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + secret.GITHUB_TOKEN
    }
  };
  request(options, function(err, res, body) {
    cb(err, JSON.parse(body));
  });
}


//call downloadImageURL function
if (!myArgv) {
  throw "Error: Argument must be entered!"
}

getRepoContributors(myArgv, myArgv, function(err, result) {
  if (err) throw err

  result.forEach(function(item) {
    console.log(item.avatar_url);
    downloadImageByURL(item.avatar_url, `./avatars/${item.login}.jpg`);
  });
  console.log("Downloading images complete!")
});

