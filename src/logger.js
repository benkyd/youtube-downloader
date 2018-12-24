const moment = require('moment');
const dateFormat = 'DD-MM-YY HH:mm:ss'

module.exports.log = function(log) {
    let d = moment().format(dateFormat);
    console.log('[' + d.toLocaleString() + '] ' + log);
}
