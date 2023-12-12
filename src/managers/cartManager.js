const fs = require("node:fs");
const ProductManager = require("../managers/productManager.js");

const productManager = new ProductManager("./data/products.json");
// Load products from json file
productManager.getProducts().then(() => {});

class CartManager {
  constructor(path) {
    this.carts = [];
    this.path = path;
  }

  async getCarts() {
    const cartsJSON = await fs.promises.readFile(this.path, "utf-8");
    this.carts = JSON.parse(cartsJSON);
    return this.carts;
  }

  async saveCarts() {
    const cartsJSON = JSON.stringify(this.carts, null, 2);
    await fs.promises.writeFile(this.path, cartsJSON);
  }

  async validateCart(cart) {
    if (cart?.products?.length === 0) throw new Error("Products is required");
    for (const product of cart.products) {
      if (!product.id) throw new Error("Product id is required");
      if (product.quantity <= 0 || !product.quantity) throw new Error("Product quantity must be greater than 0");
      const productFound = await productManager.getProductById(product.id);
      if (!productFound) throw new Error(`Product with id ${product.id} not found`);
    }
  }

  async addCart(products) {
    const newCart = {
      id: this.carts.length + 1,
      products,
    };
    await this.validateCart(newCart);
    this.carts.push(newCart);
    await this.saveCarts();
    return newCart;
  }

  async getCartsById(id) {
    const cart = this.carts.find((cart) => cart.id === id);
    if (!cart) throw new Error(`Cart with id ${id} not found`);
    for (const product of cart.products) {
      const productFound = await productManager.getProductById(product.id);
      product.product = productFound;
    }
    return cart;
  }

  async addProductToCart(id, product, quantity) {
    const cart = await this.getCartsById(id);
    await this.validateCart({ products: [{ id: product, quantity }] });
    const productInCart = cart.products.find((p) => p.id === product);
    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      cart.products.push({ id: product, quantity });
    }
    await this.saveCarts();
    return this.getCartsById(id);
  }
}

module.exports = CartManager;
