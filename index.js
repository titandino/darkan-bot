const Discord = require('discord.js');
const client = new Discord.Client();

const CLIENT_TOKEN = process.env.CLIENT_TOKEN || require('./config').CLIENT_TOKEN;
const COMMAND_PREFIX = '.';

client.on('ready', () => console.log('Bot connected as ' + client.user.username));

client.on('message', function(msg) {
  if (msg.content && msg.content.startsWith(COMMAND_PREFIX)) {
    let args = msg.content.split(' ');
    let command = args[0].replace(COMMAND_PREFIX, '');
    try {
      require('./commands/' + command)(client, msg, args);
    } catch(err) {
      msg.channel.send('Unknown command.');
    }
  }
});

client.getUser = function(userId) {
  return this.fetchUser(userId.replace(/\D/g, ''));
};

client.getMember = function(msg, userId) {
  return this.getUser(userId).then(user => msg.channel.guild.fetchMember(user));
};

client.login(CLIENT_TOKEN);
