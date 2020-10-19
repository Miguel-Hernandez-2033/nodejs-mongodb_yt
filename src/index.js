//Aca se llaman a los modulos que se instalaron en el proyecto para despues utilizarlos
const express = require('express');//Este es el framework de nodejs
const path = require('path');//Este sirve para ver el directorio en donde esta el proyecto como otras cosas mas, como juntar 2 directorios
const exphbs = require('express-handlebars');//Este es el motor de vistas para poder usar vistas dentro de vistas
const methodOverride = require('method-override');//Este se usa para poder sobreescribir los metodos de los forms (DELETE, PUT, etc)
const session = require('express-session');//Esto guarda las sessions del usuario que despues se utilizaran con "passport"
const flash = require('connect-flash')//Esto permite enviar mensajes al usuario en la pantalla al completar alguna accion
const passport = require('passport');//Esto permite autenticar al usuario a la hora de logearse, como tambien poder usar el metodo bcrypt para la contraseña
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');//npm i @handlebars/allow-prototype-access + const handlebars, se soluciona un problema de protocolo con esto
//no es necesario usa el .lean()
const handlebars = require('handlebars');//El motodo de busqueda en este caso se llama asi para complementar el protoype-access
const { use } = require('passport'); //Esto se agrego solo, si se usa despues se descomenta nomas. PD: lo descomente pero nose para que se usa aun xd.


//Initializations
const app = express(); //Esto inicia express y se guarda en una variable para poner ir usando sus metodos
require('./database'); //Esto llama al archivo que inicia la conexion a la base de datos
require('./config/passport');
//Settings 
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views')); //Configurar el directorio de las vistas
app.engine('.hbs', exphbs({
    defaultLayout: 'main', //Main plantilla
    layoutsDir: path.join(app.get('views'), 'layouts'), //Directorio donde estan las vistas de los modelos (user, note, etc...)
    partialsDir: path.join(app.get('views'), 'partials'), //Directorio donde estan las vistas parciales, por ejemplo; un form que se pueda reutilizar en otra vista
    extname: '.hbs', //Nombre de las extensiones de los archivos para en ves de poner "index.hbs", solo pner "hbs"
    handlebars: allowInsecurePrototypeAccess(handlebars) //Necesario para el tema de datos desde base de datos
}));
app.set('view engine', '.hbs') //El motor de vistar, en este caso es "express-handlebars"

//Middlewares
app.use(express.urlencoded({extended : false})); //No me acuerdo que hacia esto
app.use(methodOverride('_method')); //Sobreescribe metodos de los formulario, para usar los de PUT, DELETE, etc, que estos sirven para editar y eliminar
app.use(session({
    secret: 'mysecretapp', //Tampoco me acuerdo para que sirve todo esto, creo que era para guardar las sessiones de usuarios, 
    resave: true,           //y que no tengan que logearse denuevo al cambiar de pagina
    saveUninitialized: true 
}));
app.use(passport.initialize());//Inicia el modulo passport, para autenticar
app.use(passport.session());//Inicia el modulo session, por ende, debe estar en uso el app.use(session) antes que este
app.use(flash());//Inicia flash


//Global variables
app.use((req, res, next) => { //Guarda datos de manera global, como enviar mensajes al usuario de acciones que ocurriron (creacion de una nota, edicio, etc..)
    res.locals.success_msg = req.flash('success_msg'); 
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); //El metodo passport utiliza el nombre error para su variables 
    res.locals.user = req.user || null; //Mensaje de bienvenida al usuario pero en caso que no este auth, sera null
    next();
});



//Routes
app.use(require('./routes/index')); //Asi se cargan las rutas hacias las vistas
app.use(require('./routes/notes'));
app.use(require('./routes/users'));


//Static Files
app.use(express.static(path.join(__dirname, 'public'))); //Se define el directorio public donde estaran los css, js, para no tener que poner el _dir completo


//Server Listening
app.listen(app.get("port"), () => {
    console.log("Listening on port", app.get("port"));
  });