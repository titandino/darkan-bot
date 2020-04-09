const htmlConvert = require('html-convert');
const request = require('request');
const captureWebsite = require('capture-website');

let convert = htmlConvert({
  width: 300,
  height: 100
});

module.exports = function(client, msg, args) {
  let npcName = msg.content.substring(msg.content.indexOf(' ')+1);
  request('https://darkan.org/api/npc/'+npcName, (err, res, npcData) => {
    if (npcData.error)
      return msg.channel.send('Monster not found.');
    npcData = JSON.parse(npcData);
    request('https://darkan.org/api/npc/'+npcName+'/simdrop', (err, res, drop) => {
      if (npcData.error)
        return msg.channel.send('Error requesting simulated drop.');
      drop = JSON.parse(drop);
      for (var i = 0;i < drop.length;i++) {
        if (drop[i].amount == 1)
          drop[i].amount = '';
        else
          drop[i].amount = drop[i].amount + ' ';
      }
      captureWebsite.buffer('http://localhost', {
        renderDelay: 5000,
        width: drop.length > 3 ? 400 : 300,
        height: drop.length > 4 ? 140 : 80,
        beforeScreenshot: (page, browser) => {
          page.evaluate((drops) => {
            if (drops[0]) {
              document.getElementById('d0').src = 'items/'+drops[0].id+'.png';
              document.getElementById('n0').textContent = drops[0].amount + '' + drops[0].name;
            }
            if (drops[1]) {
              document.getElementById('d1').src = 'items/'+drops[1].id+'.png';
              document.getElementById('n1').textContent = drops[1].amount + '' + drops[1].name;
            }
            if (drops[2]) {
              document.getElementById('d2').src = 'items/'+drops[2].id+'.png';
              document.getElementById('n2').textContent = drops[2].amount + '' + drops[2].name;
            }
            if (drops[3]) {
              document.getElementById('d3').src = 'items/'+drops[3].id+'.png';
              document.getElementById('n3').textContent = drops[3].amount + '' + drops[3].name;
            }
            if (drops[4]) {
              document.getElementById('d4').src = 'items/'+drop[4].id+'.png';
              document.getElementById('n4').textContent = drops[4].amount + '' + drops[4].name;
            }
            window.renderable = true;
          }, drop);
        }
      }).then((data) => {
        if (data.length > 100)
          msg.channel.send('<@!' + msg.author.id + '> killed '+ npcData.name + '!', { file: { attachment: data, name: 'image.png' } });
      });
    });
  });
};
