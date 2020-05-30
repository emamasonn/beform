const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const fs = require('fs')
const path = require('path')
app.use(fileUpload());


app.put('/upload/:tipo/:id', (req, res)=>{
    
    let tipo = req.params.tipo
    let id = req.params.id

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "El archivo no pudo ser cargado"
            }
        });
    }

    let tipoValido = ['usuario', 'producto']
    if(tipoValido.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El tipo no es valido'
            }
        })
    }
       
    let archivo = req.files.archivo;

    let extensionesValidas = ['jpg', 'png', 'gif', 'jpeg']
    let nombreArchivo = archivo.name.split('.')
    let extension = nombreArchivo[nombreArchivo.length - 1]

    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'La extension no es valida'
            }
        })
    }

    let nombreFinal = `${id}-${new Date().getMilliseconds()}.${extension}`

    archivo.mv(`uploads/${tipo}/${nombreFinal}`, (err) => {
        if (err)
          return res.status(500).json({
                ok: false,
                err
          });

        if(tipo === 'usuario'){
            imagenUsuario(id, res, nombreFinal)
        }else{
            imagenProducto(id, res, nombreFinal)
        }  
        
    });
});

function imagenUsuario(id, res, nombreFinal){
    Usuario.findById(id, (err, usuarioDB)=>{
        if (err){
            borrarImagen(nombreFinal, 'usuario')
          return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB){
            borrarImagen(nombreFinal, 'usuario')
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        borrarImagen(usuarioDB.img, 'usuario')

        usuarioDB.img = nombreFinal

        usuarioDB.save((err, usuarioGuardado)=>{
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreFinal
            })
        })
    })
}

function imagenProducto(id, res, nombreFinal){
    Producto.findById(id, (err, productoDB)=>{
        if (err){
            borrarImagen(nombreFinal, 'producto')
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            borrarImagen(nombreFinal, 'producto')
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Producto no encontrado'
                }
            })
        }

        borrarImagen(productoDB.img, 'producto')

        productoDB.img = nombreFinal

        productoDB.save((err, productoGuardado)=>{
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreFinal
            })
        })
    })
}


function borrarImagen(nombreImagen, tipo){
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen)
    }
}
module.exports = app;