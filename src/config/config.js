import 'dotenv/config'
let config= {};

config.server= {
    port: process.env.PORT || 8080,
    host: 'https://mateomarket.vercel.app',
    // host: 'http://localhost:8080',

}

config.db = {
    cs: process.env.mongodb,
    name: process.env.dbname
}

config.secretKey = {
    key: process.env.secretKey
}

config.stripe = {
    Secret_key: process.env.secret_key_stripe 
}

config.nodemailer= {
    key: process.env.nodemailerKey
}

export default config;