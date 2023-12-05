import { Router } from "express";
import ProductManager from "../persitence/productManager.js";
import { validateNumber } from "../utils/helpers.js";
import {
  validateRequest,
  validateNumberParams,
  validateCodeNotRepeated,
} from "../middleware/validators.js";

const router = Router();
const path = "src/db/products.json";
const myProductManager = new ProductManager(path);

router.get("/", async (req, res) => {
  try {
    const products = await myProductManager.getProducts();
    const limit = req.query.limit;
    const isValidLimit = validateNumber(limit);
    let renderedProducts = products;

    if (products && isValidLimit) {
      renderedProducts = products.slice(0, limit);
    }

    res.render("home", {
      products: renderedProducts,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await myProductManager.getProducts();
    const limit = req.query.limit;
    const isValidLimit = validateNumber(limit);
    let renderedProducts = products;

    if (products && isValidLimit) {
      renderedProducts = products.slice(0, limit);
    }

    res.render("realTimeProducts", {
      products: renderedProducts,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

export default router;