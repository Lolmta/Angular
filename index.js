const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const config = require('./config/db');
const { connected } = require('process');
const account = require('./routes/acc')
const key=process.env.PASS;


const app = express();


const port = 8080;

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use(cors());

////
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

////

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(config.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://Lolita:spssos17@cluster0.v6dyw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
            useNewUrlParser: true, useUnifiedTopology: true
        });
    
        app.listen(8080);
    } catch (err) {
        console.error(`Error on server startup: ${err.message}`);
    }
}

start();

mongoose.connection.on('connected', () =>{
    console.log('Успешное подключение к БД')
});

mongoose.connection.on('error', (err) =>{
    console.log('Нет подключения к БД' + err)
});

app.get('/', (req, res) =>{
    res.send('Главная...');
});

app.use('/acc', account)

app.listen(port, () => {
    console.log('Сервер запущен')
})

