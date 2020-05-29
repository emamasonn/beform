process.env.PORT = process.env.PORT || 3000


process.env.NODE_ENV = process.env.NODE_ENV || 'Dev'

process.env.CADUCIDAD_TOKEN = '48h'

process.env.SEED = process.env.SEED || 'secret-dev'

let urlDB;

if(process.env.NODE_ENV === 'Dev'){
    urlDB = 'mongodb://localhost:27017/caffe'
}else{
    urlDB = 'mongodb+srv://admin:lG0JSKKHa2923jaM@cluster0-xsw8o.mongodb.net/caffe'
}

process.env.URLDB = urlDB

