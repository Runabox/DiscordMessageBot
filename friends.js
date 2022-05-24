const { Client } = require('discord.js-selfbot-v13');
const client = new Client();

// globals
const config = require('./config.json');
const TOKEN = config.TOKEN;
const relationshipRemoveDelay = config.TIMINGS.relationships;

// validate globals
if (!TOKEN) {
    console.log(`[!] No token provided - exiting...`);
    process.exit(0);
}

if (!relationshipRemoveDelay) {
    relationshipRemoveDelay = 1000;
}

console.log(`[*] Delay set to ${relationshipRemoveDelay}ms`);

// start when discord.js-selfbot-v13 has intialized and logged into gateway
client.on('ready', async () => {
    var relationships = await fetchRelationships();

    // remove a relationship every {relationshipRemoveDelay}ms
    for (var i = 0; i < relationships.length; i++) {
        ((index) => {
            setTimeout(async () => {
                let relationship = relationships.at(index);

                await client.relationships.deleteFriend(relationship.user.id)
                    .then(() => console.log(`[-] ${relationship.user.username}#${relationship.user.discriminator}`))
                    .catch(e => console.log(`[!] ${relationship.user.username}#${relationship.user.discriminator}`));
            }, index * relationshipRemoveDelay);
        })(i);
    }
});

// unsafe but likely to get your account disabled considering its one request
const fetchRelationships = async () => {
    let res = await fetch('https://discord.com/api/v10/users/@me/relationships', {
        method: 'get',
        headers: {
            Authorization: TOKEN,
        },
    });

    let result = await res.json();
    if (res.status !== 200) {
        console.log(`[!] ERROR FETCHING RELATIONSHIPS \n${result}`);
        return [];
    }

    return result;
}

client.login(TOKEN);