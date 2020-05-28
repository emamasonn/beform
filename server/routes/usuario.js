const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const { verificaToken, verificaAdmin_Role } = require('../milddlewares/autentication');
const _ = require('underscore')
const Usuario = require('../models/usuario')

app.get('/usuario', verificaToken, function (req, res) {

    let desde = Number(req.query.desde) || 0
    let limite = Number(req.query.limite) || 5

    Usuario.find({estado: true}, 'nombre role email estado img' )
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios) => {
                if(err){
                    res.status(400).json({
                        ok: false,
                        err
                    })
                }
                Usuario.count({estado: true}, (err, conteo) => {
                    res.json({
                        ok: true,
                        usuarios,
                        cuanto: conteo
                    })
                })
                
            })
})
  
app.post('/usuario', [verificaToken, verificaAdmin_Role], function (req, res) {
    let body = req.body
    
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB)=>{
        if(err){
            res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })    
})
  
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function (req, res) {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'email', 'role', 'estado', 'img']) 

    Usuario.findByIdAndUpdate(id, body, {new: true}, (err, usuarioDB) => {
        if(err){
            res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})
  
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function (req, res) {
    let id = req.params.id
    Usuario.findByIdAndUpdate(id, {estado: false}, {new: true}, (err, usuarioBorrado) => {
        if(err){
            res.status(400).json({
                ok: false,
                err
            })
        }
        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            })
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
})
   
module.exports = app;