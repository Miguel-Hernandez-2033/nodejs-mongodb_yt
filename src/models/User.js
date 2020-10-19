const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

//Este es como el constructor del objeto
const UserSchema = new Schema({
    name: { type: String, require: true },
    email: { type: String, require: true},
    password: { type: String, require: true},
    date: { type: Date, default: Date.now }
});

UserSchema.methods.encryptPassword = async (password) => { //Metodo para poder encryptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

UserSchema.methods.matchPassword = async function (password){ //Metodo para poder desencryptar la contraseña, OJO se usa el "Function", 
    return await bcrypt.compare(password, this.password);    //ya que este permite usar la palabra reservada "this", para referirse a la 
};                                                           // password del modelo en si

module.exports = mongoose.model('User', UserSchema);