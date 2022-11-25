import Express from "express";
import { PrismaClient } from "@prisma/client";
import { Produto } from "../../Entidades/Produto";
import checarAutorizacao from "../autorizacao";
import Jwt from "jsonwebtoken";

const produtosRouter = Express.Router();
const db = new PrismaClient();

// GET /produtos
produtosRouter.get("/", async (req, res) => {
  /*
    #swagger.tags = ['Produtos']
    #swagger.description = 'Endpoint para obter todos os produtos.'
    #swagger.responses[200] = {
        description: 'Lista de produtos',
        schema: [
            {
              Id: "number",
              Nome: "string",
              Valor: "number",
              Descricao: "string",
              URLImagem: "string",
            }
        ]
    }
*/
  const produtos: Produto[] = await db.produtos.findMany();
  res.status(200).json(produtos);
});

// GET /produtos/:id
produtosRouter.get("/:id", async (req, res) => {
  /*
    #swagger.tags = ['Produtos']
    #swagger.description = 'Endpoint para obter um produto.'
    #swagger.parameters['id'] = {
            in: 'path',
            description: 'Id do produto',
            type: 'number'
    }
    #swagger.responses[200] = {
        description: 'Produto',
        schema: {
          Id: "number",
          Nome: "string",
          Valor: "number",
          Descricao: "string",
          URLImagem: "string",
        }
    }
    #swagger.responses[404] = {
        description: 'Produto não encontrado'
    }
*/
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

// POST /produtos/adicionar
produtosRouter.post("/adicionar", async (req, res) => {
  /*
    #swagger.tags = ['Produtos']
    #swagger.description = 'Endpoint para adicionar um produto.'
    #swagger.security = [{
            "bearerAuth": []
    }]
    #swagger.parameters['token'] = {
            in: 'header',
            description: 'Token de autenticação',
            type: 'string'
    }
    #swagger.parameters['produto'] = {
            in: 'body',
            description: 'Produto a ser adicionado',
            schema: {
              Nome: "string",
              Valor: "number",
              Descricao: "string",
              URLImagem: "string",
            }
    }
    #swagger.responses[200] = {
        description: 'Produto adicionado', 
    }
    #swagger.responses[400] = {
        description: 'Erro ao adicionar produto'
    }
*/

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
      res.status(200);
    } else {
      res.status(400).json({ message: "Erro ao cadastrar produto" });
    }
  });
});

// PUT /produtos/atualizar/:id
produtosRouter.put("/atualizar/:id", async (req, res) => {
  /*
    #swagger.tags = ['Produtos']  
    #swagger.description = 'Endpoint para atualizar um produto.'
    #swagger.security = [{
            "bearerAuth": []
    }]
    #swagger.parameters['token'] = {
            in: 'header',
            description: 'Token de autenticação',
            type: 'string'
    }
    #swagger.parameters['id'] = {
            in: 'path',
            description: 'Id do produto',
            type: 'number'
    }
    #swagger.parameters['produto'] = {
            in: 'body',
            description: 'Produto a ser atualizado',
            schema: {
              Nome: "string",
              Valor: "number",
              Descricao: "string",
              URLImagem: "string",
            }
    }
    #swagger.responses[200] = {
        description: 'Produto atualizado',
    }
    #swagger.responses[400] = {
        description: 'Erro ao atualizar produto'
    }
    #swagger.responses[404] = {
        description: 'Produto não encontrado'
    }
*/
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
  /*
    #swagger.tags = ['Produtos']
    #swagger.description = 'Endpoint para deletar um produto.'
    #swagger.security = [{
            "bearerAuth": []
    }]
    #swagger.parameters['token'] = {
            in: 'header',
            description: 'Token de autenticação',
            type: 'string'
    }
    #swagger.parameters['id'] = {
            in: 'path',
            description: 'Id do produto',
            type: 'number'
    }
    #swagger.responses[200] = {
        description: 'Produto deletado',
    }
    #swagger.responses[500] = {
        description: 'Erro ao deletar produto'
    }
*/
  checarAutorizacao(req, res, async () => {
    const { id } = req.params;
    const produto: Produto | null = await db.produtos.delete({
      where: {
        Id: Number(id),
      },
    });

    if (produto) {
      res.status(200);
    } else {
      res.status(500).json({ message: "Erro ao deletar produto" });
    }
  });
});

export default produtosRouter;
