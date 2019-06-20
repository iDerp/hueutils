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
                    let strobeTime = 500;
                    if (config.msStrobeFlash != null) {
                        strobeTime = config.msStrobeFlash;
                        console.log(`Setting strobe flash to ${strobeTime}ms`)
                    } else {
                        console.log(`No strobe flash time set! Running at default (500ms)`)
                    }
                    let strobingTime = (onOff) => {
                        if (onOff == true) {
                            console.log(`Strobing lights on...`)
                        } else {
                            console.log(`Strobing lights off...`)
                        }
                        lightsList.forEach(light => {
                            snek.put(`http://${config.bridgeIP}/api/${config.loginKey}/lights/${light}/state`).send(`{"on":${onOff}, "transitiontime": 0, "bri": 254, "hue": 0, "sat": 0}`).then(() => {})
                        })
                        sleep(strobeTime).then(() => {
                            if (onOff == true) {
                                strobingTime(false)
                            } else {
                                strobingTime(true)
                            }
                        })
                    }
                    strobingTime(false)
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