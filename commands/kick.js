const Discord = require('discord.js');

module.exports = function(client, msg, args) {
  if (msg.channel instanceof Discord.TextChannel) {
    if (args[1]) {
      client.getMember(msg, args[1]).then(member => {
        if (member.kickable) {
          member.kick();
          msg.channel.send(member.nickname || member.user.username + ' has been kicked from the server by ' + msg.author);
        } else {
          msg.channel.send('I can\'t kick that user my dude.');
        }
      }).catch(() => msg.channel.send('User not found.'));
    } else {
      msg.channel.send('Must supply a username.');
    }
  }
};
