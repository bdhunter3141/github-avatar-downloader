// Requirements
var request = require("request");
var fs = require("fs");
require('dotenv').config();

// User input for Repo owner and Repo Name
var repoOwner = process.argv[2];
var repoName = process.argv[3];

// Initial welcome message
console.log('Welcome to the GitHub Avatar Downloader!');

// Authentication information
var GITHUB_USER = process.env.GITHUB_USER;
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Function creates the request URL and uses it in the options variable.
// Function then uses the options variable to make a get request, returning a callback
function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  var options = {
    uri: requestURL,
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
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

// Function returns an error message, or downloads to a filepath from a url
function downloadImageByURL(url, filePath) {
  request.get(url)
    .on("error", function(err) {
      console.log("Error: ", err);
      return;
    })
    .pipe(fs.createWriteStream(filePath));
}

// Calling the getRepoContributors function using the user inputs and a callback
getRepoContributors(repoOwner, repoName, function(err, result) {
  // Provides error message if repoOwner or repoName is missing from user input
  if (!repoOwner || ! repoName) {
    console.log("Please enter a valid GitHub Repo owner, followed by a valid GitHub Repo name.");
    return;
  }
  // If there is no error, it will create an avatars directory, and download images to it, using downloadImageBy URL function
  if(result) {
    console.log("Beginning download..");
    fs.mkdir("./avatars/");
    result.forEach(function(avatar) {
      // Uses username as file name for image
      downloadImageByURL(avatar.avatar_url, "./avatars/" + avatar.login + ".jpg");
    });
    console.log("Download complete.");
  // Displays errors if there are any
  } else {
    console.log("Errors:", err);
  }
});
