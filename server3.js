var https = require('https');
var http = require('http');

var twitter= require('ntwitter');
var keys = require('./twitterkeys');

var request = require('request');
var JSONStream = require('JSONStream');
var es = require('event-stream');
var parser = JSONStream.parse(['user', /./, 'screen_name']);
var logger = es.mapSync(function (data) {
      console.error(data)
      return data
    });

var twit = new twitter({
  consumer_key: keys.consumerKey,
	consumer_secret: keys.consumerSecret,
	access_token_key: keys.token,
	access_token_secret: keys.secret

});

twit.verifyCredentials (function (err, data) {
	if (err) {
		console.log("Error verifying credentials: " + err);
		process.exit(1);
	}
});



// Stream
twit.stream('statuses/filter', {track:'#yolo'}, function(stream) {
  stream.on('data', function (data) {
    console.dir("streaming: "+ JSON.stringify(data));
    var status_id = data.id_str;
    var user = data.user;
    var user_id = user.id;
    var user_screen_name = user.screen_name;
    reply(status_id, user_screen_name);

  });

  stream.on('end', function (response) {
  	console.dir("ended");
    // Handle a disconnection
  });

  stream.on('destroy', function (response) {
  	console.dir("destroyed");
    // Handle a 'silent' disconnection from Twitter, no end/error event fired
  });
});

 
function reply (status_id, user_screen_name) {
	twit.replyToStatus('@' + user_screen_name + ' You only live once - that's a given. Don't use YOLO as an excuse to be irrational. ', status_id, user_screen_name,
	function (err, data) {
		if (err) console.log('Tweeting failed: ' + err);
		else console.log('Success!');
	});
}

console.log('running');
