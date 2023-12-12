const express = require("express");
const handlebars = require("express-handlebars");
const productRouter = require("./routes/products.router.js");
const cartRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("hbs", handlebars.engine({ extname: ".hbs" }));

app.set("view engine", ".hbs");

app.set("views", __dirname + "/views");

const { Server } = require("socket.io");


const PORT = 8080;


app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/views", viewsRouter);


const serverHttp = app.listen(PORT, () => {
  console.log(`Server listening on port http:/localhost:${PORT}`);
});
const socketServer = new Server(serverHttp);

app.set("socketio", socketServer);
socketServer.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
