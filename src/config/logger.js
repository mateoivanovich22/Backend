import winston from 'winston';

const customLevelsOption = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5
    },
    colors: {
        fatal: 'red',
        error: 'green',
        warning: 'yellow',
        info: 'blue',
        debug: 'white',
        http: 'black',
    }
};

const log = winston.createLogger({
    levels: customLevelsOption.levels,
    format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOption.colors }),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOption.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: 'logs/development.log',
            level: 'debug',
            format: winston.format.simple()
        }),
        new winston.transports.File({
            filename: 'logs/errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    ]
});


export default log;
