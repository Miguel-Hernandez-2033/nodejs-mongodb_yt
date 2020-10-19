const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');
//Pantalla inicial de usuario
router.get('/users/', (req, res) =>{
    res.send('Users start');
});

//Formulariode login del usuario
router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

//Metodo de autenticacion del usuario
router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes', //Logeo correcto
    failureRedirect: '/users/signin', //Logeo fallido
    failureFlash: true //Permite el poder enviar mensaje flash
}));

//Formulario de registro del usuario
router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    if(!name || !email || !password || !confirm_password){
        errors.push({text: 'Please complete all fields'})
    }

    if (password != confirm_password) {
        errors.push({ text: 'Password do not match' });
    }

    if (password.length < 4) {
        errors.push({ text: 'Passsword must be at least 4 characteres' });
    }

    if (errors.length > 0) {
        res.render('users/signup', {
            errors,
            name,
            email,
            password,
            confirm_password
        });

    }else{
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('error_msg', 'The email is already in use');
            res.redirect('/users/signup');
        }
        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'You are registered now')
        res.redirect('/users/signin');
    }

});


router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});



module.exports = router;