// Requirements
var request = require("request");
var fs = require("fs");
require('dotenv').config();

// User input for Repo owner and Repo Name
var repoOwner = process.argv[2];
var repoName = process.argv[3];

// Initial welcome message
console.log('Welcome to the GitHub Avatar Downloader!');

// Authentication information and check for .env information
var GITHUB_USER = process.env.GITHUB_USER;
if (!GITHUB_USER) {
  console.log("Please check your dotenv file for a valid GitHub username.");
}
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  console.log("Please check your dotenv file for a valid GitHub token.");
}

// Function creates the request URL and uses it in the options variable.
// Function then uses the options variable to make a get request, returning a callback
function getRepoContributors(repoOwner, repoName, cb) {
  // A check for more than 2 user inputs
  if(process.argv[4]) {
    console.log("Please only provide 2 inputs. (A GitHub Owner and GitHub Repo name.)");
    return;
  }
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
    return cb(null, JSON.parse(body));
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
  if (!repoOwner || !repoName) {
    console.log("Please enter a valid GitHub Repo owner, followed by a valid GitHub Repo name.");
    return;
  }
  // If there is no error, it will create an avatars directory, and download images to it, using downloadImageBy URL function
  if(result) {
    if (!result[0]) {
      console.log("Error: Could not download. Check that you have the correct GitHub owner and Repo.");
      return;
    }
    console.log("Beginning download..");
    // Handling if directory for avatars already exists
    fs.mkdir("./avatars/", function(err) {
      if (err && err.code === 'EEXIST') {
        console.log("The directory already exists. Files may have been overwritten.");
        return;
      } else if (err) {
        console.log("Error: ", err);
        return;
      }
    });
    result.forEach(function(avatar) {
      // Uses username as file name for image
      downloadImageByURL(avatar.avatar_url, "./avatars/" + avatar.login + ".jpg");
    });
    console.log("Download complete.");
  // Displays errors if there are any
  } else {
    console.log("Errors: ", err);
  }
});
