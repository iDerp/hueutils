let snek = require('snekfetch');
const config = require(`./config.json`);
var sleep = require('sleep-promise');


console.log(`Checking Config...`);
if (config.loginKey != null && config.loginKey.length > 0 && config.bridgeIP != null && config.bridgeIP.length > 0) {
console.log("Finding Lights...")
snek.get(`http://${config.bridgeIP}/api/${config.loginKey}/lights`).then(res1 => {
            if (Object.keys(res1.body)[0] != null) {
                if (Object.keys(res1.body)[0] == "1") {
                    let lightsList = Object.keys(res1.body)
                    let rainbow = (hueNumb, satTemp, sat) => {
                        console.log(`Hue: ${hueNumb}`)
                        lightsList.forEach(light => {
                            snek.put(`http://${config.bridgeIP}/api/${config.loginKey}/lights/${light}/state`).send(`{"on":true, "transitiontime": 0, "bri": 254, "hue": ${hueNumb}, "sat": 254}`).then(() => {})
                        })
                        sleep(200).then(() => {
                            if (hueNumb > 65535) {
                                console.log(`End of hue reached! Going back to 0...`)
                                rainbow(0, 0, 0)
                            } else {
                                if (satTemp == 1) {
                                    rainbow(hueNumb + 300, 0, sat + 1)
                                } else {
                                    rainbow(hueNumb + 300, satTemp + 1, sat)
                                }
                            }
                        })
                    }
                    rainbow(0, 0, 0)
                } else {
                    console.log(`An error has occured!`)
                    console.log(`Error ${res1.body[0].error.type} | ${res1.body[0].error.description} | ${res1.body[0].error.address}`)
                }
            } else {
                console.log(`An unknown error occured!`)
            }
        }).catch(err => {
            console.log(`An error has occured!`)
            console.log(err)
        })
} else {
    console.log("Config Invalid! Please Run node getSetupInfo.js")
}