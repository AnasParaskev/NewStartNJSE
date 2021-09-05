const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { deleteOne } = require('../models/user');


router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Haran!');
            res.redirect('/');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    console.log(User.username)
    const redirectUrl = req.session.returnTo || '/home';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/home');
})



router.get('/edit', (req, res) => {
    res.render('users/edit')
});
router.get('/edit', (req, res) => {
    res.render('users/edit')
 });


 router.post('/edit', catchAsync(async (req, res, next) => {
      const user =  User.findById({ _id: req.user });
      user.setPassword(req.body.password, function(err) {
             user.save(function(err) {
                 req.login(user, function(err) {
                     done(err, user);
                 });
            });
       })
      
 }));

    
    
    

    
        




module.exports = router;