/**
 * Created by Will on 12/17/2016.
 */

const storage = require('../util/storage/playlists');

exports.func = (res, msg, args) => {
    storage.get(msg.guild.id).volume = parseFloat(args[0]);
};

exports.triggers = [
    'vol',
    'volume'
];

exports.validator = (msg, args) => {
    const parsed = parseFloat(args[0]);
    return msg.guild && args.length > 0 && !isNaN(parsed) && Math.abs(parsed) <= 100 && storage.has(msg.guild.id);
};