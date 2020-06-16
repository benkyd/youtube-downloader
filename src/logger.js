const Config = require('./config')

const Moment = require('moment');
const fs = require('fs');

const dateFormat = 'DD-MM-YY HH:mm:ss'

module.exports.Log = (log) => 
{
    let d = Moment().format(dateFormat);
    log = '[' + d.toLocaleString() + '] ' + log;
    console.log(log);
    fs.appendFile(Config.Configuration.LogFile, log + '\n', (e) => { if (e) throw e; });
}
