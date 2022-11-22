import Express from "express";
import clientesRouter from "./routers/clientes-router";
import pedidosRouter from "./routers/pedidos-router";

const app = Express();
//GET PORT FROM ENVIRONMENT
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/clientes", clientesRouter);
app.use("/pedidos", pedidosRouter);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
