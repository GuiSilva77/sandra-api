import { PrismaClient } from "@prisma/client";
import Express from "express";
import { Cliente } from "../../Entidades/Cliente";
import Jwt from "jsonwebtoken";
import checarAutorizacao from "../autorizacao";

const db = new PrismaClient();
const clientesRouter = Express.Router();

// GET /clientes/login
clientesRouter.get("/login", async (req, res) => {
  const { Login, Senha } = req.body;
  const cliente: Cliente | null = await db.clientes.findFirst({
    where: {
      Login,
      Senha,
    },
  });

  if (cliente) {
    const token: string = Jwt.sign(
      { id: cliente.Id },
      process.env.TOKEN as string
    );
    res.status(200).json({ cliente, token });
  } else {
    res.status(404).json({ message: "Cliente não encontrado" });
  }
});

// GET /clientes/logout
clientesRouter.get("/logout", (req, res) => {
  res.status(200).json({ message: "Logout realizado com sucesso" });
});

//POST /clientes/cadastrar
clientesRouter.post("/cadastrar", async (req, res) => {
  const { Nome, Login, Senha } = req.body;
  const cliente: Cliente | null = await db.clientes.create({
    data: {
      Nome,
      Login,
      Senha,
    },
  });

  if (cliente) {
    res.status(200).json(cliente);
  } else {
    res.status(500).json({ message: "Erro ao cadastrar cliente" });
  }
});

// DELETE /clientes/:id
clientesRouter.delete("/desativar/:id", async (req, res) => {
  //checarAutorizacao(req, res, async () => {
  const { id } = req.params;
  const cliente: Cliente | null = await db.clientes.delete({
    where: {
      Id: Number(id),
    },
  });

  if (cliente) {
    res.status(200).json(cliente);
  } else {
    res.status(404).json({ message: "Cliente não encontrado" });
  }
  // });
});

export default clientesRouter;
