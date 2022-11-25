import Express from "express";
import clientesRouter from "./routers/clientes-router";
import pedidosRouter from "./routers/pedidos-router";
import produtosRouter from "./routers/produtos-router";
import SwaggerUI from "swagger-ui-express";
import Cors from "cors";
const swaggerDocument = require("../swagger.json");

const app = Express();
const PORT = process.env.PORT;

app.use("/docs", SwaggerUI.serve);
app.get("/docs", SwaggerUI.setup(swaggerDocument));

app.use(Cors());

app.use(
  Express.json({
    limit: "1mb",
    strict: false,
  })
);

app.use("/clientes", clientesRouter);
app.use("/pedidos", pedidosRouter);
app.use("/produtos", produtosRouter);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
