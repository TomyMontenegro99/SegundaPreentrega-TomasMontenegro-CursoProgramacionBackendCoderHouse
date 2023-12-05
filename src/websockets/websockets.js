import ProductManager from "../persitence/productManager.js";

export default function initializeSocketIO(io) {
  const path = "src/db/products.json";
  const myProductManager = new ProductManager(path);

  io.on("connection", (socket) => {
    console.log("New client websocket: ", socket.id); 

    socket.on("new-product", async (data) => {
      console.log(data);
      try {
        await myProductManager.addProduct(data);
        const productListUpdated = await myProductManager.getProducts();
        io.sockets.emit("refresh-products", productListUpdated);
      } catch (err) {
        console.log(err);
      }
    });
  });
}