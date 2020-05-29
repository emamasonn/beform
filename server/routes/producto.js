const express = require('express')
const app = express()
const { verificaToken } = require('../milddlewares/autentication');
const Producto = require('../models/producto')

//===================================
//Muestra todas las productos
//===================================
app.get('/producto', verificaToken, (req, res)=> {
    let desde = Number(req.query.desde) || 0
    let limite = Number(req.query.limite) || 15

    Producto.find({disponible: true})
            .skip(desde)
            .limit(limite)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'nombre')
            .exec((err, producto) => {
                if(err){
                    res.status(500).json({
                        ok: false,
                        err
                    })
                }
                Producto.count({disponible: true}, (err, conteo) => {
                    res.json({
                        ok: true,
                        producto,
                        cuanto: conteo
                    })
                })
                
            })
        
})


//===================================
//Muestra un producto
//===================================
app.get('/producto/:id', verificaToken, (req, res)=> {
    let id = req.params.id
    Producto.findById(id)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'nombre')
            .exec((err, producto) => {
                if(err){
                    res.status(400).json({
                    ok: false,
                    err
                    })
                }

                if(!producto){
                    res.status(400).json({
                        ok: false,
                        err: {
                            message: 'No existe el producto'
                        }
                    })
                }
                res.json({
                    ok: true,
                    producto  
                })
            })
})
//===================================
//Buscar un producto
//===================================
app.get('/producto/buscar/:termino', verificaToken, (req, res)=>{
    
    let termino = req.params.termino
    let regex = new RegExp(termino, 'i')
    
    Producto.find({nombre: regex})
        .populate('categoria', 'nombre')
        .exec((err, producto)=>{
            if(err){
                res.status(400).json({
                ok: false,
                err
                })
            }
            res.json({
                ok: true,
                producto  
            })
        })
})


//===================================
//Crear un producto
//===================================
app.post('/producto', verificaToken, (req, res)=> {
    let body = req.body
    
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productoDB)=>{
        if(err){
            res.status(500).json({
                ok: false,
                err
            })
        }
        if(!productoDB){
            res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })   
})

//===================================
//Editar un producto
//===================================
app.put('/producto/:id', verificaToken, (req, res)=> {
    let usuarioId = req.usuario._id
    let id = req.params.id

    Producto.findByIdAndUpdate(id, req.body, {new: true, runValidators: true}, (err, productoDB) => {
        if(err){
            res.status(400).json({
                ok: false,
                err
            })
        }

        if(!productoDB){
            res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

//===================================
//Eliminar un producto
//===================================
app.delete('/producto/:id', verificaToken, (req, res)=> {
    
    let id = req.params.id
    Producto.findByIdAndUpdate(id, {disponible: false}, (err, productoDB) => {
        if(err){
            res.status(400).json({
                ok: false,
                err
            })
        }

        if(!productoDB){
            res.status(400).json({
                ok: false,
                err: {
                    message: "el id del producto no existe"
                }
            })
        }

        res.json({
            ok: true,
            message: "Producto borrado"
        })

    })

})


module.exports = app;