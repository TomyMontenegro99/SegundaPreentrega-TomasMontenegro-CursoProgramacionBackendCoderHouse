const express = require('express');
const ProductManager = require('./ProductManager.js'); 
const fs = require('fs').promises;

const app = express();
const productManager = new ProductManager('productos.json');

app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit;
    const productos = await productManager.obtenerProductos();

    if (limit) {
      const limitedProducts = productos.slice(0, parseInt(limit));
      return res.json(limitedProducts);
    }

    return res.json(productos);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const producto = await productManager.obtenerProductoPorId(productId);

    if (!producto) {
      return res.status(404).json({ error: 'El producto no existe' });
    }

    return res.json(producto);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

const PORT = 8080; 
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});
