let snek = require('snekfetch');
const config = require(`./config.json`);
const { exec } = require('child_process');
var sleep = require('sleep-promise');

console.log(`Checking Config...`);
if (config.loginKey != null && config.loginKey.length > 0 && config.bridgeIP != null && config.bridgeIP.length > 0) {
console.log("Finding Lights...")
snek.get(`http://${config.bridgeIP}/api/${config.loginKey}/lights`).then(res1 => {
            if (Object.keys(res1.body)[0] != null) {
                if (Object.keys(res1.body)[0] == "1") {
                    let lightsList = Object.keys(res1.body)
                    let soundAlarm = () => {
                        console.log(`Sounding Alarm & Turning Lights On...`)
                        lightsList.forEach(light => {
                            snek.put(`http://${config.bridgeIP}/api/${config.loginKey}/lights/${light}/state`).send(`{"on":true, "transitiontime": 0, "bri": 254, "hue": 0, "sat": 254, "xy": [0.6915, 0.3083], "ct": 153}`).then(() => {})
                        })
                        exec('cmdmp3.exe dangerAlarm.mp3', (err, stdout, stderr) => {
                            if (err) {
                              console.error(err);
                              return;
                            }
                            lightsList.forEach(light => {
                                snek.put(`http://${config.bridgeIP}/api/${config.loginKey}/lights/${light}/state`).send(`{"on":false, "transitiontime": 0}`).then(() => {})
                            })
                            console.log(`Lights Off...`)
                            sleep(250).then(() => {
                                soundAlarm()
                            })
                          });
                    }
                    soundAlarm()
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