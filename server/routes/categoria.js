const express = require('express')
const app = express()
const { verificaToken, verificaAdmin_Role } = require('../milddlewares/autentication');
const Categoria = require('../models/categoria')

//===================================
//Muestra todas las categorias
//===================================
app.get('/categoria', verificaToken, (req, res)=> {
    Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {
        if(err){
            res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categorias,
            })
        })
        
})


//===================================
//Muestra una categoria
//===================================
app.get('/categoria/:id', verificaToken, (req, res)=> {
    let id = req.params.id
    Categoria.findById(id, (err, categoria) => {
        if(err){
            res.status(400).json({
                ok: false,
                err
            })
        }

        if(!categoria){
            res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe la categoria'
                }
            })
        }
        res.json({
          ok: true,
          categoria  
        })
    })
})

//===================================
//Crear una categoria
//===================================
app.post('/categoria', verificaToken, (req, res)=> {
    let id = req.usuario._id
    let body = req.body
    
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: id
    })

    categoria.save((err, categoriaDB)=>{
        if(err){
            res.status(500).json({
                ok: false,
                err
            })
        }
        if(!categoriaDB){
            res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })   
})

//===================================
//Editar una categoria
//===================================
app.put('/categoria/:id', verificaToken, (req, res)=> {
    let usuarioId = req.usuario._id
    let id = req.params.id
    let descripcionCategoria = {
        descripcion: req.body.descripcion
    } 

    Categoria.findByIdAndUpdate(id, descripcionCategoria, {new: true, runValidators: true}, (err, categoriaDB) => {
        if(err){
            res.status(400).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB){
            res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: categoriaDB
        })
    })
})

//===================================
//Eliminar una categoria
//===================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res)=> {
    
    let id = req.params.id
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if(err){
            res.status(400).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB){
            res.status(400).json({
                ok: false,
                err: {
                    message: "el id no existe"
                }
            })
        }

        res.json({
            ok: true,
            message: "Categoria Borrada"
        })

    })

})


module.exports = app;