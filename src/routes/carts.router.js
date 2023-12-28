const { Router } = require("express");
const router = Router();
const CartManager = require("../managers/cartManager");

const cartManager = new CartManager('./data/products.json');

cartManager.getCarts().then(() => {});


router.post("/", async (req, res) => {
  try {
    const { products } = req.body;
    const cart = await cartManager.addCart(products);
    res.status(201).json({ status: "ok", data: cart });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});


router.get("/:cid", async (req, res) => {
  try {
    const id = parseInt(req.params.cid);
    const cart = await cartManager.getCartsById(id);
    res.status(200).json({ status: "ok", data: cart });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
});


router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.cid);
    const product = parseInt(req.params.pid);
    const quantity = parseInt(req.body.quantity);
    const cart = await cartManager.addProductToCart(id, product, quantity);
    res.status(200).json({ status: "ok", data: cart });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
});

router.delete('/:cartId/products/:productId', async (req, res) => {
  try {
    const { cartId, productId } = req.params;

    const updatedCart = await cartManager.removeCartItem(cartId, productId);
    res.status(200).json({ status: 'success', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
