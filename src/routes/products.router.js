const { Router } = require("express");
const router = Router();
const ProductManager = require("../managers/productManager");


const productManager = new ProductManager( './data/products.json');

productManager.getProducts().then(() => {});

router.get('/', async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    let products = await productManager.getProducts();

    // Aplicar filtros según los parámetros de query
    if (query) {
      if (query === 'disponible') {
        products = products.filter((product) => product.status === true);
      } else {
        products = products.filter((product) => product.category === query);
      }
    }

    // Aplicar ordenamiento según el parámetro sort
    if (sort) {
      if (sort === 'asc') {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === 'desc') {
        products.sort((a, b) => b.price - a.price);
      }
    }

    // Calcular paginación
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalPages = Math.ceil(products.length / limit);

    const results = {};
    if (endIndex < products.length) {
      results.nextPage = page + 1;
    }
    if (startIndex > 0) {
      results.prevPage = page - 1;
    }
    results.totalPages = totalPages;
    results.page = page;
    results.hasPrevPage = page > 1;
    results.hasNextPage = endIndex < products.length;

    // Obtener los productos para la página actual
    results.payload = products.slice(startIndex, endIndex);

    res.status(200).json({ status: 'success', ...results });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});


router.get("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    const product = await productManager.getProductById(id);
    res.status(200).json({ status: "ok", data: product });
    
  } catch (error) {
    
    res.status(404).json({ status: "error", message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const { title, description, price, thumbnails, code, stock, status, category } = req.body;
    const product = await productManager.addProduct(title, description, price, thumbnails, code, stock, status, category);
    const socketIo = req.app.get("socketio");
    const products = await productManager.getProducts();
    socketIo.emit("update-products", products);
    res.status(201).json({ status: "ok", data: product });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    const { title, description, price, thumbnails, code, stock, status, category } = req.body;
    const product = await productManager.updateProduct(id, title, description, price, thumbnails, code, stock, status, category);
    res.status(200).json({ status: "ok", data: product });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    await productManager.deleteProduct(id);
    const socketIo = req.app.get("socketio");
    const products = await productManager.getProducts();
    socketIo.emit("update-products", products);
    res.status(200).json({ status: "ok", message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

module.exports = router;
