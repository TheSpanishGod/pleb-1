/**
 * Created by Will on 9/12/2016.
 */

let rp = require('request-promise-native').defaults({
    baseUrl: 'https://api.imgur.com/3',
    headers:    {
        Authorization: 'Client-Id ' + process.env.imgur
    },
    json: true
});
const numeral = require('numeral');


exports.func = (response, msg, args) => {
    if(msg.attachments.size !== 0) {
        const ul = [];
        for(const attachment of msg.attachments) {
            const q = {
                uri: '/image',
                body: {
                    image: attachment[1].url
                }
            };

            if(msg.attachments.size === 1 && args.length > 0)    {
                q.body.title = args.join(' ');
            }

            ul.push(rp.post(q));
        }

        return Promise.all(ul).then(imgs => {
            if(imgs.length > 1) {
                const q = {
                    uri: '/album',
                    body: {
                        ids: imgs.reduce((prev, cur) => `${prev},${cur.id}`, '')
                    }
                };

                if(args.length > 0) q.body.title = args.join(' ');
                return rp.post(q);
            }   else {
                return imgs[0];
            }
        }).then(res => {
            if(msg.deletable) msg.delete();
            return response.success(res.data.link);
        });

    }   else {

        return rp.get('gallery/hot/viral/0.json').then(res => {
            const rand = res.data.random();
            return response.success(`**${rand.title}** - ${rand.account_url}\n👁 ${numeral(rand.views).format('0,0')} - 🥅 ${numeral(rand.score).format('0,0')}\n${rand.link}`);
        });
    }
};