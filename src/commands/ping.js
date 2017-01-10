/**
 * Created by Will on 9/12/2016.
 */

const httpPing = require('node-http-ping');

exports.func = (msg, args) => {
    if(!args[0])    {
        return msg.channel.sendMessage('pinging....').then(newMessage => {
            newMessage.edit(`\`${newMessage.createdTimestamp - msg.createdTimestamp} ms\` round-trip ⏱ | \`${Math.round(msg.client.ping)} ms\` heartbeat 💓`);
        });
    }   else    {
        return httpPing(args[0]).then(function(time)    {
            return args[0] + ': ' + time + 'ms';
        }).catch(function(err)  {
            msg.reply('error pinging ' + args[0] + ': ' + err);
        });
    }
};