const { Router } = require("express");
const router = Router();
const ProductManager = require("../managers/productManager");

const productManager = new ProductManager("./data/products.json");

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("index", { title: "Clothing Store", name: "User", products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { title: "Clothing Store", name: "User", products });
});

module.exports = router;
