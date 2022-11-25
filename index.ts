import swaggerAutogen from "swagger-autogen";

const docs = {
  info: {
    version: "1.0.0",
    title: "API Cantina da Sandra",
    description: "API para o sistema de pedidos da cantina da Sandra",
  },
  host: "localhost:4000",
  basePath: "/",
  schemes: ["http"],
  definitions: {
    Cliente: {
      Id: "number",
      Nome: "string",
      Login: "string",
      Senha: "string",
      Ativado: "boolean",
      CPF: "string",
    },
    Produto: {
      Id: "number",
      Nome: "string",
      Descricao: "string",
      Preco: "number",
      URLImagem: "string",
    },
    Pedido: {
      Id: "number",
      Valor: "number",
      Data: "Date",
      MetPag: "string",
      ClienteId: "number",
      ProdutosPedidos: "Produto[]",
    },
  },
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./src/server.ts"];

swaggerAutogen()(outputFile, endpointsFiles, docs).then(() => {
  import("./src/server");
});
