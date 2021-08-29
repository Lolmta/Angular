const express = require('express');
const router = express.Router();
const User = require('../models/user')
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');


// router.get('/reg', (req, res) =>{
//     res.send('Регистрация...');
// });

router.post('/reg', (req, res) =>{
    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        login:req.body.login,
        password: req.body.password,
        age: req.body.age
    });

    User.addUser(newUser, (err, user) => {
        if(err)
            res.json({success:false, msg: 'Пользователь не был добавлен' });
        else
            res.json({success:true, msg: 'Пользователь был добавлен' });
    });
});


router.post('/auth', (req, res) =>{
    const login = req.body.login;
    const password = req.body.password;

    User.getUserByLogin(login, (err, user) => {
        if(err) throw err; 
        if(!user)
            return res.json({success:false, msg: 'Пользователь не найден'});
        User.comparePass(password, user.password, (err, isMatch) =>{
            if(err) throw err; 
            if(isMatch){
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 3600 * 24
                });

                res.json({
                    success: true,
                    token: 'JWT' + token,
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        login: user.login
                    }
                });


            } else
                return res.json({success:false, msg: 'Пароли не совпадают'});
        })
    });


});






router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res) =>{
    res.send('Кабинет пользователя...');
});

router.get('/games', passport.authenticate('jwt', {session:false}), (req, res) =>{
    res.send('Игры...');
});

router.get('/library', passport.authenticate('jwt', {session:false}), (req, res) =>{
    res.send('Библиотека...');
});

router.get('/friends', passport.authenticate('jwt', {session:false}), (req, res) =>{
    res.send('Друзья...');
});


module.exports = router;