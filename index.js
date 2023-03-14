require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs')
const schedule = require('node-schedule');
const PublicGoogleSheetsParser = require('public-google-sheets-parser')

const grupId = process.env.GROUP_ID || -1
let spreadsheetId = process.env.SPREADSHEET_ID || ""
const token = process.env.TELEGRAM_TOKEN || ""

const fotoFudida = fs.readFileSync('./orelhafudida.jpg')
const futoBoa = fs.readFileSync('orelhahoje.jpg')


const bot = new TelegramBot(token, { polling: true })

bot.onText(/\/orelha/, (msg) => {
    const chatId = msg.chat.id
    console.log(chatId)
    bot.sendPhoto(chatId, fotoFudida)
    bot.sendPhoto(chatId, futoBoa)
});


schedule.scheduleJob('0 0 5 * * *', async () => {
    try {
        const parser = new PublicGoogleSheetsParser(spreadsheetId)
        const sheet = await parser.parse()
        for (data of sheet) {
            var dd = data.Aniversario.slice(5, -1)
            dd = dd.split(",").reverse().map(x => parseInt(x))
            data.Aniversario = new Date(dd[2], dd[1], dd[0])
            if (data.Aniversario.getMonth() == new Date().getMonth() && data.Aniversario.getDate() == new Date().getDate()) {
                bot.sendMessage(grupId, data.Mensagem)
            }
        }

    } catch (error) {
        console.log(error)
    }
})






