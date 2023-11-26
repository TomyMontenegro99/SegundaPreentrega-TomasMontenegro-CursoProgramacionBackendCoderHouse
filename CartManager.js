const fs = require('fs').promises;

class CartManager {
  constructor(rutaArchivoCarritos) {
    this.path = rutaArchivoCarritos;
  }

  async obtenerCarritoPorId(id) {
    try {
      const datos = await fs.readFile(this.path, 'utf-8');
      const carritos = JSON.parse(datos);
      const carrito = carritos.find((cart) => cart.id === id);
      return carrito || null;
    } catch (error) {
      throw new Error('Error al obtener el carrito');
    }
  }

  async crearCarrito(nuevoCarrito) {
    try {
      let carritos = [];
      const datos = await fs.readFile(this.path, 'utf-8');
      
      if (datos) {
        carritos = JSON.parse(datos);
      }
  
      const id = Math.floor(Math.random() * 1000);
      const carrito = { id, ...nuevoCarrito, products: [] };
      carritos.push(carrito);
  
      await fs.writeFile(this.path, JSON.stringify(carritos, null, 2), 'utf-8');
      return carrito;
    } catch (error) {
      throw new Error('Error al crear el carrito');
    }
  }

  async agregarProductoAlCarrito(carritoId, productId) {
    try {
      const datos = await fs.readFile(this.path, 'utf-8');
      const carritos = JSON.parse(datos);
      const index = carritos.findIndex((cart) => cart.id === carritoId);

      if (index !== -1) {
        const carrito = carritos[index];
        const productIndex = carrito.products.findIndex((product) => product.id === productId);

        if (productIndex !== -1) {
    
          carrito.products[productIndex].quantity += 1;
        } else {
         
          carrito.products.push({ id: productId, quantity: 1 });
        }

      
        carritos[index] = carrito;
        await fs.writeFile(this.path, JSON.stringify(carritos, null, 2), 'utf-8');
        return carrito;
      } else {
        throw new Error('Carrito no encontrado');
      }
    } catch (error) {
      throw new Error('Error al agregar producto al carrito');
    }
  }
}

module.exports = CartManager;
