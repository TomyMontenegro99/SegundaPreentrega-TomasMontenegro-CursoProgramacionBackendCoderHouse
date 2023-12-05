import express from "express";
import ProductManager from "../persitence/productManager.js";
import multer from "multer";
import {
  validateRequest,
  validateNumberParams,
  validateCodeNotRepeated,
} from "./../middleware/validators.js";
import { validateNumber } from "./../utils/helpers.js";

const router = express.Router();
const path = "src/db/products.json";
const myProductManager = new ProductManager(path);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage }).single("thumbnail");
router.use(upload);

router.get("/", async (req, res) => {
  try {
    const products = await myProductManager.getProducts();
    const limit = req.query.limit;
    const isValidLimit = validateNumber(limit);

    let renderedProducts = products || [];

    if (isValidLimit) {
      renderedProducts = renderedProducts.slice(0, limit);
    }

    res.status(200).json({
      status: "success",
      payload: renderedProducts,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.get("/:id", validateNumberParams, async (req, res) => {
  try {
    const id = req.params.id;
    const product = await myProductManager.getProductById(id);

    if (product) {
      res.status(200).json({
        status: "success",
        payload: product,
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Sorry, no product found by id: " + id,
        payload: {},
      });
    }
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.post(
  "/realtimeProducts",
  validateRequest,
  validateCodeNotRepeated,
  async (req, res) => {
    try {
      const newProduct = req.body;
      const photo = req.file;

      newProduct.thumbnail = "/uploads/" + photo.filename;

      const productCreated = await myProductManager.addProduct(newProduct);

      res.render("realTimeProducts", { product: productCreated });
    } catch (err) {
      res.status(err.status || 500).json({
        status: "error",
        payload: err.message,
      });
    }
  }
);

router.put("/:id", validateRequest, validateNumberParams, async (req, res) => {
  try {
    const id = req.params.id;
    const newProduct = req.body;

    const productUpdated = await myProductManager.updateProduct(id, newProduct);

    res.status(200).json({
      status: "success",
      payload: productUpdated,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.delete("/:id", validateNumberParams, async (req, res) => {
  try {
    const id = req.params.id;
    const product = await myProductManager.getProductById(id);

    if (!product) {
      res.status(404).json({
        status: "error",
        message: "Sorry, no product found by id: " + id,
        payload: {},
      });
    } else {
      const productDeleted = await myProductManager.deleteProduct(id);
      res.status(200).json({
        status: "success",
        payload: productDeleted,
      });
    }
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});





export default router;
