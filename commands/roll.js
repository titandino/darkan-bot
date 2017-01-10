module.exports = function(client, msg, args) {
  msg.channel.send('You rolled a ' + Math.ceil((Math.random() * 100)));
};
