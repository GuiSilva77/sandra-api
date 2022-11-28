import { PrismaClient } from "@prisma/client";
import Express from "express";
import { Cliente } from "../../Entidades/Cliente";
import Jwt from "jsonwebtoken";
import checarAutorizacao from "../autorizacao";

const db = new PrismaClient();
const clientesRouter = Express.Router();

// GET /clientes/login
clientesRouter.post("/login", async (req, res) => {
  /*
    #swagger.tags = ['Clientes']
    #swagger.description = 'Endpoint para realizar login de um cliente.'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Login do cliente.',
      required: true,
      schema: {
        $Login: 'string',
        $Senha: 'string'
      }
    }
    #swagger.responses[200] = {
      description: 'Login realizado com sucesso.',
      schema: { 
        cliente: {
      Id: "number",
      Nome: "string",
      Login: "string",
      Senha: "string",
      Ativado: "boolean",
      CPF: "string",
    },
        token: "string" 
      }
    }
    #swagger.responses[404] = {
      description: 'Login ou senha inválidos.'
    }
  */
  const { Login, Senha } = req.body;

  if (Login == process.env.ADMIN_LOGIN && Senha == process.env.ADMIN_PASSWORD) {
    const token = Jwt.sign(
      { Login, Senha, Id: "Sandra" },
      process.env.TOKEN as string
    );
    res.status(200).json({ token });
    return;
  }

  const cliente: Cliente | null = await db.clientes.findFirst({
    where: {
      Login,
      Senha,
    },
  });

  if (cliente) {
    //create a token that expires in 1 hour
    const token = Jwt.sign({ id: cliente.Id }, process.env.TOKEN as string, {
      expiresIn: "1h",
    });

    res.status(200).json({ cliente, token });
  } else {
    res.status(404).json({ message: "Cliente não encontrado" });
  }
});

// GET /clientes/:id (somente SANDRA)
clientesRouter.get("/:id", async (req, res) => {
  /*
    #swagger.tags = ['Clientes']
    #swagger.description = 'Endpoint para obter um cliente.'
    #swagger.parameters['id'] = { description: 'Id do cliente.' }
    #swagger.responses[200] = {
      description: 'Cliente encontrado.',
      schema: {
        Id: "number",
        Nome: "string",
        Login: "string",
        Senha: "string",
        Ativado: "boolean",
        CPF: "string",
      }
    }
    #swagger.responses[404] = {
      description: 'Cliente não encontrado.'
    }
  */
  checarAutorizacao(req, res, async (decoded) => {
    if (decoded.Id != "Sandra") {
      res.status(401).json({ message: "Acesso não autorizado" });
      return;
    }
    const id = req.params.id;

    const cliente: Cliente | null = await db.clientes.findUnique({
      where: {
        Id: Number(id),
      },
    });

    if (cliente) {
      res.status(200).json(cliente);
    } else {
      res.status(404).json({ message: "Cliente não encontrado" });
    }
  });
});

// GET /clientes/logout
clientesRouter.get("/logout", (req, res) => {
  /*
    #swagger.tags = ['Clientes']
    #swagger.description = 'Endpoint para realizar logout de um cliente.'
    #swagger.responses[200] = {
      description: 'Logout realizado com sucesso.'
    }
  */
  res.status(200).json({ message: "Logout realizado com sucesso" });
});

//POST /clientes/cadastrar
clientesRouter.post("/cadastrar", async (req, res) => {
  /*
    #swagger.tags = ['Clientes']
    #swagger.description = 'Endpoint para cadastrar um cliente.'
    #swagger.parameters['obj'] = {
      in: 'body',
      description: 'Dados do cliente.',
      required: true,
      schema: {
        $Nome: 'string',
        $Login: 'string',
        $Senha: 'string',
        $CPF: 'string'
      }
    }
    #swagger.responses[200] = {
      description: 'Cliente cadastrado com sucesso.',
    }
    #swagger.responses[500] = {
      description: 'Erro ao cadastrar o cliente.'
    }
  */
  const { Nome, Login, Senha, CPF } = req.body;
  const cliente: Cliente | null = await db.clientes.create({
    data: {
      Nome,
      Login,
      Senha,
      Ativado: true,
      CPF,
    },
  });

  if (cliente) {
    res.status(200).send();
  } else {
    res.status(500).json({ message: "Erro ao cadastrar cliente" });
  }
});

// DELETE /clientes/:id
clientesRouter.delete("/desativar/:id", async (req, res) => {
  /*
    #swagger.tags = ['Clientes']
    #swagger.description = 'Endpoint para desativar um cliente.'
    #swagger.security = [{
      "Bearer": []
    }]
    #swagger.parameters['token'] = {
      in: 'header',
      description: 'Token de autenticação.',
      required: true,
      type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Cliente desativado com sucesso.',
    }
    #swagger.responses[404] = {
      description: 'Cliente não encontrado.'
    }
  */
  checarAutorizacao(req, res, async () => {
    const { id } = req.params;
    const cliente: Cliente | null = await db.clientes.update({
      where: {
        Id: Number(id),
      },
      data: {
        Ativado: false,
      },
    });

    if (cliente) {
      res.status(200).send();
    } else {
      res.status(404).json({ message: "Cliente não encontrado" });
    }
  });
});

export default clientesRouter;
