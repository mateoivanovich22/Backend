import mongoose from 'mongoose';
import config from '../../config/config.js';

const Mongodb = config.db.cs;
const Dbname = config.db.name;

mongoose.connect(Mongodb, {
  dbName: Dbname,
});
/*
mongoose.connect("mongodb+srv://mateoivanovich43:mateo@cluster0.c6wntnx.mongodb.net/?retryWrites=true&w=majority", {
  dbName: "ecommerce",
});*/

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error to connect MongoDB:'));
db.once('open', () => {
  console.log('Connection succesfully to MongoDB');
});

export default db;