const fs = require('fs');

class ProductManager {
  constructor(rutaArchivo) {
    this.path = rutaArchivo;
  }

  agregarProducto(producto) {
    const productos = this.obtenerProductos();
    producto.id = this.generarIdUnico(productos);
    productos.push(producto);
    this.guardarProductos(productos);
  }

  obtenerProductos() {
    try {
      const datos = fs.readFileSync(this.path, 'utf-8');
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
      this.guardarProductos(productos);
    }
  }

  eliminarProducto(id) {
    const productos = this.obtenerProductos();
    const productosActualizados = productos.filter((p) => p.id !== id);
    this.guardarProductos(productosActualizados);
  }

  generarIdUnico(productos) {
    return productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1;
  }

  guardarProductos(productos) {
    const datos = JSON.stringify(productos, null, 2);
    fs.writeFileSync(this.path, datos, 'utf-8');
  }
}


module.exports = ProductManager;

// Ejemplo de uso:
const rutaArchivo = 'productos.json'; 
const gestorDeProductos = new ProductManager(rutaArchivo);

// Agregar un producto
gestorDeProductos.agregarProducto({
  title: 'Producto 1',
  description: 'Descripción 1',
  price: 19.99,
  thumbnail: 'imagen1.jpg',
  code: 'P1',
  stock: 10,
});

// Consultar productos
console.log(gestorDeProductos.obtenerProductos());

// Obtener producto por ID
console.log(gestorDeProductos.obtenerProductoPorId(1));

// Actualizar producto por ID
gestorDeProductos.actualizarProducto(1, { price: 29.99, stock: 15 });

// Eliminar producto por ID
gestorDeProductos.eliminarProducto(1);

// Consultar productos después de la actualización y eliminación
console.log(gestorDeProductos.obtenerProductos());
