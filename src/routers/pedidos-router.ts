import Express from "express";
import { PrismaClient } from "@prisma/client";
import { Pedido } from "../../Entidades/Pedido";

const pedidosRouter = Express.Router();
const db = new PrismaClient();

pedidosRouter.get("/listar", async (req, res) => {
  const pedidos: Pedido[] = await db.pedidos.findMany();
  res.json(pedidos);
});

pedidosRouter.get("/listar/:id", async (req, res) => {
  const pedido: Pedido | null = await db.pedidos.findUnique({
    where: {
      Id: Number(req.params.id),
    },
  });
  res.json(pedido);
});

pedidosRouter.post("/adicionar", async (req, res) => {
  const pedido: Pedido = {
    Valor: req.body.Valor,
    Data: req.body.Data,
    MetPag: req.body.MetPag,
    ClienteId: req.body.ClienteId,
  };

  await db.pedidos
    .create({
      data: {
        Valor: pedido.Valor,
        Data: pedido.Data,
        MetPag: pedido.MetPag,
        ClienteId: pedido.ClienteId,
      },
    })
    .catch((err) => {
      console.log(err);

      res.status(500).json({
        message: "Erro ao adicionar pedido",
        error: err,
      });
    });

  res.statusCode = 200;
});

pedidosRouter.put("/atualizar/:id", async (req, res) => {
  const pedido: Pedido = {
    Id: Number(req.params.id),
    Valor: req.body.Valor,
    Data: req.body.Data,
    MetPag: req.body.MetPag,
    ClienteId: req.body.ClienteId,
  };

  await db.pedidos
    .update({
      where: {
        Id: pedido.Id,
      },
      data: {
        Valor: pedido.Valor,
        Data: pedido.Data,
        MetPag: pedido.MetPag,
        ClienteId: pedido.ClienteId,
      },
    })
    .catch((err) => {
      console.log(err);

      res.status(500).json({
        message: "Erro ao atualizar pedido",
        error: err,
      });
    });

  res.statusCode = 200;
});

pedidosRouter.delete("/deletar/:id", async (req, res) => {
  await db.pedidos
    .delete({
      where: {
        Id: Number(req.params.id),
      },
    })
    .catch((err) => {
      console.log(err);

      res.status(500).json({
        message: "Erro ao deletar pedido",
        error: err,
      });
    });

  res.statusCode = 200;
});

export default pedidosRouter;
