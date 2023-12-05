import { Router } from "express";
import CartManager from "../persitence/cartManager.js";
import ProductManager from "../persitence/productManager.js";

const router = Router();
const cartsFilePath = "src/db/carts.json";
const productsFilePath = "src/db/products.json";
const myCartManager = new CartManager(cartsFilePath);
const myProductManager = new ProductManager(productsFilePath);

router.get("/", async (req, res) => {
  try {
    const carts = await myCartManager.read();
    res.status(200).json({
      status: "success",
      payload: carts,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = await myCartManager.createCart();
    res.status(201).json({
      status: "success",
      payload: newCart,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const idCart = req.params.id;
    const cart = await myCartManager.getCartById(idCart);
    if (!cart) {
      res.status(404).json({
        status: "error",
        message: "Sorry, no cart found by id: " + idCart,
        payload: {},
      });
    } else {
      res.status(200).json({
        status: "success",
        payload: cart,
      });
    }
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
  }
});

router.put("/:id/add-product", async (req, res) => {
  try {
    const idCart = req.params.id;
    const productId = req.body.productId;

    const productToAdd = await myProductManager.getProductById(productId);
    if (!productToAdd) {
      res.status(404).json({
        status: "error",
        message: "Sorry, no product found by id: " + productId,
        payload: {},
      });
      return;
    }

    const cart = await myCartManager.addProductToCart(idCart, productToAdd);

    res.status(200).json({
      status: "success",
      payload: cart,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      status: "error",
      payload: err.message,
    });
}
});

router.delete("/:id", async (req, res) => {
  try {
    const idProduct = req.params.id;

    const allCarts = await myCartManager.read();
    const updatedCarts = [];

    for (const cart of allCarts) {
      const updatedProducts = [];

      for (const product of cart.products) {
        if (product.id !== idProduct) {
          updatedProducts.push(product);
        }
      }

      const updatedCart = {
        id: cart.id,
        products: updatedProducts,
      };

      updatedCarts.push(updatedCart);
    }

    await myCartManager.write(updatedCarts);

    const deletedProduct = await myProductManager.deleteProduct(idProduct);

    if (deletedProduct.status === "error") {
      res.status(404).json({
        status: "error",
        message: "Sorry, no product found by id: " + idProduct,
        payload: {},
      });
    } else {
      res.status(200).json({
        status: "success",
        payload: deletedProduct,
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