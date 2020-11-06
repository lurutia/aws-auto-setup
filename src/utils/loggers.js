import 'dotenv-safe/config';
import winston, { format } from 'winston';
import winstonDaily from 'winston-daily-rotate-file'
import fs from 'fs';

const { printf, label, timestamp,combine } = format;
const tsFormat = () => (new Date()).toLocaleTimeString();
const logDir = 'log';

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// log level
/* error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 */
const myFormat = printf(({level, label, message, timestamp}) => {
    return `[${timestamp}][${level}]: ${message}`;
})

const logger = winston.createLogger({
    format: combine(
        timestamp(),
        label(),
        myFormat,
    ),
    transports: [
        new (winstonDaily)({
            filename: `./${logDir}/log_%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            colorize: false,
            maxSize: 5242880,
            maxFiles: 1000,
            level: 'debug',
            showLevel: true,
            json: false,
            timestamp: tsFormat,
            prepend: true,
        }),
        new (winston.transports.Console)({
            name: 'debug-console',
            colorize: true,
            level: 'info',
            showLevel: true,
            json: false,
            timestamp: tsFormat,
        }),
    ]
});

export default logger;