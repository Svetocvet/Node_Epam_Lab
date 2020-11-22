require('dotenv').config();
const config = {};
config.db = {};

config.db.name = process.env.DBNAME || 'hw3';
config.db.host = process.env.DBHOST || 'localhost';
config.db.port = process.env.DBPORT || 27017;
config.db.url = process.env.DBURL || `mongodb+srv://user:user@cluster0.ojc8f.mongodb.net/hw3?retryWrites=true&w=majority`;
config.port = process.env.PORT || 8080;
config.secret = process.env.SECRET || 'someverysecretsecret';
config.salt = process.env.SALT || 3;
config.mailUser = process.env.MAILUSR || 'mytodomail@gmail.com';
config.mailPass = process.env.MAILPSWD || 'wertyQ123';

module.exports = config;
