import fs from "fs-extra";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    return await this.read();
  }

  async getProductById(id) {
    const allProductsArray = await this.read();
    const product = allProductsArray.find((product) => product.id === id);
    return product;
  }

  async addProduct(newProduct) {
    const allProductsArray = await this.read();
    const nextId = await this.getNextId(allProductsArray);
    newProduct.id = nextId;
    newProduct.status = true;
    allProductsArray.push(newProduct);
    await this.write(allProductsArray);
    return newProduct;
  }

  async updateProduct(id, newProduct) {
    const allProductsArray = await this.read();
    const productToUpdate = allProductsArray.find(
      (product) => product.id === id
    );
    if (!productToUpdate) {
      return {
        status: "error",
        message: "Sorry, no product found by id: " + id,
        payload: {},
      };
    }
    const updatedProduct = this.updateProductFields(
      productToUpdate,
      newProduct
    );
    const index = allProductsArray.indexOf(productToUpdate);
    allProductsArray[index] = updatedProduct;
    await this.write(allProductsArray);
    return updatedProduct;
  }

  async deleteProduct(id) {
    try {
      const allProductsArray = await this.read();
      const productToDeleteIndex = allProductsArray.findIndex(
        (product) => product.id === id
      );

      if (productToDeleteIndex === -1) {
        return {
          status: "error",
          message: "Sorry, no product found by id: " + id,
          payload: {},
        };
      }

      const productToDelete = allProductsArray[productToDeleteIndex];
      allProductsArray.splice(productToDeleteIndex, 1);
      await this.write(allProductsArray);

      return productToDelete;
    } catch (err) {
      console.log("Error al eliminar el producto", err);
      return {
        status: "error",
        message: "Error al eliminar el producto",
        payload: {},
      };
    }
  }

  updateProductFields(productToUpdate, newProduct) {
    const updatedProduct = {
      ...productToUpdate,
      ...newProduct,
    };
    return updatedProduct;
  }

  async read() {
    let allProductsArray = [];
    try {
      const allProductsString = await fs.readFile(this.path, "utf-8");
      allProductsArray = JSON.parse(allProductsString) || [];
    } catch (err) {
      console.log("Error en la lectura del archivo", err);
    }
    return allProductsArray;
  }

  async write(allProductsArray) {
    const allProductsString = JSON.stringify(allProductsArray);
    try {
      await fs.writeFile(this.path, allProductsString);
    } catch (err) {
      console.log("Error en la escritura", err);
    }
  }

  async getNextId(allProductsArray) {
    let lastId = 0;
    const allIdsArray = allProductsArray
      .map((product) => product.id)
      .filter((id) => typeof id === "number");
    if (allIdsArray.length > 0) {
      lastId = Math.max(...allIdsArray);
    }
    return lastId + 1;
  }
}

export default ProductManager;