import 'dotenv/config'
let config= {};

config.server= {
    port: process.env.PORT,
}

config.db = {
    cs: process.env.mongodb,
    name: process.env.dbname
}

config.secretKey = {
    key: process.env.secretKey
}

export default config;