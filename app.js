const express = require('express');
const ProductManager = require('./ProductManager.js');
const app = express();

const rutaArchivoProductos = 'productos.json';
const rutaArchivoCarritos = 'carritos.json';
const productManager = new ProductManager(rutaArchivoProductos, rutaArchivoCarritos);

app.use(express.json());

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

app.post('/products', async (req, res) => {
  try {
    const nuevoProducto = req.body; 
    await productManager.agregarProducto(nuevoProducto); // Agregar el producto al archivo
    
    return res.status(201).json({ message: 'Producto agregado exitosamente', nuevoProducto });
  } catch (error) {
    return res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

app.put('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;

    const existingProduct = await productManager.obtenerProductoPorId(productId);

    if (!existingProduct) {
      return res.status(404).json({ error: 'El producto no existe' });
    }

    // Evitar actualizar el ID si se proporciona en el cuerpo de la solicitud
    delete updatedFields.id;

    const updatedProduct = { ...existingProduct, ...updatedFields };

    await productManager.actualizarProducto(productId, updatedProduct);

    return res.status(200).json({ message: 'Producto actualizado exitosamente', updatedProduct });
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

app.delete('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);

    const existingProduct = await productManager.obtenerProductoPorId(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: 'El producto no existe' });
    }

    await productManager.eliminarProducto(productId);

    return res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});


const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});
