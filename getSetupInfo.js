let snek = require('snekfetch');

console.log(`Searching for Hue Bridge...`);
snek.get("https://discovery.meethue.com").then(res1 => {
    if (res1.body[0] != null) {
        console.log(`Bridge found @ ${res1.body[0].internalipaddress}! Creating New User...`);
        snek.post(`http://${res1.body[0].internalipaddress}/api`).send(`{"devicetype":"iderp#nodeutils"}`).then(res2 => {
            if (res2.body[0] != null) {
                if (res2.body[0].success != null) {
                    console.log(`Success! Please copy the following into the config file:\n\nloginKey: ${res2.body[0].success.username}\nbridgeIP: ${res1.body[0].internalipaddress}`)
                } else {
                    console.log(`An error has occured!`)
                    console.log(`Error ${res2.body[0].error.type} | ${res2.body[0].error.description} | ${res2.body[0].error.address}`)
                }
            } else {
                console.log(`An unknown error occured!`)
            }
        }).catch(err => {
            console.log(`An error has occured!`)
            console.log(err)
        })
    } else {
        console.log("No bridges found! Please make sure the bridge is turned on and connected to the correct network.")
    }
})