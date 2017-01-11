module.exports = function(client, msg) {
  msg.channel.send('You rolled a ' + Math.ceil((Math.random() * 100)));
};
