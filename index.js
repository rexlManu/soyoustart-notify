require('dotenv').config()
var chalk = require('chalk')
var axios = require('axios').default
var scheduler = require('node-schedule')
var SlimBot = require('slimbot')
var bot = new SlimBot(process.env.TELEGRAM_TOKEN)

var zoneRegion = 'fra'
var SOYOUSTART_URL = 'http://www.soyoustart.com/fr/js/dedicatedAvailability/availability-data.json'

bot.startPolling();

scheduler.scheduleJob('*/30 * * * *', () => {
    axios.get(SOYOUSTART_URL).then((response) => {
        response.data.availability.forEach(server => {
            if (server.reference.indexOf('game') != -1) {
                if (server.zones.filter(zone => zone.zone == zoneRegion && zone.availability != 'unavailable')[0]) {
                    bot.sendMessage(process.env.TELEGRAM_CHAT_ID, `⚙️ SoYouStart Notify\n\nNeuer Server ist in Frankreich verfügbar.\n💎Server: ${server.reference}💎`).then((message) => {
                        console.log(chalk.green('Telegram message sended.'))
                    }).catch(err => {
                        console.error(err)
                    })
                }
            }
        });
    }).catch(console.error)
})