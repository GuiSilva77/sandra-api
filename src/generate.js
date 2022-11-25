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
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./src/server.ts"];

swaggerAutogen()(outputFile, endpointsFiles, docs);
