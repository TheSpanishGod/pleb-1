/**
 * Created by Will on 9/12/2016.
 */

let rp = require('request-promise-native');

function Imgur(client, msg, args)   {

    const arr = msg.attachments.array();
    if(arr.length > 0) {
        msg.channel.startTyping();

        const defaults = {
            baseUrl: 'https://api.imgur.com/',
            headers:    {
                Authorization: 'Client-Id ' + process.env.imgur
            },
            json: true
        };
        if(args[0]) {
            defaults.body = {
                title: args.join(' ')
            };
        }
        rp = rp.defaults(defaults);

        const ul = [];
        for(let i = 0; i < arr.length; i++) {
            ul.push(rp.post({
                uri: '/3/image',
                body: {
                    image: arr[i].url
                }
            }));
        }

        if(ul.length > 1)  {
            Promise.all(ul).then(function(imgs)  {
                const string = imgs.map(function(elem)  {
                    return elem.id;
                }).join(',');

                return rp.post({
                    uri: '/3/album',
                    body: {
                        ids: string
                    }
                });
            }).then(function(album) {
                msg.channel.stopTyping();
                msg.reply('https://imgur.com/a/' + album.data.id);
            }).catch(function(e)    {
                msg.channel.stopTyping();
                msg.reply(e);
            });
        }   else    {
            ul[0].then(function(img)    {
                msg.channel.stopTyping();
                msg.reply('https://imgur.com/' + img.data.id);
            }).catch(function(e)    {
                msg.channel.stopTyping();
                msg.reply(e);
            });
        }
    }   else    {
        msg.reply('i\'m not a miracle worker :wink:');
    }
}

module.exports = Imgur;