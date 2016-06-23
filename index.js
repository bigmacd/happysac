var Botkit = require('botkit');
var https = require('https');

var firstMessage = [ 'Way to go ',
                     'Look at you ',
                     '3 cheers for ',
                     "You're no mama's boy ",
                     'Just like a chicken dinner ',
                     'Horray for ',
                     '#1 team playa ',
                     'Our inspiration '];

var secondMessage = ['sweet',
                     'winner',
                     'hero',
                     'superstar',
                     'manager material',
                     'better than an architect',
                     'code slaya'];


var controller = Botkit.slackbot();

controller.hears(["Narayan", "narayan", "nice", "Nice", "awesome","Awesome", "cool", "Cool", "neat", "Neat", "sweet", "Sweet", / ^.{0,}happysac.{0,}$/],["direct_message","direct_mention","mention","ambient"],function(bot,message) {
  // do something to respond to message
  // all of the fields available in a normal Slack message object are available
  // https://api.slack.com/events/message
    // extract the user ids
    if (/\b[n|N]arayan\b/.test(message.text)) {
        bot.reply(message, 'We love that guy!');
    }
    var userIds = extractUserIds(message);
    for (id in userIds) {
        answer(message, userIds[id]);
    }
});


var extractUserIds = function(message) {
    // first find the user mentioned
    var userIds = [];
    var text = message.text;
    var pos = 0;
    var pos2 = 0;
    while ((pos = text.indexOf('<@', pos)) != -1) {
        pos += 2;

        // find the ">"
        pos2 = text.indexOf(">", pos2);
        userIds.push(text.slice(pos, pos2));
        pos2 += 1;
    }
    return userIds;
}

var bot = controller.spawn({
  token: require('./config').token
});


bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});


function reply(message, answer) {
  bot.reply(message, answer);
}


function gotData(message, username) {
  userName = username;
  firstMessageIndex = Math.floor((Math.random() * firstMessage.length));
  secondMessageIndex = Math.floor((Math.random() * secondMessage.length));
  var answer = firstMessage[firstMessageIndex] + userName + "..." + secondMessage[secondMessageIndex];
  reply(message, answer)
}


function answer(message, userId) {

  headers = {
    'Content-Type':'application/json'
  };

  var options = {
    host: 'slack.com',
    path: '/api/users.info?user=' + userId + '&token=' + require('./config').token,
    method: 'GET',
    headers: headers
  };

  https.request(options, function(res) {
    //console.log('STATUS: ' + res.statusCode);
    //console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      //console.log('BODY: ' + chunk);
      //return chunk['user']['name'];
      var response = JSON.parse(chunk);
      gotData(message, response['user']['name']);
    });
  }).end();

}