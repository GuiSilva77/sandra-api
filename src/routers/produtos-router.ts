import Express from "express";
import { PrismaClient } from "@prisma/client";
import { Produto } from "../../Entidades/Produto";
import checarAutorizacao from "../autorizacao";
import Jwt from "jsonwebtoken";

const produtosRouter = Express.Router();
const db = new PrismaClient();

// GET /produtos
produtosRouter.get("/", async (req, res) => {
  checarAutorizacao(req, res, async () => {
    const produtos: Produto[] = await db.produtos.findMany();
    res.status(200).json(produtos);
  });
});

// GET /produtos/:id
produtosRouter.get("/:id", async (req, res) => {
  checarAutorizacao(req, res, async () => {
    const { id } = req.params;
    const produto: Produto | null = await db.produtos.findUnique({
      where: {
        Id: Number(id),
      },
    });
    if (produto) {
      res.status(200).json(produto);
    } else {
      res.status(404).json({ message: "Produto não encontrado" });
    }
  });
});

// POST /produtos/adicionar
produtosRouter.post("/adicionar", async (req, res) => {
  checarAutorizacao(req, res, async () => {
    const { Nome, Preco, Descricao, URLImagem } = req.body;
    const produto: Produto | null = await db.produtos.create({
      data: {
        Nome,
        Preco,
        Descricao,
        URLImagem,
      },
    });

    if (produto) {
      res.status(200).json(produto);
    } else {
      res.status(500).json({ message: "Erro ao cadastrar produto" });
    }
  });
});

// PUT /produtos/atualizar/:id
produtosRouter.put("/atualizar/:id", async (req, res) => {
  checarAutorizacao(req, res, async () => {
    const { id } = req.params;
    const { Nome, Preco, Descricao, URLImagem } = req.body;
    const produto: Produto | null = await db.produtos.update({
      where: {
        Id: Number(id),
      },
      data: {
        Nome,
        Preco,
        Descricao,
        URLImagem,
      },
    });

    if (produto) {
      res.status(200).json(produto);
    } else {
      res.status(500).json({ message: "Erro ao atualizar produto" });
    }
  });
});

// DELETE /produtos/deletar/:id
produtosRouter.delete("/deletar/:id", async (req, res) => {
  checarAutorizacao(req, res, async () => {
    const { id } = req.params;
    const produto: Produto | null = await db.produtos.delete({
      where: {
        Id: Number(id),
      },
    });

    if (produto) {
      res.status(200).json(produto);
    } else {
      res.status(500).json({ message: "Erro ao deletar produto" });
    }
  });
});

export default produtosRouter;
