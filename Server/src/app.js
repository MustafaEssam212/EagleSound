const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');

const app = express();
const v1 = require('../routes/v1')
const passport = require('passport')


//--------- DB Config --------//

mongoose.connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 

mongoose.connection.on('connected', ()=>{
    console.log('Connect to database')
});

mongoose.connection.on('error', (err)=>{
    console.log('Failed to connect to database')
})



// -------- Middlewares -------- //
app.use(cors())
app.use(logger('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('../config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());



// -------- Routes -------- //
app.use('/api/v1', v1)

module.exports = app;