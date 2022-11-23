import Express from "express";
import { PrismaClient, ProdutosPedidos } from "@prisma/client";
import { Pedido } from "../../Entidades/Pedido";
import checarAutorizacao from "../autorizacao";
import Jwt from "jsonwebtoken";

const pedidosRouter = Express.Router();
const db = new PrismaClient();

// GET /pedidos
pedidosRouter.get("/", async (req, res) => {
  const pedidos: Pedido[] = await db.pedidos.findMany();
  res.status(200).json(pedidos);
});

// GET /pedidos/:id
pedidosRouter.get("/:id", async (req, res) => {
  checarAutorizacao(req, res, async () => {
    const { id } = req.params;
    const pedido: Pedido | null = await db.pedidos.findUnique({
      where: {
        Id: Number(id),
      },
    });
    if (pedido) {
      res.status(200).json(pedido);
    } else {
      res.status(404).json({ message: "Pedido não encontrado" });
    }
  });
});

// POST /pedidos/adicionar
pedidosRouter.post("/adicionar", async (req, res) => {
  //checarAutorizacao(req, res, async () => {
  const clienteId = /*Jwt.verify(
      req.headers["authorization"] as string,
      process.env.TOKEN as string
    ) as { id: number };*/ 8;

  const { Valor, MetPag, ProdutosPedidos } = req.body;

  // Cria o pedido
  const pedido: Pedido = await db.pedidos.create({
    data: {
      Valor,
      MetPag,
      Data: new Date(),
      ClienteId: clienteId,
      ProdutosPedidos: {
        create: ProdutosPedidos.map((produto: ProdutosPedidos) => ({
          ProdutoId: produto.ProdId,
          Quantidade: produto.Quantidade,
        })),
      },
    },
  });

  if (pedido) {
    res.status(200).json(pedido);
  } else {
    res.status(500).json({ message: "Erro ao cadastrar pedido" });
  }
  //});
});

export default pedidosRouter;
