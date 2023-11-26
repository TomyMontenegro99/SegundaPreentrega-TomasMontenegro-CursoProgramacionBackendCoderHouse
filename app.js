const express = require('express');
const ProductManager = require('./ProductManager.js');
const CartManager = require('./CartManager.js'); // Agrega la importación del CartManager
const app = express();

const rutaArchivoProductos = 'productos.json';
const rutaArchivoCarritos = 'carritos.json';
const productManager = new ProductManager(rutaArchivoProductos, rutaArchivoCarritos);
const cartManager = new CartManager(rutaArchivoCarritos); // Crea una instancia de CartManager

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

app.post('/carts', async (req, res) => {
  try {
    const newCart = await cartManager.crearCarrito(req.body);
    res.status(201).json({ message: 'Nuevo carrito creado', newCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/carts/:cid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.obtenerCarritoPorId(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'El carrito no existe' });
    }
    res.status(200).json(cart.products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/carts/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    const cart = await cartManager.obtenerCarritoPorId(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'El carrito no existe' });
    }

    const addedProduct = await cartManager.agregarProductoAlCarrito(cartId, productId);
    res.status(201).json({ message: 'Producto agregado al carrito exitosamente', addedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});
