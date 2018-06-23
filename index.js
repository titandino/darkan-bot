const Discord = require('discord.js');
const client = new Discord.Client();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const moment = require('moment');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

const CLIENT_TOKEN = process.env.CLIENT_TOKEN || require('./config').CLIENT_TOKEN;
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK || require('./config').DISCORD_WEBHOOK;
const COMMAND_PREFIX = '.';

client.on('ready', () => {
  client.user.setActivity('Darkan - 2012 Remake');
  console.log('Bot connected as ' + client.user.username);
});

client.on('message', function(msg) {
  if (msg.content && msg.content.startsWith(COMMAND_PREFIX)) {
    let args = msg.content.split(' ');
    let command = args[0].replace(COMMAND_PREFIX, '');
    handleRoleRequiredCommand(null, command, msg, args);
    handleRoleRequiredCommand('Moderator', command, msg, args);
    handleRoleRequiredCommand('Administrator', command, msg, args);
    handleRoleRequiredCommand('Owner', command, msg, args);
  }
});

function handleRoleRequiredCommand(roleName, command, msg, args) {
  if (roleName) {
    client.getMember(msg, msg.author.id).then((member) => {
      if (member.roles.exists('name', roleName)) {
        require('./commands/' + roleName.toLowerCase() + '/' + command)(client, msg, args);
      }
    }).catch(() => { /*empty*/ });
  } else {
    try {
      require('./commands/' + command)(client, msg, args);
    } catch(err) {
      console.log(err);
      msg.channel.send('Unknown command.');
    }
  }
}

client.getUser = function(userId) {
  return this.fetchUser(userId.replace(/\D/g, ''));
};

client.getMember = function(msg, userId) {
  return this.getUser(userId).then(user => msg.channel.guild.fetchMember(user));
};

app.post('/bitbucket/webhook', (req, res) => {
  let changes = req.body.push.changes;
  if (changes) {
    changes.forEach(change => {
      change.commits.forEach(commit => {
        if (!commit.message.startsWith('Merge')) {
          request.post(DISCORD_WEBHOOK, {
            form: {
              username: 'Trent',
              content: moment(commit.date).format("MMMM Do YYYY, h:mma") + ' - ' + commit.message,
              avatar_url: 'https://bitbucket.org/account/titandino/avatar/256/'
            }
          }, function (err, res, body) { });
        }
      });
    });
  }
});


client.login(CLIENT_TOKEN);
const server = app.listen(80, function() {
  console.log('Local server listening at http://' + server.address().address + ':' + server.address().port);
});
