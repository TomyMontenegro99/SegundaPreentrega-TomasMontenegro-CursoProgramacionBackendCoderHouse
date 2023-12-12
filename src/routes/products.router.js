const { Router } = require("express");
const router = Router();
const ProductManager = require("../managers/productManager");


const productManager = new ProductManager( './data/products.json');

productManager.getProducts().then(() => {});

router.get("/", async (req, res) => {
  let limit = req.query.limit;
  const returnProducts = await productManager.getProducts();
  if (limit) {
    res.status(200).json({ status: "ok", data: returnProducts.slice(0, limit) });
    
  } else {
    res.status(200).json({ status: "ok", data: returnProducts });
    
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
