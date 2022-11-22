import { PrismaClient } from "@prisma/client";
import Express from "express";
import { Cliente } from "../../Entidades/Cliente";

const db = new PrismaClient();
const clientesRouter = Express.Router();

clientesRouter.post("/login", async (req, res) => {
  const { Login, Senha } = req.body;
  const cliente = await db.clientes.findFirst({
    where: {
      Login,
      Senha,
    },
  });
  if (cliente) {
    res.status(200).json(cliente);
  } else {
    res.status(401).json({ message: "Credenciais inválidas" });
  }
});

export default clientesRouter;
