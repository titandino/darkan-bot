const Discord = require('discord.js');
const client = new Discord.Client();

const CLIENT_TOKEN = process.env.CLIENT_TOKEN || require('./config').CLIENT_TOKEN;
const COMMAND_PREFIX = '.';

client.on('ready', () => console.log('Bot connected as ' + client.user.username));

client.on('message', function(msg) {
  if (msg.content && msg.content.startsWith(COMMAND_PREFIX)) {
    if (!msg.getAuthorAsGM())
      return;
    let args = msg.content.split(' ');
    let command = args[0].replace(COMMAND_PREFIX, '');
    handleRoleRequiredCommand(null, command, msg, args);
    handleRoleRequiredCommand('Moderator', command, msg, args);
    handleRoleRequiredCommand('Administrator', command, msg, args);
    handleRoleRequiredCommand('Owner', command, msg, args);
  }
});

Discord.Message.prototype.getAuthorAsGM = function() {
  try {
    return this.channel.guild.fetchMember(this.author);
  } catch(err) {
    return null;
  }
};

function handleRoleRequiredCommand(roleName, command, msg, args) {
  if (roleName) {
    msg.getAuthorAsGM().then((member) => {
      if (member.roles.exists('name', roleName)) {
        require('./commands/' + roleName.toLowerCase() + '/' + command)(client, msg, args);
      }
    }).catch(() => { /*empty*/ });
  } else {
    try {
      require('./commands/' + command)(client, msg, args);
    } catch(err) {
      //empty
    }
  }
}

client.getUser = function(userId) {
  return this.fetchUser(userId.replace(/\D/g, ''));
};

client.getMember = function(msg, userId) {
  return this.getUser(userId).then(user => msg.channel.guild.fetchMember(user));
};

client.login(CLIENT_TOKEN);
