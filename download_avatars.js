var request = require("request");
var fs = require("fs");

console.log('Welcome to the GitHub Avatar Downloader!');

var GITHUB_USER = "bdhunter3141";
var GITHUB_TOKEN = "46755ed8b7655f1ac0e8e5e15608055e19f15fa4";

function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  var options = {
    uri: requestURL,
    headers: {
      'User-Agent': '"GitHub Avatar Downloader - Student Project"'
    }
  }
  request(options, function(err, response, body) {
    if (err) {
      cb(err);
      return;
    }
    return cb("None.", JSON.parse(body));
  });
}


function downloadImageByURL(url, filePath) {
  request.get(url)
    .on("error", function(err) {
      console.log("Error: ", err);
      return;
    })
    .on("response", function(resp) {
      console.log(`Response code is ${resp.statusCode} and response message is:`, resp.statusMessage);
      console.log("Beginning download..");
    })
    .pipe(fs.createWriteStream(filePath))
    .on("finish", function() {
      console.log("Download complete.");
    });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result: ");
  result.forEach(function(avatar) {
     downloadImageByURL(avatar.avatar_url, "./" + avatar.login + ".jpg");
  });
});













