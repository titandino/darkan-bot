module.exports = function(client, msg, args) {
  if (args.length <= 1) {
    msg.channel.send('Must supply a status.');
    return;
  }
  let status = '';
  for (let i = 1;i < args.length;i++) {
    status += args[i] + ' ';
  }
  client.user.setGame(status);
  msg.channel.send('Set playing status to "' + status + '"');
};
