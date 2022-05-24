const { Client } = require('discord.js-selfbot-v13');
const client = new Client();

// globals
const config = require('./config.json');
const TOKEN = config.TOKEN;
const message = config.MESSAGE;
const blacklist = config.BLACKLIST;
const messageDelay = config.TIMINGS.messages;

// validate globals
if (!TOKEN) {
    console.log(`[!] No token provided - exiting...`);
    process.exit(0);
}

if (!message) {
    console.log(`[!] No message provided - exiting...`);
    process.exit(0);
}

if (!messageDelay) {
    messageDelay = 2000;
}

console.log(`Delay set to ${messageDelay}ms`);

// start when discord.js-selfbot-v13 has intialized and logged into gateway
client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    // fetch relationships and open channels (dms & groups)
    let relationships = await fetchRelationships();
    let channels = await fetchDMList();

    // remove relationships that already have dm channels open or if recepient is in blacklist
    channels.forEach(channel => {
        for (var i = 0; i < relationships.length; i++)
            channel.recipients.forEach(recipient => {
                if (recipient.id === relationships.at(i).user.id || blacklist.includes(recipient.id))
                    relationships.splice(i, 1);
            });
    });

    // loop through every channel
    for (var i = 0; i < channels.length; i++) {
        // loop through each channel recipient and check if channel contains a blacklisted user
        let cont = false; // cont short for "continue" (represents if it should continue or not)
        channels.at(i).recipients.forEach(recipient => {
            if (blacklist.includes(recipient.id))
                cont = true;
        });

        if (!cont)
            ((index) => {
                // delay by (index * message delay)
                setTimeout(async () => {
                    var channel = await client.channels.fetch(channels.at(index).id);

                    // delay by 500ms because it was needed to fetch channel from api
                    setTimeout(() =>
                        channel.send(message)
                            .then(res => {
                                if (res.status !== 200) {
                                    console.log(`[!] ${channel.name} (${res.status})`);
                                    return true;
                                }
                            })
                            .then((e) => {
                                if (!e)
                                    console.log(`[+] ${channel.name}`);
                            })
                            .catch(e => console.log(`[!] ${channel.name} (${e})`))
                        , 500);
                }, index * messageDelay);
            })(i);
    }

    // loop through every relationship and create channel
    for (var i = 0; i < relationships.length; i++)
        ((index) => {
            setTimeout(async () => {
                // fetch user and create dm
                var user = await client.users.fetch(relationships.at(index).user.id);
                let dm = await user.createDM();

                // delay by (index * message delay)
                setTimeout(() => {
                    dm.send(message)
                        .then(res => {
                            if (res.status !== 200) {
                                console.log(`[!] ${user.tag} (${res.status})`);
                                return true;
                            }
                        })
                        .then((e) => {
                            if (!e)
                                console.log(`[+] ${user.tag}`);
                        })
                        .catch(e => console.log(`[!] ${user.tag} (${e})`));
                }, 500);
            }, (index + 1) * messageDelay);
        })(i);
});

const fetchDMList = async () => {
    let res = await fetch('https://discord.com/api/v10/users/@me/channels', {
        method: 'get',
        headers: {
            Authorization: TOKEN,
        },
    });

    let result = await res.json();
    return result;
}

const fetchRelationships = async () => {
    let res = await fetch('https://discord.com/api/v10/users/@me/relationships', {
        method: 'get',
        headers: {
            Authorization: TOKEN,
        },
    });

    let result = await res.json();
    return result;
}

client.login(TOKEN);