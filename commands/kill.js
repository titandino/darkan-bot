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
  request('http://localhost:5556/api/npc/'+npcName, (err, res, npcData) => {
    if (!isJSON(npcData))
      return msg.channel.send('Monster not found.');
    npcData = JSON.parse(npcData);
    request('http://localhost:5556/api/npc/'+npcName+'/simdrop', (err, res, drop) => {
      drop = JSON.parse(drop);
      console.log(drop);
      let imgStream = webshot('http://localhost', {
        quality: 100,
        errorIfJSException: true,
        renderDelay: 5000,
        screenSize: {
          width: 300,
          height: 100
        },
        onLoadFinished: {
          fn: function() {
            for (let i = 0;i < this.drop.length;i++) {
              document.getElementById(''+i).src = '/items/'+this.drop[i].id+'.png';
            }
          }, context: { drop: drop }
        }
      });
      imgStream.on('data', data => {
        msg.channel.send('You killed '+ npcData.name + '!', { file: { attachment: data, name: 'image.png' } });
      });
    });
  });
};
