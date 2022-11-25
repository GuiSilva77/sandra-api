import Express from "express";
import { Pedidos, PrismaClient, ProdutosPedidos } from "@prisma/client";
import { Pedido } from "../../Entidades/Pedido";
import checarAutorizacao from "../autorizacao";
import Jwt, { JwtPayload } from "jsonwebtoken";

const pedidosRouter = Express.Router();
const db = new PrismaClient();

// GET /pedidos
pedidosRouter.get("/", async (req, res) => {
  /*
    #swagger.tags = ['Pedidos']
    #swagger.description = 'Endpoint para obter todos os pedidos.'
    #swagger.security = [{
            "bearerAuth": []
    }]
    #swagger.parameters['token'] = {
            in: 'header',
            description: 'Token de autenticação',
            type: 'string'
    }
    #swagger.responses[200] = {
        description: 'Lista de pedidos',
        schema: [
            {
              Id: "number",
              Valor: "number",
              Data: "Date",
              MetPag: "string",
              ClienteId: "number",
              ProdutosPedidos: "Produto[]",
            }
        ]
    }
    #swagger.responses[404] = {
        description: 'Pedido não encontrado'
    }
  */
  checarAutorizacao(req, res, async () => {
    const pedidos = await db.pedidos.findMany({
      include: {
        ProdutosPedidos: {},
      },
    });

    if (pedidos) {
      res.status(200).json(pedidos);
    } else {
      res.status(404).json({ mensagem: "Pedido não encontrado" });
    }
  });
});

// GET /pedidos/:id
pedidosRouter.get("/:id", async (req, res) => {
  /*
    #swagger.tags = ['Pedidos']
    #swagger.description = 'Endpoint para obter um pedido.'
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
            description: 'Id do pedido',
            type: 'number'
    }
    #swagger.responses[200] = {
        description: 'Pedido',
        schema: {
          Id: "number",
          Valor: "number",
          Data: "Date",
          MetPag: "string",
          ClienteId: "number",
          ProdutosPedidos: "Produto[]",
        }
    }
    #swagger.responses[404] = {
        description: 'Pedido não encontrado'
    }
  */
  checarAutorizacao(req, res, async () => {
    const { id } = req.params;
    const pedido: Pedidos | null = await db.pedidos.findUnique({
      where: {
        Id: Number(id),
      },
      include: {
        ProdutosPedidos: {},
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
  /*
    #swagger.tags = ['Pedidos']
    #swagger.description = 'Endpoint para adicionar um pedido.'
    #swagger.security = [{
            "bearerAuth": []
    }]
    #swagger.parameters['token'] = {
            in: 'header',
            description: 'Token de autenticação',
            type: 'string'
    }
    #swagger.parameters['pedido'] = {
            in: 'body',
            description: 'Pedido',
            schema: {
              Valor: "number",
              MetPag: "string",
              ProdutosPedidos: "Produto[]",
            }
    }
    #swagger.responses[200] = {
        description: 'Pedido adicionado',
        schema: {
          Id: "number",
          Valor: "number",
          Data: "Date",
          MetPag: "string",
          ClienteId: "number",
          ProdutosPedidos: "Produto[]",
        }
    }
    #swagger.responses[500] = {
        description: 'Erro ao adicionar pedido'
    }
  */
  checarAutorizacao(req, res, async () => {
    //decodifica o token para obter o id do cliente
    const token = req.headers.authorization?.split(" ")[1];
    const payload = Jwt.verify(token!, process.env.TOKEN!) as JwtPayload;
    const clienteId = payload.id;

    const { Valor, MetPag, ProdutosPedidos } = req.body;

    const pedido: Pedido = await db.pedidos.create({
      data: {
        Valor,
        Data: new Date(),
        MetPag,
        ClienteId: clienteId,
      },
    });

    const produtosPedidos = await db.produtosPedidos.createMany({
      data: ProdutosPedidos.map((produtoPedido: ProdutosPedidos) => ({
        ProdId: produtoPedido.ProdId,
        PedId: pedido.Id,
        Quantidade: produtoPedido.Quantidade,
      })),
    });

    if (pedido && produtosPedidos) {
      res.status(200).json(pedido);
    } else {
      res.status(500).json({ message: "Erro ao criar pedido" });
    }
  });
});

export default pedidosRouter;
