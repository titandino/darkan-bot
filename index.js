'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();

const CLIENT_TOKEN = process.env.CLIENT_TOKEN || require('./config').CLIENT_TOKEN;

client.on('ready', () => console.log('Bot connected.'));

client.on('message', function(msg) {

});

client.login(CLIENT_TOKEN);
