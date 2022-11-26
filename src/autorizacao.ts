import { Request, Response, NextFunction } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";

const checarAutorizacao = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (token) {
    Jwt.verify(token, process.env.TOKEN as string, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Token inválido" });
      } else {
        next(decoded);
      }
    });
  } else {
    res.status(401).json({ message: "Token não informado" });
  }
};

export default checarAutorizacao;
