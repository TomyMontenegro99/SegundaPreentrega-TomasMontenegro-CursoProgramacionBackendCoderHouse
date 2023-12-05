import express from "express";
import morgan from "morgan";
import http from "http";
import exphbs from "express-handlebars";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import productRoutes from "./routes/productRoutes.js";
import initializeSocketIO from "./websockets/websockets.js"; // Importamos la función para inicializar los sockets

const app = express();
const PORT = process.env.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const httpServer = http.createServer(app);
initializeSocketIO(httpServer); // Inicializamos socket.io pasándole el servidor http

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main", 
    extname: ".handlebars", 
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.get("/home", async (req, res) => {
  try {
    
    const products = await getProducts(); 
    res.render("home", { products }); 
  } catch (error) {
    console.error(error);
    res.status(500).send("Error obteniendo los productos");
  }
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

app.post("/realtimeProducts", (req, res) => {
  res.send("Solicitud POST a /realtimeProducts recibida");
});

app.use("/api", productRoutes);

httpServer.listen(PORT, () => {
  console.log(
    `Server started on port ${PORT} at ${new Date().toLocaleString()}`
  );
});
