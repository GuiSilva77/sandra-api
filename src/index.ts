import Express from "express";
import Jwt from "jsonwebtoken";
import clientesRouter from "./routers/clientes-router";
import pedidosRouter from "./routers/pedidos-router";
import produtosRouter from "./routers/produtos-router";

const app = Express();
const PORT = process.env.PORT;

app.use(Express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/clientes", clientesRouter);
app.use("/pedidos", pedidosRouter);
app.use("/produtos", produtosRouter);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
