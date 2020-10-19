const { models } = require('mongoose');
const { route } = require('.');

const router = require('express').Router();
const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');

//IMPORTANTE: A la hora de obtener datos de la basededatos poner el ".lean()",
//por temas de seguridad no deja enviar de otra forma. (lean() convierte los datos a formato json,
//los cuales puede leer mongodb)

//Mostrar formulario de crear las notas
router.get('/notes/add', isAuthenticated, (req, res) =>{
    res.render('notes/new-note');
});


//Verificar informacion del formulario de crear notas y enviarlas a la base de datos
router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    const {title, description } = req.body;
    const errors = [];

    //Validadores de inputs
    if(!title){
        errors.push({
            text: 'Please write a title '
        });
    }
    if(!description){
        errors.push({
            text: 'Please write a description'
        });
    }

    //Validador de errores
    if(errors.length > 0){
        res.render('notes/new-note', {
            errors,
            title,
            description
        })
    }else{
        const newNote = new Note({ title, description});
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Note added successfully'); //Se crea el mensaje para mostrar al usuario con el modulo flash
        res.redirect('/notes');
    }
    
});

//Ver todas las notas del usuario
router.get('/notes', isAuthenticated,  async (req, res) =>{
    const notes = await Note.find({ user: req.user.id }).sort({ date: 'desc'}).lean();
    res.render('notes/all-notes', { notes });
});

//Mostrar formulario de editar las notas
router.get('/notes/edit/:id', isAuthenticated,async (req, res) => {
    const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-note', { note });
});

//Editar la informacion recivida desde el formulario de editar, se usa el metodo PUT
router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) =>{
    const { title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description });
    req.flash('success_msg', 'Note updated successfully');
    res.redirect('/notes');
});

//Eliminar notes, se usa el metodo DELETE
router.delete('/notes/delete/:id', isAuthenticated, async (req, res) =>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note deleted successfully');
    res.redirect('/notes');
});

module.exports = router;