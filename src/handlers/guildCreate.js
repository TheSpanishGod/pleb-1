/**
 * Created by Will on 12/6/2016.
 */

function guildCreate(guild) {
    guild.defaultChannel.sendMessage('Sup.  Try `@Pleb help`.').catch(() => null);
    guild.client.provider.initializeGuild(guild);
}

module.exports = guildCreate;