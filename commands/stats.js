const http = require('http');
const asciiTable = require('ascii-table');

const SKILL_NAMES = ['Overall', 'Attack', 'Defence', 'Strength', 'Constitution', 'Ranged', 'Prayer', 'Magic', 'Cooking', 'Woodcutting', 'Fletching', 'Fishing', 'Firemaking', 'Crafting', 'Smithing', 'Mining', 'Herblore', 'Agility', 'Thieving', 'Slayer', 'Farming', 'Runecrafting', 'Hunter', 'Construction', 'Summoning', 'Dungeoneering', 'Divination', 'Invention'];

module.exports = function(client, msg, args) {
  let name = '';
  for (let i = 1;i < args.length;i++) {
    name += args[i] + ((i == args.length - 1) ? '' : ' ');
  }
  getStats(name).then((stats) => {
    msg.channel.send(formatStats(name, stats));
  }).catch((err) => msg.channel.send(err.message));
};

function formatStats(name, stats) {
  let table = new asciiTable();
  table.setTitle('VIEWING STATS FOR '+ name.toUpperCase());
  table.setHeading('Skill', 'Level', 'Experience', 'Rank');
  for (let i = 0;i < SKILL_NAMES.length;i++) {
    table.addRow(SKILL_NAMES[i], stats[i].level, Intl.NumberFormat('en-US').format(stats[i].xp), Intl.NumberFormat('en-US').format(stats[i].rank));
  }
  return '```' + table.toString() + '```';
}

function getStats(name) {
  return new Promise(function(resolve, reject) {
    http.get('http://services.runescape.com/m=hiscore/index_lite.ws?player=' + name, function(httpRes) {
      let body = '';

      httpRes.on('data', function(chunk) {
        body += chunk;
      });

      httpRes.on('end', function() {
        if (body.includes('DOCTYPE')) {
          reject(new Error('Player not found.'));
        } else {
          let statBlocks = body.split('\n');
          let stats = [];
          for (let i = 0;i < statBlocks.length;i++) {
            if (i >= SKILL_NAMES.length)
              break;
            let statRanks = statBlocks[i].split(',');
            stats[i] = {
              skillName: SKILL_NAMES[i],
              rank: parseInt(statRanks[0]),
              level: parseInt(statRanks[1]),
              xp: parseInt(statRanks[2])
            };
          }
          resolve(stats);
        }
      });
    }).on('error', function(e) {
      console.log(e);
      reject(new Error('Error retrieving player details.'));
    });
  });
}
