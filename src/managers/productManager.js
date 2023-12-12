const fs = require("node:fs");

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }
  // clear products from json file
  async clearProducts() {
    this.products = [];
    const productsJSON = JSON.stringify(this.products, null, 2);
    await fs.promises.writeFile(this.path, productsJSON);
  }
  // validate product properties
  validateProduct = ({ title, description, price, thumbnails, code, stock, status, category }) => {
    if (!title || !description || !price || thumbnails?.length === 0 || !code || !stock || typeof status !== "boolean" || !category) {
      throw new Error("Missing properties");
    }

    const existingProduct = this.products.find((product) => product.code === code);
    if (existingProduct) {
      throw new Error("Product with code already exists");
    }
  };

  // saveProducts to json file
  async saveProducts() {
    const productsJSON = JSON.stringify(this.products, null, 2);
    await fs.promises.writeFile(this.path, productsJSON);
  }

  // create a product and save it to json file
  async addProduct(title, description, price, thumbnails, code, stock, status, category) {
    const newProduct = {
      id: this.products.length + 1,
      title,
      description,
      price,
      thumbnails,
      code,
      stock,
      status,
      category,
    };
    console.log(newProduct);

    this.validateProduct(newProduct);
    this.products.push(newProduct);
    await this.saveProducts();
    return newProduct;
  }

  // read products from json file
  async getProducts() {
    const productsJSON = await fs.promises.readFile(this.path, "utf-8");
    this.products = JSON.parse(productsJSON);
    return this.products;
  }

  // read products from json file and find product by id
  async getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  // Update product and save it to json file
  async updateProduct(id, title, description, price, thumbnails, code, stock, status, category) {
    // update with product id
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      throw new Error("Product not found");
    }
    // update with product properties
    if (!title || !description || !price || thumbnails?.length === 0 || !code || !stock || typeof status !== "boolean" || !category) {
      throw new Error("Missing properties");
    }
    this.products[productIndex] = { id, title, description, price, thumbnails, code, stock, status, category };
    await this.saveProducts();
    return this.products[productIndex];
  }

  // delete product and save it to json file
  async deleteProduct(id) {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      throw new Error("Product not found");
    }
    const deletedProduct = this.products[productIndex];
    this.products.splice(productIndex, 1);
    await this.saveProducts();
    return deletedProduct;
  }
}

module.exports = ProductManager;
