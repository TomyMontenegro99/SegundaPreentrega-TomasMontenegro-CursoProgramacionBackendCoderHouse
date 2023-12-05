import fs from "fs";
import ProductManager from "../persitence/productManager.js";

class CartManager {
  constructor(path) {
    this.path = path;
    this.productManager = new ProductManager("src/db/products.json");
  }

  async addCart() {
    const allCartsArray = await this.read();

    const nextId = this.getNextId(allCartsArray);
    const newCart = {
      id: nextId,
      products: [],
    };

    allCartsArray.push(newCart);
    await this.write(allCartsArray);

    return newCart;
  }

  async addProductToCart(idCart, idProduct) {
    const allCartsArray = await this.read();
    const cartToUpdate = allCartsArray.find((cart) => cart.id === idCart);

    if (!cartToUpdate) {
      return {
        status: "error",
        message: "Sorry, no cart found by id: " + idCart,
        payload: {},
      };
    }

    const productToAdd = await this.productManager.getProductById(idProduct);

    if (!productToAdd) {
      return {
        status: "error",
        message: "Sorry, no product found by id: " + idProduct,
        payload: {},
      };
    }

    const productAlreadyInCart = this.findProductInCart(
      cartToUpdate,
      idProduct
    );

    if (productAlreadyInCart) {
      const index = cartToUpdate.products.indexOf(productAlreadyInCart);
      const productData = {
        id: productAlreadyInCart.id,
        quantity: productAlreadyInCart.quantity + 1,
      };
      cartToUpdate.products[index] = productData;
    } else {
      const productData = {
        id: productToAdd.id,
        quantity: 1,
      };
      cartToUpdate.products.push(productData);
    }

    const indexCart = allCartsArray.indexOf(cartToUpdate);
    allCartsArray[indexCart] = cartToUpdate;
    await this.write(allCartsArray);

    return cartToUpdate;
  }

  async removeProductFromCart(idCart, idProduct) {
    const allCartsArray = await this.read();
    const cartToUpdate = allCartsArray.find((cart) => cart.id === idCart);

    if (!cartToUpdate) {
      return {
        status: "error",
        message: "Sorry, no cart found by id: " + idCart,
        payload: {},
      };
    }

    const productToRemove = this.findProductInCart(cartToUpdate, idProduct);

    if (!productToRemove) {
      return {
        status: "error",
        message: "Sorry, no product found by id: " + idProduct,
        payload: {},
      };
    }

    const index = cartToUpdate.products.indexOf(productToRemove);
    cartToUpdate.products.splice(index, 1);

    const indexCart = allCartsArray.indexOf(cartToUpdate);
    allCartsArray[indexCart] = cartToUpdate;
    await this.write(allCartsArray);

    return cartToUpdate;
  }

  findProductInCart(cartToUpdate, idProduct) {
    return cartToUpdate.products.find((product) => product.id === idProduct);
  }

  async read() {
    let allCartsArray = [];
    try {
      const allCartsString = await fs.promises.readFile(this.path, "utf-8");

      if (allCartsString.length > 0) {
        allCartsArray = JSON.parse(allCartsString);
      }
    } catch (err) {
      console.log("Error en la lectura del archivo", err);
    }
    return allCartsArray;
  }

  async write(allCartsArray) {
    const allCartsString = JSON.stringify(allCartsArray);
    try {
      await fs.promises.writeFile(this.path, allCartsString);
    } catch (err) {
      console.log("Error en la escritura", err);
    }
  }

  getNextId(allCartsArray) {
    let lastId = 0;

    const allIdsArray = allCartsArray
      .map((product) => product.id)
      .filter((id) => typeof id === "number");

    if (allIdsArray.length > 0) {
      lastId = Math.max(...allIdsArray);
    }
    return lastId + 1;
  }
}

export default CartManager;