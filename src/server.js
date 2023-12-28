const express = require('express');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const productRouter = require('./routes/products.router.js');
const cartRouter = require('./routes/carts.router.js');
const viewsRouter = require('./routes/views.router.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.engine('hbs', handlebars.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', __dirname + '/views');


mongoose
  .connect('mongodb://localhost:8080/productosDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Conexión exitosa a MongoDB');

   
    app.use('/api/products', productRouter);
    app.use('/api/carts', cartRouter);
    app.use('/views', viewsRouter);

    const PORT = 8080;
    app.listen(PORT, () => {
      console.log(`Servidor iniciado en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });
