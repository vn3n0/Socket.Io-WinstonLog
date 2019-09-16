const {createLogger, format, transports} = require('winston');

module.exports = createLogger({
    format: format.combine(format.simple()),
    transports: [
        new transports.File({
            maxsize: 5120000,//5MB Aprox
            maxFiles: 5,
            filename: `${__dirname}/../logs/log-api.log`
        }),
        new transports.Console({
            level: 'debug'
            //,format: format.combine(format.simple())
        })
    ]
})