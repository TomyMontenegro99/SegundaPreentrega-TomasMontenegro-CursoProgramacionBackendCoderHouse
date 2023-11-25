const fs = require('fs');

class ProductManager {
  constructor(rutaArchivoProductos, rutaArchivoCarritos) {
    this.pathProductos = rutaArchivoProductos;
    this.pathCarritos = rutaArchivoCarritos;
  }

  // Métodos para productos
  agregarProducto(producto) {
    const productos = this.obtenerProductos();
    producto.id = this.generarIdUnico(productos);
    productos.push(producto);
    this.guardarProductos(productos);
  }

  obtenerProductos() {
    try {
      const datos = fs.readFileSync(this.pathProductos, 'utf-8');
      return JSON.parse(datos);
    } catch (error) {
      return [];
    }
  }

  obtenerProductoPorId(id) {
    const productos = this.obtenerProductos();
    const producto = productos.find((p) => p.id === id);
    return producto || null;
  }

  actualizarProducto(id, productoActualizado) {
    const productos = this.obtenerProductos();
    const indice = productos.findIndex((p) => p.id === id);
  
    if (indice !== -1) {
      productos[indice] = { ...productos[indice], ...productoActualizado };
      this.guardarProductos(productos); // Guardar los productos actualizados
    }
  }

  eliminarProducto(id) {
    let productos = this.obtenerProductos();
    productos = productos.filter((p) => p.id !== id);
    this.guardarProductos(productos);
  }

  generarIdUnico(productos) {
    return productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1;
  }

  guardarProductos(productos) {
    try {
      fs.writeFileSync(this.pathProductos, JSON.stringify(productos, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error al guardar los productos:', error);
    }
  }
  
  

  // Métodos para carritos
  crearCarrito() {
    const carrito = {
      id: this.generarIdUnicoCarrito(),
      products: []
    };
    this.guardarCarrito(carrito);
    return carrito;
  }

  agregarProductoAlCarrito(carritoId, productId) {
    const carrito = this.obtenerCarritoPorId(carritoId);
    if (!carrito) return false;

    carrito.products.push(productId);
    this.guardarCarrito(carrito);
    return true;
  }

  obtenerProductosDelCarrito(carritoId) {
    const carrito = this.obtenerCarritoPorId(carritoId);
    if (!carrito) return [];

    const productos = [];
    for (const productId of carrito.products) {
      const producto = this.obtenerProductoPorId(productId);
      if (producto) {
        productos.push(producto);
      }
    }
    return productos;
  }

  obtenerCarritoPorId(carritoId) {
    try {
      const datos = fs.readFileSync(this.pathCarritos, 'utf-8');
      const carritos = JSON.parse(datos);
      return carritos.find((c) => c.id === carritoId);
    } catch (error) {
      return null;
    }
  }

  guardarCarrito(carrito) {
    try {
      const datos = fs.readFileSync(this.pathCarritos, 'utf-8');
      const carritos = JSON.parse(datos);
      carritos.push(carrito);
      fs.writeFileSync(this.pathCarritos, JSON.stringify(carritos, null, 2), 'utf-8');
    } catch (error) {
      fs.writeFileSync(this.pathCarritos, JSON.stringify([carrito], null, 2), 'utf-8');
    }
  }

  generarIdUnicoCarrito() {
    try {
      const datos = fs.readFileSync(this.pathCarritos, 'utf-8');
      const carritos = JSON.parse(datos);
      return carritos.length > 0 ? Math.max(...carritos.map((c) => c.id)) + 1 : 1;
    } catch (error) {
      return 1;
    }
  }
}

module.exports = ProductManager;
