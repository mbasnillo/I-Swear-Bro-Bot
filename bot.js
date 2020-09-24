import { messages } from './messages.js';

const Discord = require('discord.js');
const dotenv = require('dotenv').config();

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  if (message.content.charAt(0) != '.') return;

  let sender = message.member;
  let textID = '';
  let voiceID = '';
  let text_channel = client.channels.cache.get(message.channel.id);

  switch (message.content) {
    case '.m':
      if (sender.voice.channel && sender.voice.channel.id) {
        textID = message.channel.id;
        voiceID = message.member.voice.channel.id;
        muteAll(textID, voiceID);
      } else {
        text_channel.send('You gotta be in a voice channel first, bro.');
      }
      break;
    case '.u':
      if (sender.voice.channel && sender.voice.channel.id) {
        textID = message.channel.id;
        voiceID = message.member.voice.channel.id;
        unmuteAll(textID, voiceID);
      } else {
        text_channel.send('You gotta be in a voice channel first, bro.');
      }
      break;
    case '.whoisit':
      if (sender.voice.channel && sender.voice.channel.id) {
        textID = message.channel.id;
        voiceID = message.member.voice.channel.id;
        whoIsIt(textID, voiceID);
      } else {
        text_channel.send('You gotta be in a voice channel first, bro.');
      }
      break;
    default:
      let name = message.content.substring(1);
      if (messages[name]) {
        sendRandomizedMessage(name, text_channel);
      } else {
        text_channel.send('Command not found. Try again bro');
      }
      break;
  }
});

const sendRandomizedMessage = (name, channel) => {
  // let name = content.substring(1);
  let message = messages[name][Math.floor(Math.random() * (messages[name].length - 1))];
  channel.send(message);
};

const muteAll = (textID, voiceID) => {
  let text_channel = client.channels.cache.get(textID);
  let voice_channel = client.channels.cache.get(voiceID);
  let members = voice_channel.members;

  for (let [, member] of members) {
    member.voice.setMute(true);
  }

  text_channel.send('Now muting everyone');
};

const unmuteAll = (textID, voiceID) => {
  let text_channel = client.channels.cache.get(textID);
  let voice_channel = client.channels.cache.get(voiceID);
  let members = voice_channel.members;

  for (let [, member] of members) {
    member.voice.setMute(false);
  }

  text_channel.send('Now unmuting everyone');
};

const whoIsIt = (textID, voiceID) => {
  let text_channel = client.channels.cache.get(textID);
  let voice_channel = client.channels.cache.get(voiceID);
  let members = voice_channel.members;

  let chosen = members.random();

  text_channel.send(`${chosen.user} is the impostor! I SWEAR BRO!`);
};

client.login(process.env.APP_TOKEN);
