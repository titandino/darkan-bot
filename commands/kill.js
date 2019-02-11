const htmlConvert = require('html-convert');
const fs = require('fs');
const request = require('request');
const isJSON = require('is-valid-json');
const webshot = require('webshot');

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
      let imgStream = webshot('localhost', {
        quality: 100,
        renderDelay: 5000,
        errorIfJSException: true,
        screenSize: {
          width: drop.length > 3 ? 400 : 300,
          height: drop.length > 4 ? 140 : 80
        },
        onLoadFinished: {
          fn: function() {
            if (this.drop[0]) {
              document.getElementById('d0').src = 'items/'+this.drop[0].id+'.png';
              document.getElementById('n0').textContent = this.drop[0].amount + '' + this.drop[0].name;
            }
            if (this.drop[1]) {
              document.getElementById('d1').src = 'items/'+this.drop[1].id+'.png';
              document.getElementById('n1').textContent = this.drop[1].amount + '' + this.drop[1].name;
            }
            if (this.drop[2]) {
              document.getElementById('d2').src = 'items/'+this.drop[2].id+'.png';
              document.getElementById('n2').textContent = this.drop[2].amount + '' + this.drop[2].name;
            }
            if (this.drop[3]) {
              document.getElementById('d3').src = 'items/'+this.drop[3].id+'.png';
              document.getElementById('n3').textContent = this.drop[3].amount + '' + this.drop[3].name;
            }
            if (this.drop[4]) {
              document.getElementById('d4').src = 'items/'+this.drop[4].id+'.png';
              document.getElementById('n4').textContent = this.drop[4].amount + '' + this.drop[4].name;
            }
            window.renderable = true;
          }, context: { drop: drop }
        }
      });
      imgStream.on('data', (data) => {
        if (data.length > 100)
          msg.channel.send('<@!' + msg.author.id + '> killed '+ npcData.name + '!', { file: { attachment: data, name: 'image.png' } });
      });
    });
  });
};
