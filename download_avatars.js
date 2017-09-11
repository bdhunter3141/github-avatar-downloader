var request = require("request");

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


getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result: ");
  result.forEach(function(avatar) {
    console.log("\t", avatar.avatar_url);
  });
});