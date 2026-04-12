import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  const [, token] = authHeader.split(" ");

  // 2. Resolvemos o erro de 'overload' garantindo a string de forma bruta
  const secret = process.env.JWT_SECRET as string;

  if (!secret) {
    return res.status(500).json({ message: "Erro: JWT_SECRET não configurado." });
  }

  try {
    // 3. O segredo aqui é usar o 'any' no verify para pular a checagem de sobrecarga do TS
    // mas mantemos a segurança lógica logo abaixo.
    const decoded = (jwt.verify as any)(token, secret);

    req.user = decoded;

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido." });
  }
};