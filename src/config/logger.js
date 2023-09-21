
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

const vercelTransport = new winston.transports.Console({
    level: 'info', 
    format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOption.colors }),
        winston.format.simple()
    )
});

const log = winston.createLogger({
    levels: customLevelsOption.levels,
    format: winston.format.combine(
        winston.format.colorize({ colors: customLevelsOption.colors }),
        winston.format.simple()
    ),
    transports: [
        vercelTransport,
    ]
});

export default log;

