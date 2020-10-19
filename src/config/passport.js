const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.use(new LocalStrategy ({ //Se valida el usuario usando los metodos creados en su schema, y con el passport se puede retornar informacion con done()
    usernameField: 'email'
}, async (email, password, done) => {
    const user = await User.findOne({email: email});
    if(!user){
        return done(null, false, {message: 'Not user found'});  //Estructura done(error, user, mensaje)
    } else { 
        const match = await user.matchPassword(password);
        if(match){
            return done(null, user);
        } else {
            return done(null, false, {message: 'Incorrect password'})
        }
    }
}));


passport.serializeUser((user, done) => {//Toma un usuario y callback, con esto genera una id 
    done(null, user.id)
});

passport.deserializeUser((id, done)=>{//Busca una id y devuelve un usuario
    User.findById(id, (err, user) =>{
        done(err, user);
    });
});