const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

const {verificaTokenImg} = require('../milddlewares/autentication')

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo
    let img = req.params.img
    
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`)
    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen)
    }else{
        let noImagenPath = path.resolve(__dirname, '../assets/imgnofound.png')
        res.sendFile(noImagenPath)
    }    

    
})


module.exports = app;